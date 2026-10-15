import assert from 'node:assert/strict';
import {chromium,baseURL,outputDir,outputPath} from './test-runtime.mjs';
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=d3d11']});
const page=await browser.newPage(),errors=[];
page.on('pageerror',error=>errors.push(error.message));
await page.addInitScript(()=>{
 window.__published=[];
 window.desktopMain={showPet(){window.__nativePetRequested=true;},publishState(payload){window.__published.push(structuredClone(payload));},onOpenFriend(callback){window.__desktopOpenFriend=callback;}};
});
try{
 await page.goto(baseURL+"/");await page.waitForFunction(()=>window.__socialStore&&window.__discoveryBoards,null,{timeout:180000});
 await page.evaluate(async()=>{await __socialStore.setDemoPaused(true);await __socialStore.addFriend('tuantuan');await __socialStore.receiveMessage('tuantuan',{text:'桌面通知合并检查'},'desktop-merge-check');});
 const last=await page.evaluate(()=>__published.at(-1));assert.equal(last.unreadCount,1);assert.deepEqual(last.state.friends,['tuantuan']);assert.ok(last.state.messages.some(m=>m.id==='desktop-merge-check'));
 await page.locator('#pet-toggle').click();assert.ok(await page.evaluate(()=>__nativePetRequested));assert.equal(await page.locator('#pet-widget').count(),0);
 await page.evaluate(()=>__desktopOpenFriend('tuantuan'));
 await page.waitForFunction(()=>__socialUI.activeFriend==='tuantuan'&&__published.at(-1).unreadCount===0);
 await page.reload();await page.waitForFunction(()=>window.__socialStore,null,{timeout:180000});
 const state=await page.evaluate(()=>({groups:__socialStore.state.groups,reminders:__socialStore.state.settings.petReminders,discovery:__socialStore.state.discovery,friend:__socialStore.state.friends.includes('tuantuan')}));
 assert.deepEqual(state.groups,[]);assert.equal(state.reminders,true);assert.ok(state.discovery);assert.ok(state.friend);
 await page.goto(baseURL+"/?capture=1");await page.waitForFunction(()=>window.__capture?.ready,null,{timeout:180000});
 assert.equal(await page.evaluate(()=>__published.length),0,'isolated recording must not publish or initialize user data');
 assert.deepEqual(errors,[]);
 console.log('PASS: merged desktop bridge publishes unread changes, opens/reads friends, preserves desktop and discovery defaults, and keeps capture isolated.');
}finally{await browser.close();}
