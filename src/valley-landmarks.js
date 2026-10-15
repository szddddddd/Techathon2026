import {valleyInstance} from './valley-assets.js';
import * as THREE from 'three';

/** Editable timber and masonry. Reused GLBs share geometry and materials. */
export function buildValleyLandmarks({scene,terrain,generated,assets,valleyAssets={}}){
  const root=new THREE.Group();root.name='Valley living room';scene.add(root);
  const obstacles=[...(terrain.mountains||[])],pickables=[],leaves=[];
  const material=c=>new THREE.MeshStandardMaterial({color:c,roughness:.95,flatShading:true});
  const leafShape=new THREE.Shape();leafShape.moveTo(0,-.55);leafShape.bezierCurveTo(-.55,-.2,-.45,.2,0,.65);leafShape.bezierCurveTo(.4,.2,.5,-.25,0,-.55);const leafGeometry=new THREE.ExtrudeGeometry(leafShape,{depth:.07,bevelEnabled:true,bevelSize:.025,bevelThickness:.025,bevelSegments:1,curveSegments:4});
  const wood=material(0x88684b),end=material(0xc2a77b),stone=[0xc2c4a3,0xb9bea0,0xd3ceb0].map(material),moss=material(0x71884d);
  const make=(parent,name,g,m,x,y,z)=>{const o=new THREE.Mesh(g,m);o.name=name;o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;};
  const box=(parent,name,x,y,z,w,h,d,m=wood)=>make(parent,name,new THREE.BoxGeometry(w,h,d),m,x,y,z);
  function obstacle(name){const g=new THREE.Group();g.name=name;g.userData.layoutId=name;g.userData.kind='valley';root.add(g);obstacles.push(g);return g;}
  function branch(parent,a,b,r,m=wood){a=new THREE.Vector3(...a);b=new THREE.Vector3(...b);const o=make(parent,'Carved timber',new THREE.CylinderGeometry(r*.75,r,a.distanceTo(b),7),m,0,0,0);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),b.sub(a).normalize());return o;}
  // Interrupted rings leave three generous gates, with seams retaining real grass.
  if(valleyAssets.stone_ring){
    for(const radius of [2.2,3.65,5.2])for(const side of [-1,1]){
      const ring=valleyInstance(valleyAssets,'stone_ring',{width:radius*2+.4,height:.055,depth:radius+.4});ring.position.set(21,2.225,2+side*radius*.5);ring.rotation.y=side<0?Math.PI:0;
      ring.traverse(o=>{if(!o.isMesh)return;o.castShadow=false;const trim=m=>{const material=m.clone();material.onBeforeCompile=shader=>{shader.vertexShader='varying vec3 vRingWorld;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <project_vertex>','#include <project_vertex>\nvRingWorld=(modelMatrix*vec4(transformed,1.0)).xyz;');shader.fragmentShader='varying vec3 vRingWorld;\n'+shader.fragmentShader;shader.fragmentShader=shader.fragmentShader.replace('void main() {',`void main() { if(abs(length(vRingWorld.xz-vec2(21.0,2.0))-${radius.toFixed(3)})>.29)discard;float a=atan(vRingWorld.z-2.0,vRingWorld.x-21.0);if(abs(atan(sin(a-.05),cos(a-.05)))<.13||abs(atan(sin(a-2.48),cos(a-2.48)))<.13||abs(atan(sin(a-4.6),cos(a-4.6)))<.13)discard;`);};material.customProgramCacheKey=()=> 'valley-open-stone-rings-'+radius;return material;};o.material=Array.isArray(o.material)?o.material.map(trim):trim(o.material);});root.add(ring);
    }
  }else{
  for(const [ring,radius] of [2.2,3.65,5.2].entries())for(let j=0;j<48;j++){
    const a=j/48*Math.PI*2;if([.05,2.48,4.6].some(g=>Math.abs(Math.atan2(Math.sin(a-g),Math.cos(a-g)))<.17))continue;
    const r=radius+Math.sin(j*1.7+ring)*.07,o=make(root,'Year-ring limestone',new THREE.BoxGeometry(.55,.065,ring===2?.62:.38),stone[(j+ring)%3],21+Math.cos(a)*r,2.245,2+Math.sin(a)*r);o.rotation.y=-a+Math.PI/2;
  }
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
  for(let i=0;i<4;i++){const a=i*Math.PI/2+.35,y=2.7+(i%2)*.5,x=Math.cos(a)*.95,z=Math.sin(a)*.95;if(!valleyAssets.letter_tree)branch(lamp,[0,y-.5,0],[x,y,z],.065);const mat=new THREE.MeshStandardMaterial({color:[0xe9c45f,0xd89563,0xc7d7a4,0xb99c70][i],emissive:0xffcc75,emissiveIntensity:.12,roughness:.65});const l=make(lamp,'Unread leaf '+i,leafGeometry,mat,x,y+.12,z);l.scale.set(.85,1,1);l.rotation.z=-Math.cos(a)*.5;if(valleyAssets.letter_tree){const p=[[-.72,3.42,.02],[.05,4.05,-.03],[.72,3.25,.04],[.72,2.6,.2]][i];l.position.set(...p);}leaves.push(l);}
  if(!valleyAssets.letter_tree)box(lamp,'Letter slot',0,1,.2,.38,.4,.16,end);pickables.push(lamp);
  const lampHit=make(lamp,'Tree lamp hit area',new THREE.CylinderGeometry(.24,.24,3.4,8),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}),0,1.9,0);lampHit.castShadow=false;lampHit.userData.interactionOnly=true;
  for(const [start,span] of [[.6,.75],[2.65,.7]]){const seating=obstacle('Curved limestone seating '+start);
    if(valleyAssets.curved_seat){const a=start+span/2;const model=valleyInstance(valleyAssets,'curved_seat',{width:4.6,height:.55,depth:1.1});seating.add(model);seating.position.set(21+Math.cos(a)*5.55,2.22,2+Math.sin(a)*5.55);seating.rotation.y=-a-Math.PI/2;}
    else for(let j=0;j<10;j++){const a=start+j/9*span;for(let step=0;step<2;step++){const r=5.35+step*.4,o=box(seating,'Curved sitting step',21+Math.cos(a)*r,2.22+.15+step*.15,2+Math.sin(a)*r,.53,.3+step*.3,.43,stone[j%3]);o.rotation.y=-a+Math.PI/2;}}
  }
  const bench=obstacle('Woodland shade bench');bench.position.set(26,2.22,-.5);bench.rotation.y=.4;
  if(valleyAssets.wood_bench)bench.add(valleyInstance(valleyAssets,'wood_bench',{width:2.5,height:1.05,depth:.72}));
  else{for(const x of [-.9,.9])box(bench,'Bench stone foot',x,.25,0,.3,.5,.5,stone[0]);for(let z=-.24;z<=.25;z+=.16)box(bench,'Bench slat',0,.58,z,2.5,.13,.13,end);box(bench,'Bench back',0,1,-.3,2.5,.35,.12);}
  for(let i=0;i<4;i++){const a=i*.19+3.6;branch(root,[21+Math.cos(a)*5.1,2.25,2+Math.sin(a)*5.1],[21+Math.cos(a+.08)*6.1,2.27,2+Math.sin(a+.08)*6.1],.07);}
  const terrace=obstacle('Terrace safety rail');
  for(const [a,b] of [[[18.1,-15.6],[22.3,-15.6]],[[23.1,-14.5],[23.4,-13.2]],[[18.1,-15.6],[18.1,-13.3]]]){const count=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/1.3);for(let i=0;i<=count;i++){const t=i/count,x=a[0]+(b[0]-a[0])*t,z=a[1]+(b[1]-a[1])*t;branch(terrace,[x,5.5,z],[x,6.2,z],.065);}branch(terrace,[a[0],6.1,a[1]],[b[0],6.1,b[1]],.065);}
  for(let x=18.8;x<22.8;x+=.5)for(let z=-14.3;z<-13.1;z+=.42)box(root,'Terrace stone paving',x,5.51,z,.46,.025,.38,stone[(Math.round(x*2)+Math.round(-z*2))%3]);
  const frame=obstacle('Valley viewing frame');frame.position.set(19.5,5.5,-13.3);frame.rotation.y=-.97;frame.userData.landmark='terrace';
  if(valleyAssets.viewing_frame)frame.add(valleyInstance(valleyAssets,'viewing_frame',{width:2.2,height:1.45,depth:.24}));
  else{for(const x of [-1,1])box(frame,'Viewing frame upright',x,.7,0,.13,1.4,.16);box(frame,'Viewing frame lintel',0,1.4,0,2.2,.14,.18,end);box(frame,'Viewing frame sill',0,.48,0,2.2,.12,.2,end);}pickables.push(frame);
  const aperture=make(frame,'Viewing aperture hit area',new THREE.PlaneGeometry(2.3,1.7),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide}),0,.85,0);aperture.castShadow=false;aperture.receiveShadow=false;aperture.userData.interactionOnly=true;
  if(valleyAssets.notice_board){
    const notice=obstacle('Forest plaza notice board');notice.add(valleyInstance(valleyAssets,'notice_board',{width:1.3,height:2,depth:.42}));notice.position.set(25.7,2.22,3);notice.rotation.y=-.3;notice.userData.landmark='plaza';pickables.push(notice);
    if(typeof document!=='undefined'){const c=document.createElement('canvas');c.width=512;c.height=320;const ctx=c.getContext('2d');ctx.fillStyle='#f1e8cb';ctx.fillRect(0,0,512,320);ctx.strokeStyle='#b0b68b';ctx.lineWidth=4;ctx.strokeRect(18,18,476,284);ctx.fillStyle='#4c674b';ctx.textAlign='center';ctx.font='bold 56px sans-serif';ctx.fillText('年轮广场',256,107);ctx.font='29px sans-serif';ctx.fillText('在树荫下，见一面',256,182);ctx.font='24px sans-serif';ctx.fillText('来广场坐坐',256,253);const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;make(notice,'Readable plaza invitation',new THREE.PlaneGeometry(.91,.65),new THREE.MeshStandardMaterial({map:tex,roughness:1}),0,1.14,.228);}
  }
  // Sparse silhouettes keep the river pass and original cottage unobstructed.
  const plants=[['tree',26.5,-4,4],['tree',26.8,7,3.7],['tree',18,9.3,3.2],['tree',-13,-12.5,3.8],['tree',-5,-22.3,2.6],['tree',5,-14.5,2.5],['tree',17,-21,2.8],['tree',18.4,-3,3],['rock',-11,-11.9,1.8],['rock',13,-13,1.6],['rock',18,-16,1.8],['rock',25.5,-6,1],['fern_large',25.8,-2,1],['fern_large',17.4,7.5,.9],['grass',25,8,1.1],['grass',19,8.9,.9]];
  for(const [kind,x,z,height] of plants){if(!assets?.[kind])continue;const g=obstacle('Valley '+kind+' '+x+' '+z),source=assets[kind],model=source.model.clone(true),box3=new THREE.Box3().setFromObject(model),size=box3.getSize(new THREE.Vector3()),c=box3.getCenter(new THREE.Vector3());model.position.sub(new THREE.Vector3(c.x,box3.min.y,c.z));g.add(model);g.scale.setScalar(height/size.y);g.position.set(x,terrain.sample(x,z).height-(kind==='rock'?height*.4:kind==='tree'&&z<-15?.25:0),z);g.rotation.y=x*.7;g.userData.kind=kind;}
  // These remain identifiable for picking and shared collision, rather than merged away.
  for(const g of obstacles)if(pickables.includes(g)||['tree','rock','fern_large','grass'].includes(g.userData.kind)||g.children.some(c=>c.userData.rodinValley))g.traverse(o=>{o.userData.generatedProp=true;});
  const flowerGeo=new THREE.IcosahedronGeometry(.065,0),flowers=new THREE.InstancedMesh(flowerGeo,material(0xe8d7a5),90),dummy=new THREE.Object3D();for(let i=0;i<90;i++){const a=i*2.399,r=5.9+(i%4)*.16,x=21+Math.cos(a)*r,z=2+Math.sin(a)*r;dummy.position.set(x,terrain.sample(x,z).height+.12+(i%3)*.045,z);dummy.scale.set(1.4,1,1.4);dummy.updateMatrix();flowers.setMatrixAt(i,dummy.matrix);}flowers.userData.generatedProp=true;flowers.name='Small plaza wildflowers';root.add(flowers);
  terrain.landmarkObstacles=obstacles;
  return {root,obstacles,pickables,lamp,frame,leaves,updateUnread(ids){const keys=['tuantuan','ali','xiaomian','shanshan'];leaves.forEach((l,i)=>{l.material.emissiveIntensity=ids.has(keys[i])?.85:.12;});}};
}
