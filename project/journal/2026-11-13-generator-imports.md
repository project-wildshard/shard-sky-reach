# generator-imports paid to zero (opus-sa6)

Meta SHARD-AUTHORING SA6 (J170, J317).

- The author lint now loads sharddev's `wildshard-sdk` plugin
  (`node_modules/@wildshard/sharddev/lint/sdk-plugin.mjs`, pin `efbdc25`).
  Its `generator-imports` allows the shard format, valibot and `node:*`, so
  the format, valibot and Node imports in `bake-sky-world.mjs`, `items.ts`,
  `rocFight.ts` and `skyDock.ts` pass as they are.
- The two engine type imports left are replaced by the format's own types:
  `creatures.ts` takes its body dims from `format/rows` (`ShardRows` species
  dims, the same seven fields) and `movers.ts` its boxes from
  `format/movers` (`MoverData` boxes). Types only; no output changes.
- The ratchet entries are deleted and the rule is a plain error. The
  `generators/` edit changes `tilesHash`, so the shard uploads with the
  one-revision-per-shard pass, not now.
