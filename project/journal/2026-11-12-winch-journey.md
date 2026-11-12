# Winch journey proof (SKY-1)

- Carried the keeper tape (content-tapes.json) on to the winch in
  `test/ci/winch-journey.test.mjs`, after shard-dunes' signal journey.
  Routes walk, HOVER presses step on and off the board, [E] is the
  `far.interact` act, GUST is the `far.fan` script act. The roost rays
  and the free ray are struck by aiming at where they are. No flag or
  quest state is written.
- The winch is pressed twice from the same drum spot: refused with two
  vanes, then raising `far.winch.bridge` once the keeper vane turns.
  The walk then crosses the raised bridge onto the crown.
- An earlier tape (fixed-yaw strikes, so a different tick phase) fell
  off the windmill isle on its second crossing; the cause was not
  pinned. The free ray dives at whoever crosses there, so the test
  downs it first. Without that fight this ordering still passes. The step's wisp shoves an idle
  player off the rim and they fall forever: an open row in the
  product-coverage plan.
- The drum's prompt radius is 3 m from its spot 1.2 m up: (-60.5,
  -133.3) is out of reach; (-60.8, -135.3) is in. ~3.4 s locally.
