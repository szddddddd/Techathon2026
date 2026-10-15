import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import config from '../desktop/runtime-config.cjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const port=config.webPort(root);
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json','.glb':'model/gltf-binary','.mp3':'audio/mpeg','.webm':'video/webm','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.gif':'image/gif'};
const server=http.createServer(async(req,res)=>{
 let relative;try{relative=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);res.end();return;}
 if(relative==='/')relative='/index.html';
 const file=path.resolve(root,'.'+relative);
 if(!file.startsWith(root+path.sep)||relative.includes('\\')||!(/^\/(assets|dist|src)\//.test(relative)||/^\/[a-z0-9-]+\.(html|css|jpg|png)$/i.test(relative))){res.writeHead(404);res.end();return;}
 try{
  const stat=await fs.promises.stat(file);if(!stat.isFile())throw new Error();
  const type=mime[path.extname(file)]||'application/octet-stream',range=req.headers.range;
  const headers={'Content-Type':type,'Accept-Ranges':'bytes','Cache-Control':'no-cache'};
  const match=range&&/^bytes=(\d+)-(\d*)$/.exec(range);
  if(match){const start=Number(match[1]),end=Math.min(match[2]?Number(match[2]):stat.size-1,stat.size-1);if(start>end||start>=stat.size){res.writeHead(416,{'Content-Range':`bytes */${stat.size}`});res.end();return;}res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${stat.size}`,'Content-Length':end-start+1});if(req.method==='HEAD')res.end();else fs.createReadStream(file,{start,end}).pipe(res);}
  else{res.writeHead(200,{...headers,'Content-Length':stat.size});if(req.method==='HEAD')res.end();else fs.createReadStream(file).pipe(res);}
 }catch{res.writeHead(404);res.end();}
});
server.on('error',error=>{console.error(`Cannot start http://localhost:${port}/: ${error.message}`);process.exitCode=1;});
server.listen(port,'127.0.0.1',()=>console.log(`Forest Letters: http://localhost:${port}/ (Ctrl+C to stop)`));
