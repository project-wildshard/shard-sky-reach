# Cut Far Reach to the 1.0 GB phone envelope

> Written by: Claude (lane mini-zonemem)

> **State:** draft, 2026-11-17. One cut row, unclaimed. Opened by meta
> `docs/plans/MEMORY-GATES-PLAN.md` MG11 (J410, Jake 2026-11-17 ~17:05
> Cancún: *"all the zones should be optimized for memory"*). The
> phone's target is engine `PHONE_PLAYING_BYTES`, 1.0 GB; J408's
> 1.5 GB refusal is only the safety net.

## Measured (2026-11-17, Mac mini)

Product: the pinned revision 4 (source `714a8c1f`), which engine
`test/pins/shardfiles.json` ships; a local build at `a30052f` has the
same source hash.

| Instrument | Reading |
| --- | --- |
| Epoch-2 estimate (format main `52f184e`) | worst loading 951 MB, playing 863 MB |
| `wildshard memory`, v0.1.36 client, Low, 2 runs | Chromium renderer + GPU 1,264 / 1,274 MB |
| Loading renderer peak x2.0 (engine `3cd2dd87`) | **1,133 MB predicted phone peak** |
| iOS Simulator Safari, boot / after 2 min | WebContent 0.797 / 0.806 GB + GPU 0.156 GB |

The estimate passes; the measured boot does not. The empty template
on the same client predicts 848 MB, so Far Reach adds about 285 MB.

## Top allocations

- **JS heap during the load:** 230 MB peak inside a 566 MB renderer
  (the `modules` step). Live JS heap at ready is 57 MB.
- **Boot charge:** 168 MB shader compile, 33 MB held spawn parts.
- **Scene at ready:** 21 MB geometry arrays, 25 MB textures (9).
- **Files, decoded, phone tiers:** glb 29 MB, image 24 MB. Largest:
  `world/geometry/prepared-models.glb` 10.1 MB, `ui/images/
  card-landscape` 7.5 MB and `card-portrait` 6.9 MB (title cards,
  decoded in play), `world/rigs/storm-roc.glb` 6.3 MB beside its
  2.1 MB `storm-roc.phone.glb`.

## Rows

| Row | Work | Done when |
| --- | --- | --- |
| FM1 | Load the phone rig only (`storm-roc.phone.glb`) on the phone tier; keep the two card images out of play; split `prepared-models.glb` so the far half streams. | `wildshard memory` on the prepared product predicts at most 1,000 MB (loading renderer x2.0). Record shard and engine SHAs. Then lower the CI ratchet (MG11) to the new peak + 10%. |
