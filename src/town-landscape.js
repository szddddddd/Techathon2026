import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {addTownCars} from './town-cars.js';
import {COMMUNITY_PARKING} from './community-layout.js';
import {COMMUNITY_HEIGHT as Y,COMMUNITY_PATHS,COMMUNITY_PLAZAS,COMMUNITY_GARDENS,COMMUNITY_TREES,COMMUNITY_BENCHES,COMMUNITY_LAMPS,COMMUNITY_PLANTERS,GROUP_QUEUE,GROUP_SLOTS,plotPoint,distanceToTownPath} from './community-layout.js';

export function createCommunityGround(scene){
 const root=new T.Group();root.name='Riverside garden neighbourhood';scene.add(root);
 const material=color=>new T.MeshStandardMaterial({color,roughness:.96,flatShading:true});
 const stone=material(0xaaa78b),wood=material(0x9d7953),metal=material(0x66725d),soil=material(0x78805c),stem=material(0x68875a);
 const leaves=[0x93ad6c,0xa8ba79,0x7f9f65].map(material),flowers=[0xf3eed4,0xe4c967,0xb7a9c6].map(material);
 const glow=new T.MeshStandardMaterial({color:0xf2ddb1,emissive:0xd8b981,emissiveIntensity:.28,roughness:.8});
 function mesh(parent,name,geometry,mat,x=0,y=0,z=0){const m=new T.Mesh(geometry,mat);m.name=name;m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 const box=(parent,name,x,y,z,w,h,d,mat)=>mesh(parent,name,new T.BoxGeometry(w,h,d),mat,x,y,z);
 // A single clipped surface unions paths and squares. No stacked strips at junctions.
 const doorPaths=GROUP_SLOTS.map(p=>{const a=plotPoint(p,0,1.72);return{kind:'gravel',width:1.6,points:[[a.x,a.z],[p.entry.x,p.entry.z]]};});
 const paths=[...COMMUNITY_PATHS,...doorPaths];
 function field(x,z,extra=0){let value=Infinity;for(const p of paths)value=Math.min(value,distanceToTownPath(x,z,p)-p.width/2-extra);for(const p of COMMUNITY_PLAZAS)value=Math.min(value,(Math.hypot((x-p.x)/p.rx,(z-p.z)/p.rz)-1)*Math.min(p.rx,p.rz)-extra);for(const p of COMMUNITY_PARKING){const dx=x-p.x,dz=z-p.z,c=Math.cos(p.rotation),s=Math.sin(p.rotation);value=Math.min(value,Math.max(Math.abs(dx*c-dz*s)-p.width/2,Math.abs(dx*s+dz*c)-p.depth/2)-extra);}return value;}
 function pave(extra,height,border=false){
  const positions=[],colors=[],kinds=[],step=.26;
  for(let x=-26;x<-3;x+=step)for(let z=-15;z<8;z+=step){
   const points=[[x,z],[x+step,z],[x+step,z+step],[x,z+step]].map(([x,z])=>({x,z,f:field(x,z,extra)}));
   if(points.every(p=>p.f>0))continue;
   const onStone=COMMUNITY_PATHS.some(p=>p.kind==='stone'&&distanceToTownPath(x,z,p)<p.width/2)||COMMUNITY_PLAZAS.some(p=>Math.hypot((x-p.x)/p.rx,(z-p.z)/p.rz)<1);
   const color=new T.Color(border?0x999e80:onStone?0x979b90:0xb5a47e).multiplyScalar(border?1:.96+.075*((Math.sin(x*51+z*29)*43758)%1+1)/2);
   for(const tri of [[points[0],points[2],points[1]],[points[0],points[3],points[2]]]){
    const clipped=[];for(let i=0;i<3;i++){const a=tri[i],b=tri[(i+1)%3],inside=a.f<=0;if(inside)clipped.push(a);if(inside!==(b.f<=0)){const t=a.f/(a.f-b.f);clipped.push({x:a.x+(b.x-a.x)*t,z:a.z+(b.z-a.z)*t});}}
    for(let i=1;i+1<clipped.length;i++)for(const p of [clipped[0],clipped[i],clipped[i+1]]){positions.push(p.x,height,p.z);colors.push(color.r,color.g,color.b);kinds.push(onStone?1:0);}
   }
  }
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('color',new T.Float32BufferAttribute(colors,3));g.setAttribute('aTownStone',new T.Float32BufferAttribute(kinds,1));g.computeVertexNormals();
  const mat=new T.MeshStandardMaterial({vertexColors:true,roughness:1});
  if(!border)mat.onBeforeCompile=shader=>{
   shader.vertexShader='attribute float aTownStone;varying float vTownStone;varying vec2 vTownXZ;\n'+shader.vertexShader;
   shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvTownXZ=position.xz;vTownStone=aTownStone;');
   shader.fragmentShader='varying float vTownStone;varying vec2 vTownXZ;\n'+shader.fragmentShader;
   shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
    vec2 tile=vec2(vTownXZ.x/.78+mod(floor(vTownXZ.y/.52),2.)*.5,vTownXZ.y/.52);
    vec2 edge=min(fract(tile),1.-fract(tile));
    float seam=1.-smoothstep(.015,.045,min(edge.x,edge.y));
    float grain=fract(sin(dot(floor(vTownXZ*24.),vec2(12.9898,78.233)))*43758.5453);
    diffuseColor.rgb*=mix(.95+grain*.09,1.-seam*.18,step(.5,vTownStone));`);
  };
  const m=mesh(root,border?'Town stone edging':'Unified stone and gravel streets',g,mat);m.castShadow=false;
 }
 pave(.11,Y+.012,true);pave(0,Y+.026);
 let seed=843;const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
 function garden(p,planter=false){
  const g=new T.Group();g.name=p.id||'Town flower box';g.position.set(p.x,Y,p.z);root.add(g);
  const h=planter?.27:.12;
  box(g,'Garden soil',0,h*.4,0,p.width,h*.8,p.depth,soil);
  // Broken low stone edging reads as garden boundaries rather than plot outlines.
  for(const side of [-1,1])for(let x=-p.width/2+.15;x<p.width/2;x+=.32)box(g,'Low garden stone',x,h/2,side*p.depth/2,.29,h,.13,planter?wood:stone);
  for(const side of [-1,1])for(let z=-p.depth/2+.15;z<p.depth/2;z+=.32)box(g,'Low garden stone',side*p.width/2,h/2,z,.13,h,.29,planter?wood:stone);
  const count=Math.ceil(p.width*p.depth*7);
  for(let i=0;i<count;i++){
   const x=(random()-.5)*Math.max(.1,p.width-.28),z=(random()-.5)*Math.max(.1,p.depth-.28),height=.16+random()*.22;
   const leaf=mesh(g,'Low flowering foliage',new T.IcosahedronGeometry(.12+random()*.07,0),leaves[i%3],x,h+.09,z);leaf.scale.set(1.2,.65,1);
   if(i%2===0){mesh(g,'Flower stem',new T.CylinderGeometry(.012,.014,height,4),stem,x,h+height/2,z);const bloom=mesh(g,'Small woodland flower',new T.IcosahedronGeometry(.055+random()*.025,0),flowers[(i/2)%3],x,h+height,z);bloom.scale.y=.6;}
  }
 }
 COMMUNITY_GARDENS.forEach(p=>garden(p));COMMUNITY_PLANTERS.forEach(p=>garden(p,true));
 COMMUNITY_TREES.forEach((p,i)=>{
  const g=new T.Group();g.name='Town street tree '+i;g.userData.townObstacle=true;g.position.set(p.x,Y,p.z);root.add(g);
  mesh(g,'Tree trunk',new T.CylinderGeometry(.09,.16,p.height*.65,6),wood,0,p.height*.325,0);
  for(let j=0;j<5;j++){const a=j*2.4+i,leaf=mesh(g,'Small faceted crown',new T.IcosahedronGeometry(.48,1),leaves[(i+j)%3],Math.cos(a)*.28,p.height-.65+(j%2)*.2,Math.sin(a)*.28);leaf.scale.set(1,.85+j*.04,.9);}
 });
 COMMUNITY_BENCHES.forEach((p,i)=>{
  const g=new T.Group();g.name='Town bench '+i;g.userData.townObstacle=true;g.position.set(p.x,Y,p.z);g.rotation.y=p.rotation;root.add(g);
  for(const z of [-.15,0,.15])box(g,'Warm wood seat',0,.43,z,1.6,.08,.12,wood);
  for(const y of [.65,.83])box(g,'Bench back',0,y,-.21,1.6,.13,.06,wood);
  for(const x of [-.57,.57]){box(g,'Bench legs',x,.21,0,.08,.42,.4,metal);box(g,'Back support',x,.61,-.23,.06,.56,.06,metal);}
 });
 COMMUNITY_LAMPS.forEach((p,i)=>{
  const g=new T.Group();g.name='Town low lamp '+i;g.position.set(p.x,Y,p.z);root.add(g);
  box(g,'Lamp base',0,.045,0,.23,.09,.23,stone);mesh(g,'Lamp stem',new T.CylinderGeometry(.035,.055,1.0,6),metal,0,.55,0);
  box(g,'Warm lantern',0,1.08,0,.19,.24,.19,glow);const cap=mesh(g,'Lantern roof',new T.ConeGeometry(.2,.15,4),metal,0,1.26,0);cap.rotation.y=Math.PI/4;
 });
 // The live timber message board is owned by group-scene.
 addTownCars(root);
 // Batch only town scenery; live group buildings remain independently selectable.
 root.updateMatrixWorld(true);const buckets=new Map();root.traverse(m=>{if(!m.isMesh||m.material.vertexColors)return;const key=m.material.uuid;if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(m);});
 for(const meshes of buckets.values()){
  const geometries=meshes.map(m=>{const g=m.geometry.clone().applyMatrix4(m.matrixWorld);for(const attr of Object.keys(g.attributes))if(!['position','normal'].includes(attr))g.deleteAttribute(attr);if(g.index){const flat=g.toNonIndexed();g.dispose();return flat;}return g;});
  const combined=mergeGeometries(geometries);if(combined){const batch=mesh(root,'Town landscape batch',combined,meshes[0].material);meshes.forEach(m=>{m.removeFromParent();m.geometry.dispose();});}geometries.forEach(g=>g.dispose());
 }
 return root;
}
