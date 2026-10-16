import fs from 'node:fs/promises';
import {chromium,baseURL} from './test-runtime.mjs';
const mode=process.argv[2]||'after',out='validation/mountain-range';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=d3d11']});
const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce',...(mode==='after'?{recordVideo:{dir:out+'/recordings',size:{width:1440,height:1000}}}:{})});
await context.addInitScript(()=>{let s=527;Math.random=()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296;};});
if(mode==='before')await context.route('**/dist/world.js*',route=>route.fulfill({contentType:'text/javascript',path:'.cache/mountain-before/world.js'}));
const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto(baseURL);await page.waitForFunction(()=>window.__socialUI&&window.__valley,null,{timeout:180000});
 await page.evaluate(async()=>{await __socialStore.setDemoPaused(true);for(const id of ['tuantuan','ali','xiaomian','shanshan']){await __socialStore.addFriend(id);await __socialStore.setFriendPinned(id,true);}});await page.waitForTimeout(1800);
 await page.screenshot({path:`${out}/${mode}-desktop.jpg`,type:'jpeg',quality:92});
 const metrics=await page.evaluate(()=>new Promise(resolve=>{const times=[];let last=performance.now();function frame(now){times.push(now-last);last=now;if(times.length<210)requestAnimationFrame(frame);else{const a=times.slice(30).sort((a,b)=>a-b);resolve({median:a[Math.floor(a.length*.5)],p95:a[Math.floor(a.length*.95)],samples:a.length,...__river.stats(),characters:__characterPlacement.snapshot().characters.length});}}requestAnimationFrame(frame);}));
 await page.evaluate(()=>__river.view([13,24,12],[0,6,-20]));await page.waitForTimeout(500);await page.screenshot({path:`${out}/${mode}-gorge.jpg`,type:'jpeg',quality:93});
 await page.evaluate(()=>__river.view([-30,17,-11],[-1,6,-22]));await page.waitForTimeout(250);await page.screenshot({path:`${out}/${mode}-west.jpg`,type:'jpeg',quality:90});
 await page.evaluate(()=>__river.view([10,20,-47],[-1,6,-22]));await page.waitForTimeout(250);await page.screenshot({path:`${out}/${mode}-rear.jpg`,type:'jpeg',quality:90});
 await page.setViewportSize({width:391,height:844});await page.waitForTimeout(700);await page.screenshot({path:`${out}/${mode}-mobile.jpg`,type:'jpeg',quality:90});
 if(mode==='after'){await page.setViewportSize({width:1440,height:1000});await page.emulateMedia({reducedMotion:'no-preference'});await page.evaluate(()=>__river.view([7,19,-5],[0,7,-22]));await page.waitForTimeout(6000);await page.evaluate(()=>__river.view([23,22,15],[1,3,-9]));await page.waitForTimeout(4500);}
 await fs.writeFile(`${out}/${mode}-metrics.json`,JSON.stringify({viewport:[1440,1000],reducedMotion:true,metrics,errors},null,2));console.log(JSON.stringify({mode,metrics,errors}));
}finally{const video=page.video();await context.close();if(video)await video.saveAs(`${out}/mountain-flow.webm`);await browser.close();}
