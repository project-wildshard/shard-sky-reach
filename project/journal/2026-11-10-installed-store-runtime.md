# Declare the pinned installed author runtime

The fresh global-store install and public typecheck already pass.
Do not claim a type failure in this repo.
The actual build does fail before it can build the shard.
The engine lint boundary imports Vite from its own package context.
That context has no declared Vite edge under the store.

The same real resolver also cannot find TypeScript6 there.
Its Sharp lookup reaches an ambient home package instead.
All three observations use the exact pinned engine80d source.
The engine package version is0.1.2.
Its own author-tool context needs these runtime edges.

Add one version-scoped package extension for that engine version.
It declares Vite8.3.0, TypeScript6 6.0.2 and Sharp0.35.5.
Keep the engine, SDK and format source specifiers unchanged.
Keep all222 package resolution and integrity records unchanged.
Only dependency contexts and the extension checksum change.
No optional type-peer extension is needed by this repo's observed checks.
The root default remains false for the ordered G9 rollout.

Both existing hosted workflows now install the actual store explicitly.
The pinned branch retains its frozen install.
The existing candidate branch alone stays nonfrozen.
The runner CI environment remains true.
The cache key includes the workspace extension configuration.
A post-install check verifies all declared roots and the engine decoder.

Normal frozen installation, typecheck and full product build now pass.
The actual product rebuild completes in33.97seconds.
The original1800-input/60-settle play proof passes every assertion.
The literal dev command still refuses its declared generation root.
It launches no browser and earns no browser-boot claim.
That separate pinned-SDK wire gap keeps G6 open.
No game, layout, graphical source or existing test limit changes here.
