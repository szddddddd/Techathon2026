import fs from 'node:fs/promises';
import {spawn} from 'node:child_process';
const out='validation/mountain-range',results=[];
const scripts=['test-social-store','test-social-feed','test-discovery-store','test-pet-state','test-river','test-valley','audit-rodin-valley','test-placement-clearance','test-mountain-browser','test-rodin-valley-browser','test-river-browser','test-valley-browser','test-character-drag','test-camera-pan','test-social-presence','test-discovery-scene-icons'];
for(const name of scripts){
 const start=Date.now();let output='';
 const code=await new Promise(resolve=>{const child=spawn(process.execPath,[`scripts/${name}.mjs`],{windowsHide:true,env:{...process.env,FOREST_TEST_OUTPUT:'.test-results/mountain-range'}});child.stdout.on('data',d=>{output+=d;});child.stderr.on('data',d=>{output+=d;});child.on('error',e=>{output+=e.message;resolve(-1);});child.on('close',resolve);});
 results.push({name,exitCode:code,seconds:(Date.now()-start)/1000,...(code?{error:output.slice(-2500)}:{})});console.log(JSON.stringify(results.at(-1)));
 await fs.mkdir(`${out}/regression-logs`,{recursive:true});await fs.writeFile(`${out}/regression-logs/${name}.txt`,output);await fs.writeFile(`${out}/regressions.json`,JSON.stringify(results,null,2));
}
if(results.some(r=>r.exitCode))process.exitCode=1;
