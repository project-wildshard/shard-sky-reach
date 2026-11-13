# HS1: CI boots the room's world

> Written by: Claude (opus-hs1), 2026-11-13. Meta SERVER-PARITY HS1.

The CI journeys booted `createTrustedHeadlessAdapter` or `createTrustedHeadlessResident`, the bare trusted resident: a
world no player runs, with no chapters, doors, discoveries, owned book, room loot or real respawn. They now boot the room's
own composition through `@wildshard/engine/host/openWorld` (`openWorldAdapter`, or `openWorld(input, { room: true })` and
its `resident`), on engine `0238dc7e`. The engine pin is also a pnpm override, so sharddev shares the one copy: two engine
copies split the sim loader's module cache (Driftwood's owned journey failed on it).

A room pays the Roc's 25 coins to the walker, not to the body (J105): the walker gets the quest's 10, then the Roc's 25.
