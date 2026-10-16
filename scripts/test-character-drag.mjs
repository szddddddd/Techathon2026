import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium,baseURL,outputDir,outputPath} from './test-runtime.mjs';
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=d3d11']});
const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[],checks=[];
page.on('pageerror',e=>errors.push(e.message));
await page.addInitScript(()=>{let seed=527;Math.random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};});
const snapshot=()=>page.evaluate(()=>__characterPlacement.snapshot());
const distance=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
async function pickPoint(id){return page.evaluate(id=>{
 const record=__characterPlacement.snapshot().characters.find(r=>r.id===id);if(!record)return null;const [x,y,z]=record.position;
 for(const dy of [1,.65,1.3,.35,1.6])for(const dx of [0,.2,-.2,.4,-.4]){
  const p=__characterPlacement.project(x+dx,y+dy,z);if(p.x<5||p.x>innerWidth-5||p.y<5||p.y>innerHeight-5)continue;
  if(__characterPlacement.pick(p.x,p.y)===id&&document.elementFromPoint(p.x,p.y)?.tagName==='CANVAS')return p;
 }return null;
},id);}
async function start(id){const p=await pickPoint(id);assert.ok(p,`${id} has a visible, selectable model`);await page.mouse.move(p.x,p.y);await page.mouse.down();assert.equal((await snapshot()).active,id);}
async function moveTo(x,z){const p=await page.evaluate(({x,z})=>{const s=__characterPlacement.snapshot();const p=__characterPlacement.project(x,__valley.sample(x,z).height,z);return{x:p.x-s.footOffset.x,y:p.y-s.footOffset.y};},{x,z});await page.mouse.move(p.x,p.y,{steps:12});return snapshot();}
async function end(){await page.mouse.up();await page.waitForFunction(()=>!__characterPlacement.snapshot().active);return snapshot();}
async function safeDestination(id){return page.evaluate(id=>{
 const r=__characterPlacement.snapshot().characters.find(r=>r.id===id),[x,,z]=r.position;
 for(const radius of [1.4,2,2.6,3.3,4.2])for(let a=Math.PI/2;a<Math.PI*2.5;a+=Math.PI/8){const nx=x+Math.cos(a)*radius,nz=z+Math.sin(a)*radius;if(__characterPlacement.inspect(id,nx,nz).ok&&[[.7,0],[-.7,0],[0,.7],[0,-.7]].every(([dx,dz])=>__characterPlacement.inspect(id,nx+dx,nz+dz).ok))return{x:nx,z:nz};}return null;
},id);}
try{
 await page.goto(baseURL+'/');await page.waitForFunction(()=>window.__characterPlacement&&window.__socialUI,null,{timeout:180000});
 await page.evaluate(async()=>{await __socialStore.setDemoPaused(true);for(const id of ['tuantuan','ali','xiaomian']){await __socialStore.addFriend(id);await __socialStore.setFriendPinned(id,true);}});await page.waitForTimeout(300);

 const available=[];for(const id of ['tuantuan','ali','xiaomian','shanshan'])if(await pickPoint(id))available.push(id);assert.ok(available.length>=2);
 const id=available[0],original=(await snapshot()).characters.find(r=>r.id===id).position;
 await start(id);const target=await safeDestination(id);assert.ok(target);let s=await moveTo(target.x,target.z);assert.ok(s.candidate.ok);const camera=await page.evaluate(()=>__discoveryScene.pose());
 await page.screenshot({path:outputPath('character-drag-valid.jpg'),type:'jpeg',quality:88});s=await end();assert.ok(s.lastResult.ok);assert.equal(await page.evaluate(()=>__socialUI.activeFriend),null);
 let record=s.characters.find(r=>r.id===id);assert.ok(distance(original,record.position)>1);assert.ok(distance([target.x,record.position[1],target.z],record.position)<.01);assert.deepEqual(await page.evaluate(()=>__discoveryScene.pose()),{...camera,enabled:true});
 const saved={x:target.x,z:target.z};assert.deepEqual(await page.evaluate(()=>__socialStore.state.characterPositions||{}),{});checks.push('real model drag changes only this stay, preserves camera and stored historical positions');
 await start(id);s=await moveTo(0,0);assert.equal(s.candidate.ok,false);await page.screenshot({path:outputPath('character-drag-invalid.jpg'),type:'jpeg',quality:88});s=await end();assert.equal(s.lastResult.ok,false);assert.ok(distance(record.position,s.characters.find(r=>r.id===id).position)<.001);checks.push('river placement rejected, returns to origin');

 const other=s.characters.find(r=>r.id!==id);await start(id);s=await moveTo(other.position[0],other.position[2]);assert.equal(s.candidate.ok,false);await end();checks.push('friend overlap rejected');
 await start(id);const target2=await safeDestination(id);await moveTo(target2.x,target2.z);await page.keyboard.press('Escape');await page.mouse.up();s=await snapshot();assert.equal(s.active,null);assert.ok(distance(record.position,s.characters.find(r=>r.id===id).position)<.001);checks.push('Escape cancels and restores controls');
 // A simple click must still take the original chat route.
 const p=await pickPoint(id);await page.mouse.click(p.x,p.y);await page.waitForFunction(id=>__socialUI.activeFriend===id,id);await page.evaluate(()=>__socialUI.closeMeeting());await page.waitForTimeout(100);
 await page.reload();await page.waitForFunction(()=>window.__characterPlacement&&window.__socialStore,null,{timeout:180000});await page.waitForFunction(id=>__characterPlacement.snapshot().characters.some(r=>r.id===id),id);s=await snapshot();record=s.characters.find(r=>r.id===id);assert.deepEqual(await page.evaluate(()=>__socialStore.state.characterPositions||{}),{});checks.push('refresh creates a new valid entry without writing coordinates; single click still chats');
 // Adding a friend must not reset manually placed companions.
 const stable=await snapshot();await page.evaluate(()=>__socialStore.addFriend('shanshan'));const added=await snapshot();for(const r of stable.characters)assert.deepEqual(added.characters.find(c=>c.id===r.id).position,r.position);checks.push('adding another friend preserves existing placements');
 await page.setViewportSize({width:391,height:844});await page.waitForTimeout(200);const touchId=(await snapshot()).characters.find(r=>r.id===id)?.id;
 // Random entry can be hidden by a tree or a label in the portrait overview.
 // Frame the actual actor before testing touch, without changing its placement.
 await page.evaluate(id=>{const [x,y,z]=__characterPlacement.snapshot().characters.find(r=>r.id===id).position;__valley.view([x+8,y+12,z+17],[x,y+.5,z]);},touchId);await page.waitForFunction(()=>!__valley.snapshot().transitioning);assert.ok(await pickPoint(touchId));
 const cdp=await page.context().newCDPSession(page);const tp=await pickPoint(touchId);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:tp.x,y:tp.y}]});assert.equal((await snapshot()).active,touchId);
 const touchTarget=await safeDestination(touchId);const endPoint=await page.evaluate(t=>{const s=__characterPlacement.snapshot();const p=__characterPlacement.project(t.x,__valley.sample(t.x,t.z).height,t.z);return{x:p.x-s.footOffset.x,y:p.y-s.footOffset.y};},touchTarget);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:endPoint.x,y:endPoint.y}]});await page.screenshot({path:outputPath('character-drag-mobile.jpg'),type:'jpeg',quality:88});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForFunction(()=>!__characterPlacement.snapshot().active);assert.ok((await snapshot()).lastResult.ok);checks.push('real mobile touch drag places character');
 await page.evaluate(id=>__socialStore.clearStatus(id),touchId);const landed=(await snapshot()).characters.find(r=>r.id===touchId).position;await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForFunction(({id,landed})=>{const p=__characterPlacement.snapshot().characters.find(r=>r.id===id).position;return Math.hypot(p[0]-landed[0],p[2]-landed[2])>.08;},{id:touchId,landed},{timeout:12000});checks.push('walking resumes around the newly placed home');
 assert.deepEqual(errors,[]);const report={createdAt:new Date().toISOString(),checks,errors};await fs.writeFile(outputPath('character-drag.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));

}finally{await browser.close();}
