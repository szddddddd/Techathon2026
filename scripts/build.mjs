import {build,version as esbuildVersion} from 'esbuild';
import {createHash} from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const {version}=JSON.parse(await fs.readFile(path.join(root,'package.json'),'utf8'));
const digest=data=>createHash('sha256').update(data).digest('hex');
const cacheFile=path.join(root,'.cache/build-state.json');
const fingerprint=async files=>Object.fromEntries(await Promise.all(files.map(async name=>[name,digest(await fs.readFile(path.join(root,name)))])));
const tools=['scripts/build.mjs','package.json','package-lock.json'];
let cached,unchanged=false;
try{
 cached=JSON.parse(await fs.readFile(cacheFile,'utf8'));
 const required=[...tools,'src/main.js','src/asset-review.js','src/pet.js','src/rig-review.js','dist/world.js','dist/review.js','dist/pet.js','dist/rig-review.js','src/character-rig-worker.js','dist/rig-worker.js','src/inbox/ui.js','dist/inbox.js'];
 if(!process.argv.includes('--force')&&cached.esbuild===esbuildVersion&&cached.node===process.versions.node&&required.every(name=>typeof cached.files?.[name]==='string')){
  const current=await fingerprint(Object.keys(cached.files));
  unchanged=Object.entries(cached.files).every(([name,hash])=>current[name]===hash);
 }
}catch{/* A fresh checkout, missing output or invalid cache always builds. */}
if(!unchanged){
 // One graph lets esbuild parse shared dependencies (especially Three.js) once.
 // Keep standalone IIFE bundles, so pages still load exactly the same scripts.
 const results=await Promise.all([
  build({absWorkingDir:root,entryPoints:{world:'src/main.js',review:'src/asset-review.js',pet:'src/pet.js','rig-review':'src/rig-review.js','rig-worker':'src/character-rig-worker.js'},bundle:true,format:'iife',minify:true,outdir:'dist',metafile:true,write:false,logLevel:'info'}),
  // Inbox is an independent ESM entry. The scene fetches it only when its list
  // is opened; demo fixtures and persistence never enter the initial 3D bundle.
  build({absWorkingDir:root,entryPoints:{inbox:'src/inbox/ui.js'},bundle:true,format:'esm',minify:true,outdir:'dist',metafile:true,write:false,logLevel:'info'})
 ]);
 const result={metafile:{inputs:Object.assign({},...results.map(r=>r.metafile.inputs))},outputFiles:results.flatMap(r=>r.outputFiles)};
 // Include imported dependencies and the outputs: deleted or edited bundles cannot
 // produce a false cache hit, even when source file timestamps are preserved.
 const files=await fingerprint([...new Set([...tools,...Object.keys(result.metafile.inputs)])]);
 await fs.mkdir(path.join(root,'dist'),{recursive:true});
 await Promise.all(result.outputFiles.map(async output=>{
  // Hash esbuild's exact bytes in memory: rereading just-written bundles costs
  // extra IO on Windows, especially while antivirus inspects the new files.
  files[path.relative(root,output.path).split(path.sep).join('/')]=digest(output.contents);
  let existing;try{existing=await fs.readFile(output.path);}catch{}
  if(!existing?.equals(output.contents))await fs.writeFile(output.path,output.contents);
 }));
 await fs.mkdir(path.dirname(cacheFile),{recursive:true});
 await fs.writeFile(cacheFile,JSON.stringify({esbuild:esbuildVersion,node:process.versions.node,files}));
}
for(const filename of ['index.html','pet.html']){
 const full=path.join(root,filename),original=await fs.readFile(full,'utf8');let source=original;
 source=source.replace(/((?:src|href)="[^"?]+\.(?:js|css))(?:\?[^" ]*)?"/g,`$1?v=${version}"`);
 source=source.replace(/<meta name="forest-version" content="[^"]*">/,'');
 source=source.replace(/<title>[^<]*<\/title>/,`<title>林间来信 v${version}${filename==='pet.html'?' · 桌宠':' · 朋友住在风景里'}</title>`);
 source=source.replace('</head>',`<meta name="forest-version" content="${version}"></head>`);
 if(source!==original)await fs.writeFile(full,source);
}
console.log(`${unchanged?'Reused unchanged build for':'Built'} Forest Letters v${version}`);
