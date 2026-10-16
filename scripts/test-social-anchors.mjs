import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL('C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs'));
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=d3d11']});
const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto('http://localhost:8080');await page.waitForFunction(()=>window.__socialUI,null,{timeout:180000});
 await page.evaluate(async()=>{await __socialStore.setDemoPaused(true);for(const id of ['tuantuan','ali','xiaomian','shanshan'])await __socialStore.addFriend(id);});await page.waitForTimeout(1200);
 await page.evaluate(()=>{
  window.__anchorTrace=[];window.__traceAnchors=true;
  const tick=now=>{if(!window.__traceAnchors)return;window.__anchorTrace.push({now,moving:document.querySelector('#social').classList.contains('is-orbiting'),labels:[...document.querySelectorAll('.friend-anchor')].map(el=>{const m=new DOMMatrix(getComputedStyle(el).transform);return{id:el.dataset.friend,x:m.m41,y:m.m42,offset:Number(el.dataset.labelOffset),visible:!el.hidden};})});requestAnimationFrame(tick);};requestAnimationFrame(tick);
 });
 await page.mouse.move(1020,730);await page.mouse.down();
 for(let i=1;i<=36;i++){await page.mouse.move(1020-i*8,730-i*2);await page.waitForTimeout(16);}
 await page.screenshot({path:'validation/stable-labels-drag.jpg',type:'jpeg',quality:88});await page.mouse.up();await page.waitForTimeout(1200);
 const trace=await page.evaluate(()=>{window.__traceAnchors=false;return window.__anchorTrace;});
 const moving=trace.filter(t=>t.moving),stats=[];
 assert.ok(moving.length>=15,'capture a real sustained OrbitControls drag');
 for(const id of ['tuantuan','ali','xiaomian','shanshan']){
  const samples=moving.map(t=>t.labels.find(l=>l.id===id)).filter(Boolean);let frames=0,changed=0;
  for(let i=1;i<samples.length;i++){if(!samples[i].visible||!samples[i-1].visible)continue;frames++;if(Math.hypot(samples[i].x-samples[i-1].x,samples[i].y-samples[i-1].y)>.05)changed++;}
  const offsets=samples.map(s=>s.offset),spread=Math.max(...offsets)-Math.min(...offsets);
  if(frames>8)assert.ok(changed/frames>.75,`${id} must follow the camera every frame, rather than at 80ms steps`);
  assert.ok(spread<.05,`${id} collision lane stays fixed while dragging`);
  stats.push({id,frames,movingFrames:changed,updateRatio:frames?changed/frames:0,offsetSpread:spread});
 }
 await page.keyboard.press('Home');await page.waitForTimeout(600);
 const status=page.locator('.friend-anchor:not([hidden]) .status-badge').first();await status.click();assert.ok(await page.locator('#social-dialog').evaluate(el=>el.open));assert.ok(await page.locator('#meeting').evaluate(el=>el.hidden));await page.mouse.click(4,4);
 await page.locator('.friend-anchor:not([hidden]) .anchor-name').first().click();assert.ok(await page.locator('#meeting').evaluate(el=>!el.hidden));await page.evaluate(()=>__socialUI.closeMeeting());await page.waitForTimeout(700);
 await page.setViewportSize({width:391,height:844});await page.waitForTimeout(500);await page.mouse.move(300,500);await page.mouse.down();await page.mouse.move(160,460,{steps:16});await page.mouse.up();await page.waitForTimeout(500);await page.screenshot({path:'validation/stable-labels-mobile.jpg',type:'jpeg',quality:88});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 assert.deepEqual(errors,[]);const report={createdAt:new Date().toISOString(),dragFrames:moving.length,stats,errors,checks:['each-frame tracking','fixed avoidance while dragging','status clicks do not open chat','name clicks open chat','mobile no horizontal overflow']};await fs.writeFile('validation/stable-labels.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await browser.close();}
