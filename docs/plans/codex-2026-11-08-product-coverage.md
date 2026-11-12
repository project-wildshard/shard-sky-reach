# Shard product coverage

> Written by: Codex

Status: in progress 2026-11-08: installed product coverage.

| Row | State |
| --- | --- |
| Installed product admission, boot, walk and save continuation | CI-only outer-edge proof; 9.5 second cap per product |
| Ring 3 candidate | Exact engine/SDK graph requires a green ring-2-prepare cache, then builds and runs own tests within the unchanged five-minute cap. Cold native tool compilation belongs to the separate 15-minute Ring 2 preparation |
| Cooked server play | Real cold cook, keeper approach/talk earning notes, refused unearned winch and five identical restored ticks use only hash-verified server-pack files. Ring 2: 18.84 s cook, 19.93 s case locally |
| Cook size ceiling | Open: actual manifests are emitted; no invented wire threshold |
| Client title to play | Open: requires the installed dev-client path, not this server proof |
| Authored quest, fight and traversal tapes | Winch journey done 2026-11-12 (SKY-1): `test/ci/winch-journey.test.mjs` carries the keeper tape on to the roost rays (struck as they dive), the ruin, grove and keeper vanes (GUST), the board over the hover bridges and up the updraft, a winch press refused in reach with two vanes, the earned press raising `far.winch.bridge` (`far.bridge`, `far.complete`) and a walk over it onto the crown, on page inputs only. ~3.4 s locally. Gale/Ledger journey done 2026-11-12 (SKY-2): the same test goes on to fight the Storm Roc through its three phases on the crown (struck in its stoop and grounded sweep, GUSTed with the fan pitched up while it throws gale walls from 7 m up) to its fall on the crown, then reads the Ledger off the ticks' effects: `far-reach.quest` and `far-reach.roc` filed once each, 10 quest coins and 25 Roc coins paid once. 25,543 ticks, ~1.5 s locally. Sleeping hosts still open |
| Falling out of the world | Open, found 2026-11-12 (SKY-1): headless, the step's wisp shoves an idle player at the winch drum off the step's south rim and they fall forever (y -600 after 900 ticks); no kill floor or respawn fires. Repro: after the keeper tape and quest, stand at (-60.8, -135.3) on the step and send no input for 900 ticks. The journey test crosses the raised bridge at once instead. Owner: engine fall respawn or the shard's sea collider |
| Roc victory paid for a fall | Open, found 2026-11-12 (SKY-2): a walker shoved or walking off the crown's south rim mid-fight falls (ENG-18), the Roc stalks them down, and at about y 5 it dies with 292 of 420 HP left: `far.roc.down` is set, the Ledger files `far-reach.roc` and its 25 coins pay, though nobody struck it down. Repro: after the winch journey's crown walk, each tick face the Roc, attack it and walk straight at its ground point with no rim clamp; on the pinned engine the walker leaves the rim at (4, 43, -210) about 1,100 ticks in and the victory files at fight tick 1,223. Owner: engine held boss (a death outside the arena, or one no hit caused, should reset the encounter, not pay it) |
| Goldens and GPU | Existing graphical owner and Mac mini; outside this lane |

New coverage stays outside hooks under J186. Nothing uploads or deploys.
