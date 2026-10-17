import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import {performance} from 'node:perf_hooks';
import {chromium} from 'playwright';
import {serveStatic} from '../server/static-files.mjs';

// Same original APK assets, fixed mobile camera/time/data, real WebGL on this
// machine. CPU throttling is diagnostic, not a physical handset FPS claim.
const label=process.argv[2]||'sample',bundle=process.argv[3],out=path.resolve('.test-results/mobile-performance',label);
await fs.mkdir(out,{recursive:true});
const root=path.resolve('.cache/android-web');
const server=http.createServer(async(req,res)=>{
 try{
  if(req.url.startsWith('/mobile/')){const file=req.url.split('?')[0];if(!['/mobile/android.css','/mobile/android-runtime.js'].includes(file)){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',file.endsWith('.css')?'text/css':'text/javascript');res.end(await fs.readFile(path.join(root,file)));return;}
  await serveStatic(req,res,root);
 }catch{res.writeHead(500);res.end();}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=d3d11','--js-flags=--expose-gc']});
const rows=[];
try{
 for(const scene of ['forest','fuji','ideal']){
  const context=await browser.newContext({viewport:{width:393,height:852},deviceScaleFactor:2,isMobile:true,hasTouch:true});
  await context.addInitScript(()=>{
   let seed=123456;Math.random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
   localStorage.setItem('forest-letters-day-night-v1',JSON.stringify({version:1,mode:'day',seconds:150}));
   window.__frameCosts=[];const request=requestAnimationFrame;
   window.requestAnimationFrame=callback=>request.call(window,now=>{const start=performance.now();callback(now);if(callback.name!=='sample')__frameCosts.push(performance.now()-start);});
  });
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  if(bundle)await page.route('**/dist/world.js*',r=>r.fulfill({path:path.resolve(bundle),contentType:'text/javascript'}));
  const cdp=await context.newCDPSession(page);
  await cdp.send('Profiler.enable');await cdp.send('Profiler.start');
  const start=performance.now();await page.goto(origin+'/?scene='+scene+'&stress=1',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.querySelector('#viewport')?.dataset.loaded==='true',null,{timeout:300000});
  const readyMs=performance.now()-start;
  await page.waitForTimeout(2000);
  const {profile}=await cdp.send('Profiler.stop');await fs.writeFile(path.join(out,scene+'.cpuprofile'),JSON.stringify(profile));
  const hot=profile.nodes.filter(n=>n.hitCount).sort((a,b)=>b.hitCount-a.hitCount).slice(0,14).map(n=>({name:n.callFrame.functionName,line:n.callFrame.lineNumber,hits:n.hitCount,url:n.callFrame.url.split('/').pop()}));
  const metric=await page.evaluate(async()=>{
   __frameCosts=[];const intervals=[];let last;
   await new Promise(resolve=>{function sample(now){if(last!==undefined)intervals.push(now-last);last=now;intervals.length<120?requestAnimationFrame(sample):resolve();}requestAnimationFrame(sample);});
   const summary=a=>{const s=a.slice().sort((a,b)=>a-b);return{median:s[Math.floor(s.length*.5)],p95:s[Math.floor(s.length*.95)]};};
   const canvas=document.querySelector('#viewport canvas');
   return{cpu:summary(__frameCosts),intervals:summary(intervals),resources:__sceneTheme.resourceSnapshot(),resolution:[canvas.width,canvas.height],heap:performance.memory?.usedJSHeapSize,frames:__renderPerformance.frames};
  });
  await page.locator('#viewport canvas').screenshot({path:path.join(out,scene+'.png')});
  rows.push({scene,readyMs,...metric,hot,errors});console.log(JSON.stringify(rows.at(-1)));
  await context.close();
 }
 await fs.writeFile(path.join(out,'report.json'),JSON.stringify({label,conditions:{browser:'Edge D3D11',viewport:[393,852],deviceScaleFactor:2,stressCharacters:8,seed:123456,frames:120,physicalDevice:false},rows},null,2));
}finally{await browser.close();await new Promise(r=>server.close(r));}
