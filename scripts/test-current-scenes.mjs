import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium,baseURL} from './test-runtime.mjs';

const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=d3d11']});
const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
const page=await context.newPage(),errors=[],missing=[],checks=[],removedRequests=[];
const screenshots=process.argv.includes('--screenshots');
await fs.mkdir('.test-results/scenes',{recursive:true});
if(screenshots)await fs.mkdir('docs/images',{recursive:true});
page.on('pageerror',error=>errors.push(error.message));
page.on('request',request=>{if(/\/assets\/rodin-cyber(?:-city-v2)?\//.test(request.url()))removedRequests.push(request.url());});
page.on('response',response=>{if(response.status()===404&&/\/(?:assets|dist)\//.test(response.url()))missing.push(new URL(response.url()).pathname);});
const ready=id=>page.waitForFunction(id=>window.__sceneTheme?.ready&&__sceneTheme.id===id&&!__sceneTheme.switching&&window.__groupBuildings,id,{timeout:180000});
try{
 await page.goto(baseURL+'/?scene=forest');await ready('forest');
 await page.evaluate(()=>localStorage.setItem('forest-letters-scene','cyber'));
 await page.goto(baseURL+'/?scene=cyber');await ready('forest');
 assert.deepEqual(await page.locator('#scene-theme-menu [data-scene]').evaluateAll(nodes=>nodes.map(n=>n.dataset.scene)),['forest','fuji','ideal']);
 assert.equal(await page.evaluate(async()=>{try{await __sceneTheme.switch('cyber');return false;}catch{return true;}}),true,'removed scene cannot be activated programmatically');
 await page.evaluate(async()=>{await __socialStore.setDemoPaused(true);await __socialStore.addFriend('tuantuan');await __socialStore.receiveMessage('tuantuan',{text:'一起去风景里走走。'});window.__cleanupStore=__socialStore;window.__cleanupCanvas=document.querySelector('#viewport canvas');});
 for(const id of ['forest','fuji','ideal','forest']){
  if(await page.evaluate(()=>__sceneTheme.id)!==id){await page.evaluate(id=>__sceneTheme.switch(id),id);await ready(id);}
  await page.waitForFunction(()=>__groupBuildings.snapshot().buildings.length===9&&!__groupBuildings.assets.loading.length,null,{timeout:120000});
  const state=await page.evaluate(()=>({id:__sceneTheme.id,audit:__sceneTheme.audit,buildings:__groupBuildings.snapshot().buildings.length,shared:__cleanupStore===__socialStore&&__cleanupCanvas===document.querySelector('#viewport canvas')}));
  assert.equal(state.id,id);assert.equal(state.buildings,9);assert.ok(state.shared,'Scene switching preserves the social store and canvas');
  assert.deepEqual(state.audit.assetFallbacks||[],[],'Installed models load without fallback: '+id);
  checks.push({scene:id,buildings:state.buildings,adoptedAssets:state.audit.adoptedAssets});
  await page.mouse.move(1400,950);await page.waitForTimeout(800);
  if(screenshots)await page.screenshot({path:`docs/images/${id}.jpg`,type:'jpeg',quality:88});
 }
 await page.goto(baseURL+'/asset-review.html?asset=tree');
 await page.waitForFunction(()=>document.body.dataset.loaded==='tree'||document.querySelector('#viewport')?.dataset.loaded==='tree',null,{timeout:60000});
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);assert.deepEqual(removedRequests,[]);
 await fs.writeFile('.test-results/scenes/checks.json',JSON.stringify({checks,errors,missing,removedRequests,removedSceneChecks:['legacy URL and stored cyber selection fall back to forest','selector contains only forest, fuji and ideal','removed scene activation rejected','no removed scene assets requested']},null,2));
 console.log('PASS: three scenes, return switch, shared data/canvas, nine buildings, current model preview and no missing assets.');
}finally{await context.close();await browser.close();}
