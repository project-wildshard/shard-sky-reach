import { originalSkyMovers } from './fixtures/sky-movers';
import { originalSkyNavigation } from './fixtures/sky-navigation';
import { expect, test } from 'vitest';
import { skyShardfileRows } from '../src/generators/shardfile';

test('declaration publication is retired and callers retain isolated complete original values', () => {
  const original = skyShardfileRows(originalSkyNavigation(), originalSkyMovers());
  const rows = skyShardfileRows(originalSkyNavigation(), originalSkyMovers()); rows.entryways.length = 0; rows.files.length = 0;
  const replay = skyShardfileRows(originalSkyNavigation(), originalSkyMovers());
  expect(original.entryways.length).toBeGreaterThan(0); expect(original.files.length).toBeGreaterThan(0);
  expect(replay.entryways).toEqual(original.entryways); expect(replay.files).toEqual(original.files);
});
