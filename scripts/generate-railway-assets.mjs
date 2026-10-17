import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {Hyper3dClient,resultData} from '../server/hyper3d-client.mjs';
import {RAILWAY_ASSETS as FUJI_ASSETS,FUJI_GENERATION_OPTIONS} from './railway-asset-catalog.mjs';

const args=new Set(process.argv.slice(2)),checkOnly=args.has('--check'),pollOnly=args.has('--poll-only'),submitOnly=args.has('--submit-only');
const ids=[...args].filter(a=>!a.startsWith('--'));
if(ids.some(id=>!FUJI_ASSETS.some(a=>a.id===id)))throw new Error('Unknown Fuji asset id.');
const selected=FUJI_ASSETS.filter(a=>!ids.length||ids.includes(a.id));
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
async function writeJSON(file,value){await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file+'.tmp',JSON.stringify(value,null,2)+'\n');await fs.rename(file+'.tmp',file);}
async function readJSON(file){try{return JSON.parse(await fs.readFile(file,'utf8'));}catch(e){if(e.code==='ENOENT')return null;throw e;}}
async function transfer(url,options={}){let error;for(let i=0;i<3;i++){try{const response=await fetch(url,{...options,signal:AbortSignal.timeout(120000)});if(!response.ok)throw new Error('Asset transfer returned HTTP '+response.status);return response;}catch(e){error=e;if(i<2)await new Promise(r=>setTimeout(r,2000));}}throw error;}

const client=new Hyper3dClient(),jobs=[];
try {
  let server=await client.tools();
  // App-server initialization can expose the status before tool discovery finishes.
  for(let i=0;i<4&&!Object.keys(server.tools||{}).length&&server.runtimeStatus!=='authenticationRequired';i++){await new Promise(r=>setTimeout(r,2000));server=await client.tools();}
  const names=Object.keys(server.tools||{});
  console.log(JSON.stringify({server:server.name,runtimeStatus:server.runtimeStatus,authStatus:server.authStatus,tools:names}));
  if(server.runtimeStatus==='authenticationRequired')throw new Error('Hyper3D OAuth needs browser authorization. No generation submitted. Run codex mcp login hyper3d, then resume this script.');
  if(!names.length)throw new Error('Hyper3D tool discovery is unavailable. No generation submitted.');
  if(checkOnly){console.log('Read-only connection check complete.');}
  else {
    for(const asset of selected){
      const folder=`assets/rodin-fuji/${asset.id}`,privateFolder=`records/railway-assets/${asset.id}`,taskFile=`${privateFolder}/task.json`;
      await fs.mkdir(folder,{recursive:true});await fs.mkdir(privateFolder,{recursive:true});
      let record=await readJSON(taskFile)||{id:asset.id,phase:'new'};
      const save=()=>writeJSON(taskFile,record);
      // If interrupted between receipt persistence and task update, recover the same paid job.
      if(!record.generationId){const receipt=await readJSON(`${privateFolder}/submission.json`);if(receipt?.generation_id){record.generationId=receipt.generation_id;record.phase='processing';await save();}}
      if(['submitting','submission-uncertain'].includes(record.phase)&&!record.generationId)throw new Error(`${asset.id}: previous submission is uncertain; query its original receipt, never resubmit automatically.`);
      if(!record.generationId){
        if(pollOnly){console.log(`${asset.id}: no submitted task; skipped`);continue;}
        const refs=[await fs.readFile(`output/imagegen/railway-town/${asset.key}.png`)];await fs.copyFile(`output/imagegen/railway-town/${asset.key}.png`,`${folder}/reference.png`);await fs.writeFile(`${folder}/prompt.txt`,asset.prompt+'\n');
        const uploads=resultData(await client.call('rodin_create_uploads',{files:refs.map((bytes,i)=>({filename:`fuji-${asset.id}-${i?'rear':'front'}.png`,mime_type:'image/png',size_bytes:bytes.length}))})).uploads;
        if(!uploads||uploads.length!==1)throw new Error(`${asset.id}: expected one reference upload slot`);
        const uploadIds=[];
        for(let i=0;i<1;i++){const u=uploads[i];await transfer(u.upload_url,{method:'PUT',headers:u.headers,body:refs[i]});uploadIds.push(u.upload_id);}
        record={...record,phase:'submitting',submittedAt:new Date().toISOString(),referenceHashes:refs.map(hash),parameters:{...FUJI_GENERATION_OPTIONS,prompt:asset.prompt,reference_upload_ids:uploadIds}};
        // Write durable intent before the single paid call. Exceptions never trigger an automatic retry.
        await save();
        try {
          const receipt=resultData(await client.call('rodin_generate',record.parameters));
          await writeJSON(`${privateFolder}/submission.json`,receipt);
          if(!receipt.generation_id)throw new Error('Provider returned no generation id.');
          record.generationId=receipt.generation_id;record.phase='processing';await save();console.log(`${asset.id}: submitted ${record.generationId}`);
        }catch(error){record.phase='submission-uncertain';await save();throw new Error(`${asset.id}: submission result uncertain; inspect the saved receipt before any further action.`,{cause:error});}
      }
      jobs.push({asset,folder,privateFolder,record,save});
    }
    if(!submitOnly){
      for(let round=0;round<240&&jobs.some(j=>j.record.phase!=='downloaded');round++){
        for(const job of jobs){
          const {asset,folder,privateFolder,record,save}=job;if(record.phase==='downloaded')continue;
          const status=resultData(await client.call('rodin_get_status',{generation_id:record.generationId}));record.status=status;record.lastCheckedAt=new Date().toISOString();await save();console.log(`${asset.id}: ${status.status}`);
          if(status.status==='failed'){record.phase='failed';await save();throw new Error(`${asset.id}: generation failed; receipt preserved, no paid retry made.`);}
          if(status.status!=='completed')continue;
          const result=resultData(await client.call('rodin_get_result',{generation_id:record.generationId}));await writeJSON(`${privateFolder}/result-private.json`,result);
          const file=result.files?.find(f=>f.role==='model'&&f.name?.toLowerCase().endsWith('.glb'))||result.files?.find(f=>f.name?.toLowerCase().endsWith('.glb'));
          if(!file)throw new Error(`${asset.id}: original task completed without a GLB result`);
          const response=await transfer(file.url),bytes=Buffer.from(await response.arrayBuffer());if(bytes.subarray(0,4).toString()!=='glTF')throw new Error(`${asset.id}: result is not GLB`);
          await fs.writeFile(`${folder}/source.glb`,bytes);await fs.copyFile(`${folder}/source.glb`,`${folder}/scene.glb`);
          const {reference_upload_ids,...parameters}=record.parameters;
          const manifest={id:asset.id,name:asset.name,kind:asset.kind,provider:'Hyper3D MCP OAuth',generationId:record.generationId,phase:'downloaded',parameters,targetSize:{width:asset.size[0],depth:asset.size[1],height:asset.size[2]},front:asset.kind==='train'?'+X':'+Z',original:'source.glb',scene:'scene.glb',sha256:hash(bytes),bytes:bytes.length,references:['reference.png'],rotationY:0,imageProvider:'project configured OpenAI-compatible gpt-image-2',imagePrompt:`../../../output/imagegen/railway-town/${asset.key}-prompt.txt`,referenceHashes:record.referenceHashes,adoption:'pending multi-view visual review',downloadedAt:new Date().toISOString()};
          await writeJSON(`${folder}/manifest.json`,manifest);record.phase='downloaded';await save();console.log(`${asset.id}: downloaded ${bytes.length} bytes`);
        }
        if(jobs.some(j=>j.record.phase!=='downloaded'))await new Promise(r=>setTimeout(r,15000));
      }
      if(jobs.some(j=>j.record.phase!=='downloaded'))throw new Error('Tasks still processing; resume --poll-only to query the same generation ids.');
    }
    const manifests=await Promise.all(FUJI_ASSETS.map(async a=>({id:a.id,name:a.name,kind:a.kind,size:a.size,manifest:`${a.id}/manifest.json`,model:`${a.id}/scene.glb`,available:!!(await readJSON(`assets/rodin-fuji/${a.id}/manifest.json`))})));
    await writeJSON('assets/rodin-fuji/railway-catalog.json',{version:1,batchSize:14,style:'Fuji sakura Japanese miniature town',assets:manifests});
  }
}finally{client.close();}
