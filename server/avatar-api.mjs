import fs from 'node:fs/promises';
import path from 'node:path';
import {AvatarPipeline,imageMime} from './avatar-pipeline.mjs';

export function createAvatarApi({root,port,pipeline=new AvatarPipeline({root})}){
  let ready;const initialize=()=>ready??=pipeline.init();
  const json=(res,status,data)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(data));};
  async function body(req){let n=0;const chunks=[];for await(const b of req){n+=b.length;if(n>9*1024*1024)throw new Error('上传内容过大。');chunks.push(b);}return JSON.parse(Buffer.concat(chunks).toString());}
  async function handle(req,res){
    const url=new URL(req.url,'http://localhost');if(!url.pathname.startsWith('/api/avatar/'))return false;
    try{
      const allowed=new Set([`localhost:${port}`,`127.0.0.1:${port}`]);if(!allowed.has(req.headers.host))return json(res,403,{error:'不支持的本地访问地址。'}),true;
      if(req.headers.origin&&!allowed.has(new URL(req.headers.origin).host))return json(res,403,{error:'不支持的请求来源。'}),true;
      if(req.method==='POST'&&(req.headers['x-forest-avatar']!=='1'||!req.headers['content-type']?.startsWith('application/json')))return json(res,403,{error:'请从添加好友页面操作。'}),true;
      await initialize();
      const route=url.pathname.slice('/api/avatar/'.length);
      if(req.method==='GET'&&route==='status'){json(res,200,await pipeline.status(url.searchParams.get('connect')!=='0'));return true;}
      if(req.method==='GET'&&route==='jobs'){json(res,200,{jobs:pipeline.list()});return true;}
      if(req.method==='POST'&&route==='jobs'){json(res,202,await pipeline.create(await body(req)));return true;}
      const jobRoute=/^jobs\/([a-f0-9-]{36})(?:\/(continue|retry|cancel|recover))?$/.exec(route);
      if(jobRoute){if(req.method==='GET'&&!jobRoute[2]){const job=pipeline.public(pipeline.jobs.get(jobRoute[1]));json(res,job?200:404,job||{error:'未找到任务。'});return true;}if(req.method==='POST'&&jobRoute[2]){const value=await body(req);json(res,200,await pipeline.act(jobRoute[1],jobRoute[2],value.generationId));return true;}}
      const asset=/^assets\/([a-f0-9-]{36})\/(avatar\.img|reference\.img|scene\.glb)$/.exec(route);
      if(req.method==='GET'&&asset){const bytes=await fs.readFile(path.join(pipeline.dataDir,asset[1],asset[2]));res.writeHead(200,{'Content-Type':asset[2]==='scene.glb'?'model/gltf-binary':imageMime(bytes),'Content-Length':bytes.length,'Cache-Control':'private, max-age=3600','X-Content-Type-Options':'nosniff'});res.end(bytes);return true;}
      json(res,404,{error:'未找到生成接口。'});
    }catch(error){json(res,400,{error:error.code==='ENOENT'?'生成文件暂不可用。':String(error.message||'生成服务暂不可用。').slice(0,300)});}return true;
  }
  return {handle,close:()=>pipeline.close()};
}
