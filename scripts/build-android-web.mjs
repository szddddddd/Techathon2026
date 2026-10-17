import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export const webDir=path.join(root,'.cache/android-web');
const runtime=/\.(?:glb|bin|json|png|jpe?g|webp|svg|mp3|mp4|webm)$/i;
const files=[];
async function collect(dir){for(const entry of await fs.readdir(path.join(root,dir),{withFileTypes:true})){const rel=path.posix.join(dir,entry.name);if(entry.isDirectory())await collect(rel);else if(runtime.test(rel))files.push(rel);}}
await collect('assets');
files.push(...(await fs.readdir(root)).filter(name=>name.endsWith('.css')),'startup.js','mobile/android-runtime.js','mobile/android.css');
files.push('dist/world.js','dist/inbox.js','dist/rig-worker.js');
await fs.mkdir(webDir,{recursive:true});
const inventory=[];
for(const rel of files){const dest=path.join(webDir,rel),data=await fs.readFile(path.join(root,rel));await fs.mkdir(path.dirname(dest),{recursive:true});await fs.writeFile(dest,data);inventory.push({path:rel,bytes:data.length,sha256:createHash('sha256').update(data).digest('hex')});}
let html=await fs.readFile(path.join(root,'index.html'),'utf8');
html=html.replace('width=device-width,initial-scale=1','width=device-width,initial-scale=1,viewport-fit=cover');
html=html.replace('</head>','<link rel="stylesheet" href="mobile/android.css"><script src="mobile/android-runtime.js"></script></head>');
await fs.writeFile(path.join(webDir,'index.html'),html);
// Fail closed if a stale previous build contains anything outside the allowlist.
const allowed=new Set([...files,'index.html']);
async function prune(dir=''){for(const item of await fs.readdir(path.join(webDir,dir),{withFileTypes:true})){const rel=path.posix.join(dir,item.name);if(item.isDirectory())await prune(rel);else if(!allowed.has(rel))await fs.unlink(path.join(webDir,rel));}}
await prune();
const total=inventory.reduce((sum,f)=>sum+f.bytes,Buffer.byteLength(html));
await fs.writeFile(path.join(root,'.cache/android-assets.json'),JSON.stringify({version:1,files:inventory,bytes:total},null,2));
console.log(`Android web assets: ${files.length+1} files, ${(total/1024/1024).toFixed(1)} MiB; original model/texture bytes preserved.`);
