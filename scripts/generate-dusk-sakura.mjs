import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import {Hyper3dClient,resultData} from '../server/hyper3d-client.mjs';

const ids=process.argv.filter(a=>/^sakura-(yoshino|weeping)-v3(?:r1)?$/.test(a));
const selected=ids.length?ids:['sakura-yoshino-v3','sakura-weeping-v3'];
const submitOnly=process.argv.includes('--submit-only'),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const common='One complete natural densely flowering Japanese cherry tree, precisely reconstruct this isolated supplied reference INCLUDING THE FULL PINK FLOWERING CROWN, not just the trunk or bare branches. Dense pink blossom clusters are essential solid geometry attached to every branch. Elegant continuous branching grey-brown trunk with root flare, open lower trunk, densely covered small irregular blossom sprays, lacy negative spaces and visible branch forks. Use layered detailed textured blossom clusters rather than smooth spherical crown lobes. Dusty pale rose and ivory-pink flowers, matte miniature game-art materials. Complete consistent back and sides. No ground, pedestal, grass, sky, buildings, disconnected floating petals, text, or baked lighting. Keep the crown and branches connected, preserve an identifiable natural tree silhouette.';
const catalog=selected.map(id=>({id,name:id.includes('yoshino')?'舒展型染井吉野':'纤长型枝垂樱',prompt:common+(id.includes('yoshino')?' Broad gently spreading asymmetrical crown, branching upward and outward in multiple irregular tiers.':' Relatively narrow upright tree, graceful outward-arching fine limbs and hanging flower-laden branchlets; the lower one-third is open for pedestrians.')}));
async function read(file){try{return JSON.parse(await fs.readFile(file,'utf8'));}catch(e){if(e.code==='ENOENT')return null;throw e;}}
async function json(file,value){await fs.writeFile(file+'.tmp',JSON.stringify(value,null,2));await fs.rename(file+'.tmp',file);}
const client=new Hyper3dClient();
try{
 let inventory=await client.tools();for(let i=0;i<5&&!inventory.tools?.rodin_generate;i++){if(inventory.runtimeStatus==='authenticationRequired')throw Error('Hyper3D OAuth authorization required');await new Promise(r=>setTimeout(r,1500));inventory=await client.tools();}if(!inventory.tools?.rodin_generate)throw Error('Rodin tool unavailable');
 const tasks=[];
 for(const asset of catalog){
  const folder='assets/rodin-fuji/'+asset.id,privateFolder='records/dusk-sakura/'+asset.id,input='output/imagegen/dusk-sakura/'+asset.id+'.png';await fs.mkdir(folder,{recursive:true});await fs.mkdir(privateFolder,{recursive:true});
  const taskPath=privateFolder+'/task.json';let task=await read(taskPath)||{phase:'new'};const receipt=await read(privateFolder+'/submission.json');task.generationId||=receipt?.generation_id;
  if(task.phase==='submitting'&&!task.generationId)throw Error('Uncertain submission; inspect existing receipt before any retry: '+asset.id);
  if(!task.generationId){
   const bytes=await fs.readFile(input);await fs.copyFile(input,folder+'/reference.png');await fs.writeFile(folder+'/prompt.txt',asset.prompt+'\n');
   const slot=resultData(await client.call('rodin_create_uploads',{files:[{filename:asset.id+'.png',mime_type:'image/png',size_bytes:bytes.length}]})).uploads?.[0];if(!slot)throw Error('No upload slot');
   const response=await fetch(slot.upload_url,{method:'PUT',headers:slot.headers,body:bytes,signal:AbortSignal.timeout(120000)});if(!response.ok)throw Error('Reference upload failed: '+response.status);
   task={phase:'submitting',referenceSha256:hash(bytes),parameters:{reference_upload_ids:[slot.upload_id],prompt:asset.prompt,tier:'Gen-2.5-Medium',mesh_mode:'Raw',quality_override:30000,geometry_file_format:'glb'},submittedAt:new Date().toISOString()};await json(taskPath,task);
   const result=resultData(await client.call('rodin_generate',task.parameters));await json(privateFolder+'/submission.json',result);if(!result.generation_id)throw Error('No task id; do not resubmit');task.generationId=result.generation_id;task.phase='processing';await json(taskPath,task);console.log('Submitted',asset.id,task.generationId);
  }
  tasks.push({asset,folder,privateFolder,taskPath,task});
 }
 if(!submitOnly)for(let cycle=0;cycle<180;cycle++){
  for(const item of tasks){const {asset,folder,privateFolder,taskPath,task}=item;if(task.phase==='downloaded')continue;
   const status=resultData(await client.call('rodin_get_status',{generation_id:task.generationId}));task.status=status;await json(taskPath,task);console.log(asset.id,status.status);
   if(status.status==='failed')throw Error('Rodin failed; task preserved: '+asset.id);
   if(status.status!=='completed')continue;
   const result=resultData(await client.call('rodin_get_result',{generation_id:task.generationId}));await json(privateFolder+'/result-private.json',result);const file=result.files?.find(f=>f.name?.endsWith('.glb'));if(!file)throw Error('No GLB result');
   const response=await fetch(file.url,{signal:AbortSignal.timeout(120000)});if(!response.ok)throw Error('Download failed '+response.status);const bytes=Buffer.from(await response.arrayBuffer());if(bytes.subarray(0,4).toString()!=='glTF')throw Error('Not a GLB');await fs.writeFile(folder+'/source.glb',bytes);await fs.writeFile(folder+'/scene.glb',bytes);
   const {reference_upload_ids,...parameters}=task.parameters;await json(folder+'/manifest.json',{id:asset.id,name:asset.name,provider:'Hyper3D MCP OAuth',generationId:task.generationId,parameters,reference:'reference.png',referenceSha256:task.referenceSha256,imageProvider:'project configured OpenAI-compatible gpt-image-2 via imagegen CLI',imagePrompt:'../../../output/imagegen/dusk-sakura/'+asset.id+'-prompt.txt',original:'source.glb',scene:'scene.glb',sha256:hash(bytes),bytes:bytes.length,rotationY:0,adoption:'pending three-view and scene review'});task.phase='downloaded';await json(taskPath,task);console.log('Downloaded',asset.id,bytes.length);
  }
  if(tasks.every(t=>t.task.phase==='downloaded'))break;
  if(cycle===179)throw Error('Still processing; resume to query the same tasks');await new Promise(r=>setTimeout(r,15000));
 }
}finally{client.close();}
