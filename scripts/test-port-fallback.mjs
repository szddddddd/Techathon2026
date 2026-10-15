import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {spawn} from 'node:child_process';
const file='.forest-runtime.json';let before;try{before=await fs.readFile(file);}catch{}
const blocker=http.createServer((req,res)=>res.end('another application'));
await new Promise(resolve=>blocker.listen(0,'127.0.0.1',resolve));const port=blocker.address().port;
const child=spawn('powershell.exe',['-NoProfile','-File','scripts/launch.ps1','-NoBrowser','-SkipProtocolInstall'],{env:{...process.env,FOREST_WEB_PORT:String(port),PATH:path.dirname(process.execPath)+path.delimiter+process.env.PATH},stdio:'inherit'});
try {
 const response=await new Promise((resolve,reject)=>{
  const timer=setTimeout(()=>{clearInterval(poll);reject(new Error('Fallback startup timed out'));},30000);
  const poll=setInterval(async()=>{try{const r=await fetch(`http://127.0.0.1:${port+1}/`);if((await r.text()).includes('forest-version')){clearInterval(poll);clearTimeout(timer);resolve(r);}}catch{}},300);
 });assert.equal(response.status,200);
 const saved=JSON.parse((await fs.readFile(file,'utf8')).replace(/^\uFEFF/,''));assert.equal(saved.webPort,port+1);
 console.log('PASS: occupied web port selects next port and persists shared bridge configuration');
}finally{
 await new Promise(resolve=>{const stop=spawn('taskkill',['/PID',String(child.pid),'/T','/F'],{stdio:'inherit'});stop.once('exit',resolve);});
 await new Promise(resolve=>blocker.close(resolve));
 if(before)await fs.writeFile(file,before);else await fs.rm(file,{force:true});
}
