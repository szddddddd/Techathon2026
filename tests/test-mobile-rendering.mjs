import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import {PNG} from 'pngjs';
import {chromium} from 'playwright';
import {serveStatic} from '../server/static-files.mjs';
const root=path.resolve('.cache/android-web'),out=path.resolve('.test-results/mobile-performance/rendering'),baseline=process.argv[2];
await fs.mkdir(out,{recursive:true});
const server=http.createServer(async(req,res)=>{try{if(req.url.startsWith('/mobile/')){const p=req.url.split('?')[0];if(!['/mobile/android.css','/mobile/android-runtime.js'].includes(p)){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',p.endsWith('.css')?'text/css':'text/javascript');res.end(await fs.readFile(path.join(root,p)));return;}await serveStatic(req,res,root);}catch{res.writeHead(500);res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=d3d11']});
const checks=[],errors=[],rows=[],counts=[];
const ready=(page,id)=>page.waitForFunction(id=>window.__sceneTheme?.ready&&!__sceneTheme.switching&&__sceneTheme.id===id,id,{timeout:240000});
async function context(){const c=await browser.newContext({viewport:{width:393,height:852},deviceScaleFactor:2,isMobile:true,hasTouch:true,reducedMotion:'reduce'});await c.addInitScript(()=>{let seed=123456;Math.random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);localStorage.setItem('forest-letters-day-night-v1',JSON.stringify({version:1,mode:'day',seconds:150}));});return c;}
try{
 for(const scene of ['forest','fuji','ideal']){
  const shots=[];
  for(const kind of baseline?['before','after']:['after']){
   const c=await context(),p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));
   if(kind==='before')await p.route('**/dist/world.js*',r=>r.fulfill({path:path.resolve(baseline),contentType:'text/javascript'}));
   await p.goto(origin+'/?scene='+scene+'&stress=1');await ready(p,scene);await p.waitForFunction(()=>__groupBuildings.assets.loading.length===0);await p.waitForTimeout(400);
   const file=path.join(out,scene+'-'+kind+'.png');await p.locator('#viewport canvas').screenshot({path:file});
   shots.push({kind,pixels:PNG.sync.read(await fs.readFile(file)),stats:await p.evaluate(()=>({resources:__sceneTheme.resourceSnapshot(),instances:__renderPerformance.instances,warmup:__renderPerformance.warmup}))});await c.close();
  }
  const after=shots.at(-1);assert.equal(Object.keys(after.stats.resources.characters.positions).length,8);
  if(baseline){const a=shots[0].pixels,b=after.pixels;assert.equal(a.width,b.width);assert.equal(a.height,b.height);let changed=0,sum=0;for(let i=0;i<a.data.length;i+=4){let delta=0;for(let k=0;k<3;k++){const d=Math.abs(a.data[i+k]-b.data[i+k]);delta=Math.max(delta,d);sum+=d;}if(delta>24)changed++;}const fraction=changed/(a.width*a.height),mean=sum/(a.width*a.height*3);rows.push({scene,fraction,mean,before:shots[0].stats,after:after.stats});assert.ok(fraction<.01,scene+' visual mismatch '+fraction);console.log('PASS: '+scene+' unchanged resolution/eight characters, pixel difference >24: '+(fraction*100).toFixed(3)+'%');}
 }
 const c=await context(),p=await c.newPage(),mailboxRequests=new Map();p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>{const url=new URL(r.url());if(/^\/assets\/mailboxes\/[^/]+\/scene.glb$/.test(url.pathname))mailboxRequests.set(url.pathname,(mailboxRequests.get(url.pathname)||0)+1);});
 await p.goto(origin+'/?scene=forest&inbox=1');await ready(p,'forest');
 await p.waitForFunction(()=>window.__socialUI?.inbox);
 await p.evaluate(async()=>{await __socialStore.setDemoPaused(true);for(const id of ['tuantuan','ali','xiaomian','shanshan']){await __socialStore.addFriend(id);await __socialStore.receiveMessage(id,{text:'切换测试'});}await __socialUI.inbox.gateway.loadDemo();});
 await p.locator('[data-inbox-thread="external:demo:qqmail:thread-1"]').click();await p.waitForFunction(()=>__uiInteractions.state('inbox-thread')==='open');
 await p.locator('#inbox-thread [name=reply]').fill('连续切换后保留这份草稿');
 const limits=new Map();
 for(let cycle=0;cycle<5;cycle++)for(const scene of ['fuji','ideal','forest']){
  assert.equal(await p.evaluate(id=>__sceneTheme.switch(id),scene),true);await ready(p,scene);await p.waitForFunction(()=>__groupBuildings.assets.loading.length===0);await p.waitForTimeout(200);
  const r=await p.evaluate(()=>__sceneTheme.resourceSnapshot());assert.equal(r.worldRoots,1);assert.equal(r.characters.suspended,false);assert.equal(Object.keys(r.characters.positions).length,4);assert.equal(await p.locator('#inbox-thread [name=reply]').inputValue(),'连续切换后保留这份草稿');
  const previous=limits.get(scene);if(previous){assert.ok(r.textures<=previous.textures+2,scene+' retained textures grew');assert.ok(r.geometries<=previous.geometries+5,scene+' retained geometries grew');}else limits.set(scene,r);counts.push({cycle,scene,textures:r.textures,geometries:r.geometries});
 }
 checks.push('five full scene cycles keep one world, four friends, draft and bounded GPU allocations');
 assert.equal(mailboxRequests.size,3);for(const count of mailboxRequests.values())assert.equal(count,1,'Each mailbox is fetched and parsed once across scene revisits');checks.push('each mailbox loads once across five complete scene cycles');
 await p.screenshot({path:path.join(out,'inbox-after-five-cycles.jpg')});await c.close();
 const failure=await context(),f=await failure.newPage();f.on('pageerror',e=>errors.push(e.message));
 await f.goto(origin+'/?scene=ideal');await ready(f,'ideal');await f.route('**/rodin/record-player/scene.glb',r=>r.abort());
 assert.equal(await f.evaluate(async()=>{try{await __sceneTheme.switch('forest');return false;}catch{return true;}}),true);await ready(f,'ideal');assert.equal(await f.evaluate(()=>__sceneTheme.resourceSnapshot().worldRoots),1);
 await f.unroute('**/rodin/record-player/scene.glb');assert.equal(await f.evaluate(()=>__sceneTheme.switch('forest')),true);await ready(f,'forest');checks.push('failed preparation retains old world and a subsequent retry succeeds');await failure.close();
 assert.deepEqual(errors,[]);await fs.writeFile(path.join(out,'report.json'),JSON.stringify({rows,counts,checks,errors},null,2));console.log('PASS: '+checks.join('; '));
}finally{await browser.close();await new Promise(r=>server.close(r));}
