# Gale and Ledger journey (SKY-2)

- The winch journey now goes on past the crown walk: the Storm Roc is
  fought to its fall and the Ledger is read off the ticks' effects
  (`far-reach.quest` and `far-reach.roc` once each, 10 and 25 coins
  once each). Same test file, one more leg, so CI replays the tape
  once; ~1.5 s locally on the pinned packages.
- Phases 1 and 3 come to the fan (the stoop, the grounded sweep), so
  facing and striking is enough. Phase 2 stays 7 m up, 14 m off, and
  throws gale walls: melee never lands. GUST, pitched up through
  `far.fan.aim`, takes 4 a time when the Roc wheels within 9 m, so
  the walker keeps under its 13 m orbit round the dais, clamped 15 m
  from the crown's middle so a wall cannot shove them off.
- The first, unclamped chase walked off the south rim. The Roc stalked
  the falling walker down and died at about y 5 with 292 HP left, and
  the encounter paid: `far.roc.down`, the Ledger fact, 25 coins. That
  is an open row in the product-coverage plan; the test asserts the
  Roc falls on the crown so this path cannot pass it.
