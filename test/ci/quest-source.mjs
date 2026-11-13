// Independent original author leaves, never a copied product snapshot.
import {parseShardfileField} from '@wildshard/format/shardSchema';
import {SKY_QUESTS} from '../../src/shards/far-reach/generators/quests.ts';
export function questSource(slug){return parseShardfileField('quests',SKY_QUESTS);}
