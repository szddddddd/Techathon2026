import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'msedge',headless:true});
try{
const page=await browser.newPage({viewport:{width:1280,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:8097/');await page.waitForFunction(()=>!!window.__recordPlayer);
const pose=()=>page.evaluate(()=>__soundCamera.snapshot());const original=await pose();
await page.locator('#record-player-control').click();
await page.waitForTimeout(1300);
await page.screenshot({path:'records/rodin-record-player/sound-panel.png'});
assert.equal(await page.locator('#sound-settings').getAttribute('data-scene'),'true');assert.equal(await page.locator('.sound-track').count(),2);await page.locator('[data-track="spring"]').click();await page.waitForTimeout(200);assert.equal(await page.locator('[data-track="spring"]').getAttribute('aria-pressed'),'true');assert.equal(await page.evaluate(()=>__sound.track.id),'spring');
await page.locator('#sound-settings [aria-label="关闭声音设置"]').click();await page.waitForTimeout(1200);
const restored=await pose();assert(restored.position.every((v,i)=>Math.abs(v-original.position[i])<.01));
await page.locator('#dock-reveal').click();await page.locator('[data-action="me"]').click();const personal=await pose();await page.locator('[data-action="sound-settings"]').click();await page.waitForTimeout(500);assert.deepEqual((await pose()).position,personal.position);
assert.equal(await page.locator('#sound-settings').getAttribute('data-scene'),'false');
await page.locator('[data-sound="music"]').setChecked(false);
await page.locator('#sound-settings [aria-label="返回"]').click();await page.waitForTimeout(350);assert(await page.locator('#social-dialog').isVisible());
await page.setViewportSize({width:390,height:844});await page.locator('[data-action="sound-settings"]').click();await page.waitForTimeout(400);const rect=await page.locator('#sound-settings').boundingBox();assert(rect.x>=0&&rect.x+rect.width<=390);assert.deepEqual(errors,[]);console.log('PASS: scene panel, shared personal panel, back navigation, mobile bounds, no page errors');
}finally{await browser.close();}
