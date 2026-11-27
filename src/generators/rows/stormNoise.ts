/** The retained cloud density/light channels, lossless and linear in the cached library. */
export const STORM_NOISE = {
  "hash": "c17558f1f31296936f6bc8acbe827f9466e261cc05a441c5d6ed79816dd660db",
  "kind": "image",
  "compressed": 10624,
  "decoded": 58880,
  "gpu": 16384,
  "triangles": 0,
  "draws": 0,
  "dependencies": [],
  "critical": false
} as const;

/** Match the original DataTexture: no mips, linear filtering, periodic UVs. */
export const STORM_NOISE_SAMPLER = { filter: 'linear', wrap: 'repeat', mips: 'file' } as const;
