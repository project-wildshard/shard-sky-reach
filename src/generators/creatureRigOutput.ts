import type { ProjectGenerationContext } from '@wildshard/sdk/projectGeneration';
import { emitNamedBlobs, nameBlob, type EmittedBlobs } from '@wildshard/sdk/blobs';
import { CREATURE_RIG_FILES, skyCreatureRigProgram } from './creatureRigProgram';

/** Admit the four source rigs. The cook makes any tier-specific texture copies. */
export async function skyCreatureRigOutput(ctx: Pick<ProjectGenerationContext, 'cached'>): Promise<EmittedBlobs> {
  const rigs = await skyCreatureRigProgram(ctx);
  return emitNamedBlobs(CREATURE_RIG_FILES.map(name => {
    const bytes = rigs.get(name);
    if (bytes === undefined) throw new Error(`Missing source-owned Sky rig ${name}`);
    return nameBlob(`world/rigs/${name}`, 'glb', bytes);
  }));
}
