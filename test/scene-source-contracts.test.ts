import { expect, test } from 'vitest';
import * as v from 'valibot';
import { SceneModelSourceSchema } from '@wildshard/format/sceneSources';
import { skyModelSource } from '../src/generators/sceneSources';

test('Sky emitted model source admits through the released author format', () => {
  const blob = skyModelSource('world/bridge.glb', 'world/mill.glb', 'world/fan.glb');
  const source: unknown = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(blob.bytes));
  expect(() => v.parse(SceneModelSourceSchema, source)).not.toThrow();
});
