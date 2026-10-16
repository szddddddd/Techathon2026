import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {chromium,baseURL} from './test-runtime.mjs';

const out=path.resolve(process.env.FUJI_VALIDATION_DIR||'validation/showa-town'),recordings=path.join(out,'.capture-recordings');
await fs.mkdir(recordings,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=d3d11']});
const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce',recordVideo:{dir:recordings,size:{width:1440,height:1000}}});
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
 if(process.argv.includes('--mobile-only')){
  await page.setViewportSize({width:391,height:844});await page.waitForTimeout(500);await view(page,[24,100,172],[0,4,-7]);await page.mouse.move(380,780);await page.screenshot({path:path.join(out,'fuji-mobile.jpg'),quality:94});
  const labels=await page.locator('.group-building-anchor:visible').evaluateAll(nodes=>nodes.map(node=>{const r=node.getBoundingClientRect(),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return{id:node.dataset.group,x:r.x,y:r.y,width:r.width,height:r.height,hit:hit===node||node.contains(hit)};}));
  assert.equal(labels.length,9);assert.ok(labels.every(r=>r.width>=44&&r.height>=44&&r.hit&&r.x>=0&&r.x+r.width<=391),'All nine mobile group labels remain reachable');
  await page.waitForTimeout(250);await page.screenshot({path:path.join(out,'mobile-scene-picker.jpg'),quality:94});await page.keyboard.press('Escape');
  const report={generatedAt:new Date().toISOString(),camera:{position:[24,100,172],target:[0,4,-7]},viewport:{width:391,height:844},labels,hitCount:labels.filter(l=>l.hit).length,groups:await page.evaluate(()=>__groupBuildings.snapshot().entries.length),characters:await page.evaluate(()=>__characterPlacement.snapshot().characters.length),errors};
  await fs.writeFile(path.join(out,'capture-mobile.json'),JSON.stringify(report,null,2));assert.deepEqual(errors,[]);await closeTemporary(page);console.log(JSON.stringify(report,null,2));
 }else{
 await view(page,[33,33,64],[0,2,-5]);await page.screenshot({path:path.join(out,'fuji-overview.jpg'),quality:94});
 await view(page,[0,95,-9.9],[0,0,-10]);await page.screenshot({path:path.join(out,'fuji-plan.jpg'),quality:94});
 await view(page,[20,23,35],[0,2,-5]);await page.screenshot({path:path.join(out,'fuji-street.jpg'),quality:94});
 await view(page,[6,7,11],[12,3,3]);await page.screenshot({path:path.join(out,'fuji-carriages.jpg'),quality:94});
 await page.setViewportSize({width:391,height:844});await page.waitForTimeout(500);await view(page,[24,100,172],[0,4,-7]);await page.mouse.move(380,780);await page.screenshot({path:path.join(out,'fuji-mobile.jpg'),quality:94});
 const evidence=await page.evaluate(()=>({snapshot:__sceneTheme.snapshot(),groups:__groupBuildings.snapshot().entries.length,characters:__characterPlacement.snapshot().characters.length,resources:__sceneTheme.resourceSnapshot(),viewport:{width:innerWidth,height:innerHeight}}));
 await page.setViewportSize({width:1440,height:1000});await switchTo(page,'forest');await closeTemporary(page);

 // A second page reuses the isolated fixture and warmed HTTP cache. Its video
 // includes the actual top toolbar and live transition, not just WebGL pixels.
 const film=await context.newPage();observe(film);await film.emulateMedia({reducedMotion:'no-preference'});await film.goto(forest.href);await ready(film,'forest');await populated(film);await view(film,[40,36,66],[0,0,-5]);await film.waitForTimeout(1500);
 await film.waitForTimeout(1200);await film.locator('#scene-switcher .scene-switcher-option').press('End');await ready(film,'fuji');await populated(film);await film.waitForFunction(()=>!document.querySelector('.scene-travel'));await film.mouse.move(1400,940);await film.waitForTimeout(4500);
 await view(film,[20,23,35],[0,2,-5]);await film.waitForTimeout(4500);
 const states=[];for(let i=0;i<48;i++){await film.waitForTimeout(1000);states.push(await film.evaluate(()=>__sceneTheme.snapshot()));}await fs.writeFile(path.join(out,'train-timeline.json'),JSON.stringify(states,null,2));
 const video=film.video();await film.close();await video.saveAs(path.join(out,'showa-town-petals.webm'));temporaryVideos.push(await video.path());
 await fs.writeFile(path.join(out,'capture.json'),JSON.stringify({generatedAt:new Date().toISOString(),files:['fuji-plan.jpg','fuji-overview.jpg','fuji-street.jpg','fuji-mobile.jpg','showa-town-petals.webm'],fixture:'isolated IndexedDB: nine group types and nine friends',loadedScene:evidence,errors},null,2));
 if(errors.length)throw Error('Scene capture reported errors: '+errors.join('; '));console.log(JSON.stringify({out,...evidence,errors},null,2));
 }
}finally{
 await context.close();await browser.close();for(const videoPath of temporaryVideos)if(path.resolve(videoPath).startsWith(recordings+path.sep))await fs.unlink(videoPath).catch(()=>{});
}
