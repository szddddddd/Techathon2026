import fs from 'node:fs/promises';
import path from 'node:path';

/** Read local credentials on the server only. Never return this object to a browser. */
export async function readImageConfig({root=process.cwd(),dataDir=path.join(root,'.forest-avatar-data')}={}){
  const config=JSON.parse(await fs.readFile(path.join(dataDir,'image-config.json'),'utf8'));
  const baseURL=String(config.baseURL||'').replace(/\/$/,'');
  const url=new URL(baseURL);
  if(url.protocol!=='https:'||url.username||url.password||url.search||url.hash)throw new Error('本机生图服务地址须为 HTTPS。');
  const apiKey=String(config.apiKey||'').trim(),model=String(config.model||'gpt-image-2').trim();
  if(!apiKey||!model)throw new Error('本项目的生图配置不完整。');
  return {baseURL,model,size:['1024x1024','1024x1536','1536x1024'].includes(config.size)?config.size:'1024x1536',apiKey};
}
