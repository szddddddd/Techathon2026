import assert from 'node:assert/strict';
import {chromium,baseURL} from './test-runtime.mjs';
const browser=await chromium.launch({channel:'msedge',headless:true});
try{for(const mobile of [false,true]){const page=await browser.newPage({viewport:mobile?{width:390,height:844}:{width:1440,height:1000},reducedMotion:mobile?'reduce':'no-preference'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
for(const theme of ['forest','fuji','ideal']){
await page.goto(baseURL+'/?scene='+theme);await page.waitForFunction(()=>window.__sceneTheme?.ready,null,{timeout:180000});
await page.evaluate(async()=>{if(!__socialStore.state.friends.length)await __socialStore.addFriend('tuantuan');});await page.waitForTimeout(2500);
for(const delay of [100,1000]){
const before=await page.evaluate(()=>__mailboxCamera.snapshot());
await page.locator('[aria-label^="聚焦"]').click();await page.waitForFunction(()=>__uiInteractions.state('directory')==='open');await page.waitForTimeout(delay);
await page.evaluate(()=>__socialUI.openFriend(__socialStore.state.friends[0]));await page.locator('#moments-toggle').click();await page.keyboard.press('Escape');await page.keyboard.press('Escape');await page.waitForTimeout(1700);
const state=await page.evaluate(()=>({pose:__mailboxCamera.snapshot(),controls:__sceneTheme.resourceSnapshot().controls,inert:document.querySelector('#viewport').inert}));
assert.equal(state.pose.active,false);assert.equal(state.controls.enabled,true);assert.equal(state.controls.enableDamping,true);assert.equal(state.inert,false);
for(const key of ['position','target'])assert.ok(state.pose[key].every((v,i)=>Math.abs(v-before[key][i])<.15),JSON.stringify({theme,delay,state,before}));
}console.log(`PASS ${theme} ${mobile?'mobile':'desktop'} mailbox → friend → moments`);
}assert.deepEqual(errors,[]);await page.close();}}finally{await browser.close();}
