// ONE-FORMAT OF20b/OF20c: Sky Reach's creatures are declared rows the engine runs beside the runtime plan (OF19b0). The
// built product stands every ray, roost ray, wisp, goat and the Storm Roc as a declared spawn and the keeper nothing; the
// goats stand on their isles (the plan's solids, OF20b's engine half) and one shoved off the rim dies under the plan's death
// plane, as a keeper home did; a ray dives on a player under it; the cell saves and restores them. The Roc's fight is a
// declared boss encounter that takes the plan's owner row (OF20c): its win sets the flag, files the fact and pays the purse.
// oxlint-disable-next-line import/no-nodejs-modules -- The proof reads the admitted product and native physics.
import { readFileSync } from 'node:fs';
import { builtFolder } from '@wildshard/sdk/internal/engine/test/builtFolder';
import { expect, test } from 'vitest';
import { nativeRapierFile } from './fixtures/native-rapier-file';
import { loadHeadlessFolder } from '@wildshard/sdk/headless/host/headlessFolder';
import { outputDescriptor } from '@wildshard/sdk/headless/game/shardfile/outputDescriptor';
import { loadRapier } from '@wildshard/sdk/headless/physics/rapier';
import { createSimHost } from '@wildshard/sdk/internal/engine/sim';
import { snapshotSimHost } from '@wildshard/sdk/headless/sim/snapshot';
import { restoreSimHost } from '@wildshard/sdk/internal/engine/sim/restore';
import { prepareRuntimeWorld } from '@wildshard/sdk/internal/engine/game/plugin/simulation';
import { parseNativeRuntimePlan } from '@wildshard/format/nativeRuntimePlan';
import { leadPlayer } from '@wildshard/sdk/internal/engine/sim/leadPlayer';
import { SKY_FLOCK_ROWS, SKY_KILL_Y } from '../src/generators/rows/spawns';
import { ROC_ID, BOSS_REWARD } from '../src/generators/rows/rocFight';
import FLAGS from '../src/data/flags.json' with { type: 'json' };
import { Vector3 } from 'three';
import * as v from 'valibot';
import type { NativeRuntimeEffect } from '@wildshard/sdk/internal/engine/game/plugin/simulation';

const FLOCK = SKY_FLOCK_ROWS.filter(row => row.id !== ROC_ID), GOAT = 'far.goat.0', RAY = 'far.ray.0', FIGHT = 'far.roc.fight';
const fightState = v.object({ boss: v.object({ state: v.string(), saved: v.object({ defeated: v.boolean(), rewardTaken: v.boolean(), kills: v.number() }) }) });

async function cell(effects: NativeRuntimeEffect[] = []) {
  const directory = builtFolder('far-reach'), product = await loadHeadlessFolder(directory), descriptor = outputDescriptor(product.shardfile);
  if (descriptor === undefined) throw new Error('Missing admitted product');
  const shard = product.shardfile, plan = parseNativeRuntimePlan(product.section('sim/runtime-plan'));
  const assets = new Map(descriptor.index.files.map(file => [file.commons === true ? `commons:${file.hash}` : file.hash,
    Uint8Array.from(readFileSync(`${directory}/${file.path}`))]));
  const rapier = await loadRapier(Uint8Array.from(readFileSync(nativeRapierFile)));
  const world = await prepareRuntimeWorld(shard, assets, plan.baked, plan.recipe, descriptor.sections), host = createSimHost(world.level, { ...world.ports, rapier });
  world.install(host, { restoring: false, emit: effect => { effects.push(effect); } }).keeper.settle();
  return { product, shard, plan, world, host, rapier };
}

test('the Storm Roc is a declared boss: its win files the owner row\'s flag and fact and pays its purse once', async () => {
  const effects: NativeRuntimeEffect[] = [], { shard, plan, host } = await cell(effects);
  try {
    expect(shard.encounters.map(row => [row.id, row.entity, row.kind, row.start])).toEqual([[FIGHT, ROC_ID, 'boss', 'placed']]);
    expect(plan.recipe.population.owner?.actor).toBe(ROC_ID);
    const player = leadPlayer(host), roc = host.entities.get(ROC_ID);
    if (roc === undefined) throw new Error('Missing declared Roc');
    const fight = () => { const slot = snapshotSimHost(host).adapters.find(row => row.id === `encounter.${FIGHT}`);
      if (typeof slot?.state !== 'string') throw new Error('Missing declared Roc encounter'); return v.parse(fightState, JSON.parse(slot.state)).boss; };
    host.events.answer('damage.modify', request => request?.target === player.health ? null : request, host.scope);
    for (let i = 0; i < 6000 && fight().state !== 'victory'; i++) {
      player.position.set(0, 44.2, -184); player.velocity.set(0, 0, 0);
      if (roc.alive) host.combat.hit({ source: player.health, sourceTags: ['actor.player'], target: roc.combatActor(), amount: 40,
        point: roc.position.clone(), dir: new Vector3(), cause: { kind: 'test', label: 'test' } });
      host.step();
    }
    expect(fight().state).toBe('victory');
    expect(fight().saved).toMatchObject({ defeated: true, kills: 1 });
    expect(host.flags.has(FLAGS.roc)).toBe(true);
    expect(effects.flatMap(row => row.kind === 'fact' ? [row.name] : [])).toEqual(['far-reach.roc']);
    expect(effects.reduce((sum, row) => sum + (row.kind === 'coins' ? row.amount : 0), 0)).toBe(BOSS_REWARD);
  } finally { host.dispose(); }
}, 120_000);

test('the flock and the Roc are declared spawns: goats keep their isles, a fallen goat dies, a ray dives, the cell resumes', async () => {
  const { product, shard, plan, world, host, rapier } = await cell();
  expect(shard.creatures.spawns.map(row => row.id)).toEqual(SKY_FLOCK_ROWS.map(row => row.id));
  expect(plan.recipe.population.rows.homes).toEqual([]);
  // OF20d: an ordinary upload: the page draws each declared body from the `sky` library's rig of its kind (`platform.rig`),
  // with no `species.program` feature and no species program section
  expect(product.has('actors/species-programs')).toBe(false);
  expect(product.section('client/plan').features.map(row => row.kind)).not.toContain('species.program');
  expect(new Set(shard.rows.looks.filter(row => shard.creatures.spawns.some(spawn => spawn.species === row.species))
    .map(row => `${row.recipe} ${JSON.stringify(row.parameters)}`))).toEqual(new Set(['platform.rig {"library":"sky"}']));
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

test('the declared Roc holds at its perch until a player walks onto the crown, then takes off to fight (OF20d)', async () => {
  const { shard, host } = await cell();
  try {
    const roc = host.entities.get(ROC_ID), spawn = shard.creatures.spawns.find(row => row.id === ROC_ID), player = leadPlayer(host);
    if (roc === undefined || spawn === undefined) throw new Error('Missing declared Roc');
    const perch = new Vector3(...spawn.at);
    const fight = () => { const slot = snapshotSimHost(host).adapters.find(row => row.id === `encounter.${FIGHT}`);
      if (typeof slot?.state !== 'string') throw new Error('Missing declared Roc encounter'); return v.parse(fightState, JSON.parse(slot.state)).boss.state; };
    for (let i = 0; i < 1800; i++) host.step(); // 30 s with the player at the spawn, far from the crown
    expect(fight()).toBe('armed');
    expect(roc.alive).toBe(true);
    // it holds over its perch (its flight keeps it a few metres up) rather than flying to the nearest player
    expect(Math.hypot(roc.position.x - perch.x, roc.position.z - perch.z)).toBeLessThan(1);
    expect(Math.abs(roc.position.y - perch.y)).toBeLessThan(8);
    host.events.answer('damage.modify', request => request?.target === player.health ? null : request, host.scope);
    let started = false, left = 0;
    for (let i = 0; i < 1800; i++) {
      player.position.set(0, 44.2, -184); player.velocity.set(0, 0, 0);
      host.step();
      started ||= fight() === 'fight';
      left = Math.max(left, roc.position.distanceTo(perch));
    }
    expect(started).toBe(true);
    expect(left).toBeGreaterThan(5);
    expect(roc.position.distanceTo(new Vector3(0, 44.2, -184))).toBeLessThan(60);
  } finally { host.dispose(); }
}, 120_000);
