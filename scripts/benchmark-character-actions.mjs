import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium,baseURL} from '../tests/test-runtime.mjs';
const label=process.argv[2]||'after',out='.test-results/skeletal-actions';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=d3d11']}),trials=[];
try{for(let trial=0;trial<3;trial++){
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 await page.addInitScript(()=>{let seed=7041;Math.random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);const raf=window.requestAnimationFrame;window.__frameCosts=[];window.requestAnimationFrame=callback=>raf.call(window,time=>{const start=performance.now();callback(time);if(callback.name==='frame'||callback.toString().includes('.render('))__frameCosts.push(performance.now()-start);});});
 const source=await fs.readFile(label==='before'?out+'/before-world.js':'dist/world.js','utf8'),instrumented=source.replace(/window\.__characterPlacement=([\w$]+)\.placement/, '$&,window.__rigBenchmark=$1');assert.notEqual(instrumented,source);await page.route('**/dist/world.js*',r=>r.fulfill({body:instrumented,contentType:'application/javascript'}));
 await page.goto(baseURL+'/?scene=ideal&stress=1');await page.waitForFunction(()=>window.__sceneTheme?.ready,null,{timeout:180000});
 await page.evaluate(async()=>{
  await __socialStore.setDemoPaused(true);const original=['tuantuan','ali','xiaomian','shanshan'],friends=Array.from({length:9},(_,i)=>({...__socialStore.getFriend(original[i%4]),id:i<4?original[i]:i<8?original[i%4]+'-stress':'benchmark-8'})),statuses={};
  friends.forEach((f,i)=>statuses[f.id]={kind:['busy','music','emo','travel','relax','exercise','happy','tired','music'][i],expiresAt:Date.now()+600000});
  __rigBenchmark.sync(friends);__rigBenchmark.setSocialState({statuses});__dayNight.setMode('day');
  window.__benchInitial=__characterPlacement.snapshot().characters.map(r=>({id:r.id,position:r.position}));
 });
 await page.waitForFunction(()=>__characterPlacement.snapshot().characters.length===9,null,{timeout:15000}).catch(async e=>{console.log(await page.evaluate(()=>({snapshot:__characterPlacement.snapshot(),state:__socialStore.state})));throw e;});await page.waitForTimeout(3500);
 await page.evaluate(()=>window.__frameCosts=[]);const client=await page.context().newCDPSession(page);await client.send('Performance.enable');const a=await client.send('Performance.getMetrics');
 const intervals=await page.evaluate(()=>new Promise(resolve=>{const result=[];let previous;function sample(now){if(previous)result.push(now-previous);previous=now;if(result.length<180)requestAnimationFrame(sample);else resolve(result);}requestAnimationFrame(sample);}));
 const b=await client.send('Performance.getMetrics'),metric=(data,name)=>data.metrics.find(m=>m.name===name).value;intervals.sort((a,b)=>a-b);
 const frameCosts=await page.evaluate(()=>__frameCosts.sort((a,b)=>a-b)),quantile=p=>frameCosts[Math.floor((frameCosts.length-1)*p)];assert.ok(frameCosts.length>=170);
 trials.push({frameCPU:{median:quantile(.5),p95:quantile(.95),samples:frameCosts.length},median:intervals[90],p95:intervals[171],cpuPerFrame:(metric(b,'TaskDuration')-metric(a,'TaskDuration'))*1000/180,initial:await page.evaluate(()=>__benchInitial),resources:await page.evaluate(()=>__sceneTheme.resourceSnapshot()),actors:await page.evaluate(()=>__characterPlacement.snapshot().characters.length)});await page.close();
 }
 const median=key=>trials.map(t=>t[key]).sort((a,b)=>a-b)[1],report={label,trials,median:median('median'),p95:median('p95'),cpuPerFrame:median('cpuPerFrame'),frameCPU:{median:trials.map(t=>t.frameCPU.median).sort((a,b)=>a-b)[1],p95:trials.map(t=>t.frameCPU.p95).sort((a,b)=>a-b)[1]}};
 if(label==='after'){const before=JSON.parse(await fs.readFile(out+'/performance-before.json'));for(let i=0;i<trials.length;i++)for(let j=0;j<9;j++){assert.equal(trials[i].initial[j].id,before.trials[i].initial[j].id);assert.ok(Math.hypot(...trials[i].initial[j].position.map((v,k)=>v-before.trials[i].initial[j].position[k]))<.001,'Matched actor placement');}report.ratios={frameMedian:report.frameCPU.median/before.frameCPU.median,frameP95:report.frameCPU.p95/before.frameCPU.p95,median:report.median/before.median,p95:report.p95/before.p95,cpu:report.cpuPerFrame/before.cpuPerFrame};assert.ok(report.ratios.frameMedian<=1.1&&report.ratios.frameP95<=1.1,'Frame callback regression exceeds 10%');assert.ok(report.ratios.median<=1.1&&report.ratios.p95<=1.1,'Frame interval regression exceeds 10%');}
 await fs.writeFile(out+'/performance-'+label+'.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}finally{await browser.close();}
