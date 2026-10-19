import {valleyInstance} from './valley-assets.js';
import * as THREE from 'three';
import {TERRACE_EXTENSION,terraceHeight} from './terrace-profile.js';
import {surfaceHeight} from '../shared/world-surface.js';

/** Editable timber and masonry. Reused GLBs share geometry and materials. */
export function buildValleyLandmarks({scene,terrain,generated,assets,valleyAssets={}}){
  const root=new THREE.Group();root.name='Valley living room';scene.add(root);
  const obstacles=[...(terrain.mountains||[])],pickables=[],leaves=[];
  const material=c=>new THREE.MeshStandardMaterial({color:c,roughness:.95,flatShading:true});
  const crownGeometry=new THREE.IcosahedronGeometry(1,1);
  const wood=material(0x88684b),end=material(0xc2a77b),stone=[0xc2c4a3,0xb9bea0,0xd3ceb0].map(material),moss=material(0x71884d);
  const make=(parent,name,g,m,x,y,z)=>{const o=new THREE.Mesh(g,m);o.name=name;o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;};
  const box=(parent,name,x,y,z,w,h,d,m=wood)=>make(parent,name,new THREE.BoxGeometry(w,h,d),m,x,y,z);
  function obstacle(name){const g=new THREE.Group();g.name=name;g.userData.layoutId=name;g.userData.kind='valley';root.add(g);obstacles.push(g);return g;}
  function branch(parent,a,b,r,m=wood){a=new THREE.Vector3(...a);b=new THREE.Vector3(...b);const o=make(parent,'Carved timber',new THREE.CylinderGeometry(r*.75,r,a.distanceTo(b),7),m,0,0,0);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),b.sub(a).normalize());return o;}
  // Interrupted rings leave three generous gates, with seams retaining real grass.
  for(const [ring,radius] of [2.2,3.65,5.2].entries())for(let j=0;j<48;j++){
    const a=j/48*Math.PI*2;if([.05,2.48,4.6].some(g=>Math.abs(Math.atan2(Math.sin(a-g),Math.cos(a-g)))<.17))continue;
    const r=radius+Math.sin(j*1.7+ring)*.07,o=make(root,'Year-ring limestone',new THREE.BoxGeometry(.55,.065,ring===2?.62:.38),stone[(j+ring)%3],21+Math.cos(a)*r,2.245,2+Math.sin(a)*r);o.rotation.y=-a+Math.PI/2;
  }
  // The trail follows the same surface function as placement and walking.
  function trail(points,width){const curve=new THREE.CatmullRomCurve3(points.map(([x,z])=>new THREE.Vector3(x,0,z))),vertices=[],indices=[];for(let i=0;i<=110;i++){const p=curve.getPoint(i/110),t=curve.getTangent(i/110);for(const sign of [-1,1]){const x=p.x-t.z*width*sign,z=p.z+t.x*width*sign;vertices.push(x,terrain.sample(x,z).height+.028,z);}if(i<110){const a=i*2;indices.push(a,a+1,a+2,a+1,a+3,a+2);}}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));g.setIndex(indices);g.computeVertexNormals();make(root,'Soft ochre footpath',g,material(0xbfb180),0,0,0).castShadow=false;}
  trail([[13,1],[16,2],[19,2]],.55);trail([[22,0],[23,-3],[23,-7],[22.7,-11],[21.5,-13.4]],.75);
  const lamp=obstacle('Letter tree lamp');lamp.position.set(21,2.22,2);lamp.userData.landmark='plaza';
  if(valleyAssets.letter_tree)lamp.add(valleyInstance(valleyAssets,'letter_tree',{width:1.9,height:3.8,depth:1.25}));
  else{
  make(lamp,'Tree lamp moss foot',new THREE.CylinderGeometry(.48,.62,.18,9),moss,0,.09,0);
  branch(lamp,[0,.1,0],[-.18,1.8,.04],.18);branch(lamp,[-.18,1.8,.04],[.12,3.4,0],.14);branch(lamp,[.12,3.4,0],[.4,3.95,.08],.07);
  }
  // Four rounded, truly volumetric golden canopy clusters retain per-friend unread glow.
  const crowns=[[-.88,3.48,.08,1.04,.85,.95],[.12,4.12,-.16,1.12,.94,1.02],[.92,3.4,.15,1,.83,.92],[.02,3.24,.88,.95,.76,.86]];
  crowns.forEach(([x,y,z,sx,sy,sz],i)=>{
    const mat=new THREE.MeshStandardMaterial({color:[0xe8b82c,0xf0c83c,0xdca526,0xf2ce50][i],emissive:0xffc34e,emissiveIntensity:.12,roughness:.94,flatShading:true});
    const crown=make(lamp,'Golden canopy '+i,crownGeometry,mat,x,y,z);crown.scale.set(sx,sy,sz);crown.rotation.set(i*.19,i*.73,i*.13);leaves.push(crown);
    for(let j=0;j<5;j++){const a=j*2.399+i*.6;const tuft=make(lamp,'Golden leaf cluster',crownGeometry,mat,x+Math.cos(a)*sx*.65,y+Math.sin(j*1.8)*.4,z+Math.sin(a)*sz*.65);tuft.scale.set(.48,.43,.46);tuft.rotation.set(j*.4,a,j*.2);}
  });
  if(!valleyAssets.letter_tree)box(lamp,'Letter slot',0,1,.2,.38,.4,.16,end);pickables.push(lamp);
  const lampHit=make(lamp,'Tree lamp hit area',new THREE.CylinderGeometry(.24,.24,3.4,8),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}),0,1.9,0);lampHit.castShadow=false;lampHit.userData.interactionOnly=true;
  for(const [start,span] of [[.6,.75],[2.65,.7]]){const seating=obstacle('Curved limestone seating '+start);
    for(let j=0;j<10;j++){const a=start+j/9*span;if(start>2&&Math.abs(a-Math.PI)<.29)continue;for(let step=0;step<2;step++){const r=5.35+step*.4,o=box(seating,'Curved sitting step',21+Math.cos(a)*r,2.22+.15+step*.15,2+Math.sin(a)*r,.53,.3+step*.3,.43,stone[j%3]);o.rotation.y=-a+Math.PI/2;}}
  }
  const bench=obstacle('Woodland shade bench');bench.position.set(26,2.22,-.5);bench.rotation.y=.4;
  if(valleyAssets.wood_bench)bench.add(valleyInstance(valleyAssets,'wood_bench',{width:2.5,height:1.05,depth:.72}));
  else{for(const x of [-.9,.9])box(bench,'Bench stone foot',x,.25,0,.3,.5,.5,stone[0]);for(let z=-.24;z<=.25;z+=.16)box(bench,'Bench slat',0,.58,z,2.5,.13,.13,end);box(bench,'Bench back',0,1,-.3,2.5,.35,.12);}
  for(let i=0;i<4;i++){const a=i*.19+3.6;branch(root,[21+Math.cos(a)*5.1,2.25,2+Math.sin(a)*5.1],[21+Math.cos(a+.08)*6.1,2.27,2+Math.sin(a+.08)*6.1],.07);}
  const terrace=obstacle('Terrace safety rail');
  for(const [a,b] of [[[23.1,-14.5],[23.4,-13.2]],[[18.1,-14.5],[18.1,-13.3]]]){const count=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/1.3);for(let i=0;i<=count;i++){const t=i/count,x=a[0]+(b[0]-a[0])*t,z=a[1]+(b[1]-a[1])*t;branch(terrace,[x,5.5,z],[x,6.2,z],.065);}branch(terrace,[a[0],6.1,a[1]],[b[0],6.1,b[1]],.065);}
  const extension=obstacle('Mountain terrace rails and supports');
  // The last two sides overlap the old platform: leave that entrance open.
  for(let edge=0;edge<8;edge++){
    const a=TERRACE_EXTENSION[edge],b=TERRACE_EXTENSION[edge+1],count=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/.9);
    for(let i=0;i<count;i++){const t=i/count,u=(i+1)/count,x=a[0]+(b[0]-a[0])*t,z=a[1]+(b[1]-a[1])*t,nx=a[0]+(b[0]-a[0])*u,nz=a[1]+(b[1]-a[1])*u,y=terraceHeight(x),ny=terraceHeight(nx);
      branch(extension,[x,y-.18,z],[x,y+.82,z],.055);
      branch(extension,[x,y+.73,z],[nx,ny+.73,nz],.045);
      branch(extension,[x,y-.12,z],[nx,ny-.12,nz],.10);
    }
  }
  const groundRay=new THREE.Raycaster();
  for(const [x,z] of [[18.6,-16.3],[17,-17.6],[15.1,-18.2],[13.1,-18.2],[13.1,-19.8],[15.1,-19.8]]){
    groundRay.set(new THREE.Vector3(x,30,z),new THREE.Vector3(0,-1,0));
    const ground=Math.max(surfaceHeight(x,z,{mountain:false}),groundRay.intersectObjects(terrain.mountains||[],true)[0]?.point.y??0),top=terraceHeight(x)-.1;
    if(top>ground){box(extension,'Rock-footed timber pier',x,(ground+top)/2-.04,z,.19,top-ground+.08,.19);box(extension,'Moss stone footing',x,ground+.03,z,.42,.22,.42,stone[1]);}
  }
  // Thin seams make the continuous support surface read as timber decking.
  for(let x=12;x<22;x+=.27){const cuts=[];for(let i=0;i<TERRACE_EXTENSION.length;i++){const a=TERRACE_EXTENSION[i],b=TERRACE_EXTENSION[(i+1)%TERRACE_EXTENSION.length];if((a[0]>x)!==(b[0]>x))cuts.push(a[1]+(b[1]-a[1])*(x-a[0])/(b[0]-a[0]));}cuts.sort((a,b)=>a-b);for(let i=0;i+1<cuts.length;i+=2)box(root,'Mountain deck plank seam',x,terraceHeight(x)+.006,(cuts[i]+cuts[i+1])/2,.018,.008,cuts[i+1]-cuts[i],wood).castShadow=false;}
  for(let x=18.8;x<22.8;x+=.5)for(let z=-14.3;z<-13.1;z+=.42){
    const geometry=new THREE.BoxGeometry(.46,.07,.38),positions=geometry.attributes.position;
    for(let i=0;i<positions.count;i++){const px=x+positions.getX(i),pz=z+positions.getZ(i),py=positions.getY(i);positions.setXYZ(i,px,terrain.sample(px,pz).height+.012+(py+.035),pz);}
    geometry.computeVertexNormals();make(root,'Terrace stone paving',geometry,stone[(Math.round(x*2)+Math.round(-z*2))%3],0,0,0);
  }
  if(valleyAssets.notice_board){
    const notice=obstacle('Forest plaza notice board');notice.add(valleyInstance(valleyAssets,'notice_board',{width:1.3,height:2,depth:.42}));notice.position.set(25.7,2.22,3);notice.rotation.y=-.3;notice.userData.landmark='plaza';pickables.push(notice);
    if(typeof document!=='undefined'){const c=document.createElement('canvas');c.width=512;c.height=320;const ctx=c.getContext('2d');ctx.fillStyle='#f1e8cb';ctx.fillRect(0,0,512,320);ctx.strokeStyle='#b0b68b';ctx.lineWidth=4;ctx.strokeRect(18,18,476,284);ctx.fillStyle='#4c674b';ctx.textAlign='center';ctx.font='bold 56px sans-serif';ctx.fillText('年轮广场',256,107);ctx.font='29px sans-serif';ctx.fillText('在树荫下，见一面',256,182);ctx.font='24px sans-serif';ctx.fillText('来广场坐坐',256,253);const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;make(notice,'Readable plaza invitation',new THREE.PlaneGeometry(.91,.65),new THREE.MeshStandardMaterial({map:tex,roughness:1}),0,1.14,.228);}
  }
  // Trees and the two remaining rocks live in the shared world-coordinate layout.
  const plants=[['fern_large',25.8,-2,1],['fern_large',17.4,7.5,.9],['grass',25,8,1.1],['grass',19,8.9,.9]];
  for(const [kind,x,z,height] of plants){if(!assets?.[kind])continue;const g=obstacle('Valley '+kind+' '+x+' '+z),source=assets[kind],model=source.model.clone(true),box3=new THREE.Box3().setFromObject(model),size=box3.getSize(new THREE.Vector3()),c=box3.getCenter(new THREE.Vector3());model.position.sub(new THREE.Vector3(c.x,box3.min.y,c.z));g.add(model);g.scale.setScalar(height/size.y);g.position.set(x,terrain.sample(x,z).height,z);g.rotation.y=x*.7;g.userData.kind=kind;}
  // These remain identifiable for picking and shared collision, rather than merged away.
  for(const g of obstacles)if(pickables.includes(g)||['tree','rock','fern_large','grass'].includes(g.userData.kind)||g.children.some(c=>c.userData.rodinValley))g.traverse(o=>{o.userData.generatedProp=true;});
  const flowerGeo=new THREE.IcosahedronGeometry(.065,0),flowers=new THREE.InstancedMesh(flowerGeo,material(0xe8d7a5),90),dummy=new THREE.Object3D();for(let i=0;i<90;i++){const a=i*2.399,r=5.9+(i%4)*.16,x=21+Math.cos(a)*r,z=2+Math.sin(a)*r;dummy.position.set(x,terrain.sample(x,z).height+.12+(i%3)*.045,z);dummy.scale.set(1.4,1,1.4);dummy.updateMatrix();flowers.setMatrixAt(i,dummy.matrix);}flowers.userData.generatedProp=true;flowers.name='Small plaza wildflowers';root.add(flowers);
  terrain.landmarkObstacles=obstacles;
  return {root,obstacles,pickables,lamp,leaves,updateUnread(ids){const keys=['tuantuan','ali','xiaomian','shanshan'];leaves.forEach((l,i)=>{l.material.emissiveIntensity=ids.has(keys[i])?.85:.12;});}};
}
