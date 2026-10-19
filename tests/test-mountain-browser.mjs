import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium,baseURL} from './test-runtime.mjs';
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=d3d11']}),page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[],oldAssets=[];
page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/mountain_(crag|ridge)\/scene.glb/.test(r.url()))oldAssets.push(r.url());});
const ready=()=>page.waitForFunction(()=>window.__valley&&window.__socialUI,null,{timeout:180000});
try{
 await page.goto(baseURL);await ready();assert.ok((await page.locator('#viewport').getAttribute('data-valley-assets')).includes('mountain_range'));assert.deepEqual(oldAssets,[]);
 assert.equal(await page.evaluate(()=>__river.audit.sourceLevel),10.2);assert.equal(await page.evaluate(()=>__river.audit.mountainCascades),3);
 await page.route('**/rodin-mountain/scene.glb',r=>r.abort());await page.reload();await ready();assert.ok(!(await page.locator('#viewport').getAttribute('data-valley-assets')).includes('mountain_range'));
 const a=await page.evaluate(()=>__river.snapshot());await page.waitForTimeout(250);assert.deepEqual(await page.evaluate(()=>__river.snapshot()),a);
 await page.evaluate(()=>__river.view([13,24,12],[0,6,-20]));await page.screenshot({path:'.test-results/mountain-range/fallback-gorge.jpg',type:'jpeg',quality:90});
 await page.setViewportSize({width:391,height:844});await page.waitForTimeout(350);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:'.test-results/mountain-range/fallback-mobile.jpg',type:'jpeg',quality:88});
 assert.deepEqual(errors,[]);const report={checks:['only new mountain requested; retired two assets never fetched','source level and cascade audit exposed','failed GLB uses same coherent procedural range','reduced water frozen; mobile has no horizontal overflow'],errors};await fs.writeFile('.test-results/mountain-range/browser.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}finally{await browser.close();}
