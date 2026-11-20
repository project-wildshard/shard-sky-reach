import { speciesProgramToRows, type ConvertedSpecies } from '@wildshard/sharddev/species/toRows';
import rows from '../../data/physicsRows.json' with { type: 'json' };
import { skyPhysicsActors } from '../physics';
import { SKY_CREATURE_ROWS } from './brains';
import { RAM_DATA, DIVE_DATA, BURST_DATA } from './strikes';
import { SKY_FLOCK_ROWS } from './spawns';
import { ROC_ID } from './rocFight';

// ONE-FORMAT OF20b: Sky Reach's creatures are rows. The rays, roost rays, wisps and goats leave the runtime plan's keeper
// for declared spawns the engine's declared host runs beside it (OF19b0); the Storm Roc stays the keeper's held boss until
// OF20c. `speciesProgramToRows` turns the flock's program into species, brains and plain strikes (the Roc's exact strikes
// stay in `actors/strikes`); each body keeps its keeper id, its authored home (the diver's orbit, the goat's isle) and the
// keeper's scale, and stands where the keeper placed it: a flyer at its species' altitude, a goat on its isle.

type Kind = keyof typeof rows.species;
const flock = SKY_FLOCK_ROWS.filter(row => row.id !== ROC_ID);
const kinds = new Set<string>(flock.map(row => row.kind));
const program = { species: SKY_CREATURE_ROWS.filter(row => kinds.has(row.kind)), strikes: [RAM_DATA, DIVE_DATA, BURST_DATA] };
/** The format keeps a body's centre above its feet (`bodyY` positive); the wisp's bake centres its puff on its origin, so
 *  it stands a micron up, which no contact or reach can tell apart. */
const BODY_Y_MIN = 0.000001;
const dimsOf = (kind: Kind): (typeof rows.species)[Kind]['spec']['dims'] => { const dims = rows.species[kind].spec.dims; return { ...dims, bodyY: Math.max(dims.bodyY, BODY_Y_MIN) }; };
const looks = new Map(program.species.map(row => [row.kind, { look: `far.declared.${row.kind}`, dims: dimsOf(row.kind as Kind) }] as const));
/** The flock's rows: species with their layers, the brains they name and the plain strikes. */
export const SKY_DECLARED_ROWS: ConvertedSpecies = speciesProgramToRows(program, looks);

/** One look row per species, naming the shard's rig recipe; the page draws the bodies through its `species.program`
 *  feature until declared looks can name a rig library (the server never reads a look). */
export const SKY_DECLARED_LOOKS = SKY_DECLARED_ROWS.species.map(row => ({ id: `far.declared.${row.kind}`, species: row.id,
  recipe: 'far.rig', material: null, parameters: {}, animation: { recipe: 'far.clips', parameters: {} } }));

const keeperBodies = new Map(skyPhysicsActors().map(row => [row.id, row]));
/** Each flock body as a declared spawn, in the keeper's order: its id, home, scale and the keeper's placement. */
export const SKY_DECLARED_SPAWNS = flock.map((row, index) => {
  const brained = program.species.find(entry => entry.kind === row.kind), species = SKY_DECLARED_ROWS.species.find(entry => entry.kind === row.kind);
  const body = keeperBodies.get(row.id), brain = species?.temperament?.brain;
  if (brained === undefined || species === undefined || body === undefined || brain === undefined || brain === 'none') throw new Error(`Missing declared Sky body ${row.id}`);
  const y = brained.flight === undefined ? row.home.y : brained.flight.altitude;
  return { id: row.id, species: species.id, variant: row.look, brain, strike: null, seed: index + 1, scale: body.scale,
    at: [row.at[0], y, row.at[1]] as [number, number, number], yaw: row.yaw, home: { x: row.home.x, y: row.home.y, z: row.home.z, r: row.home.r } };
});
