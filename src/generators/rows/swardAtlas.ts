/**
 * The sward's tuft atlas (E407 row 4, a green, varied meadow; the mockups' sward is three grasses at once: a fine low
 * lawn, broad arching blades and tall wild stalks with seed heads). `variants` tufts side by side, each `w × h` texels,
 * two per species in species order (lawn, broad, wild), drawn offline (generators/swardAtlas.ts → the library texture below).
 * The channels are data, not colour: R the strand's own shade, G how far along its strand the texel is (0 root, 1 tip), B where across its blade the texel
 * sits (0 one edge, 255 the other: data/meadowLook.ts lights the sun-side edge and the midrib from it), A the coverage.
 */
export const SWARD_ATLAS = { variants: 6, perSpecies: 2, w: 192, h: 512 } as const;



/** The atlas as a cached, hash-named library texture (generators/swardAtlas.ts `bakeSwardAtlasTexture`): lossless, linear
 *  (its channels are data), one level; the meadow graph samples it with GPU mips, as the DataTexture did. */
export const SWARD_ATLAS_FILE = {
  hash: '861c087e975421ddd7cfb4be9d9ff876c38dc175ed94c635545a6aa50a89ba8d',
  kind: 'image',
  compressed: 704569,
  decoded: 5177572,
  gpu: 2359296,
  triangles: 0,
  draws: 0,
  dependencies: [],
  critical: false,
} as const;

/**
 * Linear filtering over GPU-built mips, clamped, and 4 anisotropic samples: a tuft is 192 × 512 texels on a card about
 * as wide as tall, so past ~12 m an isotropic sample picks its mip by the squeezed height, the thin strands fade under
 * the cut-off and each far card keeps only its dense lower strip (flat horizontal slabs on the knolls' flanks).
 */
export const SWARD_ATLAS_SAMPLER = { filter: 'linear', mips: 'gpu', anisotropy: 4 } as const;
