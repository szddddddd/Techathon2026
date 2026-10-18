import fs from 'node:fs/promises';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import {createReadStream} from 'node:fs';
import {pipeline} from 'node:stream/promises';
import QRCode from 'qrcode';
const product=JSON.parse(await fs.readFile('package.json','utf8'));
const port=Number(process.env.WEROAM_DOWNLOAD_PORT||8082),name=`WeRoam-${product.displayVersion.replace(/[^A-Za-z0-9.-]/g,'-')}-android.apk`;
const folder=path.resolve('downloads'),apk=path.join(folder,name),stat=await fs.stat(apk);
const candidates=Object.entries(os.networkInterfaces()).flatMap(([name,list])=>list.filter(a=>a.family==='IPv4'&&!a.internal&&!a.address.startsWith('169.254.')&&!/^198\.(?:18|19)\./.test(a.address)&&!/^(?:vEthernet|WSL|VMware|VirtualBox|Docker|Loopback)/i.test(name)).map(a=>a.address));
const urls=candidates.map(ip=>`http://${ip}:${port}/`),url=process.env.WEROAM_DOWNLOAD_URL||urls[0]||`http://localhost:${port}/`;
const qr=await QRCode.toDataURL(url,{margin:2,width:240,errorCorrectionLevel:'M'});
await fs.mkdir('.test-results/android',{recursive:true});
await QRCode.toFile('.test-results/android/download-qr.png',url,{margin:2,width:320,errorCorrectionLevel:'M'});
const digest=(await fs.readFile(apk+'.sha256','utf8')).split(' ')[0];
const page=Buffer.from(`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>WeRoam · 安卓下载</title><style>*{box-sizing:border-box}body{margin:0;min-height:100dvh;display:grid;place-items:center;background:#f5f5f7;font:16px system-ui,-apple-system,sans-serif;color:#1d1d1f;padding:24px}.card{max-width:420px;width:100%;text-align:center;background:white;border:1px solid #e8e8ed;border-radius:24px;padding:36px 28px;box-shadow:0 16px 60px #00000008}h1{font-size:28px;margin:12px 0}p{color:#64646c;line-height:1.7;font-size:14px}.icon{width:80px;height:80px;border-radius:20px}.qr{display:block;width:200px;height:200px;margin:18px auto}a{display:block;padding:15px;background:#0066cc;color:white;border-radius:12px;text-decoration:none;font-weight:600}small{display:block;color:#888;font-size:12px;line-height:1.8;margin-top:16px}.size{font-size:13px;color:#888}details{margin-top:20px;text-align:left;color:#64646c;font-size:12px}code{overflow-wrap:anywhere;font-size:10px}</style><main class="card"><img class="icon" src="/icon.png" alt="WeRoam"><h1>WeRoam</h1><p>把朋友带进风景里</p><span class="size">${product.displayVersion} · 安卓演示版 · ${(stat.size/1024/1024).toFixed(0)} MB · Android 8.0+</span><img class="qr" src="${qr}" alt="用手机扫描下载"><a href="/${name}" download>下载安卓安装包</a><small>手机与电脑连接同一 Wi-Fi<br>下载后点击 APK，按系统提示允许本次安装</small><details><summary>版本与说明</summary><p>${product.displayVersion} · 三场景离线演示<br>消息使用本地演示数据，未连接真实平台。<br>头像生成需在「我 → 设置 → 模型服务配置」填写自己的图片服务与 Hyper3D 密钥；安装包不含预置密钥。<br>保留手机数据需使用同一签名更新；卸载会移除本地数据。</p><p>SHA-256<br><code>${digest}</code></p></details></main></html>`);
// Dedicated public-artifact endpoint: never serves the project or local API.
const server=http.createServer(async(req,res)=>{
 const route=new URL(req.url,'http://localhost').pathname;
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
 res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Cache-Control','no-store');
 try{
  if(route==='/'){res.setHeader('Content-Type','text/html; charset=utf-8');res.end(req.method==='HEAD'?undefined:page);}
  else if(route==='/icon.png'){res.setHeader('Content-Type','image/png');res.end(req.method==='HEAD'?undefined:await fs.readFile('assets/branding/weroam-icon.png'));}
  else if(route==='/'+name){res.writeHead(200,{'Content-Type':'application/vnd.android.package-archive','Content-Length':stat.size,'Content-Disposition':`attachment; filename="${name}"`});if(req.method==='HEAD')res.end();else await pipeline(createReadStream(apk),res);}
  else if(route==='/'+name+'.sha256'){res.setHeader('Content-Type','text/plain');res.end(req.method==='HEAD'?undefined:await fs.readFile(apk+'.sha256'));}
  else{res.writeHead(404);res.end();}
 }catch{if(!res.headersSent)res.writeHead(500);res.end();}
});
server.on('error',e=>{console.error(e.message);process.exitCode=1;});
server.listen(port,'0.0.0.0',()=>{console.log(`Android download: ${url}`);for(const other of urls.filter(x=>x!==url))console.log(`Alternative LAN address: ${other}`);console.log(`Local preview: http://localhost:${port}/`);});
