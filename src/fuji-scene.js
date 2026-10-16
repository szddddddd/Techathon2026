import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {FUJI_OUTLINE,FUJI_BOUNDS,FUJI_AREA,inFujiWorld,FUJI_MOUNTAIN,fujiHeight,queryFujiSurface} from './fuji-profile.js';
import {RAIL_START,RAIL_END,railOffset,railLength} from './fuji-railway.js';
import {createJapaneseBuilding} from './japanese-buildings.js';
import {FUJI_LAYOUT as L,townPavingAt,facilitySpaceClear} from './fuji-layout.js';
import {createSakuraPetals} from './sakura-petals.js';
import {createFujiTrain} from './fuji-train.js';

const mat=(color,extra={})=>new T.MeshStandardMaterial({color,roughness:.92,flatShading:true,...extra});
const M={grass:mat(0xa6b878),rock:mat(0x809087),darkRock:mat(0x687b79),stone:mat(0xc1baa0),path:mat(0xd1c7a9),wood:mat(0x86654d),bark:mat(0x725546),rail:mat(0x727b79,{metalness:.5}),gravel:mat(0xa1a598),red:mat(0xc35d4c),dark:mat(0x394d4c),cream:mat(0xe7d6a7),brass:mat(0xc5aa65,{metalness:.3}),window:mat(0xadc5b6),pink:[0xefbbca,0xf5ced8,0xe4a2ba,0xf7d8df].map(c=>mat(c)),leaf:[0x7a9860,0x91a66c,0x648b64].map(c=>mat(c)),light:mat(0xffe4aa,{emissive:0xffce83,emissiveIntensity:.25})};
const mesh=(p,n,g,m,x=0,y=0,z=0)=>{const o=new T.Mesh(g,m);o.name=n;o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;o.userData.generatedProp=true;p.add(o);return o;};
const box=(p,n,x,y,z,w,h,d,m=M.wood)=>mesh(p,n,new T.BoxGeometry(w,h,d),m,x,y,z);
function branch(p,a,b,r,m=M.bark){const start=new T.Vector3(...a),end=new T.Vector3(...b),o=mesh(p,'Sculpted branch',new T.CylinderGeometry(r*.65,r,start.distanceTo(end),7),m);o.position.copy(start).add(end).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),end.sub(start).normalize());return o;}
function assetInstance(asset){if(!asset)return null;const g=asset.clone(true);g.traverse(o=>{o.userData.generatedProp=true;if(o.isMesh){o.castShadow=o.receiveShadow=true;o.userData.sharedAssetGeometry=true;o.userData.sharedAssetMaterial=true;}});return g;}
function batchGroup(group){
  group.updateMatrixWorld(true);const inverse=new T.Matrix4().copy(group.matrixWorld).invert(),buckets=new Map();
  group.traverse(o=>{if(o.isMesh&&!o.userData.keepDynamic&&!o.userData.sharedAssetGeometry){const key=o.material.uuid;if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(o);}});
  for(const objects of buckets.values()){
    const geometries=objects.map(o=>{let g=o.geometry.clone().applyMatrix4(new T.Matrix4().multiplyMatrices(inverse,o.matrixWorld));for(const key of Object.keys(g.attributes))if(!['position','normal'].includes(key))g.deleteAttribute(key);if(g.index){const flat=g.toNonIndexed();g.dispose();g=flat;}return g;});
    const combined=mergeGeometries(geometries);geometries.forEach(g=>g.dispose());objects.forEach(o=>{o.removeFromParent();o.geometry.dispose();});if(combined)mesh(group,'Batched Japanese scene detail',combined,objects[0].material);
  }
}

/** One authored seasonal island; all animation is driven by the application's existing frame loop. */
export function buildFujiScene(scene,{reduced=false,assets={}}={}){
  const root=new T.Group();root.name='Fuji sakura railway island';scene.add(root);
  const scenery=new T.Group();scenery.name='Japanese paths and gardens';root.add(scenery);
  const obstacles=[],pickables=[],leaves=[],mountains=[],Y=2.22;
  let seed=8713;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  const reducedMotion=()=>typeof reduced==='boolean'?reduced:reduced?.matches;
  function obstacle(name,kind='rock'){const g=new T.Group();g.name=name;g.userData.kind=kind;g.userData.layoutId=name;root.add(g);obstacles.push(g);return g;}

  // One continuous top and a faceted basalt underside. The shared height function
  // supplies both rendered slopes and character placement, so no hidden river remains.
  const shape=new T.Shape(FUJI_OUTLINE.map(([x,z])=>new T.Vector2(x,-z))),source=new T.ShapeGeometry(shape),positions=[],colors=[];
  const topColor=new T.Color(),grassColor=new T.Color(0xb3ba92),volcanicColor=new T.Color(0x8a9ca3),snowColor=new T.Color(0xf5f0e6);
  function triangle(a,b,c){
    const edges=[[a,b,c],[b,c,a],[c,a,b]].sort((u,v)=>v[0].distanceToSquared(v[1])-u[0].distanceToSquared(u[1]));const[u,v,w]=edges[0];
    if(u.distanceToSquared(v)>1.3*1.3){const mid=u.clone().lerp(v,.5);triangle(u,mid,w);triangle(mid,v,w);return;}
    const center=a.clone().add(b).add(c).multiplyScalar(1/3),cx=center.x,cz=-center.y,h=assets.fuji?Y:fujiHeight(cx,cz),angle=Math.atan2(cz+24,cx-2);
    const snowLine=12.1+.7*Math.sin(angle*7)+.4*Math.sin(angle*13),variation=.94+.08*Math.sin(cx*.73+cz*.92);
    topColor.copy(h>snowLine?snowColor:h>4.3?volcanicColor:grassColor);if(h>5&&h<snowLine)topColor.multiplyScalar(.87+.12*Math.sin(angle*15+.3));topColor.multiplyScalar(variation);
    for(const p of[a,b,c]){positions.push(p.x,assets.fuji?Y:fujiHeight(p.x,-p.y),-p.y);colors.push(topColor.r,topColor.g,topColor.b);}
  }
  for(let i=0;i<source.index.count;i+=3)triangle(...[0,1,2].map(k=>new T.Vector2().fromBufferAttribute(source.attributes.position,source.index.getX(i+k))));source.dispose();
  const surface=new T.BufferGeometry();surface.setAttribute('position',new T.Float32BufferAttribute(positions,3));surface.setAttribute('color',new T.Float32BufferAttribute(colors,3));surface.computeVertexNormals();const meadow=mesh(root,'Fuji continuous meadow',surface,mat(0xffffff,{vertexColors:true}));meadow.userData.terrainSurface=true;
  // Cache every fractured ring once: adjacent strips cannot disagree at a seam.
  const coast=[];for(let i=0;i<FUJI_OUTLINE.length;i++){const a=FUJI_OUTLINE[i],b=FUJI_OUTLINE[(i+1)%FUJI_OUTLINE.length],steps=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/3.8);for(let j=0;j<steps;j++)coast.push([a[0]+(b[0]-a[0])*j/steps,a[1]+(b[1]-a[1])*j/steps]);}
  const rows=[{scale:1,y:Y},{scale:1,y:-.30},{scale:.92,y:-3.65},{scale:.67,y:-7.74},{scale:.18,y:-11.47}].map((row,k)=>coast.map(([x,z],i)=>{const scale=row.scale+(k===0?0:Math.sin(i*1.91+k)*.023),height=k===0?(assets.fuji?Y:fujiHeight(x,z)):row.y+Math.sin(i*1.31+k)*([0,.45,1,1.3,.7][k]);return[x*scale,height,(z+9)*scale-9];}));
  const sidePositions=[],sideColors=[],rockColor=new T.Color();function cliffFace(a,b,c,shade){rockColor.setHex([0x8d9c8e,0x7e9188,0x718980,0x9daa92][shade%4]);for(const p of[a,b,c]){sidePositions.push(...p);sideColors.push(rockColor.r,rockColor.g,rockColor.b);}}
  for(let k=0;k<rows.length-1;k++)for(let i=0;i<coast.length;i++){const j=(i+1)%coast.length;cliffFace(rows[k][i],rows[k+1][i],rows[k][j],i+k);cliffFace(rows[k][j],rows[k+1][i],rows[k+1][j],i+k+1);}for(let i=0;i<coast.length;i++)cliffFace(rows.at(-1)[i],[0,-12.84,-9],rows.at(-1)[(i+1)%coast.length],i);
  const sides=new T.BufferGeometry();sides.setAttribute('position',new T.Float32BufferAttribute(sidePositions,3));sides.setAttribute('color',new T.Float32BufferAttribute(sideColors,3));sides.computeVertexNormals();const underside=mesh(root,'Sealed fractured basalt island',sides,mat(0xffffff,{vertexColors:true,side:T.DoubleSide}));underside.castShadow=false;underside.receiveShadow=false;
  const mountain=new T.Group();mountain.name='Mount Fuji volcanic slopes';mountain.userData.kind='mountain';root.add(mountain);mountains.push(mountain);if(assets.fuji){mountain.position.set(FUJI_MOUNTAIN.x,Y,FUJI_MOUNTAIN.z);const model=assetInstance(assets.fuji);model.scale.z*=22/24.6;mountain.add(model);obstacles.push(mountain);}
  // Snow lip makes the short crater rim legible without turning the broad cone into a spike.
  const summit=fujiHeight(FUJI_MOUNTAIN.x,FUJI_MOUNTAIN.z);const rim=mesh(scenery,'Fuji snow crater lip',new T.TorusGeometry(.76,.14,5,18),mat(0xf4efe7),FUJI_MOUNTAIN.x,summit+.04,FUJI_MOUNTAIN.z);rim.rotation.x=Math.PI/2;rim.scale.z=.48;rim.visible=!assets.fuji;

  // A single clipped union makes crossings and forecourts seamless.
  const townPaths=[...L.paths,...L.slots.map(p=>({kind:'gravel',width:1.6,points:[[p.x+1.7*Math.sin(p.rotation),p.z+1.7*Math.cos(p.rotation)],[p.entry.x,p.entry.z]]}))];
  function pathDistance(x,z,path){let best=Infinity;for(let i=1;i<path.points.length;i++){const a=path.points[i-1],b=path.points[i],dx=b[0]-a[0],dz=b[1]-a[1],d=dx*dx+dz*dz,t=d?Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/d)):0;best=Math.min(best,Math.hypot(x-a[0]-t*dx,z-a[1]-t*dz));}return best-path.width/2;}
  function roadField(x,z){let d=Math.min(...townPaths.map(p=>pathDistance(x,z,p)));for(const p of L.parking){const c=Math.cos(p.rotation),s=Math.sin(p.rotation),dx=x-p.x,dz=z-p.z;d=Math.min(d,Math.max(Math.abs(dx*c-dz*s)-p.width/2,Math.abs(dx*s+dz*c)-p.depth/2));}for(const p of L.plazas)if(p.id!=='sakura-plaza')d=Math.min(d,(Math.hypot((x-p.x)/p.rx,(z-p.z)/p.rz)-1)*Math.min(p.rx,p.rz));return d;}
  const pavingMat=mat(0xffffff,{vertexColors:true});pavingMat.onBeforeCompile=shader=>{shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec2 vFujiPaving;').replace('#include <project_vertex>','#include <project_vertex>\nvFujiPaving=(modelMatrix*vec4(transformed,1.0)).xz;');shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying vec2 vFujiPaving;').replace('#include <color_fragment>','#include <color_fragment>\nvec2 tile=vec2(vFujiPaving.x*.95+mod(floor(vFujiPaving.y*1.8),2.0)*.5,vFujiPaving.y*1.8);vec2 edge=min(fract(tile),1.0-fract(tile));float seam=1.0-smoothstep(.012,.042,min(edge.x,edge.y));diffuseColor.rgb*=1.0-seam*.10*step(.50,vColor.r);');};pavingMat.customProgramCacheKey=()=> 'fuji-stone-streets';
  function pave(extra,height,material){const vertices=[],tints=[],color=new T.Color(),step=.36;for(let x=-26;x<28;x+=step)for(let z=-17;z<10;z+=step)for(const corners of[[[x,z],[x+step,z],[x,z+step]],[[x+step,z],[x+step,z+step],[x,z+step]]]){const polygon=corners.map(([x,z])=>({x,z,d:roadField(x,z)-extra})),clipped=[];for(let i=0;i<3;i++){const a=polygon[i],b=polygon[(i+1)%3],ain=a.d<=0,bin=b.d<=0;if(ain)clipped.push(a);if(ain!==bin){const t=a.d/(a.d-b.d);clipped.push({x:a.x+(b.x-a.x)*t,z:a.z+(b.z-a.z)*t});}}for(let i=1;i+1<clipped.length;i++){const tri=[clipped[0],clipped[i+1],clipped[i]],cx=tri.reduce((v,p)=>v+p.x,0)/3,cz=tri.reduce((v,p)=>v+p.z,0)/3,stone=townPaths.some(p=>p.kind!=='asphalt'&&pathDistance(cx,cz,p)<0);color.setHex(stone?0xcac4b6:0x94978f).multiplyScalar(.98+.03*Math.sin(cx*7+cz*5));for(const p of tri){vertices.push(p.x,height,p.z);tints.push(color.r,color.g,color.b);}}}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(vertices,3));if(material===pavingMat)g.setAttribute('color',new T.Float32BufferAttribute(tints,3));g.computeVertexNormals();mesh(root,extra?'Fuji road edging':'Fuji continuous stone streets',g,material).castShadow=false;}
  pave(.25,Y+.012,M.stone);pave(0,Y+.034,pavingMat);
  const gardenPlaza=L.plazas.find(p=>p.id==='sakura-plaza'),plaza=mesh(scenery,'Sakura gathering plaza',new T.CylinderGeometry(gardenPlaza.rx,gardenPlaza.rx,.07,48),M.path,gardenPlaza.x,Y+.025,gardenPlaza.z);plaza.castShadow=false;
  for(let j=0;j<48;j++){const a=j/48*Math.PI*2;box(scenery,'Plaza stone edging',gardenPlaza.x+Math.cos(a)*gardenPlaza.rx,Y+.08,gardenPlaza.z+Math.sin(a)*gardenPlaza.rz,.42,.12,.25,M.stone).rotation.y=-a;}

  const treeMaterials=new Map();
  function sakura(x,z,height=4.8,variant=0,{interactive=false,id=String(variant)}={}){
    const g=new T.Group();g.name=interactive?'Letter tree lamp':'Sakura blossom tree '+variant;g.position.set(x,fujiHeight(x,z),z);root.add(g);const scale=height/4.7,asset=assets[variant%2?'sakura_b':'sakura_a'];
    if(asset){const model=assetInstance(asset);model.scale.multiplyScalar(scale);const tone=[...id].reduce((n,c)=>n+c.charCodeAt(0),0)%3;model.traverse(o=>{if(!o.isMesh)return;const tinted=m=>{const key=m.uuid+':'+tone;if(!treeMaterials.has(key)){const copy=m.clone();copy.color.multiply(new T.Color([0xffcfe3,0xffbfd8,0xffdbe9][tone]));treeMaterials.set(key,copy);}return treeMaterials.get(key);};o.material=Array.isArray(o.material)?o.material.map(tinted):tinted(o.material);o.userData.sharedAssetMaterial=false;});g.add(model);}else{
      branch(g,[0,0,0],[-.12,2.7*scale,0],.21*scale);branch(g,[-.1,1.5*scale,0],[-1.05*scale,3.3*scale,.1*scale],.14*scale);branch(g,[-.08,2.1*scale,0],[1.05*scale,3.45*scale,.28*scale],.12*scale);branch(g,[-.1,2.4*scale,0],[0,3.8*scale,-.75*scale],.13*scale);
      [[-1.12,3.3,.16,1.15],[.93,3.48,.35,1.13],[-.15,3.95,-.62,1.2],[.14,3.6,.9,1.12],[-.65,4,.15,1.04],[.92,4,-.4,.88],[-1.05,3.75,-.7,.84]].forEach(([xx,yy,zz,r],i)=>{const o=mesh(g,'Sakura blossom cloud',new T.IcosahedronGeometry(r*scale,1),M.pink[(i+variant)%4],xx*scale,yy*scale,zz*scale);o.scale.set(1,.72,1);o.rotation.y=i*.8;});batchGroup(g);
    }
    // Lightweight trunk collider avoids copying high-poly blossom triangles 24 times.
    const trunk=obstacle('Sakura trunk '+id,'tree');trunk.position.copy(g.position);const collider=mesh(trunk,'Cherry trunk placement',new T.CylinderGeometry(.22,.26,2.6,7),M.bark,0,1.3,0);collider.visible=false;collider.userData.collisionProxy=true;
    if(interactive){g.userData.landmark='plaza';pickables.push(g);for(let i=0;i<4;i++){const light=M.light.clone(),o=mesh(g,'Letter blossom light',new T.SphereGeometry(.095,7,5),light,Math.cos(i*1.6)*.75,2.9+i*.15,Math.sin(i*1.6)*.75);leaves.push(o);}}
    return g;
  }
  for(const path of L.paths.filter(p=>p.kind==='asphalt'))for(let i=1;i<path.points.length;i++){const a=path.points[i-1],b=path.points[i],length=Math.hypot(b[0]-a[0],b[1]-a[1]),nx=-(b[1]-a[1])/length,nz=(b[0]-a[0])/length;for(let t=1;t<length;t+=3){const x=a[0]+(b[0]-a[0])*t/length+nx*(path.width/2+.1),z=a[1]+(b[1]-a[1])*t/length+nz*(path.width/2+.1),grate=box(scenery,'Inset street drain',x,Y+.04,z,.55,.025,.16,M.dark);grate.rotation.y=-Math.atan2(b[1]-a[1],b[0]-a[0]);}}
  const trees=L.trees,treeInstances=trees.map((p,i)=>{const g=sakura(p.x,p.z,p.height,p.variant??i,{interactive:p.id===L.gatheringTreeId,id:p.id});g.rotation.y=p.rotation||0;g.scale.x=g.scale.z=p.crownScale??1;g.userData.treeId=p.id;return g;}),lamp=treeInstances.find(g=>g.userData.treeId===L.gatheringTreeId);
  for(const p of L.gardens){box(scenery,'Garden stone edge',p.x,Y+.07,p.z,p.width,.14,p.depth,M.stone);box(scenery,'Soft moss flower bed',p.x,Y+.14,p.z,p.width-.14,.12,p.depth-.14,M.leaf[1]);for(let i=0;i<Math.max(8,Math.ceil(p.width*p.depth*5));i++){const x=p.x+(rnd()-.5)*(p.width-.25),z=p.z+(rnd()-.5)*(p.depth-.19),h=.14+rnd()*.14;branch(scenery,[x,Y+.2,z],[x,Y+.2+h,z],.012,M.leaf[0]);mesh(scenery,'Street garden flower',new T.IcosahedronGeometry(.07+rnd()*.04,0),i%3?M.cream:M.pink[1],x,Y+.23+h,z).scale.y=.6;}}
  for(const p of L.planters){box(scenery,'Street flower box',p.x,Y+.22,p.z,p.width,.44,p.depth,M.wood);for(let i=0;i<4;i++)mesh(scenery,'Flower box shrub',new T.IcosahedronGeometry(.2,0),M.leaf[i%3],p.x+(i%2-.5)*.25,Y+.51,p.z+(Math.floor(i/2)-.5)*.25);}

  function lantern(x,z){const g=obstacle('Stone lantern '+x+' '+z);g.position.set(x,Y,z);box(g,'Lantern plinth',0,.1,0,.62,.2,.62,M.stone);box(g,'Stone lantern shaft',0,.65,0,.23,1.0,.23,M.stone);box(g,'Lantern chamber',0,1.23,0,.48,.4,.48,M.light);for(const dx of [-.25,.25])for(const dz of [-.25,.25])box(g,'Lantern corner',dx,1.23,dz,.055,.45,.055,M.dark);mesh(g,'Lantern pagoda cap',new T.ConeGeometry(.49,.32,4),M.dark,0,1.6,0).rotation.y=Math.PI/4;mesh(g,'Lantern finial',new T.SphereGeometry(.09,6,4),M.brass,0,1.83,0);batchGroup(g);}
  L.lamps.forEach(p=>lantern(p.x,p.z));

  function torii(x,z,scale=1){const g=obstacle('Vermilion torii gateway');g.position.set(x,Y,z);g.rotation.y=L.torii.rotation;for(const xx of [-1.4,1.4]){box(g,'Torii pillar',xx*scale,1.55*scale,0,.22*scale,3.1*scale,.22*scale,M.red);box(g,'Torii stone shoe',xx*scale,.17,0,.38,.34,.38,M.dark);}box(g,'Torii lower lintel',0,2.54*scale,0,3.1*scale,.21*scale,.25*scale,M.red);box(g,'Torii upper lintel',0,3.07*scale,0,3.6*scale,.24*scale,.36*scale,M.red);box(g,'Torii black cap',0,3.24*scale,0,3.9*scale,.12*scale,.43*scale,M.dark);box(g,'Shrine name tablet',0,2.8*scale,.15,.42,.47,.09,M.dark);batchGroup(g);}
  torii(L.torii.x,L.torii.z,1.05);
  const shrine=obstacle('Sakura hillside shrine');shrine.position.set(L.shrine.x,Y,L.shrine.z);shrine.rotation.y=L.shrine.rotation;const shrineBuilding=assetInstance(assets.club)||createJapaneseBuilding('club');shrine.add(shrineBuilding);box(shrine,'Shrine vermilion veranda',0,.36,1.48,3.4,.14,.48,M.red);for(const x of [-1.35,1.35])box(shrine,'Shrine veranda column',x,1.32,1.5,.13,1.9,.13,M.red);batchGroup(shrine);
  // Independent machiya shops keep the second landscape inhabited before any groups exist.
  for(const p of L.shops){const g=obstacle('Japanese public '+p.type);g.position.set(p.x,Y,p.z);g.rotation.y=p.rotation;g.add(assetInstance(assets[p.type])||createJapaneseBuilding(p.type));}

  // Bamboo, dry-stone gardens and hand-set path stones add detail without persistent work.
  for(const {x:cx,z:cz} of L.bamboo){
    const g=obstacle('Bamboo grove '+cx+' '+cz,'tree');g.position.set(cx,fujiHeight(cx,cz),cz);
    for(let i=0;i<7;i++){const x=(rnd()-.5)*1.4,z=(rnd()-.5)*1.4,h=2.7+rnd()*1.7;mesh(g,'Bamboo culm',new T.CylinderGeometry(.06,.075,h,6),M.leaf[1],x,h/2,z);for(let j=1;j<4;j++){mesh(g,'Bamboo node',new T.CylinderGeometry(.075,.08,.05,6),M.dark,x,j*h/4,z);const leaf=mesh(g,'Bamboo leaf spray',new T.IcosahedronGeometry(.5,0),M.leaf[j%3],x+(j%2?.3:-.3),j*h/4+.22,z);leaf.scale.set(1,.2,.5);}}batchGroup(g);
  }
  for(const {x:cx,z:cz} of L.zenGardens){
    const g=obstacle('Zen garden stones '+cx+' '+cz);g.position.set(cx,Y,cz);mesh(scenery,'Dry garden sand',new T.CylinderGeometry(1.35,1.35,.035,12),M.cream,cx,Y+.012,cz).scale.z=.7;
    for(let i=0;i<3;i++){const stone=mesh(g,'Weathered garden rock',new T.IcosahedronGeometry(.45+i*.11,0),M.rock,(i-1)*.55,.32+i*.1,(i%2)*.35);stone.scale.set(.85,1.15,.7);stone.rotation.y=i*.8;}batchGroup(g);
  }
  const notice=obstacle('Forest plaza notice board');notice.position.set(L.notice.x,Y,L.notice.z);for(const x of [-.65,.65])box(notice,'Notice timber leg',x,.8,0,.13,1.6,.13);box(notice,'Community notice frame',0,1.25,0,1.7,1,.13,M.wood);box(notice,'Community paper',0,1.25,.08,1.48,.8,.025,M.cream);for(let i=0;i<3;i++)box(notice,'Pinned announcement',-.47+i*.47,1.25,.11,.34,.48,.015,i===1?M.pink[1]:M.path);batchGroup(notice);
  for(const {x,z,rotation} of L.benches){const g=obstacle('Sakura park bench '+x);g.position.set(x,Y,z);g.rotation.y=rotation;box(g,'Bench seat',0,.48,0,1.6,.12,.5);box(g,'Bench back',0,.88,-.21,1.6,.58,.09);for(const xx of [-.57,.57])box(g,'Bench leg',xx,.25,0,.12,.5,.38,M.dark);batchGroup(g);}

  // Mossy rock tunnels have real arch portals and a broken natural silhouette.
  for(const side of[-1,1]){const portal=railOffset(side<0?RAIL_START:RAIL_END,0),g=obstacle(side<0?'West railway rock tunnel':'East railway rock tunnel');g.position.set(portal.x,Y,portal.z);g.rotation.y=portal.rotation;const innerX=side<0?2.75:-2.75;
    for(const z of[-1.14,1.14])box(g,'Tunnel buried sidewall',0,1.4,z,6.2,2.8,.45,M.darkRock);box(g,'Covered rock vault',0,2.86,0,6.2,.42,2.75,M.darkRock);
    for(let i=0;i<11;i++){const a=i/10*Math.PI,o=box(g,'Portal stone arch',innerX,1.57+Math.sin(a)*1.3,Math.cos(a)*1.02,.45,.38,.37,i%2?M.stone:M.rock);o.rotation.x=a-Math.PI/2;}for(const z of[-1.03,1.03])box(g,'Portal stone jamb',innerX,.77,z,.47,1.58,.4,M.stone);box(g,'Tunnel deep shadow',side*2.75,1.42,0,.06,2.9,1.85,M.dark);
    for(let i=0;i<12;i++){const x=-2.8+(i%6)*1.1,z=(i<6?-.66:.64)+Math.sin(i)*.17,o=mesh(g,'Tunnel mossy boulder',new T.IcosahedronGeometry(.81+(i%3)*.14,0),i%3?M.rock:M.leaf[0],x,2.94+(i%3)*.15,z);o.rotation.set(i*.3,i*.7,i*.13);o.scale.set(1.07,.8,1);}for(const z of[-1.6,1.65])for(let j=0;j<4;j++)mesh(g,'Tunnel rock slope',new T.IcosahedronGeometry(.74,0),j%2?M.rock:M.leaf[1],-2.5+j*1.5,.65+j%2*.25,z).scale.set(1.15,1.1,.8);batchGroup(g);
  }
  const station=obstacle('Sakura local railway station');station.position.set(L.station.x,Y,L.station.z);station.rotation.y=L.station.rotation;
  const platform=new T.Group();platform.name='Long north-side station platform';platform.position.set(L.platform.x,Y,L.platform.z);platform.rotation.y=L.platform.rotation;scenery.add(platform);
  box(platform,'Twelve unit platform',0,.18,0,12,.36,1.5,M.stone);box(platform,'Platform tactile edge',0,.37,.61,11.8,.025,.17,M.cream);
  for(let i=0;i<24;i++)box(platform,'Platform paving joint',-5.75+i*.5,.366,0,.018,.012,1.1,M.path);
  if(assets.station)station.add(assetInstance(assets.station));else{
    box(station,'Station stone platform',0,.16,0,7.8,.32,2.2,M.stone);box(station,'Station ticket booth',-2.25,1.1,-.2,1.75,1.85,1.25,M.cream);box(station,'Station ticket window',-2.25,1.24,.45,1.1,.7,.05,M.window);for(const x of[-3.4,-.4,3.4])box(station,'Station timber post',x,1.4,-.55,.13,2.6,.13,M.wood);box(station,'Station canopy',0,2.7,-.1,7.8,.17,2.2,M.dark).rotation.x=.1;box(station,'Station cream nameboard',.7,2.12,.7,2,.4,.08,M.cream);for(let i=0;i<5;i++)box(station,'Station lettering',.13+i*.28,2.12,.75,.12,.16,.015,M.red);batchGroup(station);
  }
  for(const {x,z} of L.vending){const g=obstacle('Station vending machine '+x);g.position.set(x,Y,z);box(g,'Vending machine body',0,.76,0,.62,1.52,.55,M.red);box(g,'Vending illuminated display',0,.96,.284,.43,.67,.025,M.window);for(let i=0;i<6;i++)box(g,'Drink cans',(i%3-1)*.13,.84+Math.floor(i/3)*.24,.306,.065,.14,.035,i%2?M.cream:M.red);box(g,'Drink collection slot',0,.29,.295,.37,.12,.03,M.dark);batchGroup(g);}
  for(const {x,z} of L.bicycles){const g=obstacle('Parked bicycle '+x);g.position.set(x,Y,z);for(const xx of[-.48,.48]){mesh(g,'Bicycle wheel',new T.TorusGeometry(.32,.035,5,16),M.dark,xx,.35,0);for(let i=0;i<6;i++)branch(g,[xx,.35,0],[xx+Math.cos(i*Math.PI/3)*.3,.35+Math.sin(i*Math.PI/3)*.3,0],.007,M.stone);}for(const[a,b]of[[[-.48,.35,0],[-.1,.78,0]],[[-.1,.78,0],[.15,.35,0]],[[.15,.35,0],[-.48,.35,0]],[[.15,.35,0],[.38,.85,0]],[[.38,.85,0],[-.1,.78,0]],[[.38,.85,0],[.48,.35,0]]])branch(g,a,b,.026,M.red);box(g,'Bicycle saddle',-.1,.83,0,.23,.055,.15,M.dark);branch(g,[.38,.85,0],[.38,1.04,0],.025,M.dark);box(g,'Bicycle handlebars',.38,1.05,0,.08,.04,.42,M.dark);batchGroup(g);}

  for(const p of L.cars){const g=new T.Group();g.position.set(p.x,Y,p.z);g.rotation.y=p.rotation;scenery.add(g);const paint=mat(p.color);box(g,'Tiny Japanese car',0,.48,0,.9,.48,1.64,paint);box(g,'Car cabin',0,.85,-.12,.78,.42,.88,paint);box(g,'Car windshield',0,.86,.335,.66,.27,.025,M.window);box(g,'Car rear glass',0,.86,-.57,.65,.25,.025,M.window);for(const x of[-.46,.46]){box(g,'Car side glass',x,.86,-.12,.025,.25,.66,M.window);for(const z of[-.58,.58])mesh(g,'Small rubber wheel',new T.CylinderGeometry(.2,.2,.11,10),M.dark,x,.23,z).rotation.z=Math.PI/2;}for(const x of[-.28,.28])box(g,'Car headlight',x,.5,.83,.2,.12,.035,M.light);}
  box(scenery,'More groups sign post',L.queue.x,Y+.65,L.queue.z,.13,1.3,.13,M.wood);box(scenery,'More groups sign',L.queue.x,Y+1.3,L.queue.z,1.15,.53,.14,M.cream);for(let i=0;i<3;i++)mesh(scenery,'More groups dot',new T.SphereGeometry(.045,6,4),M.wood,L.queue.x+(i-1)*.19,Y+1.3,L.queue.z+.09);
  batchGroup(scenery);const petals=createSakuraPetals(root,{trees:treeInstances,layout:L,reduced,assets,groundHeight:fujiHeight,paving:townPavingAt,isInside:inFujiWorld});const train=createFujiTrain(root,{reduced,assets});root.userData.landArea={total:FUJI_AREA,west:FUJI_AREA/2,east:FUJI_AREA/2,ratio:1};
  const landmarks={root,lamp,pickables,leaves,obstacles,updateUnread(ids){leaves.forEach((leaf,i)=>{leaf.material.emissiveIntensity=ids.size&&i%2===0?.18:.03;});}};
  const audit={theme:'fuji',islandArea:FUJI_AREA,river:false,terrace:false,independentLayout:true,sakuraTrees:trees.length,gardens:L.gardens.length,staticJapaneseBuildings:L.shops.length+1,railLength,trainCarriages:2,obstacleGroups:obstacles.length,adoptedAssets:Object.keys(assets).filter(k=>assets[k])};
  let disposed=false;
  return{theme:'fuji',root,layout:L,train,petals,facilitySpaceClear,river:{update(){}},sample:queryFujiSurface,canWalkStep:(from,to,radius)=>train.crossing.canStep(from,to,radius),setResidents:people=>train.crossing.setResidents(people),walkways:[],bounds:FUJI_BOUNDS,mountains,landmarkObstacles:obstacles,landmarks,update:(time,dt)=>{train.update(time,dt);petals.update(dt);},suspend:()=>petals.suspend(),activate:()=>petals.activate(),audit,snapshot:()=>({...audit,...train.snapshot(),petals:petals.snapshot()}),dispose(){if(disposed)return;disposed=true;petals.dispose();train.dispose();root.removeFromParent();}};
}
