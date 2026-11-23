import { readSourceModel } from '@wildshard/sdk/bake/skinned';
import { hashImmutableBytes } from '@wildshard/sdk/immutable';
import { parseStillImage } from '@wildshard/format/stillImage';
import { emitNamedBlobs, nameBlob, type EmittedBlobs } from '@wildshard/sdk/blobs';
import type { ProjectGenerationContext } from '@wildshard/sdk/projectGeneration';
import { HD_URLS, SKY_HD, type SkyHdName } from './fileInventory';
import { hdGeometry } from './modelIntake';
import atlasSources from './phoneAtlasSources.json' with { type: 'json' };
import type { SkyRigGpuFiles } from './rigAssetSources';

const phoneFile = (name: SkyHdName): string => `world/painted/${name}.phone.glb`;
const variants: Readonly<Partial<Record<SkyHdName, { readonly url: string; readonly hash: string }>>> = atlasSources;
const sources = [...SKY_HD.map(name => HD_URLS[name]), ...Object.values(atlasSources).map(row => row.url)];
const phoneAtlasSize = 512;

/** The renderer gets real mesh channels from prepared-models.glb. The atlas
 * reader uses this file's indexed UV primitive only to locate the material. */
async function phoneAtlasGlb(name: SkyHdName, input: Uint8Array, variant: Uint8Array | undefined): Promise<Uint8Array> {
  const source = await readSourceModel(input);
  const painted = hdGeometry(source.gltf.scene, material => source.texture(material) !== null);
  const map = painted === null ? null : source.texture(painted.material);
  if (map === null || map.mimeType !== 'image/webp') throw new Error('Sky model needs its authored WebP atlas');
  const { width, height } = parseStillImage(map.image);
  const resize = Math.max(width, height) > phoneAtlasSize;
  if (resize && (variant === undefined || hashImmutableBytes(map.image) !== variants[name]?.hash)) {
    throw new Error(`Sky phone atlas ${name} must match its authored source`);
  }
  if (!resize && variant !== undefined) throw new Error(`Sky phone atlas ${name} already fits`);
  const paint = variant ?? map.image, dimensions = parseStillImage(paint);
  if (dimensions.mime !== 'image/webp' || Math.max(dimensions.width, dimensions.height) > phoneAtlasSize) {
    throw new Error(`Sky phone atlas ${name} exceeds the 512-pixel WebP limit`);
  }
  const webp = 'EXT_texture_webp', atlasOffset = 68;
  const payloadLength = Math.ceil((atlasOffset + paint.length) / 4) * 4;
  const doc = {
    asset: { version: '2.0' }, scene: 0, scenes: [{ nodes: [0] }],
    nodes: [{ mesh: 0 }], meshes: [{ primitives: [{ attributes: { POSITION: 0, TEXCOORD_0: 1 }, indices: 2, material: 0 }] }],
    accessors: [
      { bufferView: 0, componentType: 5126, count: 3, type: 'VEC3', min: [0, 0, 0], max: [1, 1, 0] },
      { bufferView: 1, componentType: 5126, count: 3, type: 'VEC2' },
      { bufferView: 2, componentType: 5123, count: 3, type: 'SCALAR' },
    ],
    bufferViews: [
      { buffer: 0, byteOffset: 0, byteLength: 36, target: 34962 },
      { buffer: 0, byteOffset: 36, byteLength: 24, target: 34962 },
      { buffer: 0, byteOffset: 60, byteLength: 6, target: 34963 },
      { buffer: 0, byteOffset: atlasOffset, byteLength: paint.length },
    ],
    buffers: [{ byteLength: payloadLength }], images: [{ name: 'atlas', mimeType: 'image/webp', bufferView: 3 }],
    textures: [{ sampler: 0, extensions: { [webp]: { source: 0 } } }], samplers: [map.sampler],
    materials: [{ pbrMetallicRoughness: { baseColorTexture: { index: 0 } } }],
    extensionsUsed: [webp], extensionsRequired: [webp],
  };
  const json = new TextEncoder().encode(JSON.stringify(doc));
  const jsonLength = Math.ceil(json.length / 4) * 4, binary = 28 + jsonLength;
  const bytes = new Uint8Array(binary + payloadLength), view = new DataView(bytes.buffer);
  view.setUint32(0, 0x46546c67, true); view.setUint32(4, 2, true); view.setUint32(8, bytes.length, true);
  view.setUint32(12, jsonLength, true); view.setUint32(16, 0x4e4f534a, true);
  bytes.fill(32, 20, 20 + jsonLength); bytes.set(json, 20);
  view.setUint32(binary - 8, payloadLength, true); view.setUint32(binary - 4, 0x004e4942, true);
  // Indexed UV triangle for the atlas reader. The scene never draws it.
  view.setFloat32(binary + 12, 1, true); view.setFloat32(binary + 28, 1, true);
  view.setFloat32(binary + 44, 1, true); view.setFloat32(binary + 56, 1, true);
  view.setUint16(binary + 62, 1, true); view.setUint16(binary + 64, 2, true);
  bytes.set(paint, binary + atlasOffset);
  return bytes;
}

/** Build the phone variants from the same authored maps as the image path. */
export async function skyPaintedModelPhoneOutput(ctx: Pick<ProjectGenerationContext, 'cached'>): Promise<EmittedBlobs> {
  const files = await ctx.cached({ id: 'phone-paint', native: true, inputs: sources }, async inputs => {
    const result = new Map<string, Uint8Array>();
    for (const name of SKY_HD) {
      const bytes = inputs.get(HD_URLS[name]);
      if (bytes === undefined) throw new Error(`Missing Sky painted model ${name}`);
      const variant = variants[name];
      result.set(phoneFile(name), await phoneAtlasGlb(name, bytes, variant === undefined ? undefined : inputs.get(variant.url)));
    }
    return result;
  });
  if (files.size !== SKY_HD.length) throw new Error('Sky phone atlas cache inventory differs');
  return emitNamedBlobs(SKY_HD.map(name => {
    const path = phoneFile(name), bytes = files.get(path);
    if (bytes === undefined) throw new Error(`Missing Sky phone atlas ${path}`);
    return nameBlob(path, 'glb', bytes, { tier: 'phone' });
  }));
}

/** Route phone loads to the GLBs this product actually ships. */
export function skyPaintedModelGpuFiles(files: EmittedBlobs['files'], original: SkyRigGpuFiles): SkyRigGpuFiles {
  const named = new Map(files.map(file => [file.name, file]));
  const phone = { ...original.phone };
  for (const name of SKY_HD) {
    const file = named.get(phoneFile(name));
    if (file?.kind !== 'glb' || file.tier !== 'phone' || file.path !== `blobs/glb/${file.hash}.glb`) {
      throw new Error(`Sky phone atlas is missing from admission: ${name}`);
    }
    phone[HD_URLS[name]] = `/shardfiles/far-reach/${file.path}`;
  }
  return { phone, desktop: original.desktop };
}
