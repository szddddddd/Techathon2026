import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';
const runtime='C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const {chromium}=await import(pathToFileURL(runtime).href);
const out=path.resolve('assets/discovery');await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,channel:'msedge',args:['--use-gl=angle','--use-angle=d3d11','--disable-background-timer-throttling','--autoplay-policy=no-user-gesture-required']});
const start=Number(process.argv[2])||1,end=Number(process.argv[3])||6;
// MediaRecorder writes streaming WebM without Duration; add a standard Info
// duration so the local player can immediately display and seek its timeline.
function withDuration(input,milliseconds){const marker=Buffer.from([0x15,0x49,0xa9,0x66]),index=input.indexOf(marker);if(index<0)return input;const size=input[index+4];if(!(size&0x80)||size===0xff)return input;const length=size&0x7f,end=index+5+length;if(length+11>=127)return input;const duration=Buffer.alloc(11);duration[0]=0x44;duration[1]=0x89;duration[2]=0x88;duration.writeDoubleBE(milliseconds,3);const before=Buffer.from(input.subarray(0,end));before[index+4]=0x80|(length+11);return Buffer.concat([before,duration,input.subarray(end)]);}
try{for(let index=start;index<=end;index++){
  const context=await browser.newContext({viewport:{width:540,height:960},deviceScaleFactor:1});const page=await context.newPage();
  page.on('pageerror',e=>console.error('pageerror',e.message));
  await page.goto(`http://localhost:8080/?capture=${index}`,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.__capture?.ready,{},{timeout:180000});
  const report=await page.evaluate(()=>window.__capture.audit);await fs.writeFile(path.join(out,'scene-placement.json'),JSON.stringify(report,null,2));
  const clip=await page.evaluate(async index=>window.__capture.record(index,12000),index);
  await fs.writeFile(path.join(out,`video-${index}.webm`),withDuration(Buffer.from(clip.video,'base64'),clip.duration));
  const ffmpeg=execFileSync('python',['-c','import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())'],{encoding:'utf8'}).trim();
  const original=path.join(out,`video-${index}.webm`),remuxed=path.join(out,`video-${index}-seekable.webm`);
  execFileSync(ffmpeg,['-y','-loglevel','error','-i',original,'-map','0:v:0','-c','copy',remuxed]);await fs.rename(remuxed,original);
  execFileSync('python',['scripts/add-discovery-audio.py',String(index)],{stdio:'inherit'});
  await fs.writeFile(path.join(out,`video-${index}.jpg`),Buffer.from(clip.poster,'base64'));
  console.log(JSON.stringify({index,bytes:Buffer.byteLength(clip.video,'base64'),mime:clip.mime,duration:clip.duration,fps:await page.locator('#viewport').getAttribute('data-fps')}));
  await context.close();
}}finally{await browser.close();}
