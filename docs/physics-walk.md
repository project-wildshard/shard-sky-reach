# Far Reach walk report

> Written by: Claude (mini-shardvis, Mac mini), 2026-11-16. Meta `docs/plans/test-coverage/SHARD-REPOS.md` SH-sky-3.

> **State:** current, 2026-11-16. 10 of 10 legs walk to their end on the real GPU, none sticks or falls.

The ten fixed legs of `far-reach` in engine `scripts/physics-route.json`, walked by engine's
`scripts/physics-baseline.mjs --mode=walk`. They prove nobody sticks on the islands: the rope and hover bridges between
the isles, the board legs, the Rising Islet's two ways in and the two sky docks.

## How to run it

From an engine checkout with the pinned products (`node scripts/pins.ts install`) and a served build
(`scripts/serve-build.sh --head`):

```bash
# the Node harness on the checked products (the physics ruler, no GPU)
node scripts/physics-baseline.mjs --mode=walk --no-build --shard=far-reach
# the same legs in headless Chromium on the host GPU (Metal via ANGLE), phone tier 390x844
scripts/browser-lane.sh node scripts/physics-baseline.mjs --mode=walk --gpu --shard=far-reach --url=<preview URL>
```

A leg fails on 2 s without 0.3 m of progress (stuck), an incomplete route or a timeout; the script exits non-zero.

## 2026-11-16, Mac mini M5 Pro, Metal

Build `a9bb818-mwj99m1d` (engine `a9bb818f` with the pinned Far Reach), harness engine `4d0d9022`. Node harness: 10 legs
passed, zero stuck or bounds failures. Real GPU:

| Leg | s | End y | Expected y | Max y | Ground speed p50 m/s | Air frames | Stuck |
|---|---|---|---|---|---|---|---|
| windmill (on foot) | 14.8 | 30.02 | 30 | 30.88 | 4.30 | 0 | 0 |
| grove (on foot) | 24.3 | 27.02 | 27 | 30.03 | 4.32 | 0 | 0 |
| roost (board) | 8.5 | 34.44 | 34 | 34.49 | 14.11 | 22 | 0 |
| keeper (board) | 13.0 | 32.96 | 32.5 | 34.45 | 14.12 | 51 | 0 |
| keeper-to-roost (board) | 13.0 | 34.44 | 34 | 34.51 | 14.12 | 26 | 0 |
| ruin (on foot) | 13.5 | 28.02 | 28 | 34.08 | 4.33 | 25 | 0 |
| rising islet north in | 43.3 | 30.02 | none | 30.02 | 4.33 | 0 | 0 |
| rising islet east in | 34.4 | 34.02 | none | 34.02 | 4.26 | 0 | 0 |
| sky dock north | 2.1 | 0.02 | 0 | 0.02 | 4.24 | 0 | 0 |
| sky dock west | 2.2 | 0.02 | 0 | 0.02 | 4.21 | 0 | 0 |

No page errors. Air frames on the board legs are the hover bridges' slope changes; every leg ends on its floor.

**Found on the way, fixed in the harness (engine `4d0d9022`):** the first GPU run had six legs fail (keeper fell off
the keeper hover bridge to y 4; the islet and dock legs never reached their starts). The browser walk moved the player
with a local `spawn()`, which a worker page's server never heard, so each leg began where the last one ended, and a
board press right after the last leg's dismount was dropped. The walk now tells the server where it put the player and
asks for the board until the server holds it. Not a world or physics fault: the Node harness passed all ten throughout.
