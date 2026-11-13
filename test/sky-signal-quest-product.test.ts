import { expect, test } from 'vitest';
import { parsePersistedQuestPage } from '@wildshard/sharddev/quests';
import { skyQuestPage } from '../src/generators/questRows';

test('Sky authored quest persistence admits its current page and rejects unsupported saves', () => {
  const page = skyQuestPage();
  expect(parsePersistedQuestPage(page)).toEqual(page);
  expect(() => parsePersistedQuestPage({ ...page, persistence: { reward: { kind: 'other', key: 'paid', legacy: 'paid' } } })).toThrow();
  expect(() => parsePersistedQuestPage({ ...page, unexpectedCursor: 1 })).toThrow();
});
