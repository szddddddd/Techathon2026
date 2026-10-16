import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {chromium,baseURL} from './test-runtime.mjs';
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=d3d11']}),page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[],network=[];
page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error'&&/THREE|WebGL|shader/i.test(m.text()))errors.push(m.text());});
page.on('response',r=>{if(r.status()>=400)network.push({url:r.url(),status:r.status()});});
try{
 await page.goto(baseURL);await page.waitForFunction(()=>window.__freeRoam&&window.__groupBuildings,null,{timeout:180000});
 await page.evaluate(async()=>{await __socialStore.setDemoPaused(true);await __socialStore.seedGroupDemo();});
 for(const [name,position,target] of [['overview',[40,30,68],[0,-4,-4]],['waterfall',[18,8,53],[0,-8,9]]]){
  await page.evaluate(({position,target})=>__valley.view(position,target),{position,target});await page.waitForFunction(()=>!__valley.snapshot().transitioning);await page.waitForTimeout(300);
  await page.screenshot({path:`validation/island-waterfall/${name}.jpg`,quality:93});
 }
 await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:391,height:844});await page.waitForTimeout(500);await page.screenshot({path:'validation/island-waterfall/mobile.jpg',quality:92});
 assert.deepEqual(errors,[]);await fs.writeFile('validation/island-waterfall/browser.json',JSON.stringify({errors,network,checks:['animated waterfall and shader render','desktop overview and outlet close-up','391px portrait and reduced-motion mode']},null,2));
}finally{await browser.close();}
