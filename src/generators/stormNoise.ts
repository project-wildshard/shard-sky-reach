import { bakeSkySeaTexture } from './seaTexture';
import type { ProjectGenerationContext } from '@wildshard/sdk/projectGeneration';

/** Retain the existing density/light raster as a lossless, linear library
 * texture. Row order, alpha and channel meaning match the original DataTexture. */
export function bakeStormNoise(writeImagePixels: NonNullable<ProjectGenerationContext['writeImagePixels']>): Promise<Uint8Array> {
  const sea = bakeSkySeaTexture();
  return writeImagePixels({ width: sea.size, height: sea.size, pixels: new Uint8ClampedArray(sea.rgba) });
}
