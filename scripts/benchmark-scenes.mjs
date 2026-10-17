import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {performance} from 'node:perf_hooks';
import {chromium,baseURL} from './test-runtime.mjs';

// Run against a local server. A saved bundle allows comparison with the same
// assets, browser, server and machine, without checking out or changing sources.
const label=process.argv[2]||'sample',bundle=process.argv[3];
const out=path.resolve('.test-results/performance',label);await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=d3d11']});
const results=[];
try{
 for(const scene of ['forest','fuji','ideal']){
  const context=await browser.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:1,reducedMotion:'reduce'});
  await context.addInitScript(()=>{
   let seed=123456;Math.random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
   localStorage.setItem('forest-letters-day-night-v1',JSON.stringify({version:1,mode:'day',seconds:150}));
   window.__frameCosts=[];const request=window.requestAnimationFrame;
   window.requestAnimationFrame=callback=>request.call(window,now=>{const start=performance.now();callback(now);if(callback.name!=='sample')__frameCosts.push(performance.now()-start);});
  });
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  if(bundle)await page.route('**/dist/world.js*',route=>route.fulfill({path:path.resolve(bundle),contentType:'text/javascript'}));
  const start=performance.now();await page.goto(baseURL+'/?scene='+scene,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.querySelector('#viewport')?.dataset.loaded==='true',null,{timeout:180000});
  const readyMs=performance.now()-start;await page.evaluate(()=>__socialStore.setDemoPaused(true));
  const modes=[];
  for(const mode of ['day','dusk','night']){
   await page.evaluate(mode=>__dayNight.setMode(mode),mode);await page.waitForTimeout(500);
   const metric=await page.evaluate(async()=>{
    __frameCosts=[];const frames=[];let last;
    await new Promise(resolve=>{function sample(now){if(last!==undefined)frames.push(now-last);last=now;frames.length<90?requestAnimationFrame(sample):resolve();}requestAnimationFrame(sample);});
    const summary=values=>{const s=[...values].sort((a,b)=>a-b);return{median:s[Math.floor(s.length*.5)],p95:s[Math.floor(s.length*.95)]};};
    return{frameCPU:summary(__frameCosts),frames:summary(frames),resources:__sceneTheme.resourceSnapshot(),audit:__sceneTheme.audit,night:__dayNight.effects()};
   });
   await page.locator('#viewport canvas').screenshot({path:path.join(out,scene+'-'+mode+'.png')});
   modes.push({mode,...metric});
  }
  await page.setViewportSize({width:391,height:844});await page.waitForTimeout(500);
  await page.locator('#viewport canvas').screenshot({path:path.join(out,scene+'-mobile.png')});
  assert.deepEqual(errors,[]);results.push({scene,readyMs,modes,errors});await context.close();
 }
 await fs.writeFile(path.join(out,'report.json'),JSON.stringify({label,conditions:{browser:'Edge headless D3D11',viewport:[1440,1000],reducedMotion:true,seed:123456,frames:90},results},null,2));
 console.log(JSON.stringify({label,results:results.map(({scene,readyMs,modes,errors})=>({scene,readyMs,modes:modes.map(({mode,frameCPU,frames,resources})=>({mode,frameCPU,frames,calls:resources.calls,triangles:resources.triangles})),errors}))},null,2));
}finally{await browser.close();}
