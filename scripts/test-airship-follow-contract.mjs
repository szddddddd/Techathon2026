import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {chromium} from './test-runtime.mjs';
const source=await build({stdin:{resolveDir:process.cwd(),contents:`
 import * as T from 'three';import {createTrainFollow} from './src/train-follow.js';
 const camera=new T.PerspectiveCamera(45,1,.1,200);camera.position.set(10,10,20);camera.lookAt(0,0,0);
 const controls={target:new T.Vector3(),enabled:true,enableDamping:true,autoRotate:false,update(){}};
 window.follow=createTrainFollow({train:{getTarget:()=>new T.Vector3(3,4,5),pickables:[]},camera,controls,canvas:document.querySelector('canvas'),reduced:true,ui:{subscribe(fn){fn({});return()=>{};}},presentation:{title:'云港空艇',exitLabel:'返回云港',stationTarget:{x:3,y:4,z:5},camera:{forward:2,side:3,height:4}}});
 `},bundle:true,write:false,format:'iife'});
const browser=await chromium.launch({channel:'msedge',headless:true});
try{
 const page=await browser.newPage();await page.setContent('<canvas width="800" height="600"></canvas>');await page.addScriptTag({content:source.outputFiles[0].text});
 assert.equal(await page.locator('#train-station-control span').textContent(),'云港空艇');
 await page.evaluate(()=>follow.enter());let snapshot=await page.evaluate(()=>follow.snapshot());assert.ok(snapshot.active);assert.deepEqual(snapshot.target,[3,4,5]);assert.deepEqual(snapshot.position,[5,8,8]);
 await page.keyboard.press('Escape');snapshot=await page.evaluate(()=>follow.snapshot());assert.equal(snapshot.active,false);assert.deepEqual(snapshot.position,[10,10,20]);
 await page.evaluate(()=>follow.dispose());assert.equal(await page.locator('#train-station-control').count(),0);
 console.log('Airship presentation: injected title, stationary target, camera offsets, Escape restoration and disposal passed.');
}finally{await browser.close();}
