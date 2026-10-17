import fs from 'node:fs/promises';
import path from 'node:path';
import * as THREE from 'three';
import {loadGeometryGLB} from '../scripts/glb-geometry.mjs';
import {readImageConfig} from './image-config.mjs';
import {RodinRestClient,resultData} from './rodin-rest-client.mjs';

const ID=/^[a-f0-9-]{36}$/;
const style='Cozy woodland miniature game character, softly faceted low-poly sculpted forms, hand-painted matte materials, warm cream and muted sage/olive accents, gentle rounded proportions matching a forest diorama. ';
export const avatarPrompt=description=>style+'Use the attached avatar as the identity reference: preserve recognizable hair, face, markings, glasses and clothing colors. Create exactly ONE cute cartoon character, FULL BODY from head to both feet, directly facing the camera, orthographic front view, relaxed symmetrical A-pose with hands separated from torso and legs apart, feet flat. Infer unseen body and clothing coherently. Plain warm off-white background, even soft studio lighting, no cast shadow, no pedestal, no text, no scenery, no extra views or accessories blocking limbs. '+String(description||'').slice(0,500);
const clone=v=>structuredClone(v);
export function imageMime(bytes){if(bytes[0]===0x89&&bytes.subarray(1,4).toString()==='PNG')return'image/png';if(bytes[0]===255&&bytes[1]===216)return'image/jpeg';if(bytes.subarray(0,4).toString()==='RIFF'&&bytes.subarray(8,12).toString()==='WEBP')return'image/webp';throw new Error('请使用有效的 PNG、JPG 或 WebP 图片。');}
async function atomic(file,value){await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file+'.tmp',JSON.stringify(value,null,2));await fs.rename(file+'.tmp',file);}
async function responseBytes(response,max){if(!response.ok)throw new Error(`资源下载失败（${response.status}），可以继续查询已有任务。`);const chunks=[];let n=0;for await(const b of response.body){n+=b.length;if(n>max)throw new Error('生成文件超过当前场景支持的大小。');chunks.push(b);}return Buffer.concat(chunks);}
async function fetchAsset(url,max){const parsed=new URL(url);if(parsed.protocol!=='https:'||/^(localhost|127\.|10\.|192\.168\.|169\.254\.|\[)/i.test(parsed.hostname))throw new Error('生成服务返回了不支持的资源地址。');return responseBytes(await fetch(url,{signal:AbortSignal.timeout(120000)}),max);}

export class AvatarPipeline {
  constructor({root=process.cwd(),dataDir=path.join(root,'.forest-avatar-data'),client=new RodinRestClient({root}),imageEditor=null,pollMs=5000,download=fetchAsset,configReader=readImageConfig}={}){
    Object.assign(this,{root,dataDir,client,imageEditor,pollMs,download,configReader});this.jobs=new Map();this.running=new Map();this.creating=new Map();this.settings={};this.apiKey='';this.configError='';
  }
  async init(){
    await fs.mkdir(this.dataDir,{recursive:true});await this.loadConfig();
    for(const name of await fs.readdir(this.dataDir)){if(!ID.test(name))continue;try{const job=JSON.parse(await fs.readFile(path.join(this.dataDir,name,'job.json'),'utf8'));this.jobs.set(job.id,job);if(['image_submitting','rodin_submitting'].includes(job.phase)){job.phase='attention';job.error='上次提交的结果尚未确认。请先到生成服务检查，避免重复付费。';await this.save(job);}else if(job.phase==='model_uploading'){job.phase='image_review';this.run(job.id);}else if(['queued','model_processing','downloading'].includes(job.phase))this.run(job.id);}catch{}}
    return this;
  }
  public(job){if(!job)return null;const {uploadId,subscriptionKey,...safe}=job;return clone(safe);}
  list(){return [...this.jobs.values()].sort((a,b)=>b.createdAt-a.createdAt).map(j=>this.public(j));}
  async save(job){job.updatedAt=Date.now();await atomic(path.join(this.dataDir,job.id,'job.json'),job);}
  async loadConfig(){
    if(this.imageEditor)return;
    try{const {apiKey,...settings}=await this.configReader({root:this.root,dataDir:this.dataDir});this.apiKey=apiKey;this.settings=settings;this.configError='';}
    catch{this.apiKey='';this.configError='生图服务暂未连接，请检查本项目的本地配置后重试。';}
  }
  async status(connect=true){
    let hyper3d={connected:false,tools:[],error:''};if(connect){try{const s=await this.client.tools();hyper3d={connected:!!s.tools?.rodin_generate,tools:Object.keys(s.tools||{}),error:''};}catch{hyper3d.error='请检查本项目的 Rodin REST 密钥配置。';}}
    return {image:{configured:!!this.apiKey||!!this.imageEditor,error:this.configError},hyper3d};
  }
  create(input){
    if(this.creating.has(input.requestId))return this.creating.get(input.requestId);
    const task=this.createOnce(input).finally(()=>this.creating.delete(input.requestId));this.creating.set(input.requestId,task);return task;
  }
  async createOnce(input){
    if(!ID.test(input.requestId||''))throw new Error('无效的请求标识。');
    const old=this.jobs.get(input.requestId);if(old)return this.public(old);
    if(!String(input.name||'').trim())throw new Error('给这位朋友起个名字吧。');
    const bytes=Buffer.from(String(input.avatarBase64||''),'base64');if(!bytes.length||bytes.length>6*1024*1024)throw new Error('头像不能超过 6MB。');const avatarMime=imageMime(bytes);
    if(!this.apiKey&&!this.imageEditor)await this.loadConfig();
    if(!this.apiKey&&!this.imageEditor)throw new Error(this.configError||'本机生图服务暂未连接。');
    const id=input.requestId,dir=path.join(this.dataDir,id);await fs.mkdir(dir,{recursive:true});await fs.writeFile(path.join(dir,'avatar.img'),bytes);
    const job={id,name:String(input.name).trim().slice(0,40),description:String(input.description||'').slice(0,500),pinned:input.pinned!==false,autoContinue:input.autoContinue!==false,phase:'queued',createdAt:Date.now(),avatarMime,avatarUrl:`/api/avatar/assets/${id}/avatar.img`};
    this.jobs.set(id,job);await this.save(job);this.run(id);return this.public(job);
  }
  async editImage(job){
    if(this.imageEditor)return this.imageEditor(job,await fs.readFile(path.join(this.dataDir,job.id,'avatar.img')));
    const form=new FormData();form.set('model',this.settings.model);form.set('prompt',avatarPrompt(job.description));form.set('size',this.settings.size);form.set('n','1');form.set('image',new Blob([await fs.readFile(path.join(this.dataDir,job.id,'avatar.img'))],{type:job.avatarMime}),'avatar'+(job.avatarMime==='image/png'?'.png':job.avatarMime==='image/webp'?'.webp':'.jpg'));
    let response;try{response=await fetch(this.settings.baseURL+'/images/edits',{method:'POST',headers:{Authorization:'Bearer '+this.apiKey},body:form,signal:AbortSignal.timeout(240000)});}catch{const e=new Error('生图请求结果未确认，请先在生图服务查看记录，避免重复付费。');e.ambiguous=true;throw e;}
    if(!response.ok){const e=new Error(`生图服务返回 ${response.status}，请检查地址、模型、余额或图片要求。`);e.ambiguous=response.status>=500;throw e;}
    const result=await response.json(),image=result.data?.[0];if(image?.b64_json)return Buffer.from(image.b64_json,'base64');if(image?.url)return this.download(image.url,20*1024*1024);const e=new Error('生图结果尚未确认，请先检查服务记录。');e.ambiguous=true;throw e;
  }
  run(id){if(this.running.has(id))return this.running.get(id);const task=this.work(this.jobs.get(id)).finally(()=>this.running.delete(id));this.running.set(id,task);return task;}
  async work(job){
    try{
      if(job.phase==='queued'){
        job.phase='image_submitting';await this.save(job);const bytes=await this.editImage(job);if(bytes.length>20*1024*1024)throw new Error('形象图过大。');job.referenceMime=imageMime(bytes);
        await fs.writeFile(path.join(this.dataDir,job.id,'reference.img'),bytes);job.referenceUrl=`/api/avatar/assets/${job.id}/reference.img`;job.phase='image_review';await this.save(job);if(!job.autoContinue)return;
      }
      if(job.phase==='image_review'){
        job.phase='model_uploading';await this.save(job);
        const bytes=await fs.readFile(path.join(this.dataDir,job.id,'reference.img'));
          job.phase='rodin_submitting';await this.save(job);
          let generation;try{generation=await this.client.generateImage(bytes,job.referenceMime,style+'One complete full-body character matching the reference, standing on both feet, separated limbs. No ground, no pedestal, no extra objects.');}catch{const e=new Error('Rodin 提交结果未确认，请先检查原任务，不会自动重复提交。');e.ambiguous=true;throw e;}
          if(!ID.test(generation?.generation_id||'')){const e=new Error('Rodin 未返回有效任务编号，请先检查原任务。');e.ambiguous=true;throw e;}
          job.generationId=generation.generation_id;job.phase='model_processing';await this.save(job);
      }
      if(job.phase==='model_processing'){
        for(let i=0;i<360;i++){
          if(job.phase==='cancelled')return;
          if(i===0)await new Promise(r=>setTimeout(r,this.pollMs));
          const status=resultData(await this.client.call('rodin_get_status',{generation_id:job.generationId}));job.stage=status.stage;await this.save(job);
          if(status.status==='failed')throw new Error('Rodin 生成失败，可查看 Hyper3D 的任务记录。');
          if(status.status==='completed'){job.phase='downloading';await this.save(job);break;}
          await new Promise(r=>setTimeout(r,this.pollMs));
        }
        if(job.phase==='model_processing')throw new Error('模型仍在生成，可继续查询原任务。');
      }
      if(job.phase==='downloading'){
        const result=resultData(await this.client.call('rodin_get_result',{generation_id:job.generationId})),file=result.files?.find(f=>f.role==='model'&&f.name.toLowerCase().endsWith('.glb'));if(!file)throw new Error('生成结果中没有 GLB 模型。');
        const bytes=await this.download(file.url,35*1024*1024),target=path.join(this.dataDir,job.id,'scene.glb');if(bytes.subarray(0,4).toString()!=='glTF')throw new Error('下载结果不是有效 GLB。');
        // Reject external model dependencies before Three.js can issue any secondary request.
        const json=JSON.parse(bytes.subarray(20,20+bytes.readUInt32LE(12)).toString());if([...(json.buffers||[]),...(json.images||[])].some(v=>v.uri&&!v.uri.startsWith('data:')))throw new Error('模型包含外部依赖，暂不能加入场景。');
        await fs.writeFile(target,bytes);const {model}=await loadGeometryGLB(target),bounds=new THREE.Box3().setFromObject(model),size=bounds.getSize(new THREE.Vector3());let triangles=0;model.traverse(o=>{if(o.isMesh)triangles+=(o.geometry.index?.count||o.geometry.attributes.position.count)/3;});
        if(!Number.isFinite(size.y)||size.y<=.00001||triangles>60000)throw new Error('模型体积或面数不适合当前场景，请检查生成结果。');
        job.modelUrl=`/api/avatar/assets/${job.id}/scene.glb`;job.displayUrl=result.display_url;job.triangles=triangles;job.phase='ready';job.error='';await this.save(job);
      }
    }catch(error){if(job.phase==='cancelled')return;job.attentionStage=job.phase==='image_submitting'?'image':'rodin';job.resumePhase=job.generationId?(job.phase==='downloading'?'downloading':'model_processing'):job.referenceUrl?'image_review':'queued';job.phase=error.ambiguous?'attention':'failed';job.error=error.message;await this.save(job);}
  }
  async act(id,action,generationId){
    const job=this.jobs.get(id);if(!job)throw new Error('未找到这次生成。');if(this.running.has(id))return this.public(job);
    if(action==='cancel'){job.phase='cancelled';await this.save(job);return this.public(job);}
    if(action==='continue'&&job.phase==='image_review')this.run(id);
    else if(action==='retry'&&job.phase==='failed'){job.phase=job.resumePhase;job.error='';await this.save(job);this.run(id);}
    else if(action==='recover'&&job.phase==='attention'&&ID.test(generationId||'')){job.generationId=generationId;job.phase='model_processing';await this.save(job);this.run(id);}
    return this.public(job);
  }
  close(){this.client.close();}
}
