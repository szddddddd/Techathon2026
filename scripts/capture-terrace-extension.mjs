import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {chromium,baseURL} from './test-runtime.mjs';
const out='validation/terrace-extension';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=d3d11']}),page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
 await page.addInitScript(()=>{let s=527;Math.random=()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296;};});
 await page.goto(baseURL);await page.waitForFunction(()=>window.__valley&&window.__socialUI,null,{timeout:180000});await page.evaluate(async()=>{await __socialStore.setDemoPaused(true);await __socialStore.addFriend('tuantuan');await __socialStore.setFriendPinned('tuantuan',true);});await page.waitForFunction(()=>__characterPlacement.snapshot().characters.some(r=>r.id==='tuantuan'));await page.waitForTimeout(500);
 const start=await page.evaluate(()=>{const [x,y,z]=__characterPlacement.snapshot().characters.find(r=>r.id==='tuantuan').position;for(const dy of [.5,.8,1.1,1.4])for(const dx of [0,.2,-.2]){const p=__characterPlacement.project(x+dx,y+dy,z);if(document.elementFromPoint(p.x,p.y)?.tagName==='CANVAS'&&__characterPlacement.pick(p.x,p.y)==='tuantuan')return p;}});assert.ok(start);
 await page.mouse.move(start.x,start.y);await page.mouse.down();assert.equal(await page.evaluate(()=>__characterPlacement.snapshot().active),'tuantuan');
 const target=await page.evaluate(()=>{const p=__characterPlacement.project(13.6,__valley.sample(13.6,-18.8).height,-18.8),o=__characterPlacement.snapshot().footOffset;return{x:p.x-o.x,y:p.y-o.y};});await page.mouse.move(target.x,target.y,{steps:14});await page.mouse.up();await page.waitForFunction(()=>!__characterPlacement.snapshot().active);
 const placement=await page.evaluate(()=>__characterPlacement.snapshot().lastResult);assert.ok(placement.ok);assert.ok(Math.abs(placement.y-6.9)<.01);
 await page.waitForTimeout(800);
 await page.screenshot({path:out+'/desktop.jpg',quality:92});
 await page.evaluate(()=>__valley.view([33,23,-1],[16.5,6,-17]));await page.waitForFunction(()=>!__valley.snapshot().transitioning);await page.screenshot({path:out+'/closeup.jpg',quality:93});
 await page.setViewportSize({width:391,height:844});await page.waitForTimeout(350);await page.screenshot({path:out+'/mobile.jpg',quality:92});
 await fs.writeFile(out+'/browser.json',JSON.stringify({checks:['actual pointer drag places a character on the mountain platform at height 6.9','desktop, close-up and 391px mobile screenshots'],placement,errors},null,2));if(errors.length)throw new Error(errors.join('\n'));
}finally{await browser.close();}
