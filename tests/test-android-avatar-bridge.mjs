import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs/promises';
const calls=[],context={document:{documentElement:{dataset:{}}},setTimeout,clearTimeout,AndroidAvatar:{request(...args){calls.push(args);}}};vm.createContext(context);vm.runInContext(await fs.readFile('mobile/android-runtime.js','utf8'),context);
const first=context.androidAvatarRequest('jobs/demo');assert.equal(calls[0][1],'jobs/demo');assert.equal(calls[0][2],'');context.__androidAvatarResult(calls[0][0],{status:404,data:{}});assert.equal((await first).status,404);
const second=context.androidAvatarRequest('jobs',{requestId:'demo'});assert.equal(JSON.parse(calls[1][2]).requestId,'demo');context.__androidAvatarResult(calls[1][0],{status:202,data:{phase:'queued'}});assert.equal((await second).data.phase,'queued');context.__androidAvatarResult('unknown',{});
console.log('PASS Android asynchronous request correlation and JSON body transport');
