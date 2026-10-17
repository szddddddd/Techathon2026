import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import {Hyper3dClient,resultData} from '../server/hyper3d-client.mjs';

const folder='assets/rodin-fuji/fuji-v2',privateFolder='records/fuji-mountain-v2',input='output/imagegen/fuji-v2-reference.png';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const prompt='One complete iconic Mount Fuji mountain, faithfully reconstruct the supplied generated reference image. Broad gently concave volcanic slopes with natural radial erosion gullies, interlocking rock planes and continuous low foothills. Slightly irregular summit with a subtle recessed crater formed in the mountain, not a separate ring. Organic ivory snow cap with thin tapering snow fingers in gullies, no straight or angular cutout edge. Light blue-grey volcanic rock and muted sage foothills, richly detailed softly faceted hand-painted miniature, bright matte pastel colors. One continuous mountain, width 36 depth 22 height 16.5. Complete back and sides with consistent natural terrain detail. Entire mountain only, irregular natural grounded base; no ground disc, pedestal, floating island, background plane, trees, buildings, rivers, water, people, text or baked shadows. Avoid a perfect smooth cone and detached rocks.';
await fs.mkdir(folder,{recursive:true});await fs.mkdir(privateFolder,{recursive:true});
const taskPath=privateFolder+'/task.json';let record;
try{record=JSON.parse(await fs.readFile(taskPath,'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;record={phase:'new'};}
const save=()=>fs.writeFile(taskPath,JSON.stringify(record,null,2));
if(!record.generationId){try{const receipt=JSON.parse(await fs.readFile(privateFolder+'/submission.json','utf8'));record.generationId=receipt.generation_id;}catch(e){if(e.code!=='ENOENT')throw e;}}
if(record.phase==='submitting'&&!record.generationId)throw Error('Submission uncertain: inspect the original receipt before any new paid call.');
const client=new Hyper3dClient();
try{
 let tools=await client.tools();for(let i=0;i<4&&!Object.keys(tools.tools||{}).length&&tools.runtimeStatus!=='authenticationRequired';i++){await new Promise(r=>setTimeout(r,1500));tools=await client.tools();}
 if(!tools.tools?.rodin_generate)throw Error('Hyper3D authenticated tool unavailable; no generation submitted.');
 if(!record.generationId){
  const bytes=await fs.readFile(input);await fs.copyFile(input,folder+'/reference.png');await fs.writeFile(folder+'/prompt.txt',prompt+'\n');
  const data=resultData(await client.call('rodin_create_uploads',{files:[{filename:'fuji-v2-reference.png',mime_type:'image/png',size_bytes:bytes.length}]})),upload=data.uploads?.[0];if(!upload)throw Error('No upload slot');
  const response=await fetch(upload.upload_url,{method:'PUT',headers:upload.headers,body:bytes,signal:AbortSignal.timeout(120000)});if(!response.ok)throw Error('Reference upload failed '+response.status);
  record={phase:'submitting',referenceSha256:hash(bytes),parameters:{reference_upload_ids:[upload.upload_id],prompt,tier:'Gen-2.5-Medium',mesh_mode:'Raw',quality_override:30000,geometry_file_format:'glb'},submittedAt:new Date().toISOString()};await save();
  const receipt=resultData(await client.call('rodin_generate',record.parameters));await fs.writeFile(privateFolder+'/submission.json',JSON.stringify(receipt,null,2));
  if(!receipt.generation_id)throw Error('Missing task ID: inspect saved receipt, never automatically resubmit.');record.generationId=receipt.generation_id;record.phase='processing';await save();console.log('Submitted Fuji v2:',record.generationId);
 }
 if(record.phase==='downloaded'){console.log('Existing downloaded revision preserved:',record.generationId);process.exitCode=0;}
 else{
  let completed=false;for(let i=0;i<120;i++){
   const status=resultData(await client.call('rodin_get_status',{generation_id:record.generationId}));record.status=status;await save();console.log('Fuji v2:',status.status);
   if(status.status==='failed')throw Error('Generation failed; task preserved.');if(status.status==='completed'){completed=true;break;}await new Promise(r=>setTimeout(r,15000));
  }
  if(!completed)throw Error('Still processing; resume this script to query the same task.');
  const result=resultData(await client.call('rodin_get_result',{generation_id:record.generationId}));await fs.writeFile(privateFolder+'/result-private.json',JSON.stringify(result,null,2));
  const file=result.files?.find(f=>f.name?.endsWith('.glb'));if(!file)throw Error('No GLB result');const response=await fetch(file.url,{signal:AbortSignal.timeout(120000)});if(!response.ok)throw Error('Download failed '+response.status);const bytes=Buffer.from(await response.arrayBuffer());if(bytes.subarray(0,4).toString()!=='glTF')throw Error('Invalid GLB');
  await fs.writeFile(folder+'/source.glb',bytes);await fs.copyFile(folder+'/source.glb',folder+'/scene.glb');
  const {reference_upload_ids,...parameters}=record.parameters;
  await fs.writeFile(folder+'/manifest.json',JSON.stringify({id:'fuji-v2',provider:'Hyper3D MCP OAuth',generationId:record.generationId,parameters,reference:'reference.png',referenceSha256:record.referenceSha256,original:'source.glb',scene:'scene.glb',sha256:hash(bytes),bytes:bytes.length,rotationY:0,adoption:'pending visual inspection'},null,2));record.phase='downloaded';await save();console.log('Downloaded Fuji v2:',bytes.length,'bytes');
 }
}finally{client.close();}
