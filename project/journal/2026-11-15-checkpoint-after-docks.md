# 2026-11-15: far-reach checkpoint re-recorded after the J322 docks

- Main's ring-2-prepare was red since 06:26 Cancún: `product-play` saw the far-reach checkpoint after the walk drift
  from `f948485f…` to `bf2af3f4…`. On the Mac mini the same test passes at `8cdb131^` and drifts to the identical
  `bf2af3f4…` from `8cdb131` ("docks reach the cell edge", J322) on, on darwin-arm64 as on linux-x64: the docks
  moved on purpose, so the walk's end state changed with them. Both platform rows now record `bf2af3f4…` (mini-shardgfx).
