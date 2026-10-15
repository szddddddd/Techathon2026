import {build} from 'esbuild';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const {version}=JSON.parse(await fs.readFile(path.join(root,'package.json'),'utf8'));
await Promise.all(['main','asset-review','pet'].map(name=>build({entryPoints:[path.join(root,'src',name+'.js')],bundle:true,format:'iife',minify:true,outfile:path.join(root,'dist',name==='main'?'world.js':name==='asset-review'?'review.js':'pet.js'),logLevel:'info'})));
for(const filename of ['index.html','pet.html']){
 const full=path.join(root,filename);let source=await fs.readFile(full,'utf8');
 source=source.replace(/((?:src|href)="[^"?]+\.(?:js|css))(?:\?[^" ]*)?"/g,`$1?v=${version}"`);
 source=source.replace(/<meta name="forest-version" content="[^"]*">/,'');
 source=source.replace(/<title>[^<]*<\/title>/,`<title>林间来信 v${version}${filename==='pet.html'?' · 桌宠':' · 朋友住在风景里'}</title>`);
 source=source.replace('</head>',`<meta name="forest-version" content="${version}"></head>`);
 await fs.writeFile(full,source);
}
console.log(`Built Forest Letters v${version}`);
