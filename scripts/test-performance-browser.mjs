import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium,baseURL,outputPath} from './test-runtime.mjs';

const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=d3d11']});
const context=await browser.newContext({viewport:{width:1440,height:1000}}),page=await context.newPage(),errors=[],requests=[],checks=[];
page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.url().includes('/rodin-groups/'))requests.push(r.url());});
const ready=()=>page.waitForFunction(()=>document.querySelector('#viewport')?.dataset.loaded==='true',null,{timeout:120000});
try{
 await page.goto(baseURL);await ready();await page.evaluate(()=>__socialStore.setDemoPaused(true));
 assert.deepEqual(requests,[]);assert.ok(await page.evaluate(()=>__renderPerformance.frozenTransforms>100));assert.equal(await page.evaluate(()=>__renderPerformance.preserveDrawingBuffer),false);
 assert.equal(await page.evaluate(()=>performance.getEntriesByType('resource').some(r=>/\/rodin\/(cart|barrel|outcrop)\//.test(r.name))),false);
 checks.push('Empty courtyard requests zero building models; scenery transforms are frozen without retaining the normal framebuffer');
 // A held response proves the fallback can be selected while model IO is pending.
 let release;const blocked=new Promise(resolve=>release=resolve);
 await page.route('**/rodin-groups/lab/scene.glb',async route=>{await blocked;await route.continue();});
 const ids=await page.evaluate(async()=>{
  for(const id of ['tuantuan','ali'])await __socialStore.addFriend(id);
  await __socialStore.receiveMessage('tuantuan',{type:'text',text:'性能检查来信'});
  const ids=[];for(let i=0;i<2;i++){const g=await __socialStore.createGroup({name:'性能检查 '+i,type:'lab',memberIds:['tuantuan','ali']});ids.push(g.id);await __socialStore.receiveGroupMessage(g.id,'ali',{text:'性能检查群消息'});}return ids;
 });
 await page.waitForFunction(()=>__groupBuildings.snapshot().entries.length===2);
 await page.waitForFunction(()=>__groupBuildings.assets.loading.includes('lab'));
 assert.equal(requests.length,1);const first=await page.evaluate(()=>__groupBuildings.snapshot().entries.map(e=>({id:e.id,slot:e.slot})));
 await page.evaluate(id=>__socialUI.openConversation({kind:'group',id}),ids[0]);
 await page.waitForFunction(()=>__uiInteractions.state('meeting')==='open');assert.ok(await page.locator('#chat-input').isVisible());await page.evaluate(()=>__socialUI.closeMeeting());
 release();await page.waitForFunction(()=>__groupBuildings.assets.ready.includes('lab'),null,{timeout:60000});await page.waitForTimeout(250);
 assert.deepEqual(await page.evaluate(()=>__groupBuildings.snapshot().entries.map(e=>({id:e.id,slot:e.slot}))),first);assert.equal(requests.length,1);
 checks.push('Two lab groups share one request; fallback chat works while loading, then models replace it without losing courtyard slots');
 await page.route('**/rodin-groups/music/scene.glb',route=>route.abort());
 await page.evaluate(id=>__socialStore.updateGroup(id,{type:'music'}),ids[0]);
 await page.waitForFunction(()=>__groupBuildings.failures.includes('music'));
 assert.ok(await page.locator(`[data-group="${ids[0]}"]`).isVisible());
 await page.evaluate(id=>__socialUI.openConversation({kind:'group',id}),ids[0]);await page.waitForFunction(()=>__uiInteractions.state('meeting')==='open');
 assert.match(await page.locator('#meeting-name').innerText(),/性能检查/);await page.evaluate(()=>__socialUI.closeMeeting());
 checks.push('A later type change loads only its model; a failed model retains the usable authored fallback');
 await page.waitForFunction(()=>__uiInteractions.state('meeting')==='closed');
 await page.evaluate(()=>__freeRoam.enter());await page.waitForFunction(()=>__freeRoam.active);await page.keyboard.down('KeyW');await page.waitForTimeout(200);await page.keyboard.up('KeyW');
 await page.evaluate(()=>__freeRoam.exit());await page.waitForFunction(()=>!__freeRoam.busy);
 checks.push('Free roam movement and smooth return still work');
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});
 await page.waitForTimeout(250);const stopped=await page.evaluate(()=>__renderPerformance.frames);await page.waitForTimeout(250);assert.equal(await page.evaluate(()=>__renderPerformance.frames),stopped);
 await page.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));});await page.waitForFunction(stopped=>__renderPerformance.frames>stopped+2,stopped);
 checks.push('Hidden document stops scheduling render frames; visibility resumes the loop');
 await page.screenshot({path:outputPath('performance-groups.jpg'),type:'jpeg',quality:88});
 // Canvas export/MediaRecorder are exclusive to capture mode and retain its buffer.
 await page.goto(baseURL+'/?capture=1');await ready();await page.waitForFunction(()=>window.__capture?.ready);
 assert.equal(await page.evaluate(()=>__renderPerformance.preserveDrawingBuffer),true);
 const recording=await page.evaluate(()=>__capture.record(1,1500));assert.ok(recording.poster.length>1000);assert.ok(recording.video.length>1000);
 const decoded=await page.evaluate(async data=>{
  const bytes=Uint8Array.from(atob(data.video),c=>c.charCodeAt(0)),url=URL.createObjectURL(new Blob([bytes],{type:data.mime})),video=document.createElement('video');video.muted=true;
  try{await new Promise((resolve,reject)=>{video.onloadeddata=resolve;video.onerror=()=>reject(new Error('Recorded clip cannot decode'));video.src=url;});await video.play();await new Promise(resolve=>video.requestVideoFrameCallback(resolve));return{width:video.videoWidth,height:video.videoHeight,readyState:video.readyState};}finally{video.pause();video.removeAttribute('src');video.load();URL.revokeObjectURL(url);}
 },recording);
 assert.equal(decoded.width,540);assert.equal(decoded.height,960);
 await fs.writeFile(outputPath('performance-capture.json'),JSON.stringify({posterBytes:recording.poster.length,videoBytes:recording.video.length,mime:recording.mime,decoded}));
 await fs.writeFile(outputPath('performance-capture.webm'),Buffer.from(recording.video,'base64'));
 checks.push('Capture mode retains a real JPEG poster and playable MediaRecorder output');
 assert.deepEqual(errors,[]);const report={checks,errors,buildingRequests:requests};await fs.writeFile(outputPath('performance-browser.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await context.close();await browser.close();}
