# CI21: Sky's vane and mill scene tests come home

> Written by: Claude (lane opus-ci21port)

Engine's lift-pending `sky-vane-scene` and `sky-mill-scene` prove Sky's own
scene rows: each vane rotor turns on its own at its interaction anchor and
keeps its native ports when model parts are missing; the mill's parts stay
borrowed under a native spinning hub, the hub survives failed optional baked
parts, and the fallen deck keeps its native pivot. Their subject is Sky
content bound through engine's scene runtime, so under J232 (and J200's
"proofs live in the shard") they now live here. The only change is the
import: engine's `src/client/game/plugin/scene` is the public
`@wildshard/engine/game/plugin/scene`; the `sky-scene-source` fixture was
already here. `sky-mill-scene-intake` proves intake, not this runtime binding.

Map: project-wildshard-meta docs/plans/test-coverage/CI21-PORT-MAP.json.
