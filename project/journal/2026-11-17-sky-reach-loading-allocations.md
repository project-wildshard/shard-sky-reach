# Sky Reach loading-renderer allocations

> Written by: Codex
> **State:** Measured 2026-11-17 for MEMORY-GATES MG11. The 1.0 GB row stays open.

Sky Reach product `714a8c1f` ran against preparation client `4a7ba050`,
the same build as Pine, Driftwood and Template. Headless Chromium used
phone Low, a 402 × 874 viewport at DPR 3 and no service worker. The
survey reached 600 MB of native renderer footprint. The profile
captured the loading ledger, one allocation sample and one heap
snapshot at `modules`, 4.323 s after navigation, at 569 MB of native
renderer footprint. That corresponds to 1.138 GB with the existing
renderer ×2 calibration. The main isolate had 73 MB of JS in use
and 122 MB of backing storage before the snapshot. The boot reached
player control.

All sizes are decimal MB. Rows across instruments overlap. The heap
snapshot reports bytes that survived collection. The 16 KiB sample
estimates cumulative allocations, including collected objects. The
native allocator survey's loading dump was at 549 MB of renderer
footprint. The loopback server decoded the pinned Brotli server pack
as the production host does.

| Bucket over 50 MB | MB | Owner and evidence |
| --- | ---: | --- |
| Native malloc | 204 | Chromium and shared engine. Effective live allocated objects account for 182 MB. V8's attribution below overlaps this meter. |
| Native PartitionAlloc | 174 | Chromium and shared engine buffer lifetimes. ArrayBuffer allocated objects account for 130 MB. |
| Native V8 main heap | 127 | Chromium and shared engine. New space accounts for 67 MB. V8 attributes another 115 MB of malloc to the main isolate. |
| Native V8 worker malloc | 234 | Shared engine and Chromium. Two unnamed isolates account for 117 MB apiece. Worker JS heap is 37 MB. Template also reproduces these large malloc entries. The dump cannot join them to worker targets. |
| Snapshot ArrayBuffer backing stores | 72 | Mixed. Geometry edges reach 33 MB and product wire cache edges 32 MB. |
| Snapshot JS objects and code | 51 | Shared engine and V8. Includes scene objects, compiled code, strings and parsed rows. |
| Loading ledger RAM ArrayBuffers | 94 | Mixed. Shared rig intake labelled 32.9 MB and product wire cache 32.3 MB. |
| Loading ledger GPU textures | 153 | Mixed. The Sky-owned painted GLB atlas subset is 86.7 MB, including 33.6 MB for six far isles. Some atlases receive a shared scene label. |
| Sampled format and schema allocations | 69 | Shared engine intake and format. Valibot accounts for 37 MB. |
| Sampled Three allocations | 67 | Shared renderer and model intake. Three core, GLTFLoader and WebGL account for 33, 20 and 14 MB. |

The sample estimated 290 MB of main-isolate allocation traffic. The
largest mapped site outside Three and format intake was 12 MB in
`tiledMesh.ts`. The measured painted atlas family is the only grouped
Sky-owned cut at this threshold. The 32.3 MB of product wire bytes and
other labelled scene groups stay below it.

## Phone atlas cut

The pinned discovery names compressed phone GLBs that the local pinned
product does not contain. Both the full-mesh Basis variants and the
atlas-only Basis variants reduced the atlas bucket to about 22 MB,
but the renderer peaked at 666–676 MB in the playable runs. The
landed source uses a 512-pixel WebP atlas for phone-preferring loads on
the existing variant route. Fifteen original 1,024-pixel images were
resized with ImageMagick and encoded with lossless `cwebp`. The build
checks each derivative against its original atlas hash. It packages
the 21 atlases in 5.43 MB of named GLBs, retaining model UVs through
the existing prepared geometry and the authored sampler. The desktop
and image fallback paths use the full authored atlases.

With the same browser, engine and spawn, two alternating test runs
reached control. The inline proof registered the candidate's own
discovery map and pinned the texture policy for both arms. The
catalogue route also selected all 21 registered variants during the
Basis trial. Its pinned spawn manifest could not complete against a
local draft, so the playable comparison used the inline route.

| Reading | Pinned product | 512 px candidate `509461ee` |
| --- | ---: | ---: |
| Native renderer peak, two runs | 575 / 592 MB | 565 / 565 MB |
| Phone probe at renderer ×2 | 1.150 / 1.184 GB | 1.129 / 1.131 GB |
| GPU ledger at peak | 175.4 MB | 112.4 MB |
| Painted atlas labels within the GPU ledger | 86.7 MB | 29.4 MB |
| RAM ledger at peak | 93.7 / 97.9 MB | 86.6 / 86.6 MB |

The phone Low spawn comparison retained the mill, foreground, painted
islands and skyline. The candidate's epoch-3 estimate is 979 MB
playing and 1,131 MB loading, worst grid cell. The GPU drop repeats.
The renderer delta is within the prior run spread, and both candidate
boots remain above the 1.0 GB target.

The Mac mini evidence is under
`~/.cache/wildshard/plan-artifacts/memory-gates/zone-loading-peaks-2026-11-17/far-reach`.
The allocation receipt is addressed to mini-ninemem2 and mini-memplan.
