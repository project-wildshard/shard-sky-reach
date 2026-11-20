// ONE-FORMAT OF20b: Sky Reach's flock is declared rows the engine runs beside the runtime plan's keeper (OF19b0). The
// built product stands every ray, roost ray, wisp and goat as a declared spawn and the keeper only the Storm Roc; the goats
// stand on their isles (the plan's solids, OF20b's engine half) and one shoved off the rim dies under the plan's death
// plane, as a keeper home did; a ray dives on a player under it; the cell saves and restores them.
// oxlint-disable-next-line import/no-nodejs-modules -- The proof reads the admitted product and native physics.
import { readFileSync } from 'node:fs';
import { builtFolder } from '@wildshard/engine/test/builtFolder';
import { expect, test } from 'vitest';
import { nativeRapierFile } from './fixtures/native-rapier-file';
import { loadHeadlessFolder } from '@wildshard/engine/host/headlessFolder';
import { outputDescriptor } from '@wildshard/engine/game/shardfile/outputDescriptor';
import { loadRapier } from '@wildshard/engine/physics/rapier';
import { createSimHost } from '@wildshard/engine/sim';
import { snapshotSimHost } from '@wildshard/engine/sim/snapshot';
import { restoreSimHost } from '@wildshard/engine/sim/restore';
import { prepareRuntimeWorld } from '@wildshard/engine/game/plugin/simulation';
import { parseNativeRuntimePlan } from '@wildshard/format/nativeRuntimePlan';
import { leadPlayer } from '@wildshard/engine/sim/leadPlayer';
import { SKY_FLOCK_ROWS, SKY_KILL_Y } from '../src/generators/rows/spawns';
import { ROC_ID } from '../src/generators/rows/rocFight';

const FLOCK = SKY_FLOCK_ROWS.filter(row => row.id !== ROC_ID), GOAT = 'far.goat.0', RAY = 'far.ray.0';

test('the flock is declared spawns beside the held Roc: goats keep their isles, a fallen goat dies, a ray dives, the cell resumes', async () => {
  const directory = builtFolder('far-reach'), product = await loadHeadlessFolder(directory), descriptor = outputDescriptor(product.shardfile);
  if (descriptor === undefined) throw new Error('Missing admitted product');
  const shard = product.shardfile, plan = parseNativeRuntimePlan(product.section('sim/runtime-plan'));
  expect(shard.creatures.spawns.map(row => row.id)).toEqual(FLOCK.map(row => row.id));
  expect(plan.recipe.population.rows.homes.map(row => row.id)).toEqual([ROC_ID]);
  expect(product.has('actors/species-programs')).toBe(true); // the page still draws through `species.program`
  const assets = new Map(descriptor.index.files.map(file => [file.commons === true ? `commons:${file.hash}` : file.hash,
    Uint8Array.from(readFileSync(`${directory}/${file.path}`))]));
  const rapier = await loadRapier(Uint8Array.from(readFileSync(nativeRapierFile)));
  const world = await prepareRuntimeWorld(shard, assets, plan.baked, plan.recipe, descriptor.sections), host = createSimHost(world.level, { ...world.ports, rapier });
  world.install(host, { restoring: false, emit: () => undefined }).keeper.settle();
  const player = leadPlayer(host), ray = host.entities.get(RAY), goat = host.entities.get(GOAT);
  if (ray === undefined || goat === undefined) throw new Error('Missing declared bodies');
  let blows = 0;
  host.events.on('damage.dealt', ({ req }) => { if (req.target === player.health) blows++; }, host.scope);
  const rayHome = FLOCK.find(row => row.id === RAY)?.home, goatHome = FLOCK.find(row => row.id === GOAT)?.home;
  if (rayHome === undefined || goatHome === undefined) throw new Error('Missing authored homes');
  for (let i = 0; i < 900; i++) {
    player.position.set(rayHome.x, rayHome.y - 8.8, rayHome.z); player.velocity.set(0, 0, 0);
    player.health.attributes.health = player.health.attributes.maxHealth; host.step();
  }
  for (const row of FLOCK) expect(host.entities.get(row.id)?.alive, row.id).toBe(true);
  expect(host.entities.get(ROC_ID)?.alive).toBe(true);
  expect(blows).toBeGreaterThan(0);
  expect(goat.position.y).toBeGreaterThan(goatHome.y - 1);
  const saved = snapshotSimHost(host);
  const resumed = restoreSimHost(world.level, { ...world.ports, rapier }, saved, fresh => {
    world.install(fresh, { restoring: true, emit: () => undefined, snapshot: saved }).keeper.settle();
  });
  try {
    for (let i = 0; i < 60; i++) { host.step(); resumed.step(); }
    for (const row of FLOCK) expect(resumed.entities.get(row.id)?.position.toArray(), row.id).toEqual(host.entities.get(row.id)?.position.toArray());
    // off the rim and under the death plane, a goat dies by the fall
    goat.place(goatHome.x + 40, goatHome.z, 0, SKY_KILL_Y - 1);
    host.step();
    expect(goat.alive).toBe(false);
  } finally { resumed.dispose(); host.dispose(); }
}, 120_000);
