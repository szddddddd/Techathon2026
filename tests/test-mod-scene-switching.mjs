import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium,baseURL} from './test-runtime.mjs';
import {seedPlacedFacilities} from './fixtures/placed-facilities.mjs';
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=d3d11']});
const page=await browser.newPage({viewport:{width:1280,height:900},reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto(baseURL+'/?scene=forest');await page.waitForFunction(()=>window.__sceneTheme?.ready,null,{timeout:180000});await page.evaluate(async()=>{await __socialStore.setDemoPaused(true);for(const id of ['tuantuan','ali','xiaomian','shanshan']){await __socialStore.addFriend(id);await __socialStore.receiveMessage(id,{text:'连续切换测试'},'mod-switch-'+id);await __socialStore.markRead(id);}});
 const baselines={},rounds=[];
 for(let round=0;round<=5;round++)for(const id of ['fuji','ideal','forest']){
  await page.evaluate(id=>__sceneTheme.switch(id),id);await page.waitForFunction(()=>__sceneTheme.ready&&!__sceneTheme.switching);await seedPlacedFacilities(page);await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  const sample=await page.evaluate(()=>({scene:__sceneTheme.id,resources:__sceneTheme.resourceSnapshot(),mods:__mods.diagnostics(),facilities:[__discoveryScene.kiosk.visible,__discoveryScene.cinema.visible]}));
  assert.equal(sample.resources.worldRoots,1);assert.deepEqual(sample.facilities,[true,true]);
  if(!round)baselines[id]=sample;else{assert.ok(sample.resources.geometries<=baselines[id].resources.geometries+2,`${id} geometry must stabilize`);assert.ok(sample.resources.textures<=baselines[id].resources.textures+1,`${id} textures must stabilize`);assert.equal(sample.mods.listeners,baselines[id].mods.listeners);rounds.push({round,...sample});}
 }
 assert.deepEqual(errors,[]);await fs.mkdir('.test-results/workshop',{recursive:true});await fs.writeFile('.test-results/workshop/switch-stability.json',JSON.stringify({ok:true,baseline:baselines,rounds,errors},null,2));console.log('PASS: five complete three-scene cycles retain one scene root, stable geometry/textures and stable module listeners.');
}finally{await browser.close();}
