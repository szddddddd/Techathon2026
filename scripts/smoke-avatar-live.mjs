// Explicit opt-in smoke run; one image edit and one Rodin job. Never run as part of npm test.
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import {AvatarPipeline} from '../server/avatar-pipeline.mjs';
const pipeline=await new AvatarPipeline().init();
try{
  const input=process.argv[2];if(!input)throw new Error('Pass a permitted avatar image path.');
  const job=await pipeline.create({requestId:crypto.randomUUID(),name:'头像流水线验证',avatarBase64:(await fs.readFile(input)).toString('base64'),autoContinue:true,pinned:true,description:'Preserve this friendly kangaroo identity. No brand logos or lettering.'});
  console.log('Started',job.id);
  await pipeline.running.get(job.id);
  const result=pipeline.public(pipeline.jobs.get(job.id));
  await fs.mkdir('validation/avatar-pipeline',{recursive:true});
  await fs.writeFile('validation/avatar-pipeline/live-result.json',JSON.stringify(result,null,2));
  console.log(JSON.stringify(result));
}finally{pipeline.close();}
