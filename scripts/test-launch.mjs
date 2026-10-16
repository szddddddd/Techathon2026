import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {spawn} from 'node:child_process';
import path from 'node:path';
const pkg=JSON.parse(await fs.readFile('package.json','utf8')),lock=JSON.parse(await fs.readFile('package-lock.json','utf8'));
assert.equal(pkg.version,lock.version);assert.equal(pkg.version,lock.packages[''].version);
for(const name of ['index.html','pet.html']){
 const html=await fs.readFile(name,'utf8');assert.ok(html.includes(`name="forest-version" content="${pkg.version}"`));
 for(const match of html.matchAll(/(?:src|href)="([^"?]+\.(?:js|css))\?v=([^"]+)"/g)){assert.equal(match[2],pkg.version);await fs.access(match[1]);}
}
const launcher=await fs.readFile('启动林间来信.cmd','utf8');assert.ok(launcher.includes('scripts\\launch.ps1'));
// Run the exact launch workflow without opening another browser during CI.
const output=await new Promise((resolve,reject)=>{const child=spawn('powershell.exe',['-NoProfile','-File',path.resolve('scripts/launch.ps1'),'-NoBrowser'],{windowsHide:true});let text='';for(const stream of [child.stdout,child.stderr])stream.on('data',data=>text+=data);child.once('error',reject);child.once('exit',code=>code===0?resolve(text):reject(new Error(text)));});
assert.ok(output.includes('http://localhost:8080/'));
const response=await fetch('http://localhost:8080/'),html=await response.text();assert.ok(html.includes(`content="${pkg.version}"`));
assert.equal((await fetch('http://localhost:8080/dist/world.js')).status,200);
assert.equal((await fetch('http://localhost:8080/assets/discovery/video-1.webm')).status,200);
const service=spawn(process.execPath,['scripts/serve.mjs'],{env:{...process.env,FOREST_WEB_PORT:'48082'},windowsHide:true});
try{
 await new Promise((resolve,reject)=>{service.stdout.once('data',resolve);service.once('error',reject);service.once('exit',code=>reject(new Error('Test server exited: '+code)));});
 assert.ok((await (await fetch('http://127.0.0.1:48082/')).text()).includes(`content="${pkg.version}"`));
 const range=await fetch('http://127.0.0.1:48082/assets/discovery/video-1.webm',{headers:{Range:'bytes=0-99'}});assert.equal(range.status,206);assert.equal((await range.arrayBuffer()).byteLength,100);
 assert.equal((await fetch('http://127.0.0.1:48082/package.json')).status,404);
}finally{service.kill();}
for(const file of ['ambient.js','app.js','scene-image.js','style.css','PLAN.md','validation-3d.json'])await assert.rejects(fs.access(file));
const report={createdAt:new Date().toISOString(),version:pkg.version,checks:['double-click launcher exists','launch workflow completes against current running server','package, lock, page and resource versions match','current scene and video assets load','new Node server serves latest scene and video ranges','server hides project configuration','obsolete root code removed'],output};
await fs.writeFile('validation/launch.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
