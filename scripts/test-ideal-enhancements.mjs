import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {chromium,baseURL} from './test-runtime.mjs';
const out='.test-results/ideal-assets';await fs.mkdir(out+'/video',{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1000},recordVideo:{dir:out+'/video',size:{width:1280,height:900}}});
const page=await context.newPage(),errors=[],phases=[];page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto(baseURL+'/?scene=ideal');await page.waitForFunction(()=>window.__sceneTheme?.ready&&!__sceneTheme.switching,{}, {timeout:120000});
 await page.evaluate(async()=>{await __socialStore.setDemoPaused(true);await __socialStore.addFriend('tuantuan');await __socialStore.receiveMessage('tuantuan',{type:'text',text:'来看新车流！'});});
 await page.mouse.move(1400,930);await page.waitForTimeout(500);
 assert.equal(await page.evaluate(()=>__sceneTheme.snapshot().school.count),18);assert.equal(await page.evaluate(()=>__sceneTheme.snapshot().school.lanes),1);assert.equal(await page.evaluate(()=>__sceneTheme.snapshot().vehicles.length),1);assert.equal(await page.evaluate(()=>__sceneTheme.audit.airwayCount),2);
 await page.screenshot({path:out+'/airship-docked.jpg',type:'jpeg',quality:90});
 if(process.argv.includes('--cycle')){
  for(const phase of ['taking-off','cruising','landing','docked']){await page.waitForFunction(p=>__sceneTheme.snapshot().flight.phase===p,phase,{timeout:75000});await page.waitForTimeout(1200);phases.push(await page.evaluate(()=>__sceneTheme.snapshot().flight));await page.screenshot({path:out+'/airship-'+phase+'.jpg',type:'jpeg',quality:90});console.log('Observed '+phase);}
 }
 await page.screenshot({path:'docs/images/ideal.jpg',type:'jpeg',quality:92});
 await page.evaluate(()=>__discoveryScene.focus('accounts',{duration:300}));await page.waitForTimeout(200);assert.ok(await page.evaluate(()=>__discoveryScene.kiosk.userData.holographic));await page.screenshot({path:out+'/hologram-news.jpg',type:'jpeg',quality:92});
 const point=await page.evaluate(()=>__discoveryScene.screenPoint('accounts'));await page.mouse.click(point.x,point.y);await page.waitForFunction(()=>__discoveryBoards.stage==='browsing');await page.keyboard.press('Escape');await page.waitForFunction(()=>__discoveryBoards.stage==='closed');
 await page.evaluate(()=>__discoveryScene.focus('scene-video',{duration:300}));await page.waitForTimeout(200);await page.screenshot({path:out+'/hologram-video.jpg',type:'jpeg',quality:92});await page.evaluate(()=>__discoveryScene.restore({duration:300}));
 await page.setViewportSize({width:391,height:844});await page.waitForTimeout(500);assert.equal(await page.evaluate(()=>__sceneTheme.snapshot().school.count),10);await page.screenshot({path:'.test-results/ideal/mobile.jpg',type:'jpeg',quality:90});
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(100);const frozen=await page.evaluate(()=>__sceneTheme.snapshot());await page.waitForTimeout(400);const after=await page.evaluate(()=>__sceneTheme.snapshot());assert.deepEqual(after.school,frozen.school);assert.equal(after.flight.phase,'docked');assert.deepEqual(errors,[]);
 await fs.writeFile(out+'/enhancements.json',JSON.stringify({errors,phases,desktopCars:18,mobileCars:10,schools:1,visibleAircraft:1,airways:2},null,2));console.log('PASS: one school, one airship, two corridors, physical hologram click, mobile and reduced motion.');
}finally{const video=page.video();await context.close();await video.saveAs(out+'/traffic-and-holograms.webm');await browser.close();}
