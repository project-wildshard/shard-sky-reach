import type { ProjectGenerationContext } from '@wildshard/sdk/projectGeneration';

/** Preserve the row order used by the old sky map. The cook reads PNGs unflipped. */
export async function skyMapPng(image: Uint8Array, context: Pick<ProjectGenerationContext, 'readImagePixels' | 'writeImagePixels'>): Promise<Uint8Array> {
  if (context.writeImagePixels === undefined) throw new Error('Missing sky map PNG encoder');
  return context.writeImagePixels(await context.readImagePixels(image, { flipY: true }));
}
