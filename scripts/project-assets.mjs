import fs from 'node:fs/promises';
import path from 'node:path';
import {PLACEMENTS} from '../src/layout.js';
import {treeAssetPath} from '../src/tree-assets.js';
import {GROUP_TYPES} from '../src/group-catalog.js';
import {FUJI_VISUALS} from '../src/fuji-visuals.js';
import {FRIENDS} from '../src/social-store.js';
import {ACCOUNTS,ARTICLES,CREATORS,VIDEOS} from '../src/discovery-catalog.js';
import {MUSIC_TRACKS} from '../src/sound.js';

// Resolve dynamic model URLs as well as media links. This list covers all three
// scenes, their explicit failure fallbacks, friend portraits and desktop pets.
export async function currentProjectAssets(){
 const files=new Set();
 files.add('assets/ideal-city/scene.glb');files.add('assets/ideal-city/manifest.json');
 files.add('assets/ideal-city/lowpoly/scene.glb');files.add('assets/ideal-city/lowpoly/manifest.json');
 const addModel=(folder,manifest=false)=>{files.add(folder+'/scene.glb');if(manifest)files.add(folder+'/manifest.json');};
 const kinds=new Set([...PLACEMENTS.filter(p=>p.enabled!==false).map(p=>p.kind),'tree','tree_birch','tree_maple','rock','grass','fern_large']);
 for(const kind of kinds)files.add(treeAssetPath(kind));
 addModel('assets/rodin/record-player');
 for(const kind of ['letter_tree','wood_bench','notice_board'])addModel('assets/rodin-valley/'+kind);
 addModel('assets/rodin-mountain');
 for(const {id} of GROUP_TYPES)addModel('assets/rodin-groups/'+id);
 const fujiFolders=new Set(['fuji',...Object.values(FUJI_VISUALS.treeAssets),...FUJI_VISUALS.treeFallbacks,'sakura_a','sakura_b',...['locomotive','carriage','station','track','gate',...GROUP_TYPES.map(t=>t.id)].map(k=>'railway-'+k)]);
 for(const folder of fujiFolders)addModel('assets/rodin-fuji/'+folder,true);
 for(const friend of FRIENDS){addModel(`assets/rodin-friends/${friend.animal}`);files.add(`assets/rodin-friends/${friend.animal}/portrait.webp`);}
 function media(value){if(typeof value==='string'&&value.startsWith('assets/')&&/\.(?:jpg|png|webp|svg|mp3|mp4|webm)$/.test(value))files.add(value);else if(Array.isArray(value))value.forEach(media);else if(value&&typeof value==='object')Object.values(value).forEach(media);}
 media([ACCOUNTS,ARTICLES,CREATORS,VIDEOS,MUSIC_TRACKS]);
 for(const name of ['forest','river','camp','sky'])files.add(`assets/social/${name}.svg`);
 // Retained GLBs currently embed their textures; also support external URIs.
 for(const file of [...files].filter(f=>f.endsWith('.glb'))){const bytes=await fs.readFile(file);const size=bytes.readUInt32LE(12),data=JSON.parse(bytes.subarray(20,20+size).toString('utf8'));for(const item of [...data.images||[],...data.buffers||[]])if(item.uri&&!item.uri.startsWith('data:'))files.add(path.posix.normalize(path.posix.join(path.posix.dirname(file),decodeURIComponent(item.uri))));}
 return [...files].sort();
}
