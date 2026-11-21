import stages from '../../data/bossStages.json' with { type: 'json' };
import { ROC_DEFINITION, ROC_BOSS_PROFILE, ROC_ID, BOSS_REWARD } from './rocFight';
import FLAGS from '../../data/flags.json' with { type: 'json' };
import STRINGS from '../../data/strings.json' with { type: 'json' };
import { SKY_RIG_LIBRARY } from '../rigLibrary';
import { SKY_CREATURE_ROWS, SKY_CREATURE_STRIKES, SKY_PAGE_ROWS, SKY_PAGE_HOMES } from './brains';
import { SKY_FLOCK_PLACEMENT, SKY_KILL_Y, FLOCK_STEP, SKY_FLOCK_GROUPS, SKY_PAGE_HELD } from './spawns';

// ONE-FORMAT OF20b/OF20c: the keeper stands nothing; the rays, roost rays, wisps, goats and the Storm Roc are declared
// spawns (`declaredCreatures.ts`) the engine's declared host drives beside the plan, and the Roc's fight is a declared
// `boss` encounter the plan's owner row (ROC_OWNER) still pays and saves. The page's groups still name the flock (the ray
// wake, the witness): a group may name a declared spawn.

/** The same authored catalogue enters page and native hosts; each keeps its original phase and lifetime. */
const program = { species: SKY_CREATURE_ROWS, strikes: SKY_CREATURE_STRIKES };
export const SKY_PAGE_PROGRAM = { species: { program, page: SKY_PAGE_ROWS, homes: SKY_PAGE_HOMES, shove: true, library: SKY_RIG_LIBRARY },
  population: { system: 'far.creatures', held: { ...SKY_PAGE_HELD, order: [], placements: [] },
    bodyHomes: [], groups: SKY_FLOCK_GROUPS,
    witness: { groups: ['rays', 'roost', 'goats', 'wisps'] } },
  inspect: { actors: { roc: { held: ROC_ID } }, roster: 'kept', boss: 'boss' },
  fight: { id: ROC_ID, definition: ROC_DEFINITION, stages, profile: ROC_BOSS_PROFILE, reward: BOSS_REWARD,
    victory: { flag: FLAGS.roc, fact: 'far-reach.roc', once: true, again: STRINGS.rocDown, rewardLabel: STRINGS.bossReward } },
} as const;
// ONE-FORMAT OF30: the empty keeper names no species programme (format 0.66.1, engine 0a9eff1512)
export const SKY_NATIVE_POPULATION = { step: FLOCK_STEP, seed: 6417, admission: 'install',
  homes: [],
  attackers: null, think: 'legacy', killY: SKY_KILL_Y, placement: { ...SKY_FLOCK_PLACEMENT, rows: [] } } as const;
