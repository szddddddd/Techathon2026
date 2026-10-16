import fs from 'node:fs/promises';import crypto from 'node:crypto';
import {Hyper3dClient,resultData} from '../server/hyper3d-client.mjs';import {GROUP_TYPES} from '../src/group-catalog.js';
async function transfer(url,options){let last;for(let i=0;i<3;i++){try{return await fetch(url,options);}catch(error){last=error;if(i<2)await new Promise(r=>setTimeout(r,2500));}}throw last;}
const client=new Hyper3dClient(),jobs=[];
try{
 await client.tools();
 for(const type of GROUP_TYPES){
  const folder=`assets/rodin-groups/${type.id}`,privateFolder=`records/group-buildings/${type.id}`;await fs.mkdir(privateFolder,{recursive:true});
  let record;try{record=JSON.parse(await fs.readFile(privateFolder+'/task.json','utf8'));}catch(e){if(e.code!=='ENOENT')throw e;try{record=JSON.parse(await fs.readFile(folder+'/manifest.json','utf8'));}catch(e){if(e.code!=='ENOENT')throw e;record={phase:'new'};}}
  const save=()=>fs.writeFile(privateFolder+'/task.json',JSON.stringify(record,null,2));
  if(record.phase==='submitting'&&!record.generationId)throw new Error(type.id+': submission uncertain; inspect original receipt, never resubmit automatically.');
  if(!record.generationId){
   const buffers=await Promise.all(['front','rear'].map(v=>fs.readFile(`${folder}/reference-${v}.png`)));
   const uploads=resultData(await client.call('rodin_create_uploads',{files:buffers.map((b,i)=>({filename:`${type.id}-${i}.png`,mime_type:'image/png',size_bytes:b.length}))})).uploads;
   const ids=[];for(let i=0;i<uploads.length;i++){const u=uploads[i],r=await transfer(u.upload_url,{method:'PUT',headers:u.headers,body:buffers[i],signal:AbortSignal.timeout(90000)});if(!r.ok)throw new Error('Upload failed '+r.status);ids.push(u.upload_id);}
   const prompt=`One complete small ${type.building} building for a bright cozy low-poly woodland social diorama. ${type.description} Use the supplied two views as massing guidance, enrich with appealing handmade architectural details. Warm light wood, pale cream stone, muted sage greens, soft faceted shapes, readable front door toward positive Z, complete back and sides. Approximate footprint 4 by 3.5 and height 3 to 4.2. Flat grounded bottom. Isolated building only, no ground slab, no landscape, no people, no readable text, no baked shadows, no separate loose props. Cohesive miniature architecture, light matte materials, no dark realistic concrete. Do not create an interior or a cutaway.`;
   if(prompt.length>1024)throw new Error(type.id+': prompt exceeds limit');
   record={...record,phase:'submitting',parameters:{reference_upload_ids:ids,prompt,tier:'Gen-2.5-Medium',mesh_mode:'Raw',quality_override:30000,geometry_file_format:'glb'}};await save();
   const result=resultData(await client.call('rodin_generate',record.parameters));await fs.writeFile(privateFolder+'/submission.json',JSON.stringify(result,null,2));if(!result.generation_id)throw new Error('No generation ID; inspect receipt.');record.generationId=result.generation_id;record.phase='processing';await save();console.log(type.id+' submitted '+record.generationId);
  }
  jobs.push({type,folder,privateFolder,record,save});
 }
 for(let round=0;round<180&&jobs.some(j=>j.record.phase!=='downloaded');round++){
  for(const job of jobs){const {record,folder,privateFolder,type,save}=job;if(record.phase==='downloaded')continue;
   const status=resultData(await client.call('rodin_get_status',{generation_id:record.generationId}));record.status=status;await save();console.log(type.id+' '+status.status);
   if(status.status==='failed')throw new Error(type.id+' generation failed; task retained.');if(status.status!=='completed')continue;
   const result=resultData(await client.call('rodin_get_result',{generation_id:record.generationId}));await fs.writeFile(privateFolder+'/result-private.json',JSON.stringify(result,null,2));const file=result.files?.find(f=>f.role==='model'&&f.name.endsWith('.glb'));if(!file)throw new Error('Missing GLB');
   const r=await transfer(file.url,{signal:AbortSignal.timeout(120000)});if(!r.ok)throw new Error('Download '+r.status);const bytes=Buffer.from(await r.arrayBuffer());if(bytes.subarray(0,4).toString()!=='glTF')throw new Error('Invalid GLB');await fs.writeFile(folder+'/source.glb',bytes);await fs.copyFile(folder+'/source.glb',folder+'/scene.glb');
   const {reference_upload_ids,...parameters}=record.parameters;record.phase='downloaded';await save();await fs.writeFile(folder+'/manifest.json',JSON.stringify({type:type.id,provider:'Hyper3D MCP OAuth',phase:'downloaded',generationId:record.generationId,displayUrl:result.display_url,parameters,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length,original:'source.glb',scene:'scene.glb',references:['reference-front.png','reference-rear.png'],adoption:'pending visual review'},null,2));console.log(type.id+' downloaded '+bytes.length);
  }
  if(jobs.some(j=>j.record.phase!=='downloaded'))await new Promise(r=>setTimeout(r,15000));
 }
 if(jobs.some(j=>j.record.phase!=='downloaded'))throw new Error('Generation still processing; resume existing tasks.');
}finally{client.close();}
