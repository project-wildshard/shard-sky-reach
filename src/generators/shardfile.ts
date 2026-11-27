import { SKY_DRESSING_PROGRAMS } from './sceneDressing';
import { SKY_PAINTED_GRAPHS } from './paintedLook';
import plumbing from '../data/plumbing.json' with { type: 'json' };
import slotMigrations from '../data/slotMigrations.json' with { type: 'json' };
import { SKY_SECTIONS } from './sections';
import { STORM_NOISE } from './rows/stormNoise';
import { SWARD_ATLAS_FILE, SWARD_ATLAS_SAMPLER } from './rows/swardAtlas';
import skyMaps from '../data/skyMaps.json' with { type: 'json' };
import type { SkyNavigationRows } from './navigation';
import { SKY_REACH_RUNTIME_COST } from './rows/budgets';
import { emptyShardfile } from '@wildshard/sdk/author';
import { parseShardfile } from '@wildshard/format/shardSchema';
import { SKY_LIFT_PROMPTS } from './rows/liftPrompts';
import { SKY_MOVER_VIEWS } from './rows/moverViews';
import type { MoverData } from '@wildshard/sdk/movers';
import { risingIsletRows, risingIsletEntryways } from './risingIslets';
import lookGraphs from '../data/lookGraphs.json' with { type: 'json' };
import manifest from '../manifest.json' with { type: 'json' };
import { ISLE_MAPS } from './rows/isleLook';
import { SKY_WORLD_TILE_ROWS as isleProps } from './worldTileRows';
import { withConvertedRows } from '@wildshard/sdk/species/toRows';
import { SKY_DECLARED_ENCOUNTERS, SKY_DECLARED_LOOKS, SKY_DECLARED_ROWS, SKY_DECLARED_SPAWNS, SKY_DECLARED_UI } from './rows/declaredCreatures';

const isletRows = risingIsletRows(), RISING_ISLETS = isletRows.entries, ENTRYWAYS = risingIsletEntryways();

// Legacy trusted runtime retains today's geometry/spawn; SF29 binds only its audio.
// SF49-g (G99 / G183) and SF8c's socketLift: every entry meets the road over the cloud sea's void (no ground below y = 0
// anywhere at an edge), so each is a `socketLift`: the platform's socket deck, then a static approach over a stone lip
// (top y = 0, across the socket's full 8 m inner line) to the Rising Islet resting at its road stop; the islet rides its
// chains to the gate isle, whose walk strips are the onward route's playable ground. The islets and their stationary road
// gates are this shardfile's compiled `movers` (one admitted module, fixed ride driver); the trusted runtime installs
// exactly these rows (runtime/movers.ts). world/islets.ts is the one source of the geometry.

const base = emptyShardfile({ slug: 'far-reach', name: 'Sky Reach', author: 'Wildshard', revision: 1, seed: 6417 });
// ONE-FORMAT OF20b/OF20c: the rays, roost rays, wisps, goats and the Storm Roc are declared rows the engine runs beside the
// runtime plan (OF19b0); the Roc's fight is a declared `boss` encounter with its panel
const rows = { ...withConvertedRows(base.rows, SKY_DECLARED_ROWS), looks: [...base.rows.looks, ...SKY_DECLARED_LOOKS] };
const creatures = { ...base.creatures, brains: SKY_DECLARED_ROWS.brains, spawns: SKY_DECLARED_SPAWNS };
/** ONE-FORMAT OF31h3: the cell's awake cost, ms per tick with one player in it as microseconds (engine's measured
 * SC8 table, v0.1.19: 0.866 ms); the box weighs the cell by it in place of an engine table of shards. */
const SKY_AWAKE_MICROS = 866;
const libraryBytes = skyMaps.budget.compressed + STORM_NOISE.compressed + SWARD_ATLAS_FILE.compressed;
/** Build-time declaration rows from admitted original navigation; no source handoff is read. */
export function skyShardfileRows(navigation: SkyNavigationRows, movers: MoverData): ReturnType<typeof parseShardfile> {
  return structuredClone(parseShardfile({ ...base, ...SKY_SECTIONS, rows, creatures, encounters: SKY_DECLARED_ENCOUNTERS, spawn: manifest.spawn, ui: [...base.ui, ...SKY_DECLARED_UI], plumbing, state: { ...SKY_SECTIONS.state, version: 2 }, migrations: slotMigrations, navigation: navigation.navigation, serverBudget: { ...base.serverBudget, awakeMicros: SKY_AWAKE_MICROS, memory: base.serverBudget.memory + navigation.files.reduce((sum, file) => sum + file.decoded, 0) }, accent: 'pink', runtime: null,
  // the material graphs the runtime draws its own meshes in (authored SF59 graph JSON, data/lookGraphs.json), and the
  // samplers: the islands' and boulders' library maps tile, the sward atlas keeps its own
  look: { ...base.look, materials: { ...base.look.materials, ...lookGraphs, ...SKY_PAINTED_GRAPHS }, samplers: { ...base.look.samplers, [ISLE_MAPS.rock]: { wrap: 'repeat', anisotropy: 4 }, [ISLE_MAPS.meadow]: { wrap: 'repeat', anisotropy: 4 }, [SWARD_ATLAS_FILE.hash]: SWARD_ATLAS_SAMPLER } },
  clientChannels: [...SKY_MOVER_VIEWS, ...SKY_LIFT_PROMPTS, ...SKY_DRESSING_PROGRAMS],
  entryways: [...ENTRYWAYS],
  // The authored clips declare every bridge, islet and gate; both hosts install this admitted order once.
  movers,
  // Static island geometry belongs only to the tile streamer. Explorer borrows its admitted L0 partitions cold.
  // FR2: open sky, every tile is on screen from a hover; the whole cell draws its fine tiles and decorations (2.9 MB
  // decoded + GPU for all 64 L0 tiles, the files already ship), so nothing past a 5 x 5 ring falls to its 1.5 % copy
  ring: 'cell',
  library: [...base.library, ...skyMaps.library, STORM_NOISE.hash, SWARD_ATLAS_FILE.hash], tiles: isleProps.tiles, files: [...skyMaps.files, { ...STORM_NOISE, dependencies: [] }, { ...SWARD_ATLAS_FILE, dependencies: [] }, ...navigation.files, ...isleProps.files], critical: [...navigation.critical],
  budgets: { ...base.budgets, client: SKY_REACH_RUNTIME_COST, library: { ...skyMaps.budget, compressed: libraryBytes, resident: skyMaps.budget.resident + STORM_NOISE.decoded + STORM_NOISE.gpu + SWARD_ATLAS_FILE.decoded + SWARD_ATLAS_FILE.gpu, downloadAllowance: libraryBytes }, sim: { resident: 1_000_000 + navigation.files.reduce((sum, file) => sum + file.decoded, 0), compressed: navigation.files.reduce((sum, file) => sum + file.compressed, 0) } },
  sim: { ...base.sim, scripts: [] },
  props: { ...isleProps.props, materials: Object.fromEntries(['isle-paint', 'isle-paint-cut', 'isle-paint-cut-mill', 'isle-coarse'].map(name => [name, { id: name === 'isle-coarse' ? 'toon' : name }])),
    colliders: [...RISING_ISLETS.map((entry) => ({ id: `landing.${entry.edge}`, panel: null, initialActive: true, shapes: [{ ...entry.landing }] })),
      ...RISING_ISLETS.map((entry) => ({ id: `gate-isle.${entry.edge}`, panel: null, initialActive: true, shapes: isletRows.entries.flatMap(row => row.edge === entry.edge ? row.strips.map(strip => ({ ...strip, kind: 'box' as const, surface: 'grass' as const })) : []) }))] } }));
}
