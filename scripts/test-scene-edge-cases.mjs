import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium,baseURL} from './test-runtime.mjs';
const browser=await chromium.launch({channel:'msedge',headless:true}),page=await browser.newPage({viewport:{width:1280,height:900},reducedMotion:'reduce'}),errors=[];
page.on('pageerror',e=>errors.push(e.message));const out='validation/scene-switching';
try{
 const url=new URL(baseURL);url.searchParams.set('scene','fuji');await page.goto(url.href);await page.waitForFunction(()=>window.__sceneTheme?.ready,null,{timeout:180000});await page.evaluate(()=>__socialStore.setDemoPaused(true));
 await page.locator('.scene-switcher-toggle').hover();await page.waitForFunction(()=>__uiInteractions.state('scene-switcher')==='open');await page.mouse.move(10,800);await page.waitForFunction(()=>__uiInteractions.state('scene-switcher')==='closed',null,{timeout:6000});
 await page.locator('.scene-switcher-toggle').focus();await page.keyboard.press('ArrowRight');assert.equal(await page.evaluate(()=>document.activeElement.matches('.scene-switcher-card')),true);await page.keyboard.press('Escape');await page.waitForFunction(()=>__uiInteractions.state('scene-switcher')==='closed');
 await page.evaluate(()=>__uiInteractions.open('settings'));assert.equal(await page.locator('#scene-switcher').evaluate(el=>el.inert),true);await page.keyboard.press('Escape');await page.waitForFunction(()=>__uiInteractions.state('settings')==='closed');
 const before=await page.evaluate(()=>({id:__sceneTheme.id,store:__socialStore.state.messages.map(m=>m.id),roots:__sceneTheme.resourceSnapshot().worldRoots}));
 await page.route('**/assets/rodin/bridge/scene.glb',route=>route.abort());await page.locator('.scene-switcher-toggle').click();await page.locator('.scene-switcher-card[data-scene=forest]').click();await page.waitForFunction(()=>document.querySelector('.scene-switcher-status')?.dataset.error==='true',null,{timeout:180000});
 assert.equal(await page.evaluate(()=>__sceneTheme.id),'fuji');assert.equal(await page.evaluate(()=>__sceneTheme.switching),false);assert.equal(await page.evaluate(()=>__sceneTheme.resourceSnapshot().worldRoots),before.roots);assert.deepEqual(await page.evaluate(()=>__socialStore.state.messages.map(m=>m.id)),before.store);
 await page.unroute('**/assets/rodin/bridge/scene.glb');await page.locator('.scene-switcher-card[data-scene=forest]').click();await page.waitForFunction(()=>__sceneTheme.id==='forest'&&!__sceneTheme.switching,null,{timeout:180000});
 const count=await page.evaluate(()=>__sceneTheme.resourceSnapshot().switches);await page.locator('.scene-switcher-toggle').click();await page.locator('.scene-switcher-card[data-scene=fuji]').evaluate(b=>{b.click();b.click();});await page.waitForFunction(()=>__sceneTheme.id==='fuji'&&!__sceneTheme.switching,null,{timeout:180000});assert.equal(await page.evaluate(()=>__sceneTheme.resourceSnapshot().switches),count+1);
 assert.deepEqual(errors,[]);await fs.mkdir(out,{recursive:true});const report={checks:['hover idle collapse','keyboard choice and Esc focus return','modal disables scene picker','failed asset preparation retains current world and conversation data','retry succeeds','rapid repeated clicks commit one switch'],errors};await fs.writeFile(out+'/edge-cases.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}finally{await browser.close();}
