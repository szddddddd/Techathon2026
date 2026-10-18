import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium,baseURL,outputPath} from './test-runtime.mjs';
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=d3d11']});
const context=await browser.newContext({viewport:{width:393,height:852},deviceScaleFactor:2,isMobile:true,hasTouch:true,userAgent:'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/130.0.0.0 Mobile Safari/537.36'});
const page=await context.newPage(),errors=[],media=[],petRequests=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('request',r=>{if(r.url().includes('127.0.0.1:47831'))petRequests.push(r.url());if(/\/assets\/discovery\/.*\.(webm|mp4)/.test(r.url()))media.push({url:r.url(),type:r.resourceType(),range:r.headers().range});});
try{
 await page.goto(baseURL+'/?scene=fuji');await page.waitForFunction(()=>window.__sceneTheme?.ready,null,{timeout:180000});
 await page.evaluate(()=>__socialStore.setDemoPaused(true));
 await page.evaluate(()=>{window.__videoStarts=0;__contentPlayer.video.addEventListener('loadstart',()=>__videoStarts++);return __discoveryUI.open({type:'video',id:'video-1'});});
 await page.waitForFunction(()=>__contentPlayer.video.readyState>=3&&!__contentPlayer.video.paused);
 assert.match(await page.evaluate(()=>__contentPlayer.video.src),/\/assets\/discovery\/video-1.webm$/);
 await page.evaluate(()=>__contentPlayer.pause());
 const starts=await page.evaluate(()=>__videoStarts);
 await page.evaluate(()=>Promise.all(Array.from({length:8},()=>__contentPlayer.load('video-1',{autoplay:false}))));
 assert.equal(await page.evaluate(()=>__videoStarts),starts,'Repeated callers reuse the same media source and decoder');
 await page.evaluate(()=>{const v=__contentPlayer.video;v.currentTime=v.duration*.7;});
 await page.waitForFunction(()=>{const v=__contentPlayer.video;return v.readyState>=2&&Math.abs(v.currentTime-v.duration*.7)<.1;});
 const resume=await page.evaluate(()=>__contentPlayer.video.currentTime);
 await page.evaluate(()=>__discoveryUI.close());await page.waitForFunction(()=>__uiInteractions.state('discovery')==='closed');
 await page.evaluate(()=>__discoveryUI.open({type:'video',id:'video-1'}));await page.waitForFunction(()=>__contentPlayer.video.readyState>=3);
 assert.equal(await page.evaluate(()=>__videoStarts),starts);assert.ok(await page.evaluate(t=>__contentPlayer.video.currentTime>=t-.15,resume));
 // Superseded loads must settle without replaying the old clip or leaving promises hanging.
 await page.evaluate(()=>Promise.all([__contentPlayer.load('video-2',{autoplay:false}),__contentPlayer.load('video-3',{autoplay:false})]));
 assert.equal(await page.evaluate(()=>__contentPlayer.activeId),'video-3');assert.equal(await page.evaluate(()=>__contentPlayer.video.paused),true);
 await page.route('**/video-6.webm',r=>r.abort());
 assert.equal(await page.evaluate(async()=>{try{await __contentPlayer.load('video-6',{autoplay:false});return false;}catch{return true;}}),true);
 await page.unroute('**/video-6.webm');await page.evaluate(()=>__contentPlayer.load('video-6',{autoplay:false,force:true}));
 await page.waitForFunction(()=>__contentPlayer.video.readyState>=1);
 await page.evaluate(()=>{__contentPlayer.pause();__discoveryUI.open({type:'article',id:'starthub-yc-2026-startup-report'});});
 await page.waitForFunction(()=>__uiInteractions.state('discovery')==='open');
 assert.ok(await page.locator('.d-reading h1').textContent());
 // Media controls are event-driven, including while the scene is still rendering.
 assert.ok(media.length>0);assert.ok(media.every(r=>r.type==='media'));assert.ok(media.some(r=>r.range?.startsWith('bytes=')));
 assert.deepEqual(petRequests,[]);assert.deepEqual(errors,[]);
 await page.screenshot({path:outputPath('mobile-media-streaming.png')});
 await fs.writeFile(outputPath('mobile-media-streaming.json'),JSON.stringify({checks:['direct media source without full-file JS Blob','same-source load deduplication','seek','close/reopen progress','superseded loads settle','failed load/retry','mobile browser skips desktop polling'],media,errors,petRequests},null,2));
 console.log('PASS: streaming video, source reuse, seek/progress, rapid switching, retry and zero mobile desktop-pet requests');
}finally{await context.close();await browser.close();}
