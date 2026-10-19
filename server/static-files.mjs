import fs from 'node:fs';
import path from 'node:path';
import {promisify} from 'node:util';
import {brotliCompress,gzip,constants} from 'node:zlib';
import {pipeline} from 'node:stream/promises';

const brotli=promisify(brotliCompress),zip=promisify(gzip);
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json','.glb':'model/gltf-binary','.mp3':'audio/mpeg','.webm':'video/webm','.mp4':'video/mp4','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.gif':'image/gif'};
const text=/\.(?:html|js|css|json|svg)$/i;
// Bound retained compressed data. Concurrent requests share a compression job.
const compressed=new Map();let cacheBytes=0;
const maxBytes=24*1024*1024;
// Model/audio transfers otherwise issue one filesystem read per 64 KiB. A
// bounded 256 KiB buffer reduces IO callbacks without retaining whole assets.
const transferChunkBytes=256*1024;
async function bodyFor(file,stamp,encoding){
 const key=file+'|'+encoding;
 const cached=compressed.get(key);
 if(cached?.stamp===stamp)return cached.promise;
 if(cached){cacheBytes-=cached.bytes||0;compressed.delete(key);}
 const entry={stamp,bytes:0};
 entry.promise=fs.promises.readFile(file).then(data=>encoding==='br'?brotli(data,{params:{[constants.BROTLI_PARAM_QUALITY]:4}}):zip(data,{level:6})).then(data=>{
  if(compressed.get(key)===entry){entry.bytes=data.length;cacheBytes+=data.length;while(cacheBytes>maxBytes&&compressed.size){const [oldKey,old]=compressed.entries().next().value;compressed.delete(oldKey);cacheBytes-=old.bytes;}}
  return data;
 }).catch(error=>{if(compressed.get(key)===entry)compressed.delete(key);throw error;});
 compressed.set(key,entry);return entry.promise;
}
function acceptedEncoding(value=''){
 const quality=new Map(value.toLowerCase().split(',').map(part=>{const [name,...params]=part.trim().split(';');const q=params.find(v=>v.trim().startsWith('q='));return[name,q?Number(q.trim().slice(2)):1];}));
 const q=name=>quality.get(name)??quality.get('*')??0;
 return q('br')>0&&q('br')>=q('gzip')?'br':q('gzip')>0?'gzip':null;
}

export async function serveStatic(req,res,root){
 let relative;
 try{relative=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);res.end();return;}
 if(relative==='/')relative='/index.html';
 const file=path.resolve(root,/^\/(?:index|pet|asset-review|rig-review|data-transfer)\.html$/.test(relative)?'src/pages'+relative:'.'+relative);
 if(!file.startsWith(root+path.sep)||relative.includes('\\')||relative.split('/').some(part=>part==='.'||part==='..')||!(relative==='/startup.js'||/^\/(assets|dist|src)\//.test(relative)||/^\/[a-z0-9-]+\.(html|css|jpg|png)$/i.test(relative))){res.writeHead(404);res.end();return;}
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{Allow:'GET, HEAD'});res.end();return;}
 try{
  const stat=await fs.promises.stat(file);if(!stat.isFile())throw new Error('Not a file');
  const stamp=stat.size.toString(16)+'-'+stat.mtimeMs.toString(16);
  const compressible=text.test(file)&&stat.size>=1024&&stat.size<=8*1024*1024;
  const encoding=compressible&&!req.headers.range?acceptedEncoding(req.headers['accept-encoding']):null;
  const etag=`W/"${stamp}${encoding?'-'+encoding:''}"`;
  const headers={'Content-Type':mime[path.extname(file)]||'application/octet-stream','Accept-Ranges':'bytes','Cache-Control':'no-cache',ETag:etag,'Last-Modified':stat.mtime.toUTCString()};
  if(compressible)headers.Vary='Accept-Encoding';
  if(encoding)headers['Content-Encoding']=encoding;
  const noneMatch=req.headers['if-none-match'];
  const modified=req.headers['if-modified-since'];
  if(noneMatch?(noneMatch.split(',').some(tag=>tag.trim()==='*'||tag.trim().replace(/^W\//,'')===etag.replace(/^W\//,''))):(modified&&Math.floor(stat.mtimeMs/1000)<=Math.floor(Date.parse(modified)/1000))){res.writeHead(304,headers);res.end();return;}
  // Weak validators cannot satisfy If-Range. A valid date can; otherwise send the
  // complete representation, so a changed file is never spliced into old bytes.
  const ifRange=req.headers['if-range'];
  const range=req.headers.range&&(!ifRange||(!ifRange.includes('"')&&stat.mtimeMs< Date.parse(ifRange)+1000))?req.headers.range:null;
  const match=range&&/^bytes=(\d*)-(\d*)$/.exec(range);
  if(match&&(match[1]||match[2])){
   const start=match[1]?Number(match[1]):Math.max(0,stat.size-Number(match[2]));
   const end=match[1]?(match[2]?Math.min(Number(match[2]),stat.size-1):stat.size-1):stat.size-1;
   if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start>end||start>=stat.size){res.writeHead(416,{...headers,'Content-Range':`bytes */${stat.size}`});res.end();return;}
   res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${stat.size}`,'Content-Length':end-start+1});
   if(req.method==='HEAD')res.end();else await pipeline(fs.createReadStream(file,{start,end,highWaterMark:Math.min(transferChunkBytes,end-start+1)}),res);
  }else if(encoding){
   const body=await bodyFor(file,stamp,encoding);res.writeHead(200,{...headers,'Content-Length':body.length});res.end(req.method==='HEAD'?undefined:body);
  }else{
   res.writeHead(200,{...headers,'Content-Length':stat.size});if(req.method==='HEAD')res.end();else await pipeline(fs.createReadStream(file,{highWaterMark:Math.min(transferChunkBytes,Math.max(1,stat.size))}),res);
  }
 }catch{if(res.headersSent)res.destroy();else{res.writeHead(404);res.end();}}
}
