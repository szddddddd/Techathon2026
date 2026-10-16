import {spawn} from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
const baseline=process.argv[2];if(!baseline)throw new Error('Pass a separate baseline checkout directory.');
const results={baselineFull:[],optimizedFull:[],optimizedReuse:[]};
async function measure(cwd,force=false){const start=performance.now();const log=await new Promise((resolve,reject)=>{const child=spawn(process.execPath,['scripts/build.mjs',...(force?['--force']:[])],{cwd,windowsHide:true});let text='';child.stdout.on('data',d=>text+=d);child.stderr.on('data',d=>text+=d);child.once('error',reject);child.once('exit',c=>c?reject(new Error(text)):resolve(text));});return{ms:performance.now()-start,log};}
for(let i=0;i<3;i++){
 results.baselineFull.push(await measure(path.resolve(baseline),true));
 results.optimizedFull.push(await measure(process.cwd(),true));
 results.optimizedReuse.push(await measure(process.cwd()));
}
await fs.mkdir('.test-results/performance',{recursive:true});await fs.writeFile('.test-results/performance/build.json',JSON.stringify(results,null,2));
console.log(JSON.stringify(Object.fromEntries(Object.entries(results).map(([key,samples])=>[key,samples.map(s=>s.ms)])),null,2));
