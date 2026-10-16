import {chromium} from 'playwright';
import path from 'node:path';
const browser=await chromium.launchPersistentContext(path.resolve('records/rodin-record-player/browser-profile'),{channel:'msedge',headless:true,viewport:{width:1280,height:900}});
try{
const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:8097/');await page.waitForFunction(()=>!!window.__recordPlayer);
await page.evaluate(()=>{const p=__recordPlayer.root.position;__river.view([p.x+2.4,p.y+2.2,p.z+3.5],[p.x,p.y+.65,p.z]);});
await page.waitForTimeout(800);await page.screenshot({path:'records/rodin-record-player/scene-review.png'});
await page.locator('#record-player-control').click();await page.locator('#sound-settings').waitFor({state:'visible'});
const switches=await page.locator('#sound-settings input').count();
await page.locator('#sound-settings [aria-label="关闭声音设置"]').click();
await page.locator('#sound-settings').waitFor({state:'hidden'});
await page.mouse.click(627,490);
await page.locator('#sound-settings').waitFor({state:'visible'});
await page.locator('[data-sound="music"]').setChecked(true);
await page.waitForFunction(()=>__sound.playing&&__recordPlayer.motion().speed>3.4);
const running=await page.evaluate(()=>__recordPlayer.motion());
await page.locator('[data-sound="music"]').setChecked(false);
await page.waitForFunction(()=>!__sound.playing);
const slowing=await page.evaluate(()=>({paused:!__sound.playing,...__recordPlayer.motion()}));
await page.waitForFunction(()=>__recordPlayer.motion().speed===0);
if(!slowing.paused||slowing.speed<=0)throw new Error('Expected music paused while platter coasts');
console.log(JSON.stringify({errors,dialog:true,switches,modelClick:true,running,slowing,stopped:await page.evaluate(()=>__recordPlayer.motion())}));
}finally{await browser.close();}
