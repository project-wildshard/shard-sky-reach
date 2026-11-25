# Publish script back on the kit's copy

> Written by: Claude (opus-sweep), 2026-11-25. Meta QA 11-24 row 27.

Sky Reach's scripts/publish-shard.mjs had diverged on CP13, so the kit sync skipped it and it missed repo-kit e602f0c
(a cook `stalled` status no longer fails a publish), FR-A3 (wait on a queued ci) and FR-A6 (unchanged bytes end green).
It is now byte for byte the kit's files/scripts/publish-shard.mjs, as on Driftwood and Dunes.
