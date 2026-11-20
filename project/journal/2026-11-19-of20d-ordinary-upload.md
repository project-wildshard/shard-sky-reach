# Sky Reach is an ordinary upload (meta ONE-FORMAT OF20d)

> Written by: Claude (opus-of20-sky)

- The page draws every declared body from the `sky` scene library's rig of its kind: each declared look is
  `platform.rig` with `{ library: 'sky' }` (format 0.50.0, engine `65c4becd9`, in 0.1.53). The `species.program` feature
  and the `actors/species-programs` section are gone, as Dunes dropped them in OF19d.
- A local walk on the v0.1.53 devserver client found the declared Roc leaving its perch at load: its decision row was
  bound `shard: true`, so the declared decision host ran it from the first tick and it stalked the nearest player across
  the sky to the spawn. The held fight's control only ran it in the fight. The row now binds `encounter: far.roc.fight`,
  and the fight starts `placed`: walking onto the crown starts it, as the held fight did (the engine `roc` journey's
  first step). Before that the Roc holds over its perch.
- `test/declared-population.test.ts` checks both: no species program and only `platform.rig` looks, and the Roc holding
  at its perch for 30 s, then taking off once a player stands on the crown. The perch test failed first (the Roc ended
  196 m away at the spawn). The darwin walk checkpoint is re-recorded: the Roc no longer flies to the spawn.
