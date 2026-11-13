// Preparation binds immutable author inputs and exact override commits.
// pnpm may serialize an equivalent installed graph differently per runner;
// it must not make a successful preparation unreachable by its candidate.
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {appendFileSync} from 'node:fs';

const engine=process.env.CANDIDATE_ENGINE??'',sdk=process.env.CANDIDATE_SHARDDEV??'';
for(const value of [engine,sdk])assert.ok(value===''||/^[a-f0-9]{40}$/u.test(value),'Preparation needs exact commit overrides');
const changed=execFileSync('git',['status','--porcelain','--untracked-files=all','--','src','public'],{encoding:'utf8'});
assert.equal(changed,'','Author source changed before preparation selection');
const tree=execFileSync('git',['ls-tree','-r','HEAD','--','package.json','pnpm-lock.yaml','scripts/select-candidate.mjs',
 'scripts/author-preparation-key.mjs','src','public'],{encoding:'utf8'});
assert.ok(tree.length>0,'Missing committed author inventory');
const digest=createHash('sha256').update(JSON.stringify({version:2,node:process.version,engine,sdk,tree})).digest('hex');
const key=`author-preparation-v2-${process.env.RUNNER_OS??process.platform}-${process.env.RUNNER_ARCH??process.arch}-${digest}`;
console.log(key);
if(process.env.GITHUB_OUTPUT)appendFileSync(process.env.GITHUB_OUTPUT,`key=${key}\n`);
