import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import {execFileSync} from 'node:child_process';

import {chromium,baseURL} from './test-runtime.mjs';
const root=process.cwd(),baseline=new Map(),revision=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const oldIndex=execFileSync('git',['show','HEAD:index.html']);baseline.set('index.html',oldIndex);
for(const name of ['dist/world.js',...[...oldIndex.toString().matchAll(/href="([^"?]+\.css)/g)].map(m=>m[1])])baseline.set(name,execFileSync('git',['show',`HEAD:${name}`],{maxBuffer:16*1024*1024}));
let mode='before';const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.glb':'model/gltf-binary','.jpg':'image/jpeg','.webp':'image/webp','.png':'image/png'};
const server=http.createServer(async(req,res)=>{try{const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname).slice(1)||'index.html',file=path.resolve(root,name);if(!file.startsWith(root+path.sep))throw new Error();const data=mode==='before'&&baseline.has(name)?baseline.get(name):await fs.readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(name)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data);}catch{res.writeHead(404);res.end();}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const url=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=d3d11']}),results={baselineRevision:revision,viewport:[1440,1000],workload:'Six status open/close cycles; same paused four-friend scene, Edge D3D11; no video recording.',runs:{}};
try{for(mode of ['before','after']){const context=await browser.newContext({viewport:{width:1440,height:1000}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(url);await page.waitForFunction(()=>window.__socialUI,null,{timeout:180000});await page.evaluate(async()=>{await __socialStore.setDemoPaused(true);for(const id of ['tuantuan','ali','xiaomian','shanshan'])await __socialStore.addFriend(id);});await page.waitForTimeout(1500);
 await page.evaluate(()=>{window.__measureFrames=[];window.__measureActive=true;let last=performance.now();function frame(now){if(!__measureActive)return;__measureFrames.push(now-last);last=now;requestAnimationFrame(frame);}requestAnimationFrame(frame);});
 for(let i=0;i<6;i++){await page.locator('.friend-anchor:not([hidden]) .status-badge').first().click();await page.waitForTimeout(380);await page.mouse.click(4,4);await page.waitForTimeout(280);}
 const frames=await page.evaluate(()=>{__measureActive=false;return __measureFrames.slice(3);});frames.sort((a,b)=>a-b);assert.deepEqual(errors,[]);const running=await page.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length);results.runs[mode]={samples:frames.length,median:frames[Math.floor(frames.length*.5)],p95:frames[Math.floor(frames.length*.95)],max:frames.at(-1),runningAnimationsAfter:running,errors};await context.close();}
 await fs.writeFile('validation/interaction/motion-performance.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
