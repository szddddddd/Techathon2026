import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {currentProjectAssets} from './project-assets.mjs';

const assets=await currentProjectAssets();
for(const file of assets){const stat=await fs.stat(file);assert.ok(stat.isFile()&&stat.size>0,'Missing runtime asset: '+file);if(file.endsWith('/manifest.json')){const manifest=JSON.parse(await fs.readFile(file,'utf8'));assert.ok(Number.isFinite(manifest.rotationY??0),'Invalid asset rotation: '+file);}}
console.log(`PASS: ${assets.length} runtime asset files across forest, Fuji, cyber, fallback models, friends, discovery and music.`);
