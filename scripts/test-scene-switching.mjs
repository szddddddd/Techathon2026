import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium,baseURL} from './test-runtime.mjs';
import {FUJI_RAIL} from '../src/fuji-profile.js';

const out='validation/scene-switching';
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=d3d11']});
const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
const page=await context.newPage(),checks=[],errors=[],performanceSamples={};
page.on('pageerror',e=>errors.push(e.message));
page.on('console',m=>{if(m.type()==='error'&&/THREE|WebGL|shader/i.test(m.text()))errors.push(m.text());});
const ready=id=>page.waitForFunction(id=>window.__sceneTheme?.ready&&__sceneTheme.id===id&&window.__groupBuildings&&window.__socialUI,id,{timeout:180000});
const populated=()=>page.waitForFunction(()=>__groupBuildings.snapshot().entries.length===9&&__characterPlacement.snapshot().characters.length===9,null,{timeout:180000});
const chatOpen=()=>page.waitForFunction(()=>__uiInteractions.state('meeting')==='open');
const closeChat=async()=>{await page.evaluate(()=>__socialUI.closeMeeting());await page.waitForFunction(()=>__uiInteractions.state('meeting')==='closed');await page.waitForFunction(()=>__freeRoam.snapshot().orbitEnabled);};
const fingerprint=()=>page.evaluate(()=>({friends:[...__socialStore.state.friends],groups:__socialStore.state.groups.map(g=>({id:g.id,name:g.name,type:g.type})),friendMessages:__socialStore.state.messages.map(m=>({id:m.id,friendId:m.friendId,text:m.text})),groupMessages:Object.fromEntries(Object.entries(__socialStore.state.messagesByGroup).map(([id,messages])=>[id,messages.map(m=>({id:m.id,text:m.text}))]))}));
async function switchTo(id){
 await page.locator('#scene-switcher .scene-switcher-toggle').click();
 await page.locator(`#scene-switcher [data-scene="${id}"]`).click();
 await ready(id);await populated();
 await page.waitForFunction(()=>!document.querySelector('.scene-travel'));
 assert.equal(new URL(page.url()).searchParams.get('scene'),id);
 assert.equal(await page.evaluate(()=>window.__sceneTestIdentity.store===__socialStore&&window.__sceneTestIdentity.ui===__socialUI&&window.__sceneTestIdentity.canvas===document.querySelector('canvas')),true,'Scene changes retain the same store, UI and renderer canvas');
 assert.equal(await page.evaluate(()=>localStorage.getItem('forest-letters-scene')),id);
}
async function clearToolbar(){
 await page.mouse.move(1400,940);await page.keyboard.press('Escape');
 await page.waitForTimeout(300);
}
async function view(position,target){
 await page.evaluate(({position,target})=>__valley.view(position,target),{position,target});
 await page.waitForFunction(()=>!__valley.snapshot().transitioning);await page.waitForTimeout(350);
}
async function measureFrames(){
 const previous=await page.evaluate(()=>__discoveryScene.pose());await view([40,36,66],[0,0,-5]);
 const result=await page.evaluate(()=>new Promise(resolve=>{const frames=[];let last;function tick(now){if(last!==undefined)frames.push(now-last);last=now;if(frames.length<180)requestAnimationFrame(tick);else{const sorted=[...frames].sort((a,b)=>a-b);resolve({frameCount:frames.length,meanMs:frames.reduce((s,n)=>s+n,0)/frames.length,p95Ms:sorted[Math.floor(sorted.length*.95)],resources:__sceneTheme.resourceSnapshot()});}}requestAnimationFrame(tick);}));
 await view(previous.position,previous.target);return result;
}
async function contentTravel(){
 const url=new URL(baseURL);url.searchParams.set('scene','forest');await page.goto(url.href);await ready('forest');await page.evaluate(()=>__socialStore.setDemoPaused(true));
 await page.locator('[data-scene-content="accounts"]').click();await page.waitForFunction(()=>__discoveryBoards.stage==='browsing');
 await page.locator('.d-content-card[data-id="hyper3d-rodin-workflow"]').click();await page.waitForTimeout(350);
 await page.locator('.discovery-body').evaluate(el=>el.scrollTop=700);await page.waitForTimeout(350);
 const before=await page.evaluate(()=>{window.__contentTravelIdentity=__discoveryUI;return{route:__discoveryUI.route,scroll:document.querySelector('.discovery-body').scrollTop};});
 await page.locator('.scene-switcher-toggle').click();await page.locator('#scene-switcher [data-scene="fuji"]').click();await ready('fuji');
 await page.waitForFunction(()=>!__sceneTheme.switching&&!document.querySelector('.scene-travel')&&__uiInteractions.state('scene-switcher')==='closed');
 const after=await page.evaluate(()=>({sameUI:__contentTravelIdentity===__discoveryUI,route:__discoveryUI.route,scroll:document.querySelector('.discovery-body').scrollTop,controls:__sceneTheme.resourceSnapshot().controls}));
 assert.equal(after.sameUI,true);assert.equal(after.route.type,'article');assert.equal(after.route.id,before.route.id);assert.ok(Math.abs(after.scroll-before.scroll)<3);
 await page.screenshot({path:out+'/article-scene-travel.jpg',quality:92});await page.keyboard.press('Escape');await page.waitForFunction(()=>__uiInteractions.state('discovery')==='closed');
 assert.equal(await page.evaluate(()=>__discoveryUI.isOpen),false);assert.equal(await page.evaluate(()=>__freeRoam.snapshot().orbitEnabled),true);
 const oldPose=await page.evaluate(()=>__discoveryScene.pose());await page.mouse.move(1150,700);await page.mouse.down({button:'right'});await page.mouse.move(1250,720,{steps:8});await page.mouse.up({button:'right'});await page.waitForTimeout(250);
 const newPose=await page.evaluate(()=>__discoveryScene.pose());assert.ok(Math.hypot(...newPose.target.map((v,i)=>v-oldPose.target[i]))>.1);
 const report={checks:['Scene-origin Hyper3D article keeps the same UI instance, route and reading position during live theme change','Esc closes detached article cleanly after scene change; right-button camera pan works'],before,after,errors};assert.deepEqual(errors,[]);await fs.writeFile(out+'/content-travel.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}
if(process.argv.includes('--content-only')){
 try{await contentTravel();}catch(error){await page.screenshot({path:out+'/content-travel-failure.jpg'}).catch(()=>{});await fs.writeFile(out+'/content-travel-failure.json',JSON.stringify({error:String(error),errors},null,2));throw error;}finally{await context.close();await browser.close();}
 process.exit(0);
}
if(process.argv.includes('--follow-only')){
 try{
  const url=new URL(baseURL);url.searchParams.set('scene','fuji');await page.goto(url.href);await ready('fuji');
  await page.evaluate(async()=>{await __socialStore.setDemoPaused(true);await __socialStore.seedGroupDemo();await new Promise(r=>setTimeout(r,30));for(const g of __socialStore.state.groups.slice(0,9))await __socialStore.receiveGroupMessage(g.id,'ali',{text:'在樱花街区相见。'});});
  await page.waitForFunction(()=>__groupBuildings.snapshot().entries.length===9);await page.waitForTimeout(200);await page.emulateMedia({reducedMotion:'no-preference'});
  await page.locator('#train-station-control').click();await page.waitForFunction(()=>__trainFollow.snapshot().active);await page.waitForTimeout(1100);
  await page.screenshot({path:out+'/train-follow.jpg',quality:93});const following=await page.evaluate(()=>__trainFollow.snapshot());
  await page.keyboard.press('Escape');await page.waitForFunction(()=>!__trainFollow.busy);const returned=await page.evaluate(()=>__trainFollow.snapshot());assert.ok(Math.hypot(...returned.position.map((v,i)=>v-following.savedPosition[i]))<.01);
  assert.deepEqual(errors,[]);await fs.writeFile(out+'/train-follow-camera.json',JSON.stringify({following,returned,errors},null,2));
 }finally{await context.close();await browser.close();}
 process.exit(0);
}

try{
 const url=new URL(baseURL);url.searchParams.set('scene','forest');
 await page.goto(url.href);await ready('forest');
 await page.evaluate(async()=>{
  await __socialStore.setDemoPaused(true);await __socialStore.seedGroupDemo();
  await new Promise(resolve=>setTimeout(resolve,30));
  for(const g of __socialStore.state.groups.slice(0,9))await __socialStore.receiveGroupMessage(g.id,'ali',{text:'换个风景，继续聊。'});
  await __socialStore.addFriend('tuantuan');
  await __socialStore.receiveMessage('tuantuan',{text:'一起坐火车去看樱花吧。'});
 });
 // A fresh isolated browser fixture, loaded once before the live-switch identity sentinel.
 await page.evaluate(async()=>{
  await __socialStore.flush();const request=indexedDB.open('forest-letters-social-v1',1),db=await new Promise(resolve=>request.onsuccess=()=>resolve(request.result));
  await new Promise((resolve,reject)=>{const tx=db.transaction('state','readwrite'),table=tx.objectStore('state');table.get('main').onsuccess=e=>{
   const state=e.target.result;state.friends=['tuantuan','ali','xiaomian','shanshan'];state.customFriends??={};
   for(let i=0;i<5;i++){const id='scene-guest-'+i;state.friends.push(id);state.customFriends[id]={id,name:'旅伴'+(i+1),animal:'fox',emoji:'🦊',color:'#c8794e',height:1.9,modelUrl:'assets/rodin-friends/fox/scene.glb'};}
   for(const id of state.friends)if(!state.messages.some(m=>m.friendId===id))state.messages.push({id:'scene-fixture-'+id,friendId:id,senderId:id,type:'text',text:'一起去富士樱町散步吧。',createdAt:Date.now(),read:true});table.put(state,'main');
  };tx.oncomplete=resolve;tx.onerror=reject;});db.close();
 });
 await page.reload();await ready('forest');
 await populated();
 performanceSamples.forest=await measureFrames();
 const groupId=await page.evaluate(()=>__groupBuildings.snapshot().entries[0].id);
 await page.evaluate(async id=>{window.__sceneTestIdentity={store:__socialStore,ui:__socialUI,canvas:document.querySelector('canvas')};for(let i=0;i<32;i++)await __socialStore.receiveGroupMessage(id,'ali',{text:'保留阅读位置 '+i+'：列车经过樱花树下，我们继续慢慢聊天。'});},groupId);
 await page.evaluate(id=>__socialUI.openConversation({kind:'group',id}),groupId);await chatOpen();
 await page.locator('#chat-input').fill('切换场景时，这段群聊草稿要保留。');
 const attachmentImage=await fs.readFile('assets/rodin-groups/club/reference-front.png');
 await page.locator('#chat-file').setInputFiles({name:'scene-memory.png',mimeType:'image/png',buffer:attachmentImage});await page.locator('#chat-attachment').waitFor({state:'visible'});
 await page.locator('#chat-messages').evaluate(el=>el.scrollTop=70);await page.waitForTimeout(300);
 await page.evaluate(id=>__socialStore.receiveGroupMessage(id,'ali',{text:'浏览历史时，这条新消息要继续未读。'},'scene-switch-unread'),groupId);await page.waitForTimeout(150);
 const original=await fingerprint(),readingBefore=await page.locator('#chat-messages').evaluate(el=>el.scrollTop);
 assert.equal(await page.evaluate(id=>__socialStore.state.messagesByGroup[id].find(m=>m.id==='scene-switch-unread').read,groupId),false);
 await switchTo('fuji');
 assert.deepEqual(await fingerprint(),original);
 assert.equal(await page.evaluate(()=>__groupBuildings.theme),'fuji');
 const audit=await page.evaluate(()=>__sceneTheme.audit);
 assert.equal(audit.river,false);assert.equal(audit.terrace,false);assert.ok(audit.sakuraTrees>=15);assert.equal(audit.trainCarriages,2);
 assert.equal(await page.evaluate(()=>new Set(__groupBuildings.snapshot().entries.map(e=>__socialStore.state.groups.find(g=>g.id===e.id).type)).size),9);
 await chatOpen();assert.equal(await page.evaluate(()=>__socialUI.activeConversation.id),groupId);
 assert.equal(await page.locator('#chat-input').inputValue(),'切换场景时，这段群聊草稿要保留。');
 assert.equal(await page.locator('#chat-attachment').isVisible(),true);
 assert.ok(Math.abs(await page.locator('#chat-messages').evaluate(el=>el.scrollTop)-readingBefore)<3);
 assert.equal(await page.evaluate(id=>__socialStore.state.messagesByGroup[id].find(m=>m.id==='scene-switch-unread').read,groupId),false);
 await closeChat();await clearToolbar();
 checks.push('Forest → Fuji swaps without reload, preserving store/UI/canvas identity, open chat, history scroll, unread, attachment, draft and nine building types');
 await page.screenshot({path:out+'/fuji-overview.jpg',quality:93});
 performanceSamples.fuji=await measureFrames();
 await view([-30,23,25],[-11,4,-8]);
 await page.screenshot({path:out+'/fuji-street.jpg',quality:93});

 // Hit a rendered building, rather than bypassing the pointer path with the UI API.
 const target=await page.evaluate(()=>{
  for(const entry of __groupBuildings.snapshot().entries){const {x,z}=__groupBuildings.slots[entry.slot];
   for(const y of [3.1,3.7,4.4,5])for(const dx of [0,-.6,.6]){
    const p=__groupBuildings.project(x+dx,y,z);
    if(__groupBuildings.pick(p.x,p.y)===entry.id&&document.elementFromPoint(p.x,p.y)?.tagName==='CANVAS')return{...p,id:entry.id};
   }
  }
 });
 assert.ok(target,'A Japanese building exposes a real canvas click target');
 await page.mouse.click(target.x,target.y);await chatOpen();
 assert.equal(await page.evaluate(()=>__socialUI.activeConversation.id),target.id);
 assert.equal(await page.evaluate(id=>__groupBuildings.snapshot().entries.find(e=>e.id===id).selected,target.id),true);
 await closeChat();
 checks.push('Japanese building canvas click opens the matching group and highlights its building');

 const reducedBefore=await page.evaluate(()=>__sceneTheme.snapshot());await page.waitForTimeout(650);
 const reducedAfter=await page.evaluate(()=>__sceneTheme.snapshot());
 assert.equal(reducedBefore.trainX,reducedAfter.trainX);assert.equal(reducedBefore.animationTime,reducedAfter.animationTime);
 await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForTimeout(150);
 const movingBefore=await page.evaluate(()=>__sceneTheme.snapshot());await page.waitForTimeout(900);
 const movingAfter=await page.evaluate(()=>__sceneTheme.snapshot());
 assert.ok(Math.abs(movingAfter.trainX-movingBefore.trainX)>.05);assert.ok(movingAfter.animationTime>movingBefore.animationTime);
 checks.push('Train advances with motion enabled; its position and animation time freeze in reduced-motion mode');
 await view([28,22,35],[2,4,-3]);
 const followOrigin=await page.evaluate(()=>__discoveryScene.pose());
 await page.locator('#train-station-control').click();
 await page.waitForFunction(()=>__trainFollow?.snapshot().active);await page.waitForTimeout(950);
 assert.equal(await page.locator('#train-follow-exit').isVisible(),true);
 await page.screenshot({path:out+'/train-follow.jpg',quality:92});
 await page.keyboard.press('Escape');await page.waitForFunction(()=>!__trainFollow.busy);
 const followReturn=await page.evaluate(()=>__discoveryScene.pose());
 assert.ok(Math.hypot(...followReturn.position.map((v,i)=>v-followOrigin.position[i]))<.01);
 assert.ok(Math.hypot(...followReturn.target.map((v,i)=>v-followOrigin.target[i]))<.01);
 const trainPoint=await page.evaluate(()=>__trainFollow.screenPoint());assert.ok(trainPoint.visible);
 await page.mouse.click(trainPoint.x,trainPoint.y);await page.waitForFunction(()=>__trainFollow.snapshot().active);
 await page.waitForTimeout(850);await page.mouse.move(1200,650);await page.mouse.down({button:'right'});await page.mouse.move(1230,655,{steps:5});await page.mouse.up({button:'right'});
 assert.equal(await page.evaluate(()=>__trainFollow.busy),false);
 await page.emulateMedia({reducedMotion:'reduce'});await page.locator('#train-station-control').click();await page.waitForFunction(()=>__trainFollow.snapshot().active);
 const stillCamera=await page.evaluate(()=>__trainFollow.snapshot().position);await page.waitForTimeout(350);
 assert.deepEqual(await page.evaluate(()=>__trainFollow.snapshot().position),stillCamera);
 await page.locator('#train-follow-exit').click();await page.waitForFunction(()=>!__trainFollow.busy);await page.emulateMedia({reducedMotion:'no-preference'});
 checks.push('Station badge and train-body click enter tracking; Esc restores camera, right-drag exits, reduced mode keeps a fixed station view');
 await view([28,22,35],[2,4,-3]);
 await page.evaluate(async()=>{
  const canvas=document.querySelector('canvas'),stream=canvas.captureStream(20),recorder=new MediaRecorder(stream,{mimeType:'video/webm;codecs=vp8'}),parts=[];
  const stopped=new Promise(resolve=>{recorder.onstop=resolve;});
  recorder.ondataavailable=e=>{if(e.data.size)parts.push(e.data);};recorder.start();
  await new Promise(resolve=>setTimeout(resolve,6500));recorder.stop();await stopped;stream.getTracks().forEach(t=>t.stop());
  const blob=new Blob(parts,{type:'video/webm'}),reader=new FileReader();
  window.__trainVideo=await new Promise(resolve=>{reader.onload=()=>resolve(reader.result.split(',')[1]);reader.readAsDataURL(blob);});
 });
 await fs.writeFile(out+'/steam-train.webm',Buffer.from(await page.evaluate(()=>window.__trainVideo),'base64'));

 await page.emulateMedia({reducedMotion:'reduce'});await view([33,33,64],[0,2,-5]);
 const railChecks=await page.evaluate(points=>points.filter(([x])=>Math.abs(x)<25).map(([x,z])=>({x,z,result:__characterPlacement.inspect('tuantuan',x,z)})),FUJI_RAIL.points);
 assert.ok(railChecks.every(check=>!check.result.ok));
 const gathering=await page.evaluate(()=>__valley.gather());assert.equal(gathering.ok,true);assert.equal(gathering.count,9);await page.waitForTimeout(400);assert.equal(await page.evaluate(()=>__valley.snapshot().gathering),true);
 await page.evaluate(()=>__valley.end());await page.waitForFunction(()=>!__valley.snapshot().gathering&&!__valley.snapshot().transitioning);
 for(const kind of ['accounts','scene-video','record']){
  await page.mouse.move(1400,940);await page.waitForTimeout(300);
  if(kind==='record'){await page.locator('#record-player-control').click();await page.waitForFunction(()=>__uiInteractions.state('sound')==='open');await page.keyboard.press('Escape');await page.waitForFunction(()=>__uiInteractions.state('sound')==='closed');}
  else{await page.locator(`[data-scene-content="${kind}"]`).click();await page.waitForFunction(()=>__discoveryBoards.stage==='browsing');await page.keyboard.press('Escape');await page.waitForFunction(()=>__discoveryBoards.stage==='closed');}
 }
 checks.push('Nine friends gather and return in Fuji; railway rejects placement; account, video and record-player entrances open and return');

 await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:391,height:844});await page.waitForTimeout(800);await clearToolbar();
 await page.screenshot({path:out+'/fuji-mobile.jpg',quality:92});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 const toggleBox=await page.locator('.scene-switcher-toggle').boundingBox();assert.ok(toggleBox.height>=44&&toggleBox.x>=0&&toggleBox.x+toggleBox.width<=391);
 await page.locator('.scene-switcher-toggle').click();
 const cards=await page.locator('.scene-switcher-card').evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height};}));
 assert.ok(cards.every(r=>r.height>=44&&r.x>=0&&r.x+r.width<=391));
 await page.screenshot({path:out+'/mobile-scene-picker.jpg',quality:92});await clearToolbar();
 await page.locator('.group-building-anchor:visible').first().click();await chatOpen();await closeChat();
 checks.push('391px viewport keeps scene choices within safe bounds and 44px targets; group labels still open chat');

 await page.setViewportSize({width:1440,height:1000});await page.waitForTimeout(400);
 await page.evaluate(()=>__socialUI.openFriend('tuantuan'));await chatOpen();
 await page.locator('#chat-input').fill('富士樱町的好友草稿也要带回森林。');
 await switchTo('forest');assert.deepEqual(await fingerprint(),original);
 await chatOpen();assert.equal(await page.evaluate(()=>__socialUI.activeConversation.id),'tuantuan');
 assert.equal(await page.locator('#chat-input').inputValue(),'富士樱町的好友草稿也要带回森林。');await closeChat();await clearToolbar();
 assert.equal(await page.evaluate(()=>__groupBuildings.theme),'forest');assert.equal(await page.evaluate(()=>__sceneTheme.audit.river),true);assert.equal(await page.evaluate(()=>__sceneTheme.audit.terrace),true);
 await page.screenshot({path:out+'/forest-return.jpg',quality:92});
 checks.push('Fuji → Forest restores original world and keeps friend draft, group history and all conversations');
 const switches=[],firstForestResources=await page.evaluate(()=>__sceneTheme.resourceSnapshot());
 for(const id of ['fuji','forest','fuji']){
  await switchTo(id);await clearToolbar();
  assert.deepEqual(await fingerprint(),original);
  const resources=await page.evaluate(()=>({scene:__sceneTheme.id,details:__sceneTheme.resourceSnapshot?.()||__sceneTheme.resources?.(),socialRoots:document.querySelectorAll('#social').length,groupLabels:document.querySelectorAll('#group-building-labels').length,dragHints:document.querySelectorAll('#character-drag-hint').length,canvases:document.querySelectorAll('#viewport canvas').length}));
  assert.equal(resources.socialRoots,1);assert.equal(resources.groupLabels,1);assert.equal(resources.dragHints,1);
  assert.equal(resources.details.worldRoots,1);assert.equal(resources.details.characters.cachedCharacters,9);
  if(id==='forest'){
   assert.ok(resources.details.geometries<=firstForestResources.geometries+2,'Returning forest does not accumulate geometries');
   assert.ok(resources.details.textures<=firstForestResources.textures+1,'Returning forest does not accumulate textures');
   assert.equal(await page.locator('#train-station-control').count(),0);
  }else assert.equal(await page.locator('#train-station-control').count(),1);
  switches.push(resources);
 }
 checks.push('Five live scene changes preserve session identity and conversation data without duplicate roots/labels/hints or growing forest geometry/texture counts');
 assert.deepEqual(errors,[]);
 const report={checks,errors,switches,audit,performanceSamples,railChecks,reduced:{before:reducedBefore,after:reducedAfter},motion:{before:movingBefore,after:movingAfter},mobile:{toggle:toggleBox,cards},counts:await page.evaluate(()=>({friends:__characterPlacement.snapshot().characters.length,buildings:__groupBuildings.snapshot().entries.length})),limits:['Desktop Edge and mobile viewport simulation; no physical phone test','Frame samples use the same desktop browser, viewport, camera, reduced motion, nine buildings and nine characters; not a device-independent performance benchmark']};
 await fs.writeFile(out+'/browser.json',JSON.stringify(report,null,2));console.log(JSON.stringify({checks,errors,counts:report.counts,performance:Object.fromEntries(Object.entries(performanceSamples).map(([id,p])=>[id,{meanMs:p.meanMs,p95Ms:p.p95Ms,calls:p.resources.calls,triangles:p.resources.triangles}]))},null,2));
}catch(error){await page.screenshot({path:out+'/failure.jpg'}).catch(()=>{});await fs.writeFile(out+'/failure.json',JSON.stringify({checks,errors,error:String(error)},null,2));throw error;}
finally{await context.close();await browser.close();}
