// J186 Ring 2, CI only, never a hook. The keeper tape (content-tapes.json)
// carried on to the winch on the built product: the roost rays, the three
// vanes, the board over the hover bridges and the updraft, the winch drum
// turned before and after it is earned, and the raised bridge walked to the
// storm crown. Only the inputs the page sends drive it (walking, the board,
// [E] prompts, fan strikes and GUST). No flag, pose or quest state is
// written; a fight reads where a flier is to aim, as a player's eyes do.
import '@wildshard/engine/scripts/sim-node-loader.mjs';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';
import { test } from 'node:test';

const { loadHeadlessProduct } = await import('@wildshard/engine/host/headlessProduct');
const { createTrustedHeadlessResident } = await import('@wildshard/engine/host/headlessRuntime');
const { runTrustedHeadlessTape } = await import('@wildshard/engine/host/headlessTape');
const { outputDescriptor, serverReadsFile } = await import('@wildshard/engine/game/shardfile/outputDescriptor');
const { loadRapier } = await import('@wildshard/engine/physics/rapier');
const engineRequire = createRequire(import.meta.resolve('@wildshard/engine/package.json'));

// The [E] prompts (SKY_ACT in generators/questPrompts.ts) and the fan's GUST (FAN_ACT in generators/rows/nativeMelee.ts).
const ACT = { talk: 0, winch: 2 }, GUST = { actorId: 'far.fan', value: 2 };
const keeper = JSON.parse(readFileSync('test/ci/content-tapes.json', 'utf8'))['far-reach'];
const press = (id, value) => ({ id, ticks: 1, commands: [{ kind: 'script', actorId: 'far.interact', value }] });
const wait = (id, ticks = 30) => ({ id, ticks, commands: [] });
const walk = (id, points, ticks = 3000) => ({ id, ticks, commands: [], route: points.map(([x, z]) => ({ x, z })) });
// HOVER is a press: one tick steps on or off the board; the board settles under or off the feet in the next half second.
const board = id => [{ id, ticks: 1, commands: [{ kind: 'player', moveX: 0, moveZ: 0, yaw: 0, hover: true }] }, wait(`${id}-settle`)];
// Face the vane from where the walk stops and GUST once (the vane hub is 3.3 m up; the cone takes it at zero pitch).
const gust = (id, from, vane) => {
  const yaw = Math.atan2(from[0] - vane[0], from[1] - vane[1]);
  return [{ id: `face-${id}`, ticks: 5, commands: [{ kind: 'player', moveX: 0, moveZ: 0, yaw }] },
    { id: `gust-${id}`, ticks: 1, commands: [{ kind: 'player', moveX: 0, moveZ: 0, yaw }, { kind: 'script', ...GUST }] }, wait(`${id}-turns`, 20)];
};
const back = points => [...points].reverse();
// Authored walk-routes.json lanes, plus the updraft and the fallen bridge (generators/layout.ts UPDRAFT, FALLEN_BRIDGE, WINCH).
const SUNREST_ROOST = [[-6, -1], [0, -1], [8, -2], [15.3, -3.1], [24.3, -4.9], [31.9, -6.4], [39.5, -7.9], [48.5, -9.7], [56, -14]];
const ROOST_RUIN = [[56, -14], [59, -18], [60.9, -22.2], [61.7, -32.9], [62.5, -42], [63.3, -51.1], [64.1, -61.8], [66, -68], [64, -71]];
const SUNREST_GROVE = [[-6, -1], [-14.1, 1.3], [-22.5, 2.1], [-29.4, 2.7], [-36.4, 3.4], [-44.8, 4.1], [-52, 2]];
const GROVE_KEEPER = [[-52, 2], [-54.7, -5.9], [-55.4, -17.5], [-56, -27.5], [-56.6, -37.5], [-57.3, -49.1], [-57, -58]];
const SUNREST_WINDMILL = [[0, -10], [0, -14], [0, -30], [0, -48], [-3, -56], [-9, -72.7]];
const UPDRAFT = [[-9, -72.7], [-11.5, -75.2], [-54.5, -116.8], [-57, -120]];
const STEP_WINCH = [[-57, -120], [-59, -130], [-60.8, -135.3]];
const CROWN = [[-60.8, -135.3], [-57.5, -134.5], [-55.8, -134.2], [-34, -156], [-12.95, -177.05], [-8, -182]];

// Each part ends where a fight starts; what each input earns is checked after its part.
const PARTS = [
  [...keeper.plan.segments, walk('walk-to-board', [[-2.4, -13.6], [-6, -1]]), ...board('board-to-roost'),
    walk('ride-to-roost', SUNREST_ROOST), ...board('step-off-roost')],
  [walk('walk-to-ruin', ROOST_RUIN), ...gust('ruin', [64.3, -70.5], [62, -76]),
    walk('walk-back-to-roost', back(ROOST_RUIN)), ...board('board-to-grove'),
    walk('ride-to-grove', [...back(SUNREST_ROOST), ...SUNREST_GROVE.slice(1)]), ...board('step-off-grove'), ...gust('grove', [-53.3, 1.5], [-50, 0]),
    ...board('board-to-sunrest'), walk('ride-to-sunrest', [...back(SUNREST_GROVE), [0, -10]]), ...board('step-off-sunrest'),
    walk('walk-to-windmill', SUNREST_WINDMILL)],
  [...board('board-updraft'), walk('ride-updraft', UPDRAFT), ...board('step-off-step'),
    walk('walk-to-winch', STEP_WINCH), press('winch-two-vanes', ACT.winch), wait('winch-stays-down', 180),
    walk('walk-from-winch', back(STEP_WINCH)), ...board('board-down'), walk('ride-down-updraft', back(UPDRAFT)), ...board('step-off-windmill'),
    walk('walk-to-sunrest', back(SUNREST_WINDMILL)), ...board('board-to-keeper-isle'),
    walk('ride-to-keeper-isle', [[0, -10], ...SUNREST_GROVE, ...GROVE_KEEPER.slice(1)]), ...board('step-off-keeper-isle'), ...gust('keeper', [-57, -59.2], [-54, -56]),
    ...board('board-back'), walk('ride-back-to-sunrest', [...back(GROVE_KEEPER), ...back(SUNREST_GROVE).slice(1), [0, -10]]), ...board('step-off-back'),
    walk('walk-to-windmill-again', SUNREST_WINDMILL), ...board('board-updraft-again'), walk('ride-updraft-again', UPDRAFT), ...board('step-off-step-again'),
    walk('walk-to-winch-again', STEP_WINCH), press('turn-winch', ACT.winch), wait('bridge-rising', 180), walk('cross-to-crown', CROWN)],
];
const ROOST = ['far.roost.0', 'far.roost.1', 'far.roost.2'], FREE_RAY = ['far.ray.0'];
// What each input earns (flags present, flags still absent, the quest's current step after it).
const EXPECT = {
  'distant-keeper': { absent: ['far.notes'], step: 'notes' },
  'talk-to-keeper': { flags: ['far.notes'], step: 'roost' },
  'unearned-winch': { absent: ['far.bridge'], step: 'roost' },
  'step-off-roost-settle': { absent: ['far.roost'], step: 'roost' },
  'gust-ruin': { flags: ['far.roost', 'far.vane.ruin'], absent: ['far.vanes'], step: 'vanes' },
  'gust-grove': { flags: ['far.vane.grove'], absent: ['far.vanes'], step: 'vanes' },
  'step-off-step-settle': { position: [-58, 44, -121] },
  'winch-stays-down': { absent: ['far.vane.keeper', 'far.vanes', 'far.bridge'], step: 'vanes' },
  'gust-keeper': { flags: ['far.vane.keeper', 'far.vanes'], absent: ['far.bridge'], step: 'raise' },
  'turn-winch': { absent: ['far.bridge'], step: 'raise' },
  'bridge-rising': { flags: ['far.bridge', 'far.complete'], step: null },
  'cross-to-crown': { position: [-8, 44, -182] },
};

test('far-reach: the keeper tape carried on to an earned winch on real inputs', { timeout: 9_500 }, async () => {
  const started = performance.now(), directory = resolve('out/far-reach'), product = await loadHeadlessProduct(directory), shard = product.shardfile;
  const descriptor = outputDescriptor(shard); assert.ok(descriptor, 'The built shard must pass admission');
  const assets = new Map(descriptor.index.files.filter(file => serverReadsFile(file, shard.terrain?.collider) && (file.name === undefined || file.kind === 'wasm' || file.kind === 'tile'))
    .map(file => [file.commons === true ? `commons:${file.hash}` : file.hash, readFileSync(join(directory, file.path))]));
  const rapier = await loadRapier(readFileSync(engineRequire.resolve('@dimforge/rapier3d-simd/rapier_wasm3d_bg.wasm')));
  const resident = await createTrustedHeadlessResident({ shard, assets, product, rapier }), { host } = resident;
  try {
    const player = [...host.players.values()][0]; assert.ok(player);
    // Stand and strike the nearest live flier as it dives, until every one named is down.
    const fight = (ids, limit) => {
      for (let tick = 0; tick < limit; tick++) {
        const live = ids.filter(id => host.entities.get(id)?.alive);
        if (live.length === 0) return tick;
        const near = live.map(id => ({ id, at: host.entities.get(id).position })).sort((a, b) =>
          Math.hypot(a.at.x - player.position.x, a.at.z - player.position.z) - Math.hypot(b.at.x - player.position.x, b.at.z - player.position.z))[0];
        resident.step([{ kind: 'player', moveX: 0, moveZ: 0, yaw: Math.atan2(player.position.x - near.at.x, player.position.z - near.at.z), attack: { targetId: near.id } }]);
      }
      assert.fail(`${ids.join(', ')} must fall within ${limit} ticks`);
    };
    const observations = [], fights = {};
    const play = segments => observations.push(...runTrustedHeadlessTape(host, input => { resident.step(input); }, () => resident.effects, { version: 1, observe: [], segments }).observations);
    play(PARTS[0]); fights.roost = fight(ROOST, 3000);
    // The free ray circles the windmill isle and dives at whoever crosses; an earlier tape that left it alive fell off the
    // windmill isle on its second crossing, so the journey downs it first.
    play(PARTS[1]); fights.ray = fight(FREE_RAY, 3000);
    play(PARTS[2]);
    for (const [id, fact] of Object.entries(EXPECT)) {
      const at = observations.find(row => row.id === id); assert.ok(at, `Missing observation ${id}`);
      for (const flag of fact.flags ?? []) assert.ok(at.flags.includes(flag), `${id} must earn ${flag}`);
      for (const flag of fact.absent ?? []) assert.ok(!at.flags.includes(flag), `${id} must not earn ${flag}`);
      if (fact.step !== undefined) assert.equal(at.quests.find(row => row.id === 'far.quest')?.currentId, fact.step, `${id} leaves the quest on ${fact.step}`);
      if (fact.position !== undefined) assert.ok(Math.hypot(...at.position.map((value, axis) => value - fact.position[axis])) < 2.5, `${id} must stand near ${fact.position}: ${at.position}`);
    }
    const quest = host.quests.find(row => row.def.id === 'far.quest'); assert.ok(quest?.isComplete, 'The raised bridge completes the quest');
    const crown = observations.at(-1); assert.equal(crown.grounded, true, 'The raised bridge carries the walker onto the storm crown');
    console.log(`winch-journey ${JSON.stringify({ ticks: host.state.tick, fights, elapsedMs: Math.round(performance.now() - started) })}`);
  } finally { resident.dispose(); }
});
