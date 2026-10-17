import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium,baseURL,outputPath} from './test-runtime.mjs';
import {GROUP_TYPES} from '../src/group-catalog.js';

const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=d3d11']});
const context=await browser.newContext({viewport:{width:1440,height:1000}}),page=await context.newPage(),errors=[],requests=[],checks=[];
page.setDefaultTimeout(60000);
let release=()=>{};
const check=message=>{checks.push(message);console.log('PASS: '+message);};
page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.url().includes('/rodin-groups/'))requests.push(r.url());});
const ready=()=>page.waitForFunction(()=>document.querySelector('#viewport')?.dataset.loaded==='true',null,{timeout:180000});
const assertOneRequestPerType=urls=>assert.deepEqual(urls.map(url=>new URL(url).pathname).sort(),GROUP_TYPES.map(({id})=>`/assets/rodin-groups/${id}/scene.glb`).sort());
const visibleBuildings=()=>page.evaluate(()=>{
 let count=0;__groupBuildings.root.traverse(object=>{
  if(object.userData.groupBuildingSlot===undefined)return;
  for(let parent=object;parent;parent=parent.parent)if(!parent.visible)return;
  count++;
 });return count;
});
try{
 // All nine scenery buildings are visible before any conversations exist. Hold
 // one initial response to exercise its authored fallback during model IO.
 const blocked=new Promise(resolve=>release=resolve);
 await page.route('**/rodin-groups/lab/scene.glb',async route=>{await blocked;await route.continue();});
 await page.goto(baseURL+'/?scene=forest',{waitUntil:'domcontentloaded'});await ready();await page.evaluate(()=>__socialStore.setDemoPaused(true));
 await page.waitForFunction(()=>__groupBuildings.snapshot().buildings.length===9&&__groupBuildings.assets.loading.includes('lab'));
 await page.waitForFunction(()=>__groupBuildings.assets.ready.length===8);
 assertOneRequestPerType(requests);assert.equal(await visibleBuildings(),9);
 assert.ok(await page.evaluate(()=>__renderPerformance.frozenTransforms>100));assert.equal(await page.evaluate(()=>__renderPerformance.preserveDrawingBuffer),false);
 assert.equal(await page.evaluate(()=>performance.getEntriesByType('resource').some(r=>/\/rodin\/(cart|barrel|outcrop)\//.test(r.name))),false);
 check('All nine scenery buildings remain visible with one model request per type; static transforms are frozen without retaining the normal framebuffer');
 const ids=await page.evaluate(async()=>{
  for(const id of ['tuantuan','ali'])await __socialStore.addFriend(id);
  await __socialStore.receiveMessage('tuantuan',{type:'text',text:'性能检查来信'});
  const ids=[];for(let i=0;i<2;i++){const g=await __socialStore.createGroup({name:'性能检查 '+i,type:'lab',memberIds:['tuantuan','ali']});ids.push(g.id);await __socialStore.receiveGroupMessage(g.id,'ali',{text:'性能检查群消息'});}return ids;
 });
 await page.waitForFunction(()=>__groupBuildings.snapshot().entries.length===2);
 await page.waitForFunction(()=>__groupBuildings.assets.loading.includes('lab'));
 assertOneRequestPerType(requests);const first=await page.evaluate(()=>__groupBuildings.snapshot().entries.map(e=>({id:e.id,slot:e.slot})));
 await page.evaluate(id=>__socialUI.openConversation({kind:'group',id}),ids[0]);
 await page.waitForFunction(()=>__uiInteractions.state('meeting')==='open');assert.ok(await page.locator('#chat-input').isVisible());await page.evaluate(()=>__socialUI.closeMeeting());
 release();await page.waitForFunction(()=>__groupBuildings.assets.ready.includes('lab'),null,{timeout:60000});await page.waitForTimeout(250);
 assert.deepEqual(await page.evaluate(()=>__groupBuildings.snapshot().entries.map(e=>({id:e.id,slot:e.slot}))),first);assertOneRequestPerType(requests);assert.equal(await visibleBuildings(),9);
 check('Two lab groups share one request; fallback chat works while loading, then models replace it without losing courtyard slots');
 await page.evaluate(id=>__socialStore.updateGroup(id,{type:'music'}),ids[0]);
 await page.waitForFunction(id=>{const entry=__groupBuildings.snapshot().entries.find(entry=>entry.id===id);return entry&&__groupBuildings.snapshot().buildings[entry.slot].type==='music';},ids[0]);
 assertOneRequestPerType(requests);
 check('Changing a group type reuses its already loaded scenery template without another request');
 // A new document is required: music was already loaded for its visible plot.
 // Install the failure before navigation so it reaches the initial model IO.
 await page.route('**/rodin-groups/music/scene.glb',route=>route.abort());
 const reloadStart=requests.length;await page.reload({waitUntil:'domcontentloaded'});await ready();
 await page.waitForFunction(()=>__groupBuildings.failures.includes('music'));
 await page.waitForFunction(()=>__groupBuildings.assets.loading.length===0);
 assertOneRequestPerType(requests.slice(reloadStart));assert.equal(await visibleBuildings(),9);
 assert.ok(await page.locator(`[data-group="${ids[0]}"]`).isVisible());
 await page.evaluate(id=>__socialUI.openConversation({kind:'group',id}),ids[0]);await page.waitForFunction(()=>__uiInteractions.state('meeting')==='open');
 assert.match(await page.locator('#meeting-name').innerText(),/性能检查/);await page.evaluate(()=>__socialUI.closeMeeting());
 check('A failed initial building model retains all nine visible buildings and usable fallback chat');
 await page.waitForFunction(()=>__uiInteractions.state('meeting')==='closed');
 await page.evaluate(()=>__freeRoam.enter());await page.waitForFunction(()=>__freeRoam.active);await page.keyboard.down('KeyW');await page.waitForTimeout(200);await page.keyboard.up('KeyW');
 await page.evaluate(()=>__freeRoam.exit());await page.waitForFunction(()=>!__freeRoam.busy);
 check('Free roam movement and smooth return still work');
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});
 await page.waitForTimeout(250);const stopped=await page.evaluate(()=>__renderPerformance.frames);await page.waitForTimeout(250);assert.equal(await page.evaluate(()=>__renderPerformance.frames),stopped);
 await page.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));});await page.waitForFunction(stopped=>__renderPerformance.frames>stopped+2,stopped);
 check('Hidden document stops scheduling render frames; visibility resumes the loop');
 await page.screenshot({path:outputPath('performance-groups.jpg'),type:'jpeg',quality:88});
 // Canvas export/MediaRecorder are exclusive to capture mode and retain its buffer.
 await page.goto(baseURL+'/?capture=1',{waitUntil:'domcontentloaded'});await ready();await page.waitForFunction(()=>window.__capture?.ready);
 assert.equal(await page.evaluate(()=>__renderPerformance.preserveDrawingBuffer),true);
 const recording=await page.evaluate(()=>__capture.record(1,1500));assert.ok(recording.poster.length>1000);assert.ok(recording.video.length>1000);
 const decoded=await page.evaluate(async data=>{
  const bytes=Uint8Array.from(atob(data.video),c=>c.charCodeAt(0)),url=URL.createObjectURL(new Blob([bytes],{type:data.mime})),video=document.createElement('video');video.muted=true;
  try{await new Promise((resolve,reject)=>{video.onloadeddata=resolve;video.onerror=()=>reject(new Error('Recorded clip cannot decode'));video.src=url;});await video.play();await new Promise(resolve=>video.requestVideoFrameCallback(resolve));return{width:video.videoWidth,height:video.videoHeight,readyState:video.readyState};}finally{video.pause();video.removeAttribute('src');video.load();URL.revokeObjectURL(url);}
 },recording);
 assert.equal(decoded.width,540);assert.equal(decoded.height,960);
 await fs.writeFile(outputPath('performance-capture.json'),JSON.stringify({posterBytes:recording.poster.length,videoBytes:recording.video.length,mime:recording.mime,decoded}));
 await fs.writeFile(outputPath('performance-capture.webm'),Buffer.from(recording.video,'base64'));
 check('Capture mode retains a real JPEG poster and playable MediaRecorder output');
 assert.deepEqual(errors,[]);const report={checks,errors,buildingRequests:requests};await fs.writeFile(outputPath('performance-browser.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{release();await context.close();await browser.close();}
