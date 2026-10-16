import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {chromium,baseURL} from './test-runtime.mjs';

const out=path.resolve(process.env.FUJI_VALIDATION_DIR||('validation/dusk-sakura/'+(process.argv.includes('--baseline')?'before':'after'))),recordings=path.join(out,'.capture-recordings');
await fs.mkdir(recordings,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=d3d11']});
const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce',...(process.argv.includes('--video')?{recordVideo:{dir:recordings,size:{width:1440,height:1000}}}:{})});
await context.addInitScript(()=>{let seed=27319;Math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};});
const errors=[],temporaryVideos=[];
function observe(page){page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error'&&/THREE|WebGL|shader/i.test(m.text()))errors.push(m.text());});}
const ready=(page,id)=>page.waitForFunction(id=>window.__sceneTheme?.ready&&__sceneTheme.id===id&&window.__groupBuildings&&window.__socialUI,id,{timeout:180000});
const populated=page=>page.waitForFunction(()=>__groupBuildings.snapshot().entries.length===9&&__characterPlacement.snapshot().characters.length===9,null,{timeout:180000});
async function settle(page){await page.mouse.move(1400,940);await page.keyboard.press('Escape');await page.waitForTimeout(350);}
async function view(page,position,target){await page.evaluate(({position,target})=>__valley.view(position,target),{position,target});await page.waitForFunction(()=>!__valley.snapshot().transitioning);await page.waitForTimeout(350);}
async function switchTo(page,id){await page.locator('#scene-switcher .scene-switcher-option').press(id==='fuji'?'End':'Home');await ready(page,id);await populated(page);await page.waitForFunction(()=>!document.querySelector('.scene-travel')&&!__sceneTheme.switching);}
async function closeTemporary(page){const video=page.video();await page.close();if(video)temporaryVideos.push(await video.path());}

try{
 const page=await context.newPage();observe(page);const forest=new URL(baseURL);forest.searchParams.set('scene','forest');await page.goto(forest.href);await ready(page,'forest');
 await page.evaluate(async()=>{
  await __socialStore.setDemoPaused(true);await __socialStore.seedGroupDemo();await new Promise(r=>setTimeout(r,30));
  for(const g of __socialStore.state.groups.slice(0,9))await __socialStore.receiveGroupMessage(g.id,'ali',{text:'一起坐火车，到樱花街区见。'});
  await __socialStore.addFriend('tuantuan');await __socialStore.receiveMessage('tuantuan',{text:'一起去看富士山。'});await __socialStore.flush();
  const request=indexedDB.open('forest-letters-social-v1',1),db=await new Promise(resolve=>request.onsuccess=()=>resolve(request.result));
  await new Promise((resolve,reject)=>{const tx=db.transaction('state','readwrite'),table=tx.objectStore('state');table.get('main').onsuccess=e=>{const state=e.target.result;state.friends=['tuantuan','ali','xiaomian','shanshan'];state.customFriends??={};
   for(let i=0;i<5;i++){const id='scene-guest-'+i;state.friends.push(id);state.customFriends[id]={id,name:'旅伴'+(i+1),animal:'fox',emoji:'🦊',color:'#c8794e',height:1.9,modelUrl:'assets/rodin-friends/fox/scene.glb'};}
   for(const id of state.friends)if(!state.messages.some(m=>m.friendId===id))state.messages.push({id:'scene-fixture-'+id,friendId:id,senderId:id,type:'text',text:'一起去富士樱町散步吧。',createdAt:Date.now(),read:true});table.put(state,'main');};tx.oncomplete=resolve;tx.onerror=reject;});db.close();
 });
 await page.reload();await ready(page,'forest');await populated(page);await switchTo(page,'fuji');await settle(page);

 const before=await page.evaluate(()=>__sceneTheme.snapshot());
 async function frameSample(){return page.evaluate(()=>new Promise(resolve=>{const frames=[];let last;function tick(now){if(last!==undefined)frames.push(now-last);last=now;if(frames.length<180)requestAnimationFrame(tick);else{const sorted=[...frames].sort((a,b)=>a-b);resolve({meanMs:frames.reduce((a,b)=>a+b,0)/frames.length,p95Ms:sorted[Math.floor(sorted.length*.95)],resources:__sceneTheme.resourceSnapshot()});}}requestAnimationFrame(tick);}));}
 await view(page,[33,33,64],[0,2,-5]);await page.screenshot({path:path.join(out,'overview-ui.png')});
 const hide=await page.addStyleTag({content:'body>*:not(#viewport){visibility:hidden!important} #viewport>:not(canvas){visibility:hidden!important}'});
 await page.screenshot({path:path.join(out,'overview.png')});const reducedPerf=await frameSample();
 await view(page,[20,23,35],[0,2,-5]);await page.screenshot({path:path.join(out,'street.png')});
 await view(page,[0,95,-9.9],[0,0,-10]);await page.screenshot({path:path.join(out,'plan.png')});
 await hide.evaluate(el=>el.remove());await page.setViewportSize({width:391,height:844});await page.waitForTimeout(500);await view(page,[24,100,172],[0,4,-7]);await page.screenshot({path:path.join(out,'mobile.png')});
 const labels=await page.locator('.group-building-anchor:visible').evaluateAll(nodes=>nodes.map(n=>{const b=n.getBoundingClientRect(),hit=document.elementFromPoint(b.x+b.width/2,b.y+b.height/2);return{width:b.width,height:b.height,hit:hit===n||n.contains(hit)};}));assert.equal(labels.length,9);assert.ok(labels.every(l=>l.height>=44&&l.width>=44&&l.hit));
 await page.setViewportSize({width:1440,height:1000});await view(page,[33,33,64],[0,2,-5]);await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForTimeout(1000);const movingPerf=await frameSample();
 if(process.argv.includes('--blossoms')){await view(page,[20,23,35],[0,2,-5]);const clean=await page.addStyleTag({content:'body>*:not(#viewport){visibility:hidden!important} #viewport>:not(canvas){visibility:hidden!important}'});await page.waitForTimeout(1200);await page.screenshot({path:path.join(out,'blossom-season.png')});await clean.evaluate(el=>el.remove());}
 if(process.argv.includes('--video')){await view(page,[20,23,35],[0,2,-5]);for(let i=0;i<50;i++)await page.waitForTimeout(1000);const video=page.video();await page.close();await video.saveAs(path.join(out,'dusk-train-petals.webm'));temporaryVideos.push(await video.path());}else await closeTemporary(page);
 await fs.writeFile(path.join(out,'capture.json'),JSON.stringify({snapshot:before,reducedPerf,movingPerf,labels,errors},null,2));assert.deepEqual(errors,[]);console.log(JSON.stringify({out,errors,labels:labels.length,reducedMean:reducedPerf.meanMs,movingMean:movingPerf.meanMs}));
}finally{await context.close();await browser.close();for(const f of temporaryVideos)if(path.resolve(f).startsWith(recordings+path.sep))await fs.unlink(f).catch(()=>{});}
