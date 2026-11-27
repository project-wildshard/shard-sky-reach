import type { ProjectGenerationContext } from '@wildshard/sdk/projectGeneration';
import { hashImmutableBytes } from '@wildshard/sdk/immutable';
import { STORM_NOISE } from './rows/stormNoise';
import { bakeStormNoise } from './stormNoise';

function checked(bytes: Uint8Array): Uint8Array {
  if (bytes.byteLength !== STORM_NOISE.compressed || hashImmutableBytes(bytes) !== STORM_NOISE.hash) throw new Error('Sky storm texture identity differs');
  return bytes;
}
/** Cache the original density and light raster as a PNG for the cook. */
export async function skyStormNoiseInput(ctx: Pick<ProjectGenerationContext, 'cached' | 'writeImagePixels'>): Promise<Uint8Array> {
  const writeImagePixels = ctx.writeImagePixels;
  if (writeImagePixels === undefined) throw new Error('Missing Sky storm PNG encoder');
  const files = await ctx.cached({ id: 'storm-texture-input', native: true, inputs: [] }, async inputs => {
    if (inputs.size > 0) throw new Error('Sky storm texture input inventory differs');
    return new Map([['storm.png', checked(await bakeStormNoise(writeImagePixels))]]);
  });
  const bytes = files.get('storm.png');
  if (files.size !== 1 || bytes === undefined) throw new Error('Sky storm texture cache inventory differs');
  return Uint8Array.from(checked(bytes));
}
