import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium} from 'file:///C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=d3d11']});
const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[],checks=[];
page.on('pageerror',e=>errors.push(e.message));page.on('console',e=>{if(e.type()==='error'&&/shader|WebGL|THREE\./.test(e.text()))errors.push(e.text());});
const ready=()=>page.waitForFunction(()=>document.querySelector('#viewport').dataset.loaded==='true',null,{timeout:120000});
const shot=name=>page.screenshot({path:`validation/rodin-valley/${name}.jpg`,type:'jpeg',quality:90});
try{
 for(const mode of ['before','after']){
  await page.goto('http://localhost:8080/'+(mode==='before'?'?native-valley=1':''));await ready();
  assert.ok(await page.evaluate(()=>document.querySelector('#viewport').dataset.rodinInstances),'original generated props must also load for fair comparison');
  const loaded=await page.evaluate(()=>document.querySelector('#viewport').dataset.valleyAssets.split(',').filter(Boolean));assert.equal(loaded.length,mode==='after'?6:0);
  await page.evaluate(async()=>{await __socialStore.setDemoPaused(true);for(const id of ['tuantuan','ali','xiaomian','shanshan'])await __socialStore.addFriend(id);});await page.waitForTimeout(300);await shot(`${mode}-overview`);
  await page.evaluate(()=>__valley.view([31,19,23],[21,3,1.5]));await page.waitForFunction(()=>!__valley.snapshot().transitioning);await shot(`${mode}-plaza`);
 }
 checks.push('same camera, same brighter lighting, four friends, original assets loaded; six active new assets versus authored baseline; authored paving and seating');
 const notice=await page.evaluate(()=>__valley.screenPoint('notice'));await page.mouse.click(notice.x,notice.y);await page.locator('.valley-popover').waitFor({state:'visible'});assert.equal(await page.getByRole('button',{name:'来广场坐坐',exact:true}).count(),1);await page.keyboard.press('Escape');assert.equal(await page.locator('.valley-popover').isVisible(),false);checks.push('new notice board opens gathering invitation; Escape dismisses');
 await page.evaluate(()=>__valley.view([28,8,6],[25.7,3.2,3]));await page.waitForFunction(()=>!__valley.snapshot().transitioning);await shot('notice-detail');
 await page.route('**/rodin-valley/mountain_crag/scene.glb',route=>route.abort());await page.route('**/rodin-valley/letter_tree/scene.glb',route=>route.abort());await page.reload();await ready();const loaded=await page.evaluate(()=>document.querySelector('#viewport').dataset.valleyAssets.split(','));assert.equal(loaded.length,4);assert.ok(!loaded.includes('mountain_crag')&&!loaded.includes('letter_tree'));assert.ok((await page.evaluate(()=>__valley.gather())).ok);await page.waitForFunction(()=>!__valley.snapshot().transitioning);await shot('partial-fallback');await page.evaluate(()=>__valley.end());checks.push('individual mountain and tree failures retain functional authored fallback with other four active assets');
 assert.deepEqual(errors,[]);await fs.writeFile('validation/rodin-valley/browser.json',JSON.stringify({createdAt:new Date().toISOString(),checks,errors},null,2));console.log({checks,errors});
}finally{await browser.close();}
