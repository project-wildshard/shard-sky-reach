// CI21 C8 port of engine test/sky-signal-fixed-layouts.test.ts (engine blob ec4fdb0f), Sky half.
// Every Sky case and assertion is unchanged; the sunscar-dunes row of the discovery loop
// moved to shard-dunes test/sunscar-fixed-palette.test.ts. Engine/SDK imports are public
// exports; the engine app-build reader takes a src/shards/<slug> root, so this repo's
// src/ and public/ are linked into a scratch root of that shape.
import { expect, test } from 'vitest';
// oxlint-disable-next-line import/no-nodejs-modules -- The engine's app-build reader takes a monorepo-shaped root.
import { symlinkSync } from 'node:fs';
// oxlint-disable-next-line import/no-nodejs-modules -- Bind native model reads to the actual declared public root.
import { resolve } from 'node:path';
// oxlint-disable-next-line import/no-nodejs-modules -- Own and remove only this bounded native discovery cache.
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { authoredManifestSource } from '@wildshard/engine/scripts/authored-manifest.mjs';
import { parseDiscoveryValues } from '@wildshard/format/discoveryValues';
import { fixedLayoutFiles as skyFiles, skyMapPalette } from '../src/generators/fixedLayouts';
import * as skySource from '../src/generators/layout';
import * as crownSource from '../src/generators/crownLayout';
import { createProjectGeneration } from '@wildshard/sdk/projectGeneration';
import { skyCreatureRigOutput } from '../src/generators/creatureRigOutput';
import { skyRigAssetSources } from '../src/generators/rigAssetSources';
import { skyBootInventory as skyProductBoot } from '../src/generators/bootInventory'; // renamed by SA11 (6d41cb3)
import { skyViewDiscovery } from '../src/generators/viewData';
import { GPU_FILES } from '../src/ktx2.generated';
import { originalSkyNavigation } from './fixtures/sky-navigation';

// The JSON transport sorts top-level export names; Vite namespaces retain
// declaration order, so compare the current writer with that transport order.
const ordered = (rows: Readonly<Record<string, unknown>>) => Object.fromEntries(
  Object.entries(rows).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0));
const sky = ordered(skySource), crown = ordered(crownSource);
const skyMap = skyMapPalette();

/** The same complete discovery composition as generate(), without constructing unrelated world/map output. */
async function skyDiscovery(): Promise<ReturnType<typeof parseDiscoveryValues>> {
  mkdirSync('tmp', { recursive: true });
  const cache = mkdtempSync(resolve('tmp', 'sky-layout-discovery-')), project = resolve('src');
  try {
    const context = createProjectGeneration(project, 'f'.repeat(64), new Map(), cache, [
      { prefix: '/src/', directory: project },
      { prefix: '/assets/', directory: resolve('public/assets') },
    ]);
    const rigs = await skyCreatureRigOutput(context);
    return parseDiscoveryValues({ ...skyProductBoot(skyRigAssetSources(rigs.files, GPU_FILES)),
      ...skyViewDiscovery(), mapPalette: skyMapPalette(), navigation: originalSkyNavigation() });
  } finally { rmSync(cache, { recursive: true, force: true }); }
}

test('caller mutations cannot alter another source palette', () => {
  const before = skyMapPalette(), changed = skyMapPalette();
  Reflect.set(changed.ground.base, 0, before.ground.base[0] + 1);
  expect(changed).not.toEqual(before); expect(skyMapPalette()).toEqual(before);
});

for (const [label, compile, rows] of [
  ['Sky', skyFiles, new Map<string, unknown>([['data/layout.generated.json', sky], ['data/crownLayout.generated.json', crown], ['data/mapPalette.generated.json', skyMap]])],
] as const) {
  test(`${label} compiles the complete layout without runtime mirrors`, () => {
    const files = compile();
    expect([...files.keys()]).toEqual([...rows.keys()]);
    for (const [file, value] of rows) {
      expect(files.get(file)).toEqual(new TextEncoder().encode(`${JSON.stringify(value)}\n`));
    }
  });
}

/** The engine app build reads a shard at src/shards/<slug> (SDK gen-shards); this repo's src/ and public/ are linked there. */
function appBuildRoot(): string {
  mkdirSync('tmp', { recursive: true });
  const root = mkdtempSync(resolve('tmp', 'sky-app-root-'));
  mkdirSync(resolve(root, 'src/shards'), { recursive: true });
  symlinkSync(resolve('src'), resolve(root, 'src/shards/far-reach'), 'dir');
  symlinkSync(resolve('public'), resolve(root, 'public'), 'dir');
  return root;
}

for (const [slug, palette] of [['far-reach', skyMap]] as const) {
  test(`${slug} discovery lends fixed palette JSON without executable authoring`, async () => {
    const discovery = await skyDiscovery();
    if (discovery === undefined) throw new Error('Missing current source discovery');
    const root = appBuildRoot();
    try {
    const source = authoredManifestSource(root, slug, { discovery });
    expect(source).toContain(`mapPalette: ${JSON.stringify(palette)}`);
    expect(source).not.toMatch(/from ["'][^"']*generators\/(?:layout|minimap)/u);
    expect(() => authoredManifestSource(root, slug)).toThrow('program discovery value budgets');
    {
      const noBoot = { ...discovery };
      delete noBoot['boot.files']; delete noBoot['boot.sources']; delete noBoot['boot.lateReads'];
      expect(() => authoredManifestSource(root, slug, { discovery: noBoot })).toThrow('program discovery value boot.files');
      for (const key of ['budgets', 'navigation', 'mapPalette', 'poses', 'ktx2', 'boot.files', 'boot.sources', 'boot.lateReads'] as const) {
        const missing = { ...discovery }; delete missing[key];
        expect(() => authoredManifestSource(root, slug, { discovery: missing })).toThrow(`program discovery value ${key}`);
      }
    }
    } finally { rmSync(root, { recursive: true, force: true }); }
  });
}
