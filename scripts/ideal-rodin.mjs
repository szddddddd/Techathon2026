import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {RodinRestClient,resultData} from '../server/rodin-rest-client.mjs';

// One explicitly selected asset at a time. A persisted submit marker prevents
// ambiguous network results from ever becoming an automatic second charge.
const root=process.cwd(),record=path.resolve(root,'records/ideal-lowpoly-20261017');
const [action,id]=process.argv.slice(2);
const catalog=JSON.parse(await fs.readFile(path.join(record,'catalog.json'),'utf8'));
const item=catalog.items.find(item=>item.id===id);
if(!item||!['submit','status','download'].includes(action))throw Error('Usage: node scripts/ideal-rodin.mjs submit|status|download <catalog-id>');
const dir=path.join(record,id),stateFile=path.join(dir,'job.json'),client=new RodinRestClient({root});
let state={};try{state=JSON.parse(await fs.readFile(stateFile,'utf8'));}catch(error){if(error.code!=='ENOENT')throw error;}
const save=()=>fs.writeFile(stateFile,JSON.stringify(state,null,2));
if(action==='submit'){
 if(state.generationId){console.log(id+': already submitted '+state.generationId);process.exit(0);}
 if(state.submittedAt)throw Error(id+': submission unresolved; reconcile original task before doing anything else.');
 const bytes=await fs.readFile(path.join(dir,'reference.png')),prompt=await fs.readFile(path.join(dir,'rodin-prompt.txt'),'utf8');
 await client.config();
 state={id,submittedAt:new Date().toISOString(),status:'submitting',referenceSha256:createHash('sha256').update(bytes).digest('hex'),settings:{tier:'Gen-2.5-Medium',mesh_mode:'Raw',quality_override:20000,geometry_file_format:'glb'},prompt};await save();
 try{const result=await client.generateImage(bytes,'image/png',prompt,{faceCount:20000});state.generationId=result.generation_id;state.status='processing';await save();console.log(id+': submitted '+state.generationId);}catch(error){state.status='submission-unresolved';state.error=error.message;state.networkCode=error.code;if(['UND_ERR_CONNECT_TIMEOUT','ENOTFOUND','ECONNREFUSED'].includes(error.code)){state.status='not-sent';state.failedConnectionAt=state.submittedAt;delete state.submittedAt;}await save();throw error;}
}else{
 if(!state.generationId)throw Error(id+': no known task; will not submit.');
 if(action==='status'){
  const status=resultData(await client.call('rodin_get_status',{generation_id:state.generationId}));state.status=status.status;state.stage=status.stage;await save();console.log(JSON.stringify({id,...status}));
 }else{
  const result=resultData(await client.call('rodin_get_result',{generation_id:state.generationId}));
  const file=result.files?.find(f=>/\.glb$/i.test(f.name||''));if(!file?.url)throw Error(id+': no GLB result available.');
  const response=await fetch(file.url,{signal:AbortSignal.timeout(180000)});if(!response.ok)throw Error(id+': download HTTP '+response.status);
  const bytes=Buffer.from(await response.arrayBuffer());if(bytes.toString('utf8',0,4)!=='glTF')throw Error(id+': downloaded result is not a GLB');
  await fs.writeFile(path.join(dir,'raw.glb'),bytes);state.status='downloaded';state.bytes=bytes.length;state.modelSha256=createHash('sha256').update(bytes).digest('hex');state.downloadedAt=new Date().toISOString();await save();console.log(id+': downloaded '+bytes.length+' bytes');
 }
}
