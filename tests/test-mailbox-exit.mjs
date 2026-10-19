import assert from 'node:assert/strict';
import {chromium,baseURL} from './test-runtime.mjs';
const browser=await chromium.launch({channel:'msedge',headless:true});
try{
 for(const mobile of [false,true]){
 const page=await browser.newPage({viewport:mobile?{width:390,height:844}:{width:1440,height:1000},reducedMotion:mobile?'reduce':'no-preference'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 for(const theme of ['forest','fuji','ideal']){
 await page.goto(baseURL+'/?scene='+theme);await page.waitForFunction(()=>window.__sceneTheme?.ready,null,{timeout:180000});
 for(const action of ['immediate','transition','settled','center','demo','repeat']){
 const before=await page.evaluate(()=>__mailboxCamera.snapshot());
 await page.locator('[aria-label^="聚焦"]').click();
 await page.waitForFunction(()=>['opening','open'].includes(__uiInteractions.state('directory')));
 if(action==='transition')await page.waitForTimeout(100);
 if(['settled','center','demo','repeat'].includes(action))await page.waitForTimeout(1000);
 if(['center','demo'].includes(action)){
 if(action==='demo')await page.locator('#directory .inbox-more summary').click();
 await page.locator(`#directory [data-inbox-open=${action}]`).first().click();await page.locator('#inbox-'+action).waitFor({state:'visible'});
 }
 await page.keyboard.press('Escape');if(action==='repeat'){await page.keyboard.press('Escape');await page.keyboard.press('Escape');}
 await page.waitForTimeout(1200);
 const after=await page.evaluate(()=>({pose:__mailboxCamera.snapshot(),controls:__sceneTheme.resourceSnapshot().controls,inert:document.querySelector('#viewport').inert,main:__uiInteractions.activeMain,dialogs:[...document.querySelectorAll('dialog[open]')].map(x=>x.id),shell:document.body.classList.contains('mailbox-scene-open')}));
 assert.equal(after.pose.active,false);assert.equal(after.pose.transitioning,false);assert.equal(after.controls.enabled,true);assert.equal(after.controls.enableDamping,true);assert.equal(after.inert,false);assert.equal(after.shell,false);assert.equal(after.main,undefined);assert.deepEqual(after.dialogs,[]);
 if(action!=='repeat')for(const key of ['position','target'])assert.ok(after.pose[key].every((v,i)=>Math.abs(v-before[key][i])<.15),JSON.stringify({theme,action,key,before,after}));
 }
 console.log(`PASS ${theme} ${mobile?'mobile/reduced':'desktop'}: early/animated/settled/nested/repeated Escape restores camera and controls`);
 }
 assert.deepEqual(errors,[]);await page.close();
 }
}finally{await browser.close();}
