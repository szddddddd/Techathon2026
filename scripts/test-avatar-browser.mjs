import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium,baseURL} from './test-runtime.mjs';
const out='.test-results/avatar-pipeline';await fs.mkdir(out,{recursive:true});
const image=await fs.readFile('assets/rodin-friends/kangaroo/portrait.webp'),glb=await fs.readFile('assets/rodin-friends/kangaroo/scene.glb');
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=d3d11']});
const context=await browser.newContext({viewport:{width:1440,height:1000},recordVideo:{dir:out+'/recordings',size:{width:1440,height:1000}}});
const page=await context.newPage(),errors=[],checks=[];page.on('pageerror',e=>errors.push(e.message));
let job=null,submits=0,complete=false;
await context.route('**/api/avatar/**',async route=>{
 const req=route.request(),p=new URL(req.url()).pathname.replace('/api/avatar/','');
 if(p.startsWith('assets/'))return route.fulfill({contentType:p.endsWith('.glb')?'model/gltf-binary':'image/webp',body:p.endsWith('.glb')?glb:image});
 if(p==='jobs'&&req.method()==='POST'){
  submits++;const data=req.postDataJSON();assert.equal(data.autoContinue,true);assert.equal(data.pinned,false);assert.ok(data.avatarBase64);assert.ok(!data.baseURL&&!data.apiKey&&!data.model);
  assert.ok(await page.evaluate(jobId=>__socialStore.state.friends.includes('avatar-'+jobId),data.requestId));
  job={id:data.requestId,name:data.name,phase:'model_processing',autoContinue:true};
 }else if(p.startsWith('jobs/')){
  if(!job)return route.fulfill({status:404,json:{error:'not created'}});
  if(complete){job.phase='ready';job.modelUrl=`/api/avatar/assets/${job.id}/scene.glb`;job.referenceUrl=`/api/avatar/assets/${job.id}/reference.img`;}
 }else return route.fulfill({status:404,json:{error:'Unknown test route'}});
 return route.fulfill({json:job});
});
const settled=async(id,state='open')=>page.waitForFunction(({id,state})=>__uiInteractions.state(id)===state,{id,state});
const shot=async name=>page.screenshot({path:`${out}/${name}.jpg`,type:'jpeg',quality:88});
async function directory(){if(await page.locator('#social').getAttribute('data-dock')==='collapsed')await page.locator('#dock-reveal').click();await page.locator('.social-dock [data-action=directory]').click();await settled('directory');}
async function addPage(){await directory();await page.locator('.contacts-add').click();await settled('add-friends');}
async function escape(id){await page.keyboard.press('Escape');await settled(id,'closed');}
async function inside(){await page.waitForFunction(()=>{const r=document.querySelector('#friend-profile').getBoundingClientRect();return r.top>=0&&r.left>=0&&r.bottom<=innerHeight+1&&r.right<=innerWidth+1;});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
try{
 await page.goto(baseURL);await page.waitForFunction(()=>window.__socialUI,null,{timeout:180000});await page.evaluate(()=>__socialStore.setDemoPaused(true));
 await addPage();await shot('desktop-add-search');assert.equal(await page.locator('.avatar-create-entry,#avatar-maker,#avatar-provider-settings').count(),0);
 await page.locator('#contact-search').fill('tuantuan');assert.equal(await page.locator('.contact-search-result').count(),1);await page.locator('[data-contact-profile=tuantuan]').click();await settled('friend-profile');await page.locator('[data-profile-action=add]').click();await page.locator('[data-profile-action=chat]').waitFor();assert.equal(submits,0);await shot('desktop-contact-profile');await page.locator('[data-profile-action=chat]').click();await settled('meeting');assert.equal(await page.locator('#meeting-name').textContent(),'团团');await escape('meeting');checks.push('normal account search → profile → add → chat; existing generated identity reused; no model wizard');
 await addPage();await page.locator('#contact-search').fill('new-friend');await page.locator('[data-new-contact]').click();await settled('friend-profile');assert.equal(await page.locator('#contact-form [name=account]').inputValue(),'new-friend');
 await page.locator('#contact-form [name=name]').fill('小鹿测试');await page.locator('#contact-form [name=signature]').fill('慢慢认识，慢慢聊。');await page.locator('#contact-form [name=avatar]').setInputFiles('assets/rodin-friends/kangaroo/portrait.webp');await page.locator('.contact-photo img').waitFor();
 await escape('friend-profile');assert.equal(await page.locator(':focus').getAttribute('class'),'contact-manual-entry');await page.locator('[data-new-contact]').click();await settled('friend-profile');assert.equal(await page.locator('#contact-form [name=name]').inputValue(),'小鹿测试');await shot('desktop-contact-add');
 await page.setViewportSize({width:391,height:844});await inside();await shot('mobile-contact-add');await page.setViewportSize({width:391,height:480});await inside();await shot('mobile-contact-short');await page.setViewportSize({width:1440,height:1000});
 await page.evaluate(()=>{const f=document.querySelector('#contact-form');f.requestSubmit();f.requestSubmit();});await page.locator('[data-profile-action=chat]').waitFor();await page.waitForFunction(()=>Object.values(__socialStore.state.customFriends||{}).some(f=>f.modelPhase==='model_processing'),null,{timeout:15000});assert.equal(submits,1);const id='avatar-'+job.id;
 assert.ok(await page.evaluate(id=>!__socialStore.state.pinnedFriends.includes(id),id));assert.equal(await page.locator('[data-profile-action=preview]').count(),0);await shot('desktop-background-model');checks.push('add saves friendship first, immediately offers chat, queues automatic avatar generation once; no pin/description/review/join steps');
 await page.locator('[data-profile-action=chat]').click();await settled('meeting');await page.locator('#chat-input').fill('模型还在准备，已经可以聊天');await escape('meeting');await page.evaluate(id=>__socialStore.receiveMessage(id,{text:'先聊起来吧。'}),id);assert.equal(await page.evaluate(id=>__characterPlacement.snapshot().characters.some(r=>r.id===id),id),false);checks.push('pending model never blocks messaging and never loads a fake scene actor');
 await page.reload();await page.waitForFunction(()=>window.__socialUI,null,{timeout:180000});await page.evaluate(()=>__socialStore.setDemoPaused(true));await page.waitForTimeout(600);assert.equal(submits,1);complete=true;
 await page.waitForFunction(id=>__socialStore.getFriend(id).modelPhase==='ready',id,{timeout:18000});await page.waitForFunction(id=>__characterPlacement.snapshot().characters.some(r=>r.id===id),id,{timeout:30000});await shot('scene-fixture-friend');
 await directory();await page.locator('#friend-search').fill('小鹿测试');await page.locator(`#directory [data-friend-row="${id}"] .conversation-more`).click();await settled('friend-menu');await page.locator(`[data-profile-friend="${id}"]`).click();await settled('friend-profile');await page.locator('[data-profile-action=preview]').click();const frame=page.frameLocator('.contact-model-preview');await frame.locator('#viewport[data-loaded="generated-avatar"]').waitFor({timeout:30000});await shot('desktop-auto-model-ready');await page.setViewportSize({width:391,height:844});await inside();await shot('mobile-auto-model-ready');await page.setViewportSize({width:1440,height:1000});
 await page.locator('[data-profile-action=chat]').click();await settled('meeting');assert.equal(await page.locator('#chat-input').inputValue(),'模型还在准备，已经可以聊天');assert.equal(await page.evaluate(()=>__socialStore.state.friends.filter(x=>x.startsWith('avatar-')).length),1);await escape('meeting');checks.push('refresh resumes same job; ready model attaches to original contact and enters scene under unread rule; no extra join click; preserves draft/identity');
 await page.emulateMedia({reducedMotion:'reduce'});await directory();await page.locator('#friend-search').fill('小鹿测试');await page.locator(`#directory [data-friend-row="${id}"] .conversation-more`).click();await settled('friend-menu');await page.locator(`[data-profile-friend="${id}"]`).click();await settled('friend-profile');assert.equal(await page.locator('#friend-profile').evaluate(e=>e.getAnimations().length),0);await escape('friend-profile');checks.push('profile menu, source focus, mobile and short viewport, reduced motion');
 assert.deepEqual(errors,[]);await fs.writeFile(`${out}/browser-results.json`,JSON.stringify({fixture:'Provider responses simulated with existing kangaroo image/model. Screenshots verify contact-first UI/integration, not new generation quality.',checks,errors,submits},null,2));console.log(JSON.stringify({checks,errors,submits},null,2));
}catch(error){await shot('browser-failure');await fs.writeFile(`${out}/browser-failure.json`,JSON.stringify({error:String(error),errors,checks},null,2));throw error;}
finally{const video=page.video();await context.close();await video.saveAs(`${out}/avatar-flow.webm`);await browser.close();}
