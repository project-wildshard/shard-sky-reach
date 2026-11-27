import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import * as v from 'valibot';
import { hashImmutableBytes } from '@wildshard/sdk/immutable';
import { assetCost } from '@wildshard/sdk/assets';
import { readImagePixels, writeImagePixels } from '@wildshard/sdk/bake/image';
import { skyMapPng } from './skyMapImage.ts';

const sampler = v.strictObject({ filter: v.literal('linear'), wrap: v.optional(v.literal('repeat')), anisotropy: v.optional(v.literal(4)) });
const row = v.strictObject({
  source: v.pipe(v.string(), v.regex(/^\/assets\/[a-zA-Z0-9/_-]+\.webp$/u)),
  asset: v.optional(v.pipe(v.string(), v.regex(/^[a-f0-9]{64}$/u))),
  sampler,
});
const catalogue = v.pipe(v.record(v.pipe(v.string(), v.regex(/^[a-zA-Z][a-zA-Z0-9]*$/u)), row),
  v.check(value => Object.keys(value).length > 0 && Object.keys(value).length <= 32));

/** Refresh the source hash pins and the library's cost declarations without writing binary copies.
 * @param {string} root @param {string} input @param {{encode:boolean,check:boolean}} options @returns {Promise<void>} */
export async function bakeTextureLibrary(root, input, { encode, check }) {
  const source = resolve(root, input);
  if (source !== resolve(root, 'src/data/skyMapSources.json')) throw new Error('Expected Far Reach\'s exact sky map catalogue');
  const rows = v.parse(catalogue, JSON.parse(readFileSync(source, 'utf8')));
  const maps = {};
  for (const [name, declaration] of Object.entries(rows)) {
    const png = await skyMapPng(readFileSync(join(root, 'src/static', declaration.source)), { readImagePixels, writeImagePixels });
    const hash = hashImmutableBytes(png);
    if (!encode && declaration.asset !== hash) throw new Error(`Library map ${name} needs its current PNG pin`);
    declaration.asset = hash;
    Reflect.set(maps, name, { hash, kind: 'image', compressed: png.length, ...assetCost('image', png), dependencies: [], critical: false });
  }
  const files = Object.values(maps);
  const metadata = { maps, files, library: files.map(file => file.hash), budget: {
    compressed: files.reduce((sum, file) => sum + file.compressed, 0),
    resident: files.reduce((sum, file) => sum + file.decoded + file.gpu, 0),
  } };
  const output = source.replace(/Sources\.json$/u, 's.json'), payload = `${JSON.stringify(metadata, null, 2)}\n`;
  if (check) {
    if (readFileSync(output, 'utf8') !== payload) throw new Error(`Stale library metadata ${output}`);
  } else {
    if (encode) writeFileSync(source, `${JSON.stringify(rows, null, 2)}\n`);
    writeFileSync(output, payload);
  }
}
