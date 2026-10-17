import fs from 'node:fs/promises';
import path from 'node:path';

/** Project-local REST adapter. API/subscription keys never enter public job records. */
export class RodinRestClient {
  constructor({root=process.cwd(),fetcher=fetch}={}){this.dir=path.join(root,'.forest-avatar-data');this.fetcher=fetcher;}
  async config(){let c;try{c=JSON.parse(await fs.readFile(path.join(this.dir,'hyper3d-config.json'),'utf8'));}catch{throw new Error('请配置本项目的 Rodin REST 密钥。');}if(c.baseURL!=='https://api.hyper3d.com/api/v2'||typeof c.apiKey!=='string'||!c.apiKey.trim())throw new Error('本项目 Rodin REST 配置无效。');return c;}
  async request(route,{form,json}={}){
    const c=await this.config();let response;
    try{response=await this.fetcher(c.baseURL+route,{method:form||json?'POST':'GET',headers:{Authorization:'Bearer '+c.apiKey,...(json?{'Content-Type':'application/json'}:{})},body:form|| (json?JSON.stringify(json):undefined),redirect:'error',signal:AbortSignal.timeout(180000)});}catch(cause){const error=new Error('Rodin 连接结果未确认，请查询已有任务，勿重复提交。');error.code=cause.cause?.code||cause.code||'NETWORK_UNKNOWN';throw error;}
    if(!response.ok)throw new Error(`Rodin 服务返回 ${response.status}。`);
    let data;try{data=await response.json();}catch{throw new Error('Rodin 响应未确认。');}
    if(data.error)throw new Error('Rodin 未接受请求，请检查账号或任务。');return data;
  }
  async tools(){await this.request('/check_balance');return{tools:{rodin_generate:{}}};}
  async generateImage(bytes,mime,prompt,{faceCount=12000}={}){
    if(!Number.isInteger(faceCount)||faceCount<500||faceCount>1000000)throw new Error('无效的 Rodin 面数。');
    const form=new FormData();form.set('images',new Blob([bytes],{type:mime}),'reference.'+(mime==='image/png'?'png':mime==='image/webp'?'webp':'jpg'));
    for(const [k,v] of Object.entries({tier:'Gen-2.5-Medium',mesh_mode:'Raw',quality_override:String(faceCount),geometry_file_format:'glb',prompt}))form.set(k,v);
    const data=await this.request('/rodin',{form});if(!/^[a-f0-9-]{36}$/.test(data.uuid||'')||!data.jobs?.subscription_key)throw new Error('Rodin 提交结果未确认。');
    await fs.mkdir(this.dir,{recursive:true});await fs.writeFile(path.join(this.dir,'rodin-'+data.uuid+'.json'),JSON.stringify({subscriptionKey:data.jobs.subscription_key,consumed:data.consumed}));return{generation_id:data.uuid};
  }
  async call(tool,args){
    if(!/^[a-f0-9-]{36}$/.test(args.generation_id||''))throw new Error('无效的 Rodin 任务编号。');
    if(tool==='rodin_get_status'){
      const saved=JSON.parse(await fs.readFile(path.join(this.dir,'rodin-'+args.generation_id+'.json'),'utf8'));
      const data=await this.request('/status',{json:{subscription_key:saved.subscriptionKey}}),states=(data.jobs||[]).map(j=>j.status);
      return{structuredContent:{status:states.includes('Failed')?'failed':states.length&&states.every(s=>s==='Done')?'completed':'processing',stage:{name:'Rodin',current:states.filter(s=>s==='Done').length,total:states.length}}};
    }
    if(tool==='rodin_get_result'){const data=await this.request('/download',{json:{task_uuid:args.generation_id}});return{structuredContent:{files:(data.list||[]).map(f=>({...f,role:'model'}))}};}
    throw new Error('不支持的 Rodin REST 操作。');
  }
  close(){}
}

export function resultData(result){
  if(result.structuredContent)return result.structuredContent;
  const parts=(result.content||[]).filter(p=>p.type==='text').map(p=>p.text);
  for(const text of parts){try{return JSON.parse(text);}catch{}}
  return {text:parts.join('\n')};
}
