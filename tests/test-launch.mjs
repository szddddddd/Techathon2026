import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {spawn} from 'node:child_process';
import path from 'node:path';
import {baseURL,outputPath} from './test-runtime.mjs';
const pkg=JSON.parse(await fs.readFile('package.json','utf8')),lock=JSON.parse(await fs.readFile('package-lock.json','utf8'));
assert.equal(pkg.version,lock.version);assert.equal(pkg.version,lock.packages[''].version);
for(const name of ['index.html','pet.html']){
 const html=await fs.readFile('src/pages/'+name,'utf8');assert.ok(html.includes(`name="forest-version" content="${pkg.version}"`));
 for(const match of html.matchAll(/(?:src|href)="([^"?]+\.(?:js|css))\?v=([^"]+)"/g)){assert.equal(match[2],pkg.version);await fs.access(match[1]);}
}
const launcher=await fs.readFile('scripts/windows/启动 WeRoam.cmd','utf8');assert.ok(launcher.includes('..\\launch.ps1'));
// Reuse the explicitly supplied test server; never register OS protocols in tests.
const output=await new Promise((resolve,reject)=>{
 const child=spawn('powershell.exe',['-NoProfile','-File',path.resolve('scripts/launch.ps1'),'-NoBrowser','-SkipProtocolInstall'],{env:{...process.env,FOREST_WEB_PORT:new URL(baseURL).port,PATH:path.dirname(process.execPath)+path.delimiter+process.env.PATH},windowsHide:true});
 let text='';for(const stream of [child.stdout,child.stderr])stream.on('data',data=>text+=data);child.once('error',reject);child.once('exit',code=>code===0?resolve(text):reject(new Error(text)));
});
assert.ok(output.includes(baseURL));
const response=await fetch(baseURL),html=await response.text();assert.ok(html.includes(`content="${pkg.version}"`));
assert.equal((await fetch(baseURL+'/dist/world.js')).status,200);
const range=await fetch(baseURL+'/assets/discovery/video-1.webm',{headers:{Range:'bytes=0-99'}});assert.equal(range.status,206);assert.equal((await range.arrayBuffer()).byteLength,100);
assert.equal((await fetch(baseURL+'/package.json')).status,404);
const report={createdAt:new Date().toISOString(),version:pkg.version,checks:['launcher reuses configured server without registry writes','package, lock, page and resource versions match','video ranges work','server hides project configuration'],output};
await fs.writeFile(outputPath('launch.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
