import {spawn} from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import {performance} from 'node:perf_hooks';
import {chromium} from 'playwright';

const label=process.argv[2]||'sample',port=process.env.FOREST_WEB_PORT||'48921';
const out=path.resolve('.test-results/performance');await fs.mkdir(out,{recursive:true});
const build=[];
for(let i=0;i<3;i++){
  const start=performance.now();
  await new Promise((resolve,reject)=>{const child=spawn(process.execPath,['scripts/build.mjs',...(i===0?['--force']:[])],{stdio:'pipe',windowsHide:true});let log='';child.stdout.on('data',d=>log+=d);child.stderr.on('data',d=>log+=d);child.once('error',reject);child.once('exit',code=>code?reject(new Error(log)):resolve());});
  build.push(performance.now()-start);
}
const server=spawn(process.execPath,['scripts/serve.mjs'],{env:{...process.env,FOREST_WEB_PORT:port},windowsHide:true});
let browser;
const loads=[];
try{
 await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);server.once('exit',c=>reject(new Error('Server exit '+c)));});
 browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=d3d11']});
 for(let run=0;run<3;run++){
  const context=await browser.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:1});
  await context.addInitScript(()=>{
    window.__frameCosts=[];const request=window.requestAnimationFrame;
    window.requestAnimationFrame=callback=>request.call(window,now=>{const start=performance.now();callback(now);if(callback.name!=='sample')window.__frameCosts.push(performance.now()-start);});
    window.__longTasks=[];new PerformanceObserver(list=>window.__longTasks.push(...list.getEntries().map(e=>({start:e.startTime,duration:e.duration})))).observe({type:'longtask',buffered:true});
  });
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const mode of ['cold','warm']){
   const started=performance.now();await page.goto(`http://127.0.0.1:${port}/`,{waitUntil:'domcontentloaded'});
   await page.waitForFunction(()=>document.querySelector('#viewport')?.dataset.loaded==='true',null,{timeout:180000});
   const readyMs=performance.now()-started;
   await page.evaluate(()=>__socialStore.setDemoPaused(true));
   await page.waitForTimeout(1500);
   const metric=await page.evaluate(async()=>{
    window.__frameCosts=[];const frames=[];let last;
    await new Promise(resolve=>{function sample(now){if(last!==undefined)frames.push(now-last);last=now;frames.length<120?requestAnimationFrame(sample):resolve();}requestAnimationFrame(sample);});
    const summary=values=>{const sorted=[...values].sort((a,b)=>a-b);return{count:sorted.length,median:sorted[Math.floor(sorted.length*.5)],p95:sorted[Math.floor(sorted.length*.95)]};};
    const resources=performance.getEntriesByType('resource');
    return{frames:summary(frames),frameCPU:summary(__frameCosts),render:__river.stats(),
     requests:resources.length,transferBytes:resources.reduce((n,r)=>n+r.transferSize,0),decodedBytes:resources.reduce((n,r)=>n+r.decodedBodySize,0),
     groupRequests:resources.filter(r=>r.name.includes('/rodin-groups/')).map(r=>({url:r.name,bytes:r.transferSize})),
     resources:resources.map(r=>({url:r.name,transferBytes:r.transferSize,decodedBytes:r.decodedBodySize,duration:r.duration})),
     longTasks:__longTasks};
   });
   loads.push({run,mode,readyMs,...metric,errors:[...errors]});
   if(run===0&&mode==='cold')await page.screenshot({path:path.join(out,label+'.jpg'),type:'jpeg',quality:86});
  }
  await context.close();
 }
 const report={label,createdAt:new Date().toISOString(),conditions:{viewport:[1440,1000],deviceScaleFactor:1,browser:'Edge headless D3D11',friends:0,groups:0,frames:120,coldContexts:3},buildMs:build,loads};
 await fs.writeFile(path.join(out,label+'.json'),JSON.stringify(report,null,2));
 console.log(JSON.stringify({label,buildMs:build,loads:loads.map(({run,mode,readyMs,frames,frameCPU,render,transferBytes,groupRequests,errors})=>({run,mode,readyMs,frames,frameCPU,render,transferBytes,groupRequests:groupRequests.length,errors}))},null,2));
}finally{if(browser)await browser.close();server.kill();}
