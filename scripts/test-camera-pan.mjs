import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL('C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs'));
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=d3d11']});
const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[],checks=[];
page.on('pageerror',e=>errors.push(e.message));
const snapshot=()=>page.evaluate(()=>__cameraPanBounds.snapshot());
async function check(label){
 const state=await snapshot();
 assert.ok(state.enabled,`${label}: orbit control restored`);
 assert.ok(state.offset<=state.limit+.01,`${label}: pan stays within the boundary`);
 assert.ok(Math.abs(state.projected[0])<.95&&Math.abs(state.projected[1])<.95,`${label}: forest center remains inside the viewport`);
 checks.push({label,...state});return state;
}
async function drag(dx,dy){
 const {width,height}=page.viewportSize(),x=width/2,y=height*.58;
 await page.mouse.move(x,y);await page.mouse.down({button:'right'});
 await page.mouse.move(x+dx,y+dy,{steps:16});await page.mouse.up({button:'right'});
 await page.waitForTimeout(400);
}
try{
 await page.goto('http://localhost:8080/');await page.waitForFunction(()=>window.__discoveryBoards&&window.__cameraPanBounds,null,{timeout:180000});
 await page.evaluate(async()=>{await __socialStore.setDemoPaused(true);await __socialStore.addFriend('tuantuan');});
 await check('initial');
 await drag(180,40);const moved=await check('normal pan');assert.ok(moved.offset>.5,'panning remains usable');
 for(const [dx,dy] of [[5000,0],[-10000,0],[0,8000],[0,-16000]]){await drag(dx,dy);await check(`extreme pan ${dx},${dy}`);}
 await page.screenshot({path:'validation/pan-bounds-desktop.jpg',type:'jpeg',quality:88});
 for(let i=0;i<28;i++)await page.keyboard.press('+');await page.waitForTimeout(300);
 const zoomed=await check('zoomed boundary');assert.ok(zoomed.limit<moved.limit,'near zoom tightens the range');
 await drag(8000,8000);await check('extreme pan after zoom');
 await page.keyboard.press('ArrowLeft');await page.keyboard.press('ArrowUp');await page.waitForTimeout(300);await check('rotation remains usable');
 const before=await page.evaluate(()=>__discoveryScene.pose());
 await page.evaluate(()=>{__openSceneDiscovery('accounts');});await page.waitForFunction(()=>__discoveryBoards.stage==='browsing');
 assert.equal((await snapshot()).enabled,false,'scripted close-up keeps control of the camera');
 await page.keyboard.press('Escape');await page.waitForFunction(()=>__discoveryBoards.stage==='closed');await page.waitForTimeout(300);
 const after=await page.evaluate(()=>__discoveryScene.pose());
 assert.ok(Math.hypot(...before.position.map((v,i)=>v-after.position[i]))<.001,'close-up restores exact camera pose');await check('after discovery close-up');
 await page.evaluate(()=>__socialUI.openFriend('tuantuan'));await page.waitForTimeout(700);await page.evaluate(()=>__socialUI.closeMeeting());await page.waitForTimeout(700);await check('after friend close-up');
 await page.setViewportSize({width:391,height:844});await page.waitForTimeout(500);
 for(const [dx,dy] of [[6000,3000],[-12000,-6000]]){await drag(dx,dy);await check('portrait extreme pan');}
 for(let i=0;i<28;i++)await page.keyboard.press('+');await page.waitForTimeout(300);await drag(10000,10000);await check('portrait close zoom');
 await page.screenshot({path:'validation/pan-bounds-mobile.jpg',type:'jpeg',quality:88});
 assert.deepEqual(errors,[]);const report={createdAt:new Date().toISOString(),checks,errors};await fs.writeFile('validation/pan-bounds.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await browser.close();}
