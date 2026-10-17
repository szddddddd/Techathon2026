import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

import {chromium,baseURL} from './test-runtime.mjs';
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=d3d11']}),out='.test-results/presence/actions';await fs.mkdir(out,{recursive:true});
const context=await browser.newContext({viewport:{width:960,height:720},recordVideo:{dir:out+'/raw',size:{width:960,height:720}}}),page=await context.newPage(),errors=[],poses=[];page.on('pageerror',e=>errors.push(e.message));
const subjects=[['tuantuan','kangaroo'],['ali','fox'],['xiaomian','rabbit'],['shanshan','bear']],states=['happy','emo','tired','busy','relax','music','exercise','travel'];
try{
 await page.goto(baseURL);await page.waitForFunction(()=>window.__socialUI,null,{timeout:180000});await page.evaluate(async()=>{await __socialStore.setDemoPaused(true);for(const id of ['tuantuan','ali','xiaomian','shanshan'])await __socialStore.addFriend(id);});
 for(const [id,animal] of subjects){
  await page.keyboard.press('Home');await page.waitForTimeout(800);await page.evaluate(async id=>{for(const f of __socialStore.state.friends)await __socialStore.setFriendPinned(f,f===id);},id);await page.waitForFunction(id=>__characterPlacement.snapshot().characters.some(r=>r.id===id),id);await page.waitForTimeout(1900);
  const pos=await page.evaluate(id=>__characterPlacement.snapshot().characters.find(r=>r.id===id).position,id);await page.evaluate(id=>{const view=__characterPlacement.reviewView(id);__valley.view(view.position,view.target);},id);await page.waitForFunction(()=>!__valley.snapshot().transitioning);
  for(const kind of states){
   await page.evaluate(({id,kind})=>__socialStore.publishStatus({kind,text:'状态动作演示'},id),{id,kind});await page.waitForTimeout(1100);
   if(kind==='happy')await page.waitForFunction(id=>__characterPlacement.snapshot().characters.find(r=>r.id===id)?.pose.jump>.10,id,{timeout:12000});
   if(kind==='tired')await page.waitForFunction(id=>__characterPlacement.snapshot().characters.find(r=>r.id===id)?.pose.lie>.94,id,{timeout:30000});
   const pose=await page.evaluate(id=>__characterPlacement.snapshot().characters.find(r=>r.id===id),id);assert.equal(pose.pose.kind,kind);assert.ok(pose.pose.bounds.minY+pose.pose.bounds.groundOffset>=-.001,'pose supported above surface');if(kind==='emo')assert.ok(pose.pose.sit>.9);if(kind==='tired')assert.ok(pose.pose.anchor.y<(id==='tuantuan'?2.1:id==='ali'?1.9:id==='xiaomian'?1.85:2)*.9+.3,'lying head anchor lowers');
   const clickable=await page.evaluate(id=>{const r=__characterPlacement.snapshot().characters.find(r=>r.id===id),a=r.pose.anchor;for(const h of [.3,.5,.7])for(const dx of [0,.15,-.15]){const p=__characterPlacement.project(r.position[0]+a.x+dx,r.position[1]+a.y*h,r.position[2]+a.z);if(__characterPlacement.pick(p.x,p.y)===id)return true;}return false;},id);assert.ok(clickable,`${animal}/${kind} remains pickable`);
   await page.screenshot({path:`${out}/${animal}-${kind}.jpg`,type:'jpeg',quality:90});poses.push({animal,kind,...pose.pose});console.log(animal+'/'+kind);await page.waitForTimeout(700);
  }
 }
 await page.emulateMedia({reducedMotion:'reduce'});await page.evaluate(()=>__socialStore.publishStatus({kind:'tired'},'shanshan'));await page.waitForTimeout(300);const rest=await page.evaluate(()=>__characterPlacement.snapshot().characters.find(r=>r.id==='shanshan').pose);assert.ok(rest.lie>.99);assert.equal(rest.jump,0);assert.deepEqual(errors,[]);await fs.writeFile(`${out}/results.json`,JSON.stringify({poses,errors,reducedMotion:rest},null,2));console.log('PASS: 32 species/state snapshots, grounded bounds, posed picking and static reduced-motion rest.');
}catch(e){await page.screenshot({path:`${out}/failure.jpg`});await fs.writeFile(`${out}/failure.json`,JSON.stringify({poses,errors,error:String(e)},null,2));throw e;}finally{const video=page.video();await context.close();await video.saveAs('.test-results/presence/state-actions.webm');await browser.close();}
