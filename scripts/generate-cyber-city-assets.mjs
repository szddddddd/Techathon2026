import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import {Hyper3dClient,resultData} from '../server/hyper3d-client.mjs';

const catalogAll=JSON.parse(await fs.readFile('output/imagegen/cyber-city-v2/catalog.json','utf8'));
const ids=process.argv.slice(2).filter(a=>!a.startsWith('--'));
const catalog=catalogAll.filter(a=>!ids.length||ids.includes(a.id)).map(a=>({...a,prompt:a.rodinPrompt}));
if(!catalog.length)throw Error('No matching cyber assets');
const submitOnly=process.argv.includes('--submit-only'),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
async function read(file){try{return JSON.parse(await fs.readFile(file,'utf8'));}catch(e){if(e.code==='ENOENT')return null;throw e;}}
async function json(file,value){await fs.writeFile(file+'.tmp',JSON.stringify(value,null,2));await fs.rename(file+'.tmp',file);}
async function download(url){
 for(let attempt=0;attempt<4;attempt++){
  try{const response=await fetch(url,{signal:AbortSignal.timeout(120000)});if(!response.ok)throw Error('Download HTTP '+response.status);return Buffer.from(await response.arrayBuffer());}
  catch(error){if(attempt===3)throw Error('Asset download failed; task retained for resume');await new Promise(r=>setTimeout(r,1500));}
 }
}
const client=new Hyper3dClient();
try{
 let inventory=await client.tools();for(let i=0;i<5&&!inventory.tools?.rodin_generate;i++){if(inventory.runtimeStatus==='authenticationRequired')throw Error('Hyper3D OAuth authorization required');await new Promise(r=>setTimeout(r,1500));inventory=await client.tools();}if(!inventory.tools?.rodin_generate)throw Error('Rodin tool unavailable');
 const tasks=[];
 for(const asset of catalog){
  const folder='assets/rodin-cyber-city-v2/'+asset.id,privateFolder='records/cyber-city-v2/'+asset.id,input='output/imagegen/cyber-city-v2/'+asset.id+'.png';await fs.mkdir(folder,{recursive:true});await fs.mkdir(privateFolder,{recursive:true});
  const taskPath=privateFolder+'/task.json';let task=await read(taskPath)||{phase:'new'};const receipt=await read(privateFolder+'/submission.json');task.generationId||=receipt?.generation_id;
  if(task.phase==='submitting'&&!task.generationId)throw Error('Uncertain submission; inspect existing receipt before any retry: '+asset.id);
  if(!task.generationId){
   const bytes=await fs.readFile(input);await fs.copyFile(input,folder+'/reference.png');await fs.writeFile(folder+'/prompt.txt',asset.prompt+'\n');
   const slot=resultData(await client.call('rodin_create_uploads',{files:[{filename:asset.id+'.png',mime_type:'image/png',size_bytes:bytes.length}]})).uploads?.[0];if(!slot)throw Error('No upload slot');
   const response=await fetch(slot.upload_url,{method:'PUT',headers:slot.headers,body:bytes,signal:AbortSignal.timeout(120000)});if(!response.ok)throw Error('Reference upload failed: '+response.status);
   task={phase:'submitting',referenceSha256:hash(bytes),parameters:{reference_upload_ids:[slot.upload_id],prompt:asset.prompt,tier:'Gen-2.5-Medium',mesh_mode:'Raw',quality_override:30000,geometry_file_format:'glb',texture_delight:true},submittedAt:new Date().toISOString()};await json(taskPath,task);
   const result=resultData(await client.call('rodin_generate',task.parameters));await json(privateFolder+'/submission.json',result);if(!result.generation_id)throw Error('No task id; do not resubmit');task.generationId=result.generation_id;task.phase='processing';await json(taskPath,task);console.log('Submitted',asset.id,task.generationId);
  }
  tasks.push({asset,folder,privateFolder,taskPath,task});
 }
 if(!submitOnly)for(let cycle=0;cycle<180;cycle++){
  for(const item of tasks){const {asset,folder,privateFolder,taskPath,task}=item;if(task.phase==='downloaded')continue;
   const status=resultData(await client.call('rodin_get_status',{generation_id:task.generationId}));task.status=status;await json(taskPath,task);if(task.lastLoggedStatus!==status.status){console.log(asset.id,status.status);task.lastLoggedStatus=status.status;}
   if(status.status==='failed')throw Error('Rodin failed; task preserved: '+asset.id);
   if(status.status!=='completed')continue;
   const result=resultData(await client.call('rodin_get_result',{generation_id:task.generationId}));await json(privateFolder+'/result-private.json',result);const file=result.files?.find(f=>f.name?.endsWith('.glb'));if(!file)throw Error('No GLB result');
   const bytes=await download(file.url);if(bytes.subarray(0,4).toString()!=='glTF')throw Error('Not a GLB');await fs.writeFile(folder+'/source.glb',bytes);await fs.writeFile(folder+'/scene.glb',bytes);
   const {reference_upload_ids,...parameters}=task.parameters;await json(folder+'/manifest.json',{id:asset.id,name:asset.name,provider:'Hyper3D MCP OAuth',generationId:task.generationId,parameters,reference:'reference.png',referenceSha256:task.referenceSha256,imageProvider:'project configured OpenAI-compatible gpt-image-2 via bundled imagegen CLI',imagePrompt:'../../../output/imagegen/cyber-city-v2/'+asset.id+'-prompt.txt',targetSize:asset.size,original:'source.glb',scene:'scene.glb',sha256:hash(bytes),bytes:bytes.length,rotationY:0,adoption:'pending three-view and scene review'});task.phase='downloaded';await json(taskPath,task);console.log('Downloaded',asset.id,bytes.length);
  }
  if(tasks.every(t=>t.task.phase==='downloaded'))break;
  if(cycle===179)throw Error('Still processing; resume to query the same tasks');await new Promise(r=>setTimeout(r,15000));
 }
}finally{client.close();}
