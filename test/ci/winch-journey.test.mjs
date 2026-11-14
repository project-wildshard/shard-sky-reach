// J186 Ring 2, CI only, never a hook. The keeper tape (content-tapes.json)
// carried on to the winch on the built output: the roost rays, the three
// vanes, the board over the hover bridges and the updraft, the winch drum
// turned before and after it is earned, and the raised bridge walked to the
// storm crown. There the Storm Roc is fought through its three phases (the
// stoop, the gale walls, the grounded sweep) to its fall, and the Ledger's
// two facts and the purses are read off the ticks' effects (SH-sky-1, SH-sky-2).
// Only the inputs the page sends drive it (walking, the board, [E] prompts,
// fan strikes, GUST and its pitch). No flag, pose or quest state is written;
// a fight reads where a flier is to aim, as a player's eyes do.
import '@wildshard/engine/scripts/sim-node-loader.mjs';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';
import { test } from 'node:test';

const { loadHeadlessProduct } = await import('@wildshard/engine/host/headlessProduct');
const { openWorld } = await import('@wildshard/engine/host/openWorld');
const { runTrustedHeadlessTape } = await import('@wildshard/engine/host/headlessTape');
const { outputDescriptor, serverReadsFile } = await import('@wildshard/engine/game/shardfile/outputDescriptor');
const { loadRapier } = await import('@wildshard/engine/physics/rapier');
const engineRequire = createRequire(import.meta.resolve('@wildshard/engine/package.json'));

// The [E] prompts (SKY_ACT in generators/questPrompts.ts) and the fan's GUST (FAN_ACT in generators/rows/nativeMelee.ts).
const ACT = { talk: 0, winch: 2 }, GUST = { actorId: 'far.fan', value: 2 }, AIM = 'far.fan.aim', PITCH_LIMIT = 1.45, GUST_REACH = 9;
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
const ROOST = ['far.roost.0', 'far.roost.1', 'far.roost.2'], FREE_RAY = ['far.ray.0'], ROC = 'far.roc';
// The crown and its dais (generators/layout.ts CROWN, DAIS; the Roc wheels 13 m round the dais, rocDecision.ts).
const CROWN_AT = { x: 0, z: -190, y: 44, r: 20 }, DAIS_AT = { x: 0, z: -196 }, UNDER_ORBIT = 12, SAFE = 15;
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

test('far-reach: the keeper tape carried on to an earned winch and the Storm Roc\'s fall on real inputs', { timeout: 9_500 }, async () => {
  const started = performance.now(), directory = resolve('out/far-reach'), product = await loadHeadlessProduct(directory), shard = product.shardfile;
  const descriptor = outputDescriptor(shard); assert.ok(descriptor, 'The built shard must pass admission');
  const assets = new Map(descriptor.index.files.filter(file => serverReadsFile(file, shard.terrain?.collider) && (file.name === undefined || file.kind === 'wasm' || file.kind === 'tile'))
    .map(file => [file.commons === true ? `commons:${file.hash}` : file.hash, readFileSync(join(directory, file.path))]));
  const rapier = await loadRapier(readFileSync(engineRequire.resolve('@dimforge/rapier3d-simd/rapier_wasm3d_bg.wasm')));
  const resident = (await openWorld({ shard, assets, product, rapier }, { room: true })).resident, { host } = resident;
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
    // The Storm Roc. Its stoop (phase 1) and grounded sweep (phase 3) come within the fan's reach: face it and strike. Its
    // gale walls (phase 2) come from 7 m up and shove toward the rim: keep under its orbit, never past SAFE from the
    // crown's middle, and GUST it, pitched up at it, whenever it wheels within the cone's reach.
    const effects = observations.flatMap(row => row.effects);
    let fell = -1;
    for (let tick = 0; tick < 18_000 && fell < 0; tick++) {
      const roc = host.entities.get(ROC), at = player.position, command = { kind: 'player', moveX: 0, moveZ: 0, yaw: player.yaw ?? 0 }, fan = [];
      if (roc?.alive) {
        const dx = roc.position.x - at.x, dz = roc.position.z - at.z, rise = roc.position.y - (at.y + 1.68), flat = Math.hypot(dx, dz);
        command.yaw = Math.atan2(-dx, -dz); command.attack = { targetId: ROC };
        const ox = roc.position.x - DAIS_AT.x, oz = roc.position.z - DAIS_AT.z, out = Math.hypot(ox, oz), keep = out > UNDER_ORBIT ? UNDER_ORBIT / out : 1;
        let gx = DAIS_AT.x + ox * keep, gz = DAIS_AT.z + oz * keep;
        const cx = gx - CROWN_AT.x, cz = gz - CROWN_AT.z, rim = Math.hypot(cx, cz);
        if (rim > SAFE) { gx = CROWN_AT.x + cx * SAFE / rim; gz = CROWN_AT.z + cz * SAFE / rim; }
        const tx = gx - at.x, tz = gz - at.z, go = Math.hypot(tx, tz);
        if (go > 1.5) { command.moveX = tx / go; command.moveZ = tz / go; }
        if (rise > 1.5 && Math.hypot(flat, rise) < GUST_REACH) fan.push({ kind: 'script', actorId: AIM, value: Math.min(PITCH_LIMIT, Math.atan2(rise, flat)) }, { kind: 'script', ...GUST });
      }
      resident.step([command, ...fan]); effects.push(...resident.effects);
      if (host.flags.has('far.roc.down')) fell = tick;
    }
    assert.ok(fell >= 0, 'The Storm Roc must fall within 18000 ticks');
    const body = host.entities.get(ROC).position;
    assert.ok(body.y > CROWN_AT.y - 2 && Math.hypot(body.x - CROWN_AT.x, body.z - CROWN_AT.z) < CROWN_AT.r, `The Roc falls on the crown, struck down: ${JSON.stringify(body)}`);
    assert.ok(player.position.y > CROWN_AT.y - 2, 'The walker is still on the crown when the Roc falls');
    for (let tick = 0; tick < 120; tick++) { resident.step([{ kind: 'player', moveX: 0, moveZ: 0, yaw: player.yaw ?? 0 }]); effects.push(...resident.effects); }
    // The Ledger: each completion files its fact once (rows/ledger.ts), and the Roc's purse pays once (rows/rocFight.ts).
    const facts = effects.filter(row => row.kind === 'fact').map(row => row.name).sort();
    assert.deepEqual(facts, ['far-reach.quest', 'far-reach.roc'], 'The quest and the Roc each file one Ledger fact');
    // A room (HS1's world) pays the Roc's purse to the player who earned it, not to the body (J105): the walker gets the
    // quest's 10 coins, then the Roc's 25, each once.
    assert.deepEqual(effects.filter(row => row.kind === 'coins').map(row => [row.actorId, row.amount]), [[player.id, 10], [player.id, 25]], 'The quest pays 10 coins and the Roc 25, each once, to the walker');
    console.log(`winch-journey ${JSON.stringify({ ticks: host.state.tick, fights: { ...fights, roc: fell + 1 }, effects, elapsedMs: Math.round(performance.now() - started) })}`);
  } finally { resident.dispose(); }
});
