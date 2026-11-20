import { speciesProgramToRows, type ConvertedSpecies } from '@wildshard/sharddev/species/toRows';
import rows from '../../data/physicsRows.json' with { type: 'json' };
import { skyPhysicsActors } from '../physics';
import { SKY_CREATURE_ROWS, ROC_STRIKES } from './brains';
import { RAM_DATA, DIVE_DATA, BURST_DATA } from './strikes';
import { ROC_WORLD_TARGETS } from './rocDecision';
import { SKY_FLOCK_ROWS } from './spawns';
import { ROC_ID, ROC_DEFINITION, PHASES } from './rocFight';
import * as LAYOUT from '../layout';

// ONE-FORMAT OF20b: Sky Reach's creatures are rows. The rays, roost rays, wisps and goats leave the runtime plan's keeper
// for declared spawns the engine's declared host runs beside it (OF19b0); the Storm Roc stays the keeper's held boss until
// OF20c. `speciesProgramToRows` turns the flock's program into species, brains and plain strikes (the Roc's exact strikes
// stay in `actors/strikes`); each body keeps its keeper id, its authored home (the diver's orbit, the goat's isle) and the
// keeper's scale, and stands where the keeper placed it: a flyer at its species' altitude, a goat on its isle.

type Kind = keyof typeof rows.species;
// OF20c: the Storm Roc is declared too: its decision brain becomes temperament `none` and its `sim/scripts` row
// (`ROC_DECISION`, actors `roc`) drives the declared body; its fight is a declared `boss` encounter (`SKY_DECLARED_ENCOUNTERS`).
const flock = SKY_FLOCK_ROWS;
const kinds = new Set<string>(flock.map(row => row.kind));
const program = { species: SKY_CREATURE_ROWS.filter(row => kinds.has(row.kind)), strikes: [RAM_DATA, DIVE_DATA, BURST_DATA, ...ROC_STRIKES] };
/** The format keeps a body's centre above its feet (`bodyY` positive); the wisp's bake centres its puff on its origin, so
 *  it stands a micron up, which no contact or reach can tell apart. */
const BODY_Y_MIN = 0.000001;
const dimsOf = (kind: Kind): (typeof rows.species)[Kind]['spec']['dims'] => { const dims = rows.species[kind].spec.dims; return { ...dims, bodyY: Math.max(dims.bodyY, BODY_Y_MIN) }; };
const looks = new Map(program.species.map(row => [row.kind, { look: `far.declared.${row.kind}`, dims: dimsOf(row.kind as Kind) }] as const));
const converted = speciesProgramToRows(program, looks);
/** OF20c1/OF20c2: what the Roc's borrowed row said in `strikeEffects` (the gale wall's shove, the stoop's chest aim) is its
 *  abilities' push and aim on the declared path. */
function withStrikeEffects(row: ConvertedSpecies['species'][number]): ConvertedSpecies['species'][number] {
  const decision = converted.decisions.find(entry => entry.species === row.id)?.decision;
  if (decision === undefined || row.abilities === undefined) return row;
  return { ...row, abilities: row.abilities.map(ability => {
    const effect = decision.strikeEffects.find(entry => entry.strike === ability.use);
    if (effect === undefined) return ability;
    return { ...ability, ...(effect.aimHeight > 0 ? { aimHeight: effect.aimHeight } : {}),
      ...(effect.speed > 0 || effect.lift > 0 ? { effect: 'impulse' as const, strength: effect.speed, lift: effect.lift } : {}) };
  }) };
}
/** The flock's rows: species with their layers, the brains they name and the plain strikes. */
/** A plain strike row's sizes stop at the format's 20 m, and the Roc's stoop (22 m reach) and gale wall (a 26 m lane, 30 m
 *  reach) are longer. Their exact rows stay in `actors/strikes` (ROC_STRIKES), which the declared decision host runs by the
 *  same id over the plain row (engine `decisions.ts`, OF19b0), so the plain row only names the ability and keeps in range. */
const PLAIN_SIZE_MAX = 20;
const plain = (size: number): number => Math.min(size, PLAIN_SIZE_MAX);
function withinPlain(row: ConvertedSpecies['strikes'][number]): ConvertedSpecies['strikes'][number] {
  const shape = row.shape;
  const sized = shape.kind === 'lane' ? { ...shape, length: plain(shape.length), width: plain(shape.width) }
    : shape.kind === 'wedge' ? { ...shape, length: plain(shape.length) } : shape.kind === 'ring' ? { ...shape, outer: plain(shape.outer) }
    : { ...shape, radius: plain(shape.radius) };
  return { ...row, range: plain(row.range), shape: sized };
}
export const SKY_DECLARED_ROWS: ConvertedSpecies = { ...converted, species: converted.species.map(withStrikeEffects), strikes: converted.strikes.map(withinPlain) };

/** One look row per species: OF20d, the page draws each body from the `sky` scene library's rig of its kind (format
 *  0.50.0 `platform.rig`), as an ordinary upload does, with no `species.program` feature (the server never reads a look). */
export const SKY_DECLARED_LOOKS = SKY_DECLARED_ROWS.species.map(row => ({ id: `far.declared.${row.kind}`, species: row.id,
  recipe: 'platform.rig', material: null, parameters: { library: 'sky' }, animation: { recipe: 'platform.rig', parameters: {} } }));

const keeperBodies = new Map(skyPhysicsActors().map(row => [row.id, row]));
/** Each flock body as a declared spawn, in the keeper's order: its id, home, scale and the keeper's placement. */
export const SKY_DECLARED_SPAWNS = flock.map((row, index) => {
  const brained = program.species.find(entry => entry.kind === row.kind), species = SKY_DECLARED_ROWS.species.find(entry => entry.kind === row.kind);
  const body = keeperBodies.get(row.id), brain = species?.temperament?.brain;
  if (brained === undefined || species === undefined || body === undefined || brain === undefined) throw new Error(`Missing declared Sky body ${row.id}`);
  if (row.id === ROC_ID) {
    // the Roc rests on its perch (its decision's `far.roc.perch` spot) with no brain or blow of its own: its decision row moves and strikes
    const perch = ROC_WORLD_TARGETS.spots[0];
    return { id: row.id, species: species.id, variant: row.look, brain: null, strike: null, seed: index + 1, scale: body.scale,
      at: [perch.at[0], perch.at[1], perch.at[2]] as [number, number, number], yaw: perch.yaw };
  }
  if (brain === 'none') throw new Error(`Missing declared Sky brain ${row.id}`);
  const y = brained.flight === undefined ? row.home.y : brained.flight.altitude;
  return { id: row.id, species: species.id, variant: row.look, brain, strike: null, seed: index + 1, scale: body.scale,
    at: [row.at[0], y, row.at[1]] as [number, number, number], yaw: row.yaw, home: { x: row.home.x, y: row.home.y, z: row.home.z, r: row.home.r } };
});

/** OF20c: the Storm Roc's fight as a declared `boss` encounter: placed on its perch, its arena the crown (walking onto it
 *  starts the fight, as the held fight did: OF20d), its intro, retry and phases the held fight's (speed 0: its decision row
 *  moves it); the plan's owner row binds its flag, fact, purse and save. */
export const SKY_DECLARED_ENCOUNTERS = [{ id: 'far.roc.fight', entity: ROC_ID, kind: 'boss', panel: 'far.roc.panel',
  name: ROC_DEFINITION.name, title: ROC_DEFINITION.title, retry: ROC_DEFINITION.retryTitle, start: 'placed', capExempt: true,
  arena: { at: [LAYOUT.CROWN.x, LAYOUT.CROWN.y, LAYOUT.CROWN.z] as [number, number, number], radius: LAYOUT.CROWN.r * 0.9 },
  intro: ROC_DEFINITION.intro, introShort: ROC_DEFINITION.introShort,
  respawn: { at: [LAYOUT.FALLEN_BRIDGE.x1, LAYOUT.CROWN.y + 0.2, LAYOUT.FALLEN_BRIDGE.z1 - 2] as [number, number, number], yaw: 0 },
  phases: ROC_DEFINITION.phases.map((phase, index) => ({ at: PHASES[index] ?? phase.at, name: phase.name, caption: phase.caption, speed: 0, stopDistance: 2, turnRate: 2 })) }];
/** The Roc's boss panel, mounted by a runtime-plan page from its declared `ui` row (the shared engine row). */
export const SKY_DECLARED_UI = [{ kind: 'bossPanel', id: 'far.roc.panel', encounter: 'far.roc.fight', name: ROC_DEFINITION.name,
  title: ROC_DEFINITION.title, retry: ROC_DEFINITION.retryTitle }];
