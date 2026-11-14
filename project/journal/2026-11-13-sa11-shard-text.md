# SA11: Sky Reach shard text

> Written by: Claude

J317 retires `product` from author-facing names (meta
SHARD-AUTHORING SA11, same conventions as shard-pine-hollow `7e6e505`).
`generators/product.ts` is now `generators/shardfile.ts` with
`skyShardfileRows`; the boot inventory is `skyBootInventory` over
`bootSources`; the world bake's library metadata is `metadata`.
Comments and `src/README.md` say shard file or output by what they
mean.

Kept: `bridgeSine.ts`'s `productExponent` (the exponent of a mantissa
product, a math term); the `@wildshard/format/product` import; the
engine's headless loader names and the `product` keys passed to
`openWorld` / `openWorldAdapter`; `test/lift-disposition.json` records;
and the CI proofs and `checkpoint-baseline.mjs` every shard repo
shares. Those change with SA23 / SA25 across all shard repos at once.

`pnpm test` and `pnpm check` pass. A generator edit makes the hero
stale; the revision pass rebuilds it. No upload.
