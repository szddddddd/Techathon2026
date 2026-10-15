import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL('C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs'));
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=d3d11']});
const context=await browser.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:1,reducedMotion:'reduce',recordVideo:{dir:'validation/river-recording',size:{width:1440,height:1000}}});
const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',e=>{if(e.type()==='error'&&/shader|WebGL|THREE\./i.test(e.text()))errors.push(e.text());});
const shot=name=>page.screenshot({path:`validation/river-${name}.jpg`,type:'jpeg',quality:90});
try{
 await page.goto('http://localhost:8080/');await page.waitForFunction(()=>window.__river&&window.__socialUI,null,{timeout:180000});
 await page.evaluate(async()=>{await __socialStore.setDemoPaused(true);for(const id of ['tuantuan','ali','xiaomian','shanshan'])await __socialStore.addFriend(id);});await page.waitForTimeout(400);await shot('after');
 await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForTimeout(1500);
 const performance=await page.evaluate(async()=>{const start=performance.now(),deltas=[];let last=start;await new Promise(resolve=>{const frame=now=>{deltas.push(now-last);last=now;if(now-start>=8000)resolve();else requestAnimationFrame(frame);};requestAnimationFrame(frame);});const sorted=deltas.slice().sort((a,b)=>a-b);return{duration:last-start,frames:deltas.length,averageFPS:deltas.length*1000/(last-start),p95FrameMs:sorted[Math.floor(sorted.length*.95)],...__river.stats()};});
 await page.evaluate(()=>__river.view([7,8,15],[.9,.5,3]));await page.waitForTimeout(800);await shot('bridge');await page.waitForTimeout(1800);
 await page.evaluate(()=>__river.view([7,7,18],[.8,-.1,8]));await page.waitForTimeout(800);await shot('shallows');await page.waitForTimeout(1800);
 await page.evaluate(()=>__river.view([8,4,23],[1,-.8,10.7]));await page.waitForTimeout(800);await shot('waterfall');await page.waitForTimeout(1800);
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(100);const a=await page.evaluate(()=>__river.snapshot());await page.waitForTimeout(200);assert.deepEqual(await page.evaluate(()=>__river.snapshot()),a);
 await page.reload();await page.waitForFunction(()=>window.__river&&window.__socialUI,null,{timeout:180000});await page.setViewportSize({width:391,height:844});await page.waitForTimeout(600);await shot('mobile');assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 assert.deepEqual(errors,[]);const report={createdAt:new Date().toISOString(),viewport:[1440,1000],pixelRatio:1,friends:4,performance,errors,checks:['compiled standard water shader','4 friends full scene','bridge / shallows / waterfall views','reduced motion','391px viewport']};await fs.writeFile('validation/river-browser.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));assert.ok(performance.averageFPS>=30,'average interactive frame rate must reach 30 FPS');
}finally{const video=page.video();await context.close();await video.saveAs('validation/river-motion.webm');await video.delete();await browser.close();}
