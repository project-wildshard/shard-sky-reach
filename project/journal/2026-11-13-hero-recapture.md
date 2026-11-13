# Far Reach hero recapture

- opus-shardred-b: ring-2-prepare was red: `wildshard pack` refused the
  cut because the hero stamp (stamp-existing, 01:04 UTC) predates
  aba68ec, 9e8c622 and 6454472. `--stamp-existing` refuses moved
  content, so only a capture fixes it.
- Captured with `wildshard hero` (no declared camera: spawn view) from a
  detached engine worktree at b53de789: pins installed, `out/far-reach`
  replaced by this repo's `pnpm build:shards` product with its
  `validation.json` revision set to the engine tree's, then
  `WILDSHARD_PREPARATION_ONLY=1 node scripts/build-app.mjs` under heavy-lane
  and `scripts/preview-server.mjs` on 127.0.0.1:4911.
- The released (pinned) Far Reach captured in the same build gives the
  same picture, so the content has no visible change. The old card was an
  older render, not this spawn view; the new card is the spawn view on
  engine main today (keeper and windmill under the sunset isles).
