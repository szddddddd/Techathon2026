import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL('C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs'));
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=d3d11']});
const errors=[],checks=[],out='validation';await fs.mkdir(out,{recursive:true});
const boot=async p=>{p.on('pageerror',e=>errors.push(e.message));await p.goto('http://localhost:8080/');await p.waitForFunction(()=>window.__discoveryBoards,null,{timeout:180000});await p.evaluate(()=>__discoveryScene.previewsReady);await p.evaluate(()=>__socialStore.setDemoPaused(true));};
const waitStage=(p,s)=>p.waitForFunction(s=>__discoveryBoards.stage===s,s,{timeout:15000});
const screenshot=(p,name)=>p.screenshot({path:`${out}/one-click-${name}.jpg`,type:'jpeg',quality:88});
const open=(p,kind)=>p.evaluate(kind=>{__openSceneDiscovery(kind);},kind);
try{
 for(const [kind,name] of [['accounts','kiosk'],['scene-video','cinema']]){
  const ctx=await browser.newContext({viewport:{width:1440,height:1000},recordVideo:{dir:'validation/recordings',size:{width:1440,height:1000}}}),p=await ctx.newPage();await boot(p);
  const original=await p.evaluate(()=>__discoveryScene.pose());await screenshot(p,`${name}-overview`);await p.waitForTimeout(650);
  await open(p,kind);await p.waitForTimeout(510);await screenshot(p,`${name}-approach`);await p.waitForTimeout(200);await screenshot(p,`${name}-morph`);
  await waitStage(p,'browsing');await p.waitForTimeout(350);await screenshot(p,`${name}-window`);
  assert.equal(await p.locator('[data-d-action=expand]').count(),0);assert.ok(await p.locator('#discovery-dialog').evaluate(el=>el.open));
  const frame=await p.locator('#discovery-dialog').getAttribute('data-frame');assert.equal(frame,kind==='accounts'?'journal':'cinema');
  const fit=await p.evaluate(()=>__discoveryBoards.surfaceRect());assert.ok(fit.height/1000>.72&&fit.height/1000<.9,'closer surface fit');
  if(kind==='scene-video'){await p.waitForFunction(()=>__contentPlayer.video.readyState>=3&&!__contentPlayer.video.paused);await p.waitForTimeout(1400);}
  else await p.waitForTimeout(1400);
  await p.mouse.click(4,4);await p.waitForTimeout(200);await screenshot(p,`${name}-return`);await waitStage(p,'closed');await p.waitForTimeout(800);
  assert.ok(await p.evaluate(()=>__contentPlayer.video.paused));const restored=await p.evaluate(()=>__discoveryScene.pose());assert.ok(Math.hypot(...restored.position.map((v,i)=>v-original.position[i]))<.001,'camera restored');assert.equal(restored.enabled,original.enabled);
  checks.push(`${name}: automatic open, themed frame, closer fit, one-click exit and exact camera restore`);
  const recording=p.video();await ctx.close();await recording.saveAs(`${out}/one-click-${name}-journey.webm`);await recording.delete();
 }
 const ctx=await browser.newContext({viewport:{width:1440,height:1000}}),p=await ctx.newPage();await boot(p);
 await open(p,'accounts');await waitStage(p,'browsing');await p.locator('.d-content-card[data-id=article-1]').click();await p.locator('#d-comment-text').fill('关闭后仍要保留的评论草稿');await p.locator('.discovery-body').evaluate(el=>el.scrollTop=720);await p.waitForTimeout(500);
 await p.mouse.click(4,4);await waitStage(p,'closed');await open(p,'accounts');await waitStage(p,'browsing');assert.equal(await p.evaluate(()=>__discoveryUI.route.id),'article-1');assert.ok(Math.abs(await p.locator('.discovery-body').evaluate(el=>el.scrollTop)-720)<5);assert.equal(await p.locator('#d-comment-text').inputValue(),'关闭后仍要保留的评论草稿');await p.keyboard.press('Escape');await waitStage(p,'closed');checks.push('article, scroll and comment draft restored');
 await open(p,'scene-video');await waitStage(p,'browsing');await p.waitForFunction(()=>!__contentPlayer.video.paused&&__contentPlayer.video.readyState>=3);await p.locator('.d-video-seek').fill('50');await p.waitForFunction(()=>__contentPlayer.video.currentTime>5.5);await p.locator('.d-player-controls [data-d-action=play]').click();const paused=await p.evaluate(()=>__contentPlayer.video.currentTime);await p.evaluate(()=>window.__sameVideo=__contentPlayer.video);
 await p.mouse.click(4,4);await waitStage(p,'closed');await open(p,'scene-video');await waitStage(p,'browsing');assert.ok(await p.evaluate(()=>__contentPlayer.video.paused));assert.ok(Math.abs((await p.evaluate(()=>__contentPlayer.video.currentTime))-paused)<.3);assert.ok(await p.evaluate(()=>__sameVideo===__contentPlayer.video));await p.keyboard.press('Escape');await waitStage(p,'closed');checks.push('single video, seek, progress and paused intent preserved');
 await p.route('**/video-6.webm',async route=>{await new Promise(r=>setTimeout(r,2200));await route.continue();});await p.evaluate(()=>{__discoveryBoards.open('scene-video',{type:'video',id:'video-6'});});await p.waitForTimeout(720);await p.keyboard.press('Escape');await waitStage(p,'closed');await p.waitForTimeout(2600);assert.ok(await p.evaluate(()=>__contentPlayer.video.paused));await p.unroute('**/video-6.webm');checks.push('late media fetch stays paused after exit');
 await p.evaluate(()=>{__openSceneDiscovery('accounts');__openSceneDiscovery('scene-video');});await waitStage(p,'browsing');assert.equal(await p.evaluate(()=>__discoveryBoards.kind),'scene-video');await p.mouse.click(4,4);await waitStage(p,'closed');checks.push('rapid switch keeps last selection');
 await p.setViewportSize({width:391,height:844});await open(p,'accounts');await waitStage(p,'browsing');await screenshot(p,'mobile-accounts');assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await p.keyboard.press('Escape');await waitStage(p,'closed');
 await open(p,'scene-video');await waitStage(p,'browsing');await screenshot(p,'mobile-video');await p.setViewportSize({width:844,height:391});await p.waitForTimeout(400);assert.ok(await p.locator('#discovery-dialog').evaluate(el=>el.getBoundingClientRect().width<=innerWidth));await p.keyboard.press('Escape');await waitStage(p,'closed');checks.push('391px mobile and orientation changes');
 await p.emulateMedia({reducedMotion:'reduce'});await open(p,'accounts');await waitStage(p,'browsing');await p.mouse.click(4,4);await waitStage(p,'closed');checks.push('reduced motion fade');
 const dockPose=await p.evaluate(()=>__discoveryScene.pose());await p.locator('[data-action=discover]').click();await p.locator('[data-d-action=accounts]').click();assert.equal(await p.locator('#discovery-dialog').getAttribute('data-frame'),'journal');const dockAfter=await p.evaluate(()=>__discoveryScene.pose());assert.ok(Math.hypot(...dockAfter.position.map((v,i)=>v-dockPose.position[i]))<.001);assert.equal(dockAfter.enabled,dockPose.enabled);checks.push('dock entry preserves camera');
 await ctx.close();assert.deepEqual(errors,[]);await fs.writeFile(`${out}/one-click-browser.json`,JSON.stringify({createdAt:new Date().toISOString(),errors,checks},null,2));console.log(JSON.stringify({errors,checks},null,2));
}finally{await browser.close();}
