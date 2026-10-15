import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL('C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs'));
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=d3d11']});
const page=await browser.newPage(),errors=[];
page.on('pageerror',error=>errors.push(error.message));
await page.addInitScript(()=>{
 window.__published=[];
 window.desktopMain={showPet(){window.__nativePetRequested=true;},publishState(payload){window.__published.push(structuredClone(payload));},onOpenFriend(callback){window.__desktopOpenFriend=callback;}};
});
try{
 await page.goto('http://localhost:8080/');await page.waitForFunction(()=>window.__socialStore&&window.__discoveryBoards,null,{timeout:180000});
 await page.evaluate(async()=>{await __socialStore.setDemoPaused(true);await __socialStore.addFriend('tuantuan');await __socialStore.receiveMessage('tuantuan',{text:'桌面通知合并检查'},'desktop-merge-check');});
 const last=await page.evaluate(()=>__published.at(-1));assert.equal(last.unreadCount,1);assert.deepEqual(last.state.friends,['tuantuan']);assert.ok(last.state.messages.some(m=>m.id==='desktop-merge-check'));
 await page.locator('#pet-toggle').click();await page.locator('#pet-native').click();assert.ok(await page.evaluate(()=>__nativePetRequested));await page.locator('#pet-hide').click();
 await page.evaluate(()=>__desktopOpenFriend('tuantuan'));
 await page.waitForFunction(()=>__socialUI.activeFriend==='tuantuan'&&__published.at(-1).unreadCount===0);
 await page.reload();await page.waitForFunction(()=>window.__socialStore,null,{timeout:180000});
 const state=await page.evaluate(()=>({groups:__socialStore.state.groups,reminders:__socialStore.state.settings.petReminders,discovery:__socialStore.state.discovery,friend:__socialStore.state.friends.includes('tuantuan')}));
 assert.deepEqual(state.groups,[]);assert.equal(state.reminders,true);assert.ok(state.discovery);assert.ok(state.friend);
 await page.goto('http://localhost:8080/?capture=1');await page.waitForFunction(()=>window.__capture?.ready,null,{timeout:180000});
 assert.equal(await page.evaluate(()=>__published.length),0,'isolated recording must not publish or initialize user data');
 assert.deepEqual(errors,[]);
 console.log('PASS: merged desktop bridge publishes unread changes, opens/reads friends, preserves desktop and discovery defaults, and keeps capture isolated.');
}finally{await browser.close();}
