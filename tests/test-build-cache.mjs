import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {spawn} from 'node:child_process';

await fs.mkdir('.test-results',{recursive:true});const root=await fs.mkdtemp(path.resolve('.test-results/build-cache-'));
await fs.mkdir(path.join(root,'scripts'));await fs.mkdir(path.join(root,'src'));
await fs.copyFile('scripts/build.mjs',path.join(root,'scripts/build.mjs'));
await fs.writeFile(path.join(root,'package.json'),JSON.stringify({version:'1.0.0'}));
await fs.writeFile(path.join(root,'package-lock.json'),'{}');
for(const name of ['index','pet'])await fs.writeFile(path.join(root,name+'.html'),'<head><title>Fixture</title></head>');
await fs.writeFile(path.join(root,'src/value.js'),'export const value=1;');
for(const name of ['main','review/asset-review','characters/pet','review/rig-review','characters/character-rig-worker']){
 const file=path.join(root,'src',name+'.js');await fs.mkdir(path.dirname(file),{recursive:true});
 await fs.writeFile(file,`import {value} from '${name.includes('/')?'../':'./'}value.js';globalThis.fixture=value;`);
}
await fs.mkdir(path.join(root,'src/inbox'));
await fs.writeFile(path.join(root,'src/inbox/ui.js'),"import {value} from '../value.js';export const fixture=value;");
await fs.mkdir(path.join(root,'src/mods'));
await fs.writeFile(path.join(root,'src/mods/ui.js'),"import {value} from '../value.js';export const fixture=value;");
async function build(...args){return new Promise((resolve,reject)=>{const child=spawn(process.execPath,[path.join(root,'scripts/build.mjs'),...args],{windowsHide:true});let log='';child.stdout.on('data',d=>log+=d);child.stderr.on('data',d=>log+=d);child.once('error',reject);child.once('exit',code=>code?reject(new Error(log)):resolve(log));});}
assert.match(await build(),/Built WeRoam/);assert.match(await build(),/Reused unchanged/);
const source=path.join(root,'src/value.js'),old=await fs.stat(source);
await fs.writeFile(source,'export const value=2;');await fs.utimes(source,old.atime,old.mtime);
assert.match(await build(),/Built WeRoam/);assert.match(await fs.readFile(path.join(root,'dist/world.js'),'utf8'),/=2/);
await fs.writeFile(path.join(root,'dist/world.js'),'tampered');assert.match(await build(),/Built WeRoam/);
await fs.unlink(path.join(root,'dist/pet.js'));assert.match(await build(),/Built WeRoam/);
await fs.unlink(path.join(root,'dist/inbox.js'));assert.match(await build(),/Built WeRoam/);
await fs.writeFile(path.join(root,'src/inbox/ui.js'),"export const fixture=42;");assert.match(await build(),/Built WeRoam/);
await fs.writeFile(path.join(root,'package-lock.json'),'{"fixture":true}');assert.match(await build(),/Built WeRoam/);
await fs.writeFile(path.join(root,'src/extra.js'),'export const extra=3;');
await fs.writeFile(source,"import {extra} from './extra.js';export const value=extra;");assert.match(await build(),/Built WeRoam/);
await fs.writeFile(path.join(root,'src/extra.js'),'export const extra=4;');assert.match(await build(),/Built WeRoam/);
await fs.writeFile(path.join(root,'.cache/build-state.json'),'broken');assert.match(await build(),/Built WeRoam/);
const state=JSON.parse(await fs.readFile(path.join(root,'.cache/build-state.json'),'utf8'));state.files={};await fs.writeFile(path.join(root,'.cache/build-state.json'),JSON.stringify(state));assert.match(await build(),/Built WeRoam/);
assert.match(await build('--force'),/Built WeRoam/);assert.match(await build(),/Reused unchanged/);
await fs.writeFile(path.join(root,'package.json'),JSON.stringify({version:'1.0.1'}));assert.match(await build(),/Built WeRoam/);
assert.match(await fs.readFile(path.join(root,'index.html'),'utf8'),/content="1.0.1"/);
console.log('PASS: cache hits; source content, new imports, dependencies, outputs, corrupt state, forced builds and HTML versions invalidate correctly.');
