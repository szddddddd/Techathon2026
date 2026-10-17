import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium,baseURL} from './test-runtime.mjs';

await fs.mkdir('.test-results/ideal',{recursive:true});await fs.mkdir('docs/images',{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=d3d11']});
const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce',hasTouch:true}),page=await context.newPage(),errors=[],missing=[],checks=[];
page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&/\/(assets|dist)\//.test(r.url()))missing.push(new URL(r.url()).pathname);});
const ready=id=>page.waitForFunction(id=>window.__sceneTheme?.ready&&__sceneTheme.id===id&&!__sceneTheme.switching,id,{timeout:120000});
const closeChat=async()=>{await page.evaluate(()=>__socialUI.closeMeeting());await page.waitForFunction(()=>__uiInteractions.state('meeting')==='closed');};
try{
 await page.goto(baseURL+'/?scene=ideal');await ready('ideal');
 await page.evaluate(async()=>{
  await __socialStore.setDemoPaused(true);for(const id of ['tuantuan','ali','xiaomian','shanshan'])await __socialStore.addFriend(id);await __socialStore.seedGroupDemo();await __socialStore.flush();
  const request=indexedDB.open('forest-letters-social-v1',1),db=await new Promise(r=>request.onsuccess=()=>r(request.result));
  await new Promise((resolve,reject)=>{const tx=db.transaction('state','readwrite'),table=tx.objectStore('state');table.get('main').onsuccess=e=>{const s=e.target.result;s.customFriends??={};for(let i=0;i<5;i++){const id='ideal-guest-'+i;s.friends.push(id);s.customFriends[id]={id,name:'理想城旅伴'+i,animal:'fox',emoji:'🦊',height:1.9,modelUrl:'assets/rodin-friends/fox/scene.glb'};}for(const id of s.friends)s.messages.push({id:'ideal-fixture-'+id,friendId:id,senderId:id,type:'text',text:'在云海之上见面。',createdAt:Date.now(),read:true});table.put(s,'main');};tx.oncomplete=resolve;tx.onerror=reject;});db.close();
 });
 await page.reload();await ready('ideal');await page.waitForFunction(()=>__characterPlacement.snapshot().characters.length===9&&__groupBuildings.snapshot().entries.length===9);
 assert.equal(await page.locator('#scene-theme-menu [role=menuitemradio]').count(),3);
 const original=await page.evaluate(()=>({friends:[...__socialStore.state.friends],groups:__socialStore.state.groups.map(g=>g.id)}));
 await page.mouse.move(1400,950);await page.waitForTimeout(500);await page.screenshot({path:'docs/images/ideal.jpg',type:'jpeg',quality:90});
 const label=page.locator('.group-building-anchor:visible').first(),id=await label.getAttribute('data-group');await label.click();await page.waitForFunction(()=>__uiInteractions.state('meeting')==='open');
 assert.equal(await page.evaluate(()=>__socialUI.activeConversation.id),id);await page.locator('#chat-input').fill('理想城中保留的群聊草稿');await page.waitForTimeout(200);await closeChat();
 await page.evaluate(async id=>{await __socialStore.setGroupPinned(id,true);},id);await page.waitForTimeout(200);
 const idealSlot=await page.evaluate(id=>__socialStore.state.groupBuildingSlots.ideal[id],id);assert.ok(Number.isInteger(idealSlot));
 checks.push('Nine original buildings and nine friends; real group label opens correct chat; ideal pin position persisted');
 for(const scene of ['forest','fuji','ideal']){
  await page.locator('.scene-switcher-option').click();await page.locator('#scene-theme-menu [data-scene='+scene+']').click();await ready(scene);
  await page.waitForFunction(()=>!__groupBuildings.assets.loading.length);assert.equal(await page.locator('#scene-switcher').getAttribute('data-current'),scene);
 }
 assert.deepEqual(await page.evaluate(()=>({friends:[...__socialStore.state.friends],groups:__socialStore.state.groups.map(g=>g.id)})),original);
 await page.evaluate(id=>__socialUI.openConversation({kind:'group',id}),id);await page.waitForFunction(()=>__uiInteractions.state('meeting')==='open');assert.equal(await page.locator('#chat-input').inputValue(),'理想城中保留的群聊草稿');await closeChat();
 assert.equal(await page.evaluate(id=>__groupBuildings.snapshot().entries.find(e=>e.id===id).slot,id),idealSlot);
 checks.push('Three real scene-menu choices retain conversations, group draft and ideal building position');
 await page.locator('#train-station-control').click();await page.waitForFunction(()=>__vehicleFollow.snapshot().active);await page.keyboard.press('Escape');await page.waitForFunction(()=>!__vehicleFollow.busy);
 const gathering=await page.evaluate(()=>__valley.gather());assert.equal(gathering.ok,true);assert.equal(gathering.count,9);await page.evaluate(()=>__valley.end());await page.waitForFunction(()=>!__valley.snapshot().transitioning);
 for(const kind of ['accounts','scene-video']){await page.evaluate(kind=>__openSceneDiscovery(kind),kind);await page.waitForFunction(()=>__discoveryBoards.stage==='browsing');await page.keyboard.press('Escape');await page.waitForFunction(()=>__discoveryBoards.stage==='closed');}
 await page.locator('#record-player-control').click();await page.waitForFunction(()=>__uiInteractions.state('sound')==='open');await page.keyboard.press('Escape');
 checks.push('Airship follow and Esc, nine-person gathering, newspaper, video and music entrances work');
 await page.emulateMedia({reducedMotion:'no-preference'});const before=await page.evaluate(()=>__sceneTheme.snapshot());await page.waitForTimeout(700);const after=await page.evaluate(()=>__sceneTheme.snapshot());assert.ok(after.animationTime>before.animationTime);assert.ok(after.school.positions.some((p,i)=>p.some((n,k)=>Math.abs(n-before.school.positions[i][k])>.01)));assert.equal(after.vehicles.length,1);assert.equal(after.school.lanes,1);await page.emulateMedia({reducedMotion:'reduce'});
 await page.setViewportSize({width:391,height:844});await page.mouse.move(2,760);await page.waitForTimeout(600);await page.screenshot({path:'.test-results/ideal/mobile.jpg',type:'jpeg',quality:90});assert.equal(await page.locator('.scene-switcher-option').isVisible(),true);assert.ok((await page.locator('.scene-switcher-option').boundingBox()).height>=44);
 await page.locator('.group-building-anchor:not([data-unread-tier="0"]):visible .letter-stack').first().tap();await page.waitForFunction(()=>__uiInteractions.state('meeting')==='open');await closeChat();
 checks.push('Traffic advances in normal motion; reduced motion and 391px scene menu work');
 const resources=[];for(let i=0;i<3;i++){await page.evaluate(()=>__sceneTheme.switch('fuji'));await ready('fuji');await page.evaluate(()=>__sceneTheme.switch('ideal'));await ready('ideal');await page.waitForTimeout(150);resources.push(await page.evaluate(()=>__sceneTheme.resourceSnapshot()));}
 for(const r of resources){assert.equal(r.worldRoots,1);assert.equal(r.geometries,resources[0].geometries);assert.equal(r.textures,resources[0].textures);}
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);await fs.writeFile('.test-results/ideal/browser.json',JSON.stringify({checks,resources,errors,missing},null,2));console.log(JSON.stringify({checks,errors,missing}));
}catch(e){await page.screenshot({path:'.test-results/ideal/failure.jpg'});console.log(JSON.stringify({checks,errors,missing}));throw e;}finally{await context.close();await browser.close();}
