import fs from 'node:fs/promises';
import http from 'node:http';
import {chromium} from 'playwright';
const dir='validation/railway-town',bytes=await fs.readFile(dir+'/railway-through-town.webm');
const server=http.createServer((req,res)=>{
 if(req.url==='/'){res.setHeader('Content-Type','text/html');res.end('<style>body{margin:0}video{width:1440px;height:1000px}</style><video muted preload="auto" src="/film.webm"></video>');return;}
 const range=/bytes=(\d+)-(\d*)/.exec(req.headers.range||'');const start=range?Number(range[1]):0,end=range&&range[2]?Number(range[2]):bytes.length-1;
 res.writeHead(range?206:200,{'Content-Type':'video/webm','Content-Length':end-start+1,'Accept-Ranges':'bytes',...(range?{'Content-Range':`bytes ${start}-${end}/${bytes.length}`}:{})});res.end(bytes.subarray(start,end+1));
});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({channel:'msedge',headless:true});
try{const p=await browser.newPage({viewport:{width:1440,height:1000}});await p.goto(`http://127.0.0.1:${server.address().port}`);await p.waitForFunction(()=>document.querySelector('video').readyState>=2);
 const duration=await p.locator('video').evaluate(v=>v.duration);for(const t of[15,25,40,55]){await p.locator('video').evaluate((v,t)=>new Promise(r=>{v.onseeked=r;v.currentTime=t;}),t);await p.screenshot({path:`${dir}/video-${t}.jpg`,quality:90});}
 await fs.writeFile(dir+'/video.json',JSON.stringify({duration,reviewFrames:[15,25,40,55]},null,2));console.log({duration});
}finally{await browser.close();await new Promise(r=>server.close(r));}
