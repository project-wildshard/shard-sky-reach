# Far Reach carries all its art under its own name

> Written by: Claude (opus-repacks), 2026-11-26, meta standalone-shardfiles SF8 (SF4's URL rule).

Every mount now sits under `/assets/far-reach/`:

- The colour grade moved from `/assets/lut/far-reach.bin` to `/assets/far-reach/lut.bin`, and the navmesh from
  `/assets/baked/far-reach/` to `/assets/far-reach/baked/`.
- The far and near views engine `public/` held (`far.glb`, `far.json`, `far-impostor.png`, `near.glb`, `near.json`)
  are carried in `baked/`.
- The five ground textures engine's `test/pins/assets.json` fetched from this repo (`tex/meadow`, `mill-canvas`,
  `mill-ivy`, `rock`, `stormeye`) are now mounts.
- `ktx2.generated.ts` stays as it was: besides KTX2 it maps the storm roc rig to its phone variant, which the rig
  mapping needs. Its targets under `/assets/gpu/far-reach/` were never in this repo or its product (an old engine
  build's output); they leave with the images-only slice after SF15.

Shard version 0.0.9, a patch bump of the live 0.0.8 (meta R2 layout RL2). The SDK still writes the navigation's
discovery URL at the engine-wide path until its fix ships; the engine reads the zone copy first either way.
