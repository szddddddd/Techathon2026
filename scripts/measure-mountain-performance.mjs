import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {chromium,baseURL} from './test-runtime.mjs';
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=d3d11']}),results=[];
try{
 for(const mode of ['before','after']){
  const bundle=mode==='before'?'.cache/mountain-before/world.js':'dist/world.js';
  const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  await context.addInitScript(()=>{let s=527;Math.random=()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296;};});
  if(mode==='before')await context.route('**/dist/world.js*',route=>route.fulfill({contentType:'text/javascript',path:bundle}));
  const page=await context.newPage();await page.goto(baseURL);await page.waitForFunction(()=>window.__socialUI&&window.__river,null,{timeout:180000});
  await page.evaluate(async()=>{await __socialStore.setDemoPaused(true);for(const id of ['tuantuan','ali','xiaomian','shanshan']){await __socialStore.addFriend(id);await __socialStore.setFriendPinned(id,true);}});
  await page.waitForTimeout(1800);
  const initialPose=await page.evaluate(()=>__discoveryScene.pose());
  await page.emulateMedia({reducedMotion:'no-preference'});
  const metrics=await page.evaluate(()=>new Promise(resolve=>{const frames=[];let last=performance.now();function sample(now){frames.push(now-last);last=now;if(frames.length<330)requestAnimationFrame(sample);else{const a=frames.slice(30).sort((a,b)=>a-b);resolve({median:a[Math.floor(a.length*.5)],p95:a[Math.floor(a.length*.95)],samples:a.length,...__river.stats(),characters:__characterPlacement.snapshot().characters.length});}}requestAnimationFrame(sample);}));
  results.push({mode,bundleSha256:createHash('sha256').update(await fs.readFile(bundle)).digest('hex'),initialPose,metrics});
  await context.close();
 }
 const report={createdAt:new Date().toISOString(),browser:await browser.version(),viewport:[1440,1000],reducedMotion:false,method:'Serial same-device Edge D3D11 runs, same random seed, default camera, four pinned actors, 30 warmup and 300 measured rAF intervals. Vsync-limited frame intervals are not GPU execution timings.',results};
 await fs.writeFile('validation/mountain-range/performance-active.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await browser.close();}
