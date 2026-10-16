import {FUJI_VISUALS} from './fuji-visuals.js';
import * as T from 'three';
import {projectRail} from './fuji-railway.js';
import {closestStreet,boxContains} from './fuji-streets.js';

/** Two instanced batches. Roof envelopes are prepared once, never raycast per frame. */
export function createSakuraPetals(parent,{trees,layout,reduced=false,assets={},groundHeight,paving,isInside=()=>true}){
 const root=new T.Group();root.name='Light wind sakura petals';parent.add(root);
 let seed=51871;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const shape=new T.Shape();shape.moveTo(0,-1);shape.bezierCurveTo(-.8,-.2,-.85,.7,-.23,.93);shape.quadraticCurveTo(0,.78,0,.58);shape.quadraticCurveTo(.2,.95,.36,.91);shape.bezierCurveTo(.94,.7,.7,-.2,0,-1);
 const geometry=new T.ShapeGeometry(shape,5),material=new T.MeshStandardMaterial({color:0xffeff3,roughness:.95,side:T.DoubleSide});
 const air=new T.InstancedMesh(geometry,material,1200),ground=new T.InstancedMesh(geometry,material,6500);air.name='Falling sakura petals';ground.name='Settled sakura petals';air.frustumCulled=ground.frustumCulled=false;root.add(air,ground);
 const dummy=new T.Object3D(),color=new T.Color(),roofs=[];
 for(const p of[...layout.slots,...layout.shops,layout.shrine,layout.station]){
  // Any group type can occupy a slot. Reserve the tallest available template so
  // a group replacement cannot put a roof through an already falling petal.
  const keys=p.index!==undefined?['club','classroom','sport','lab','library','music','art','cafe','observatory']:[p===layout.station?'station':p.type||'club'];
  let height=3.5;for(const key of keys)if(assets[key])height=Math.max(height,new T.Box3().setFromObject(assets[key]).getSize(new T.Vector3()).y);
  roofs.push({...p,width:p.width??4,depth:p.depth??3.5,top:2.22+height});
 }
 parent.updateMatrixWorld(true);const sources=trees.map(tree=>{const b=new T.Box3().setFromObject(tree);return{id:tree.userData.treeId,box:b,x:tree.position.x,z:tree.position.z};});
 const particles=[];let roofStops=0;
 for(let i=0;i<1200;i++){
  const s=sources[i%sources.length],b=s.box;
  let x,z,y,floor;
  for(let attempt=0;attempt<40;attempt++){
   x=T.MathUtils.lerp(b.min.x,b.max.x,.15+random()*.7);z=T.MathUtils.lerp(b.min.z,b.max.z,.15+random()*.7);y=T.MathUtils.lerp(b.min.y,b.max.y,.70+random()*.27);
   floor=groundHeight(x,z)+(paving(x,z)?.055:.025);
   for(const r of roofs)if(boxContains(r,x,z,.9))floor=Math.max(floor,r.top+.09);
   if(y>floor+.35)break;
  }
  const valid=y>floor+.35;if(floor>groundHeight(x,z)+.2)roofStops++;
  particles.push({x,z,y,floor,valid,phase:random(),period:9+random()*7,size:.070+random()*.045,angle:random()*6.28,treeId:s.id});
  air.setColorAt(i,color.setHex(FUJI_VISUALS.petals[i%3]));
 }
 let count=0;
 for(let attempt=0;count<6500&&attempt<65000;attempt++){
  const s=sources[attempt%sources.length],a=random()*Math.PI*2,r=.35+Math.pow(random(),.65)*3.5;let x=s.x+Math.cos(a)*r,z=s.z+Math.sin(a)*r;
  if(attempt%3===0){const near=layout.paths.map(p=>({...closestStreet(x,z,p),width:p.width})).sort((a,b)=>a.distance-b.distance)[0];if(near?.distance<2){const dx=x-near.x,dz=z-near.z,n=Math.hypot(dx,dz)||1,offset=near.width/2+.05+random()*.24;x=near.x+dx/n*offset;z=near.z+dz/n*offset;}}
  if(!isInside(x,z)||projectRail(x,z).distance<1.58||x< -26||x>28||z>11.5||roofs.some(p=>boxContains(p,x,z,.18)))continue;
  const y=groundHeight(x,z)+(paving(x,z)?.055:.025);if(y>2.4)continue;
  dummy.position.set(x,y,z);dummy.rotation.set(-Math.PI/2,0,a);dummy.scale.setScalar(.035+random()*.04);dummy.updateMatrix();ground.setMatrixAt(count,dummy.matrix);ground.setColorAt(count,color.setHex(FUJI_VISUALS.petals[count%3]));count++;
 }
 ground.count=count;ground.instanceMatrix.needsUpdate=true;
 let clock=0,active=true,enabled=true,disposed=false,updates=0;
 const isReduced=()=>typeof reduced==='boolean'?reduced:!!reduced.matches;
 function update(dt=0){
  if(disposed)return;const narrow=typeof innerWidth!=='undefined'&&innerWidth<700;air.count=narrow?600:1200;air.visible=enabled&&active&&!isReduced();
  if(!air.visible||(typeof document!=='undefined'&&document.hidden))return;
  clock+=Math.min(.1,Math.max(0,dt));updates++;const breeze=.45+.30*Math.max(0,Math.sin(clock*.13))**6;
  for(let i=0;i<air.count;i++){const p=particles[i],t=(clock/p.period+p.phase)%1,envelope=Math.min(1,t*9,(1-t)*10);dummy.position.set(p.x+Math.sin(clock*.45+p.angle)*breeze,p.y+(p.floor-p.y)*t,p.z+Math.cos(clock*.33+p.angle)*breeze*.6);dummy.rotation.set(t*5+p.angle,clock*.6+p.angle,Math.sin(clock*.8+p.angle));dummy.scale.setScalar(p.valid?p.size*envelope:0);dummy.updateMatrix();air.setMatrixAt(i,dummy.matrix);}air.instanceMatrix.needsUpdate=true;
 }
 update(0);
 // The scene resource owner releases geometry/materials and instance buffers.
 return{root,update,particles,roofs,setEnabled(value){enabled=!!value;air.visible=enabled&&active&&!isReduced();},activate(){active=true;},suspend(){active=false;air.visible=false;},snapshot:()=>({clock,updates,active,enabled,reduced:isReduced(),airVisible:air.visible,airCapacity:air.count,validParticles:particles.filter(p=>p.valid).length,groundCount:count,roofStops,batches:2}),dispose(){if(disposed)return;disposed=true;active=false;root.removeFromParent();}};
}
