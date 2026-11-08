# S1 byte-preserving lint debt

**Status:** in progress (2026-11-08): all 12 counts retained under the
byte-identity constraint.

Baseline: 677af030ebbc1c52bb2e120a4ad462ace5bbda6e.
Two original-source pnpm build:shards builds match all 268 files and
74,208,421 bytes. The comparison includes all product paths and raw
bytes, including map, packed blobs, index and validation receipt.

SDK migrations of erased AnimalDims, MoverData and MoverBox types
changed map.tilesHash, its packed section and index/validation.
Replacing the road constant with roadSocketMetrics also changed
these bytes. Both candidates were discarded; original source was
rebuilt and matched. The freshness key hashes raw generators/;
excluding that key or receipts would weaken the requested proof.

| File under generators/ | Counts | Open boundary |
| --- | ---: | --- |
| bake-sky-world.mjs | 4 | Node fs/path/zlib and valibot |
| creatures.ts | 2 | Engine AnimalDims type |
| movers.ts | 3 | Format MoverData and engine MoverBox types |
| rows/items.ts | 1 | Format ConeWeaponProfile type |
| rows/rocFight.ts | 1 | Format boss owner parser/type |
| skyDock.ts | 1 | Format road constant |

Every listed file is a raw map input. Acceptance for each row:
separately authorize the product change, fix its author boundary,
build and validate, then lower only the actual count. This audit
changes no source, lint rule, map inputs or ratchet ceilings.
