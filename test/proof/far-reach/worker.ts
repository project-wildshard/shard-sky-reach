// CI21 C8: engine test/proof/far-reach/worker.ts (engine blob 2fcb7497) moved to its shard.
// The same plan through the public headless-native export, as Driftwood's worker does.
import type { HeadlessRuntimePreparation, HeadlessRuntimePlan } from '@wildshard/sdk/headless/host/headlessRuntime';
import { installPortableMath } from '@wildshard/sdk/internal/engine/core/portableMath';

/** The same real Sky entry in the SDK worker, with the recorder's portable math installed before its imports. */
export async function prepareHeadlessRuntime(preparation: HeadlessRuntimePreparation): Promise<HeadlessRuntimePlan> {
  installPortableMath();
  const { prepareFolderPlan } = await import('@wildshard/sdk/internal/engine/test/headless-native');
  return prepareFolderPlan(preparation);
}
