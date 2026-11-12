# Goldens: far-reach

> Written by: Claude (opus-k9, REPO-KIT K9, 2026-11-11). Carried from singleplayer `art/shardfile-goldens/` and
> `art/legacy-goldens/` (`08e4a21f69`). Jake, 2026-11-11 (J273): "goldens has to go into each major shard".

The look to hold for `far-reach`: 24 cameras. The skill `goldens` runs them; the rules are engine `docs/goldens.md`.

- `shardfile/<nn>-<camera>.jpg`: the SHARDFILE goldens (G859, G873 L5), 22 px label strip on top.
- `legacy/<nn>-<camera>.jpg`: the frozen LEGACY record (10-28, G843). Never re-captured, never updated.
- `cameras24.json`: this shard's 24 cameras (eye, yaw, pitch, FOV, probe), the `far-reach` entry of engine
  `scripts/perf/cameras24.json`.
- `runs/<date>-<sha10>-board.jpg`: the rerun board (<= 500 KB) a look change lands with.

## Source

The clean 144-camera rerun on `744c3ab7e2`, captured 2026-10-29 with the capture now at engine
`scripts/goldens/capture.mjs --mode=shardfile` (muted Chromium, iPhone 16 Pro portrait, phone tier, 2x, seed 357,
midday / clear). Re-encoded at 540 x 915 with a 22 px label strip, JPEG quality 72.

## Updates

- 2026-11-03, far-reach 24 (hands up): refreshed from `0d7a022fbb` (G992, the sun disc and its additive halo removed
  from data-look skies). The halo washed the bridge white whenever the live clock's low sun stood behind it; without it
  the frame is stable. Cam 16 (rim crown north) is kept: its delta is the storm crown animating between visits, equal
  before and after G992. Board: `../golden-runs/far-reach/2026-11-03-0d7a022fbb-g992-board.jpg`.
- 2026-11-04, far-reach 18 and nine-dragon-stack 13: D228. Far Reach 18's 10-29 golden was captured without the viewmodel
  (LEGACY, `793ceb58` and every later frame draw the fan and hand): golden defect, promoted per wildshard-new's ruling
  (G872). Nine 13 kept the pre-QD3 streaks when QD3 (`4567995448`, G995 B) promoted 12 cameras; the frame now shows the
  intended on-screen-light gloss. Captured on `0bf578e89b`, Chromium. Boards:
  `../golden-runs/{far-reach,nine-dragon-stack}/2026-11-04-0bf578e89b-d228-board.jpg`.
- 2026-11-04, far-reach 24: D229. The G992 refresh golden (`592dc655ea`) froze a pre-refinement frame: at equal settle
  (frame 375) `a258c2941a`, `0d7a022fbb` and `c9ae94288f` all draw a pale veil over the bridge, and the same `c9ae94288f`
  build at frame 555 draws it clear and refined (sp-x8's panels `../golden-runs/far-reach/d229-2026-11-04/`). Promoted
  from `0bf578e89b` per wildshard-new's ruling (G872): not a regression. Board:
  `../golden-runs/far-reach/2026-11-04-0bf578e89b-d228-board.jpg`.

Add one line per promotion: date, cameras, ruling, board path.
