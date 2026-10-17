import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium,baseURL} from './test-runtime.mjs';
const output='.test-results/day-night';await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=d3d11']});
const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),page=await context.newPage(),errors=[],checks=[],performanceReport=[],resources=[];
let passed=false;
page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error'&&!m.text().startsWith('Failed to load resource:'))errors.push(m.text().slice(0,700));});
const ready=id=>page.waitForFunction(id=>window.__sceneTheme?.ready&&__sceneTheme.id===id&&!__sceneTheme.switching,id,{timeout:180000});
const mode=async value=>{await page.evaluate(value=>__dayNight.setMode(value),value);await page.waitForTimeout(180);};
async function measure(){return page.evaluate(()=>new Promise(resolve=>{const values=[];let last;function tick(now){if(last)values.push(now-last);last=now;if(values.length<150)requestAnimationFrame(tick);else{values.sort((a,b)=>a-b);resolve({median:values[75],p95:values[142],mean:values.reduce((a,b)=>a+b,0)/values.length});}}requestAnimationFrame(tick);}));}
try{
 await page.goto(baseURL+'/?scene=forest');await ready('forest');
 await page.evaluate(async()=>{await __socialStore.setDemoPaused(true);for(const id of ['tuantuan','ali','xiaomian']){await __socialStore.addFriend(id);await __socialStore.receiveMessage(id,{type:'text',text:'一起看夜景。'});}await __socialStore.seedGroupDemo();await __socialStore.flush();});
 await page.waitForFunction(()=>__characterPlacement.snapshot().characters.length>=3&&__groupBuildings.snapshot().entries.length>0);
 for(const theme of ['forest','fuji','ideal']){
  if(theme!=='forest'){await page.evaluate(id=>__sceneTheme.switch(id),theme);await ready(theme);assert.equal(await page.evaluate(()=>__dayNight.snapshot().mode),'night');}
  for(const value of ['day','dusk','night']){await mode(value);await page.mouse.move(5,400);await page.screenshot({path:`${output}/${theme}-${value}.jpg`,type:'jpeg',quality:91});}
  assert.ok(await page.evaluate(()=>__dayNight.effects().factor===1));
  const label=page.locator('.group-building-anchor:visible').first();await label.click();await page.waitForFunction(()=>__uiInteractions.state('meeting')==='open');await page.evaluate(()=>__socialUI.closeMeeting());await page.waitForFunction(()=>__uiInteractions.state('meeting')==='closed'&&!__groupCamera.busy&&__sceneTheme.resourceSnapshot().controls.enabled);await page.waitForTimeout(200);
  // Exercise an actual visible model drag with placement collision validation.
  const drag=await page.evaluate(()=>{for(const r of __characterPlacement.snapshot().characters){const [x,y,z]=r.position;let point;for(const dy of [1,.65,1.3])for(const dx of [0,.2,-.2]){const p=__characterPlacement.project(x+dx,y+dy,z);if(p.x>5&&p.x<innerWidth-5&&p.y>80&&p.y<innerHeight-80&&__characterPlacement.pick(p.x,p.y)===r.id&&document.elementFromPoint(p.x,p.y)?.tagName==='CANVAS')point=p;}if(!point)continue;for(const radius of [1.4,2,2.6])for(let a=0;a<Math.PI*2;a+=Math.PI/8){const nx=x+Math.cos(a)*radius,nz=z+Math.sin(a)*radius;if(__characterPlacement.inspect(r.id,nx,nz).ok)return{id:r.id,point,x:nx,z:nz};}}});
  assert.ok(drag,theme+' selectable character');await page.mouse.move(drag.point.x,drag.point.y);await page.mouse.down();
  const target=await page.evaluate(({x,z})=>{const s=__characterPlacement.snapshot(),p=__characterPlacement.project(x,__valley.sample(x,z).height,z);return{x:p.x-s.footOffset.x,y:p.y-s.footOffset.y};},drag);await page.mouse.move(target.x,target.y,{steps:12});await page.mouse.up();await page.waitForFunction(()=>!__characterPlacement.snapshot().active);assert.equal(await page.evaluate(()=>__characterPlacement.snapshot().lastResult.ok),true);
  const gathering=await page.evaluate(()=>__valley.gather());assert.equal(gathering.ok,theme!=='ideal');if(theme==='ideal')assert.equal(await page.locator('.valley-popover').count(),0);else{await page.evaluate(()=>__valley.end());await page.waitForFunction(()=>!__valley.snapshot().transitioning);}
  for(const kind of ['accounts','scene-video']){await page.evaluate(kind=>__openSceneDiscovery(kind),kind);await page.waitForFunction(()=>__discoveryBoards.stage==='browsing');await page.keyboard.press('Escape');await page.waitForFunction(()=>__discoveryBoards.stage==='closed');}
  await page.locator('#record-player-control').click();await page.waitForFunction(()=>__uiInteractions.state('sound')==='open');await page.keyboard.press('Escape');await page.waitForFunction(()=>__uiInteractions.state('sound')==='closed');
  if(await page.locator('#train-station-control').count()){await page.locator('#train-station-control').click();await page.waitForFunction(()=>__vehicleFollow.snapshot().active);await page.keyboard.press('Escape');await page.waitForFunction(()=>!__vehicleFollow.busy);}
  checks.push(theme+': night group chat, real model drag, '+(theme==='ideal'?'removed reception':'gathering')+', news, video, music and vehicle follow');
  await page.keyboard.press('Home');await page.waitForTimeout(300);
  // Alternating trials reduce warmup/order bias; reduced motion keeps geometry fixed.
  const trials=[];for(const value of ['day','night','night','day']){await mode(value);trials.push({mode:value,...await measure()});}
  const avg=value=>trials.filter(t=>t.mode===value).reduce((a,t)=>a+t.mean,0)/2;performanceReport.push({theme,trials,nightOverDay:avg('night')/avg('day')-1});
  await mode('night');await page.setViewportSize({width:391,height:844});await page.waitForTimeout(350);
  await page.mouse.move(page.viewportSize().width-40,36);
  await page.locator('#day-night-toggle').click();assert.ok(await page.locator('#day-night-menu').isVisible());
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));const boxes=await page.evaluate(()=>['#scene-switcher','#day-night-toggle','#roam-toggle'].map(s=>{const r=document.querySelector(s)?.getBoundingClientRect();return r?{x:r.x,right:r.right,y:r.y,bottom:r.bottom}:null;}));assert.ok(boxes[1].x>=0);assert.ok(!boxes[2]||boxes[1].right<=boxes[2].x);
  await page.keyboard.press('Escape');await page.screenshot({path:`${output}/${theme}-mobile-night.jpg`,type:'jpeg',quality:91});await page.setViewportSize({width:1440,height:1000});
 }
 await page.mouse.move(page.viewportSize().width-40,36);
 await page.locator('#day-night-toggle').focus();await page.keyboard.press('ArrowDown');await page.keyboard.press('End');assert.equal(await page.locator('[data-time-mode=night]').evaluate(el=>el===document.activeElement),true);await page.keyboard.press('Enter');
 await page.emulateMedia({reducedMotion:'no-preference'});await page.evaluate(()=>__dayNight.setMode('day'));await page.waitForTimeout(500);assert.equal(await page.evaluate(()=>__dayNight.snapshot().transitioning),true);await page.waitForFunction(()=>!__dayNight.snapshot().transitioning);
 await page.evaluate(()=>__dayNight.setMode('auto'));const before=await page.evaluate(()=>__dayNight.snapshot().seconds);await page.waitForTimeout(500);assert.ok(await page.evaluate(()=>__dayNight.snapshot().seconds)>before);
 // Headless Edge keeps every page visible, so inject the visibility event contract.
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});const preFreeze=await page.evaluate(()=>__dayNight.snapshot().seconds);await page.waitForTimeout(900);assert.equal(await page.evaluate(()=>__dayNight.snapshot().seconds),preFreeze);await page.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));});await page.waitForTimeout(100);assert.ok((await page.evaluate(()=>__dayNight.snapshot().seconds))-preFreeze<.5);
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(100);const paused=await page.evaluate(()=>__dayNight.snapshot().seconds);await page.waitForTimeout(300);assert.equal(await page.evaluate(()=>__dayNight.snapshot().seconds),paused);
 await mode('night');await page.reload();await ready('ideal');assert.equal(await page.evaluate(()=>__dayNight.snapshot().mode),'night');assert.equal(await page.evaluate(()=>__dayNight.effects().factor),1);
 for(let i=0;i<3;i++){for(const theme of ['forest','fuji','ideal']){await page.evaluate(id=>__sceneTheme.switch(id),theme);await ready(theme);}await page.waitForTimeout(250);resources.push(await page.evaluate(()=>__sceneTheme.resourceSnapshot()));}
 assert.equal(resources[0].textures,resources[2].textures);assert.equal(resources[0].geometries,resources[2].geometries);assert.equal(resources[2].worldRoots,1);
 checks.push('Simulated background visibility pause/resume, keyboard menu, 2-second transition, auto advance, reduced-motion pause, persistence and stable repeated-switch resources');
 for(const result of performanceReport)assert.ok(result.nightOverDay<=.15,result.theme+' night frame interval stays within 15%');
 assert.deepEqual(errors,[]);
 // A failed first visit must leave the old world and clock intact.
 const recovery=await context.newPage();await recovery.goto(baseURL+'/?scene=forest');await recovery.waitForFunction(()=>window.__sceneTheme?.ready,null,{timeout:180000});await recovery.route('**/assets/ideal-city/**/scene.glb',r=>r.abort());await recovery.route('**/assets/ideal-city/scene.glb',r=>r.abort());const rollback=await recovery.evaluate(async()=>{__dayNight.setMode('night');let failed=false;try{await __sceneTheme.switch('ideal');}catch{failed=true;}return{failed,theme:__sceneTheme.id,night:__dayNight.effects().factor,mode:__dayNight.snapshot().mode,roots:__sceneTheme.resourceSnapshot().worldRoots};});assert.deepEqual(rollback,{failed:true,theme:'forest',night:1,mode:'night',roots:1});await recovery.close();checks.push('Failed scene load preserves previous night environment and clock');passed=true;
}catch(error){await page.screenshot({path:output+'/failure.jpg',type:'jpeg'});throw error;}
finally{await fs.writeFile(output+'/report.json',JSON.stringify({passed,checks,errors,performance:performanceReport,resources},null,2));await browser.close();}
console.log(JSON.stringify({checks,errors,performance:performanceReport}));
