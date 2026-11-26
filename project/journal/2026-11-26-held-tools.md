# Held tools: retire or rewire (opus-held125, meta QA 11-25 row 126)

- `bake-sky.mjs` is retired: it baked every shard's HDRI from engine's shard registry, and Sky Reach has no HDRI.
- `bake-sky-map.mjs` imports `paintDataMap` from `@wildshard/dev/scripts/bake-data-maps.mjs` (an exported dev
  script), and reads its inputs from `src/static/` (the lean move had left it at `src/src/static/`). Run from a clean
  clone it paints the Far Reach map (17.5 KB from 1.16 M source triangles); nothing here commits that output.
- `scripts/blender/targets.json` keeps only `far-reach/roc` (the other 42 targets were the old monorepo's). It stays
  there for now: under `src/blender/` it joins the hero content hash, and this uncurated hero then needs a fresh
  capture before main ci's build passes (the push gate refused it). The move rides with that capture (meta QA 11-25
  row 129); the script-paths baseline holds that one entry.
