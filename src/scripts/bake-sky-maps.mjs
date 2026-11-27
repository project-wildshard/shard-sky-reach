#!/usr/bin/env node
// Offline Sky library map metadata (GR5, G798): a plain script with no catalogue row. It writes the committed
// src/data/skyMaps.json from the authored images (--encode refreshes PNG pins, --check verifies
// the committed file); it lives here, not in the shard, because it reads its own command line. Run it by hand:
// node --import ./scripts/bake-loader.mjs src/scripts/bake-sky-maps.mjs --check
import { bakeTextureLibrary } from '../generators/bake-sky-world.mjs';

await bakeTextureLibrary(new URL('../../', import.meta.url).pathname,
  'src/data/skyMapSources.json', { encode: process.argv.includes('--encode'), check: process.argv.includes('--check') });
