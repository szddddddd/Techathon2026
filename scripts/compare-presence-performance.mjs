import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import {execFileSync} from 'node:child_process';

import {chromium,baseURL} from './test-runtime.mjs';
const root=process.cwd(),baseline=new Map(),baselineRoot=path.resolve('validation/presence/baseline');
const oldIndex=await fs.readFile(path.join(baselineRoot,'index.html'));baseline.set('index.html',oldIndex);
for(const name of ['dist/world.js',...[...oldIndex.toString().matchAll(/href="([^"?]+\.css)/g)].map(m=>m[1])])baseline.set(name,await fs.readFile(path.join(baselineRoot,name)));
let mode='before';const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.glb':'model/gltf-binary','.jpg':'image/jpeg','.webp':'image/webp','.png':'image/png'};
const server=http.createServer(async(req,res)=>{try{const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname).slice(1)||'index.html',file=path.resolve(root,name);if(!file.startsWith(root+path.sep))throw new Error();const data=mode==='before'&&baseline.has(name)?baseline.get(name):await fs.readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(name)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data);}catch{res.writeHead(404);res.end();}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const url=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=d3d11']}),results={baseline:'Working-tree UI immediately before presence/action implementation, saved in baseline/.',viewport:[1440,1000],workload:'Four friends, paused story, Edge D3D11; six seconds steady, 100-message burst and eight status changes; serial runs without video.',runs:{}};
async function measure(page,work){
 await page.evaluate(()=>{window.__perf=[];window.__perfOn=true;let last=performance.now();function f(now){if(!__perfOn)return;__perf.push(now-last);last=now;requestAnimationFrame(f);}requestAnimationFrame(f);});
 await work();const frames=await page.evaluate(()=>{__perfOn=false;return __perf.slice(2);});frames.sort((a,b)=>a-b);return{samples:frames.length,median:frames[Math.floor(frames.length*.5)],p95:frames[Math.floor(frames.length*.95)],max:frames.at(-1)};
}
try{for(mode of ['before','after']){
 const context=await browser.newContext({viewport:{width:1440,height:1000}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(url);await page.waitForFunction(()=>window.__socialUI,null,{timeout:180000});await page.evaluate(async()=>{await __socialStore.setDemoPaused(true);for(const id of ['tuantuan','ali','xiaomian','shanshan']){await __socialStore.addFriend(id);if(__socialStore.setFriendPinned)await __socialStore.setFriendPinned(id,true);}});await page.waitForTimeout(2500);
 const steady=await measure(page,()=>page.waitForTimeout(6000));
 const changing=await measure(page,async()=>{
  await page.evaluate(async()=>{for(let i=0;i<100;i++)await __socialStore.receiveMessage('ali',{text:'待处理消息 '+i},'perf-message-'+i);});
  for(const kind of ['happy','emo','tired','busy','relax','music','exercise','travel']){await page.evaluate(async kind=>{for(const id of __socialStore.state.friends)await __socialStore.publishStatus({kind},id);},kind);await page.waitForTimeout(400);}
 });
 let hidden=null;if(mode==='after'){
  assert.equal(await page.locator('.friend-anchor[data-friend=ali] .unread-dot').first().innerText(),'99+');
  await page.evaluate(async()=>{for(const id of __socialStore.state.friends){await __socialStore.markRead(id);await __socialStore.setFriendPinned(id,false);}});await page.waitForFunction(()=>__characterPlacement.snapshot().characters.length===0);hidden=await measure(page,()=>page.waitForTimeout(2000));
 }
 assert.deepEqual(errors,[]);results.runs[mode]={steady,changing,hidden,errors};await context.close();
}await fs.writeFile('validation/presence/performance.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
