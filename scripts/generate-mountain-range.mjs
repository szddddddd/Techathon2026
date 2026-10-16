import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import {Hyper3dClient,resultData} from '../server/hyper3d-client.mjs';
const folder='records/mountain-range',recordFile=folder+'/task.json',assetDir='assets/rodin-mountain';await fs.mkdir(folder,{recursive:true});await fs.mkdir(assetDir,{recursive:true});
let record;try{record=JSON.parse(await fs.readFile(recordFile,'utf8'));}catch(error){
 if(error.code!=='ENOENT')throw error;
 // A fresh checkout still has the public task receipt. Never pay again merely
 // because the ignored private resume file is absent on this machine.
 try{const manifest=JSON.parse(await fs.readFile(assetDir+'/manifest.json','utf8'));record={phase:'downloaded',generationId:manifest.generationId,parameters:manifest.parameters};}catch(e){if(e.code!=='ENOENT')throw e;record={phase:'new',createdAt:new Date().toISOString()};}
}
if(record.phase==='downloaded'){
 const manifest=JSON.parse(await fs.readFile(assetDir+'/manifest.json','utf8'));
 let local;try{local=await fs.readFile(assetDir+'/source.glb');}catch(e){if(e.code!=='ENOENT')throw e;}
 if(local&&crypto.createHash('sha256').update(local).digest('hex')===manifest.sha256){console.log('Existing Rodin result verified; no generation or download needed:',record.generationId);process.exit(0);}
}
const save=()=>fs.writeFile(recordFile,JSON.stringify(record,null,2));
const prompt='One coherent broad mountain RANGE for a cozy stylized woodland diorama. Match the supplied THREE VIEWS of the SAME landform and dry ravine. One dominant rounded summit on the left, one lower shoulder on the right, joined by a continuous rear ridge. Width 36, height 13.5, depth 14. SOLID unbroken back ridge behind the spring basin; the gorge must NOT cut through the rear skyline. A clearly open winding steep DRY stream gorge descends from a recessed high spring basin inside the rear ridge toward the front center, with three small rock steps. Wide continuous solid lower slopes, no detached peaks, no upright pillars. Pale grey sage rock, light olive moss ledges, bold weathered faceted ROCK strata, fractured rock ledges, not smooth grassy domes, warm hand-painted matte material. Complete back and sides. No blue water mesh, no painted water, no waterfall sheets, no trees, buildings, snow, ground slab or pedestal. Preserve the open visible ravine and low broad silhouette; a single connected mountainous landmass.';
if(prompt.length>1024)throw new Error('Prompt exceeds tool limit');
const client=new Hyper3dClient();
try{
 if(record.phase==='submitting'&&!record.generationId)throw new Error('Submission uncertain; inspect the saved task before another paid call.');
 if(!record.generationId){
  const toolset=await client.tools();if(!toolset.tools?.rodin_generate)throw new Error('Authenticated Rodin tool unavailable');
  const paths=['front','top','rear'].map(v=>`${assetDir}/reference/${v}.png`),buffers=await Promise.all(paths.map(p=>fs.readFile(p)));
  const uploads=resultData(await client.call('rodin_create_uploads',{files:paths.map((p,i)=>({filename:p.split('/').at(-1),mime_type:'image/png',size_bytes:buffers[i].length}))})).uploads;
  const ids=[];for(let i=0;i<uploads.length;i++){const u=uploads[i],r=await fetch(u.upload_url,{method:'PUT',headers:u.headers,body:buffers[i],signal:AbortSignal.timeout(90000)});if(!r.ok)throw new Error('Reference upload failed '+r.status);ids.push(u.upload_id);}
  record.parameters={reference_upload_ids:ids,prompt,tier:'Gen-2.5-Medium',mesh_mode:'Raw',quality_override:30000,geometry_file_format:'glb'};record.phase='submitting';await save();
  const result=resultData(await client.call('rodin_generate',record.parameters));await fs.writeFile(folder+'/submission.json',JSON.stringify(result,null,2));
  if(!result.generation_id)throw new Error('Missing generation ID; no automatic resubmission.');record.generationId=result.generation_id;record.phase='processing';await save();console.log('Rodin task saved:',record.generationId);
 }
 for(let i=0;i<180;i++){
  const status=resultData(await client.call('rodin_get_status',{generation_id:record.generationId}));record.status=status;await save();console.log(JSON.stringify({status:status.status,stage:status.stage}));
  if(status.status==='failed')throw new Error('Rodin task failed; record preserved.');
  if(status.status==='completed')break;
  await new Promise(r=>setTimeout(r,10000));
 }
 const result=resultData(await client.call('rodin_get_result',{generation_id:record.generationId}));await fs.writeFile(folder+'/result-private.json',JSON.stringify(result,null,2));
 const file=result.files?.find(f=>f.role==='model'&&f.name.endsWith('.glb'));if(!file)throw new Error('No completed GLB returned');
 const res=await fetch(file.url,{signal:AbortSignal.timeout(120000)});if(!res.ok)throw new Error('GLB download failed '+res.status);const bytes=Buffer.from(await res.arrayBuffer());if(bytes.subarray(0,4).toString()!=='glTF')throw new Error('Invalid downloaded GLB');await fs.writeFile(assetDir+'/source.glb',bytes);
 record.phase='downloaded';await save();
 await fs.writeFile(assetDir+'/manifest.json',JSON.stringify({provider:'Hyper3D Rodin MCP OAuth',generationId:record.generationId,displayUrl:result.display_url,parameters:{...record.parameters,reference_upload_ids:undefined},referenceImages:['reference/front.png','reference/top.png','reference/rear.png'],originalFile:'source.glb',sha256:crypto.createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length,adoption:'pending inspection'},null,2));console.log('Downloaded source.glb',bytes.length);
}finally{client.close();}
