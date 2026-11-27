import type { ProjectGenerationContext } from '@wildshard/sdk/projectGeneration';
import { bakeSwardAtlasTexture } from './swardAtlas';

/** Cache the complete original numerical atlas, as a PNG for the cook. */
export async function skySwardAtlasProgram(ctx: Pick<ProjectGenerationContext, 'cached' | 'writeImagePixels'>): Promise<Uint8Array> {
  const writeImagePixels = ctx.writeImagePixels;
  if (writeImagePixels === undefined) throw new Error('Missing Sky sward PNG encoder');
  const files = await ctx.cached({ id: 'sward-atlas', native: true, inputs: [] }, async inputs => {
    if (inputs.size > 0) throw new Error('Sky sward atlas input inventory differs');
    return new Map([['sward.png', await bakeSwardAtlasTexture(writeImagePixels)]]);
  });
  const bytes = files.get('sward.png');
  if (files.size !== 1 || bytes === undefined || bytes.byteLength === 0) throw new Error('Sky sward atlas cache inventory differs');
  return bytes;
}
