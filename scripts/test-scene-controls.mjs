import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium,baseURL} from './test-runtime.mjs';
const out='.test-results/scene-controls';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=d3d11']}),checks=[],errors=[],timings=[];
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});page.on('pageerror',e=>errors.push(e.message));
 const ready=()=>page.waitForFunction(()=>window.__sceneTheme?.ready&&!__sceneTheme.switching,null,{timeout:180000});
 const controls=[{handle:'#scene-controls-reveal',host:'html',key:'sceneControls',button:'.scene-switcher-option'},
 {handle:'#environment-controls-reveal',host:'#environment-controls',key:'controls',button:'#day-night-toggle'},
 {handle:'#dock-reveal',host:'#social',key:'dock',button:'.dock-button'}];
 const state=async(c,value)=>page.waitForFunction(({host,key,value})=>document.querySelector(host).dataset[key]===value,{...c,value});
 const approach=async(c)=>{const r=await page.locator(c.handle).boundingBox();await page.mouse.move(r.x+r.width/2,r.y+r.height/2);await state(c,'expanded');};
 const leave=async()=>{await page.mouse.move(5,350);};
 await page.goto(baseURL+'/?scene=ideal');await ready();await page.evaluate(()=>__socialStore.setDemoPaused(true));
 for(const c of controls)await state(c,'collapsed');
 assert.equal(await page.locator('#environment-controls #day-night-control').count(),1);assert.equal(await page.locator('#environment-controls #free-roam').count(),1);
 await page.screenshot({path:out+'/desktop-collapsed.jpg'});
 for(const c of controls){
  await approach(c);await page.waitForTimeout(150);assert.equal(await page.locator(c.button).first().isVisible(),true);
  await page.evaluate(({host,key})=>{const target=document.querySelector(host);window.__hideTiming={};const obs=new MutationObserver(()=>{if(target.dataset[key]==='collapsed'){__hideTiming.end=performance.now();obs.disconnect();}});obs.observe(target,{attributes:true});document.addEventListener('pointermove',()=>{__hideTiming.start=performance.now();},{once:true});},c);
  await leave();await page.waitForTimeout(100);assert.equal(await page.locator(c.host).getAttribute('data-'+c.key.replace(/[A-Z]/g,m=>'-'+m.toLowerCase())),'expanded');await state(c,'collapsed');
  const ms=await page.evaluate(()=>__hideTiming.end-__hideTiming.start);assert.ok(ms>=260&&ms<650,JSON.stringify({c,ms}));timings.push({handle:c.handle,ms});
 }
 checks.push('All three groups start collapsed, independently reveal on approach and collapse about 300ms after departure');
 await approach(controls[0]);await page.locator('.scene-switcher-option').click();await leave();await state(controls[0],'collapsed');assert.equal(await page.locator('#scene-theme-menu').isVisible(),false);
 await approach(controls[1]);await page.locator('#day-night-toggle').click();await page.locator('[data-time-mode=night]').click();await leave();await state(controls[1],'collapsed');assert.equal(await page.evaluate(()=>__dayNight.snapshot().mode),'night');
 await approach(controls[1]);await page.locator('#day-night-toggle').click();await leave();await state(controls[1],'collapsed');assert.equal(await page.locator('#day-night-menu').isVisible(),false);
 checks.push('Scene and time menus close on departure; mouse focus does not pin controls');
 await approach(controls[1]);await page.locator('#roam-toggle').click();await leave();await state(controls[1],'collapsed');assert.equal(await page.evaluate(()=>__freeRoam.active),true);await approach(controls[1]);await page.locator('#roam-toggle').click();assert.equal(await page.evaluate(()=>__freeRoam.active),false);await leave();await state(controls[1],'collapsed');
 await page.waitForFunction(()=>!__freeRoam.busy);checks.push('Roam continues while collapsed and can be stopped by revealing the ball again');
 await page.locator('#viewport').focus();let entered=false;for(let i=0;i<35;i++){await page.keyboard.press('Tab');entered=await page.evaluate(()=>!!document.activeElement.closest('.scene-controls-item'));if(entered)break;}assert.ok(entered);const focusedGroup=await page.evaluate(()=>document.activeElement.closest('#environment-controls')?1:0);await leave();await page.waitForTimeout(450);assert.equal(await page.locator(controls[focusedGroup].host).evaluate((el,key)=>el.dataset[key],controls[focusedGroup].key),'expanded');await page.mouse.click(5,350);await state(controls[focusedGroup],'collapsed');
 checks.push('Keyboard focus keeps controls accessible until focus leaves');
 for(const scene of ['forest','fuji','ideal']){await page.evaluate(s=>__sceneTheme.switch(s),scene);await ready();await leave();for(const c of controls)await state(c,'collapsed');assert.equal(await page.locator('#environment-controls').count(),1);}
 await approach(controls[1]);await page.screenshot({path:out+'/desktop-expanded.jpg'});await leave();
 const touch=await browser.newContext({viewport:{width:391,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'}),mobile=await touch.newPage();mobile.on('pageerror',e=>errors.push(e.message));
 await mobile.goto(baseURL+'/?scene=ideal');await mobile.waitForFunction(()=>window.__sceneTheme?.ready&&!__sceneTheme.switching,null,{timeout:180000});
 await mobile.screenshot({path:out+'/mobile-collapsed.jpg'});
 for(const c of controls)assert.ok((await mobile.locator(c.handle).boundingBox()).height>=44);
 await mobile.locator('#environment-controls-reveal').tap();await mobile.waitForTimeout(500);assert.equal(await mobile.locator('#environment-controls').getAttribute('data-controls'),'expanded');await mobile.locator('#day-night-toggle').tap();await mobile.locator('[data-time-mode=day]').tap();await mobile.screenshot({path:out+'/mobile-expanded.jpg'});
 assert.ok(await mobile.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.equal(await mobile.locator('#environment-controls-content').evaluate(el=>getComputedStyle(el).transitionDuration),'0s');
 await mobile.touchscreen.tap(5,350);await mobile.waitForFunction(()=>document.querySelector('#environment-controls').dataset.controls==='collapsed');
 await mobile.locator('#scene-controls-reveal').tap();await mobile.locator('.scene-switcher-option').tap();assert.equal(await mobile.locator('#scene-theme-menu').isVisible(),true);await mobile.touchscreen.tap(5,350);await mobile.waitForFunction(()=>document.documentElement.dataset.sceneControls==='collapsed');
 await mobile.locator('#dock-reveal').tap();await mobile.waitForTimeout(500);assert.equal(await mobile.locator('#social').getAttribute('data-dock'),'expanded');await mobile.touchscreen.tap(5,350);await mobile.waitForFunction(()=>document.querySelector('#social').dataset.dock==='collapsed');await touch.close();
 checks.push('Scene switches retain one set; touch stays open until outside tap, mobile bounds, 44px targets and reduced motion pass');
 assert.deepEqual(errors,[]);await fs.writeFile(out+'/report.json',JSON.stringify({checks,timings,errors},null,2));console.log(JSON.stringify({checks,timings,errors},null,2));
}catch(error){console.log(JSON.stringify({checks,timings,errors}));throw error;}finally{await browser.close();}
