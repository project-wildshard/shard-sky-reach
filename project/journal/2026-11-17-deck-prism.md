# Sky Reach decks are one prism each (NET-LAG NL13, opus-netlag)

Every island top was six overlapping rotated strips. A capsule crossing one strip's edges, buried inside another strip,
took whichever edge the physics world's tree gave it first, so the same step from the same state moved the feet differently
in two worlds that added their colliders in a different order. The page's world and the room's never share that order, so
the owner was corrected all the time: staging v0.1.34 measured 8.5 to 43.6 corrections a minute on foot (the B2 bar is 2),
most of them against the windmill, where the drift on the deck grew into 2 to 5 cm.

Each deck is now one twelve-sided convex prism with the drawn deck's corners (radius `r` at 15 + 30k degrees), 2 m deep,
top at the deck height as before. Engine's `test/net-predict-collider-order.test.ts` walks every deck in both orders: the
strips part by 2.1 cm in four seconds, the prism not at all. The native 180 ms replay of staging's walk and sprint from the
spawn goes from 2 or 3 corrections to none.

The prism moved the hero's content hash, so ring-2-prepare refused the hero as stale (CI run 44095515942), and
`--stamp-existing` refuses moved content. Captured again with `wildshard hero . --base` (spawn view, no declared camera)
from opus-netlag's engine lane clone at df4285da: `out/far-reach` swapped for this repo's `pnpm build:shards` product with
the engine tree's `validation.json` revision, its mounts copied into `public/`, then `WILDSHARD_PREPARATION_ONLY=1 node
scripts/build-app.mjs` under heavy-lane and `scripts/preview-server.mjs`. `wildshard dev .` could not serve it
("Generation input needs exactly one declared root"). Collision is not drawn, so the view is the same spawn view.
`wildshard check .` passes.
