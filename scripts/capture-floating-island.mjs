import fs from 'node:fs/promises';
import {chromium,baseURL} from './test-runtime.mjs';
const phase=process.argv[2]||'after',out='validation/floating-island';
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=d3d11']}),page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[];
page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto(baseURL);await page.waitForFunction(()=>window.__groupBuildings,null,{timeout:180000});
 await page.evaluate(async()=>{await __socialStore.setDemoPaused(true);await __socialStore.seedGroupDemo();});
 await page.waitForTimeout(500);
 await page.screenshot({path:`${out}/${phase}-desktop.jpg`,quality:93});
 for(const [name,position,target] of [['island',[43,28,58],[0,0,-7]],['rock',[25,15,70],[0,-2,-7]],['courtyard',[-33,29,26],[-14,2,-6]],['rear',[-38,24,-55],[0,0,-10]]]){
  await page.evaluate(({position,target})=>__valley.view(position,target),{position,target});await page.waitForFunction(()=>!__valley.snapshot().transitioning);
  await page.screenshot({path:`${out}/${phase}-${name}.jpg`,quality:93});
 }
 await page.setViewportSize({width:391,height:844});await page.waitForTimeout(500);await page.screenshot({path:`${out}/${phase}-mobile.jpg`,quality:92});
 await fs.writeFile(`${out}/${phase}-browser.json`,JSON.stringify({errors,assets:await page.evaluate(()=>__groupBuildings.failures)},null,2));
 if(errors.length)throw new Error(errors.join('\n'));
}finally{await browser.close();}
