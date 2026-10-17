import {IDEAL_CITY_PLAN} from './ideal-city-plan.js';
import {createIdealHologram} from './ideal-holograms.js';
import {createIdealTrafficSchool,createIdealAirways,idealAirshipPose} from './ideal-traffic.js';
import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {GROUP_TYPES} from './group-catalog.js';
import {IDEAL_SOURCE,IDEAL_LAYOUT,IDEAL_GROUND,IDEAL_OUTLINE,IDEAL_PROPORTIONS,queryIdealSurface,idealCanPlace,idealCanWalkStep} from './ideal-layout.js';

function part(root,name,x,y,z,w,h,d,material){const mesh=new T.Mesh(new T.BoxGeometry(w,h,d),material);mesh.name=name;mesh.position.set(x,y,z);mesh.castShadow=mesh.receiveShadow=true;root.add(mesh);return mesh;}
const paint=(color,extra={})=>new T.MeshStandardMaterial({color,roughness:.65,...extra});
export function idealFacility(kind){if(kind!=='music')return createIdealHologram(kind);const root=new T.Group(),white=paint(0xdce9eb),steel=paint(0x456a81),cyan=paint(0x57d9ee,{emissive:0x28abc8,emissiveIntensity:.3});
 if(kind==='music'){part(root,'Music pedestal',0,.55,0,1.5,1.1,.85,white);part(root,'Music console',0,1.15,0,1.6,.14,.9,steel);for(let i=0;i<5;i++)part(root,'Equalizer',-.45+i*.22,1.24,.1,.08,.08,.2,cyan);}
 else{const video=kind==='scene-video';part(root,'Porcelain information terminal',0,.85,0,video?1.9:1.6,1.7,.26,white);part(root,'Information glass',0,1,.15,video?1.65:1.35,1.1,.04,steel);part(root,'Blue information line',0,1.64,.17,video?1.6:1.25,.045,.045,cyan);part(root,'Terminal foot',0,.12,0,1.8,.24,.8,white);}
 return root;
}
function centered(source,center){source.updateWorldMatrix(true,true);const model=source.clone(true);source.matrixWorld.decompose(model.position,model.quaternion,model.scale);model.position.sub(center);const holder=new T.Group();holder.add(model);holder.scale.setScalar(IDEAL_SOURCE.scale);return holder;}
export function applyIdealLegacyLayout(model){
 if(model.userData.idealLayoutVersion===IDEAL_PROPORTIONS.version)return applyIdealCityPlan(model);
 if(!model.children.some(o=>o.userData.idealLayoutVersion===IDEAL_PROPORTIONS.version)){
  model.updateMatrixWorld(true);for(const node of model.children){const box=new T.Box3().setFromObject(node),c=box.getCenter(new T.Vector3()),id=node.userData.idealId||'',slot=node.userData.idealGroupSlot;
   if(slot!==undefined){const p=IDEAL_LAYOUT.slots[slot];node.position.x+=p.x/2-c.x;node.position.z+=p.z/2-c.z;}
   else if(id==='colony-ship'){node.position.x*=14.2/18.1;node.scale.x*=14.2/18.1;node.position.z=node.position.z*(14.2/12)+(-1.9*IDEAL_PROPORTIONS.depthScale+2*(14.2/12))/2;node.scale.z*=14.2/12;}
   else if(id==='main-island'||id.startsWith('rock-blade')||id.startsWith('ring-road')||id==='colony-ship'||id==='east-port'){node.position.z*=IDEAL_PROPORTIONS.depthScale;node.scale.z*=IDEAL_PROPORTIONS.depthScale;}
   else if(id==='low-building-3'){node.position.x+=IDEAL_PROPORTIONS.staticBuildingCenter[0]/2-c.x;node.position.z+=IDEAL_PROPORTIONS.staticBuildingCenter[1]/2-c.z;}
   else node.position.z+=c.z*(IDEAL_PROPORTIONS.depthScale-1);
  }
 }
 model.userData.idealLayoutVersion=IDEAL_PROPORTIONS.version;model.updateMatrixWorld(true);return applyIdealCityPlan(model);
}
// Apply to both exported low-poly assets and the original fallback, before templates
// and collision proxies are extracted. Cached resources are transformed only once.
function applyIdealCityPlan(model){
 if(model.userData.idealCityPlanApplied)return model;
 const fit=(node,p)=>{
  model.updateMatrixWorld(true);const b=new T.Box3().setFromObject(node),size=b.getSize(new T.Vector3());
  node.scale.multiply(new T.Vector3(p.width/2/size.x,p.height/2/size.y,p.depth/2/size.z));
  model.updateMatrixWorld(true);const next=new T.Box3().setFromObject(node),c=next.getCenter(new T.Vector3());
  node.position.add(new T.Vector3(p.x/2-c.x,-next.min.y,p.z/2-c.z));model.updateMatrixWorld(true);
 };
 const sources=new Map();
 for(const node of model.children){
  const slot=node.userData.idealGroupSlot,id=node.userData.idealId||'';
  if(slot!==undefined){sources.set(slot,node);fit(node,IDEAL_LAYOUT.slots[slot]);}
  else if(id==='low-building-3'){
   const p=IDEAL_SOURCE.objects.find(p=>p.id===id);fit(node,{x:(p.min[0]+p.max[0])/2,z:(p.min[2]+p.max[2])/2,width:p.max[0]-p.min[0],depth:p.max[2]-p.min[2],height:p.max[1]-IDEAL_GROUND});
  }else if(id.startsWith('ring-road')){
   // Widen inward in world space, preserving the outer radius and deck elevation.
   model.updateMatrixWorld(true);const box=new T.Box3().setFromObject(node),c=box.getCenter(new T.Vector3()),outer=(box.max.x-box.min.x)/2;
   node.traverse(mesh=>{if(!mesh.isMesh)return;mesh.geometry=mesh.geometry.clone();const a=mesh.geometry.attributes.position,inv=mesh.matrixWorld.clone().invert(),p=new T.Vector3();
    for(let i=0;i<a.count;i++){p.fromBufferAttribute(a,i).applyMatrix4(mesh.matrixWorld);const dx=p.x-c.x,dz=p.z-c.z,r=Math.hypot(dx,dz);if(r>1){const nr=outer-(outer-r)*IDEAL_CITY_PLAN.roadWidth/IDEAL_PROPORTIONS.roadWidth;p.x=c.x+dx*nr/r;p.z=c.z+dz*nr/r;}p.applyMatrix4(inv);a.setXYZ(i,p.x,p.y,p.z);}
    a.needsUpdate=true;mesh.geometry.computeVertexNormals();mesh.geometry.computeBoundingBox();mesh.geometry.computeBoundingSphere();
   });
  }
 }
 for(const p of IDEAL_CITY_PLAN.satellites){const source=sources.get(p.slot);if(!source)continue;const node=source.clone(true);delete node.userData.idealGroupSlot;node.userData.idealId=p.id;node.userData.idealCitySatellite=true;node.name=p.id;model.add(node);fit(node,p);}
 model.userData.idealCityPlanApplied=true;return model;
}
export async function loadIdealAssets(retain=x=>x){
 const loader=new GLTFLoader(),failures=[];let model;
 try{model=(await loader.loadAsync('assets/ideal-city/lowpoly/scene.glb')).scene;model.userData.idealProvider='Rodin low-poly cartoon';}
 catch{failures.push('ideal-lowpoly');model=(await loader.loadAsync('assets/ideal-city/scene.glb')).scene;model.userData.idealProvider='Authored Blender fallback';}
 applyIdealLegacyLayout(model);
 model.traverse(o=>{if(o.isMesh){o.castShadow=o.receiveShadow=true;for(const m of [].concat(o.material))if(m.emissiveIntensity>1)m.emissiveIntensity=1;}});retain(model);
 const byId=new Map();model.traverse(o=>{if(o.userData.idealId)byId.set(o.userData.idealId,o);});
 const slots=IDEAL_LAYOUT.slots.map(p=>{const source=byId.get(p.assetId);if(!source)throw Error('理想城建筑资源不完整');return retain(centered(source,new T.Vector3(p.x/2,0,p.z/2)));});
 const templates=Object.fromEntries(GROUP_TYPES.map((t,i)=>[t.id,slots[i]]));
 return{model,groups:{templates,getForSlot:slot=>slots[slot],failures:[],loading:new Map()},recordModel:retain(idealFacility('music')),failures,fallbacks:failures.map(key=>({key,used:'original Blender scene'}))};
}
function batchStatic(source){source.updateMatrixWorld(true);const groups=new Map(),meshes=[];source.traverse(o=>{if(!o.isMesh||Array.isArray(o.material))return;const key=o.material.uuid;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(o);});const inverse=source.matrixWorld.clone().invert();
 for(const items of groups.values()){if(items.length<2)continue;const copies=items.map(m=>{let g=m.geometry.clone();if(g.index){const flat=g.toNonIndexed();g.dispose();g=flat;}g.applyMatrix4(inverse.clone().multiply(m.matrixWorld));for(const a of Object.keys(g.attributes))if(!['position','normal','uv'].includes(a))g.deleteAttribute(a);if(!g.attributes.uv)g.setAttribute('uv',new T.Float32BufferAttribute(new Float32Array(g.attributes.position.count*2),2));return g;});const geometry=mergeGeometries(copies);copies.forEach(g=>g.dispose());if(!geometry)continue;const merged=new T.Mesh(geometry,items[0].material);merged.name='Ideal city static material batch';merged.castShadow=merged.receiveShadow=true;source.add(merged);items.forEach(m=>m.removeFromParent());meshes.push(merged);}
 return meshes;
}
export function buildIdealScene(parent,{assets,reduced=false}={}){
 applyIdealLegacyLayout(assets.model);
 const root=new T.Group();root.name='Ideal City · adopted Blender scene';parent.add(root);
 const outline=new T.Shape();IDEAL_OUTLINE.forEach(([x,z],i)=>i?outline.lineTo(x,-z):outline.moveTo(x,-z));outline.closePath();const support=new T.Mesh(new T.ShapeGeometry(outline),new T.MeshBasicMaterial({visible:false,side:T.DoubleSide}));support.name='Ideal island meadow';support.rotation.x=-Math.PI/2;support.position.y=IDEAL_GROUND;root.add(support);
 const scenery=assets.model.clone(true);scenery.scale.setScalar(2);scenery.position.y=IDEAL_GROUND;root.add(scenery);
 const environment=[];scenery.traverse(o=>{if(o.userData.idealCollection==='07_Environment')environment.push(o);});environment.forEach(o=>o.removeFromParent());
 const remove=[],vehicleNodes=[],obstacles=[];scenery.traverse(o=>{if(o.userData.idealGroupSlot!==undefined)remove.push(o);else if(o.userData.idealVehicle)vehicleNodes.push(o);else if(o.userData.idealId&&(o.userData.idealCitySatellite||o.userData.idealCollection==='02_ColonyShip'||o.userData.idealId.startsWith('garden-')||o.userData.idealId.startsWith('low-building-')||o.userData.idealId.includes('support-set')||o.userData.idealId.startsWith('arrival-terrace')))obstacles.push(o);});
 root.updateMatrixWorld(true);obstacles.push(...remove);
 // Keep independent invisible collision views before combining decorative meshes.
 const collisionRoot=new T.Group();collisionRoot.name='Ideal city ground obstacles';root.add(collisionRoot);
 for(const item of obstacles){const copy=item.clone(true);item.matrixWorld.decompose(copy.position,copy.quaternion,copy.scale);copy.visible=false;copy.traverse(o=>o.userData.collisionProxy=true);collisionRoot.add(copy);}
 // Collision uses individual foot volumes instead of every triangle in a
 // city-wide 20k-face ring. Road decks stay overhead and streets remain walkable.
 scenery.traverse(owner=>{if(!owner.userData.rodinAsset||!['ring-road','straight-road'].includes(owner.userData.rodinAsset))return;
  const clusters=[],point=new T.Vector3();owner.traverse(mesh=>{if(!mesh.isMesh)return;const positions=mesh.geometry.attributes.position;for(let i=0;i<positions.count;i++){point.fromBufferAttribute(positions,i).applyMatrix4(mesh.matrixWorld);if(point.y>IDEAL_GROUND+.14)continue;const p=new T.Vector2(point.x,point.z);let box=clusters.find(b=>b.distanceToPoint(p)<.5);if(!box){box=new T.Box2();clusters.push(box);}box.expandByPoint(p);}});
  for(const box of clusters){const size=box.getSize(new T.Vector2()),c=box.getCenter(new T.Vector2());if(size.x<.05||size.y<.05)continue;const mesh=new T.Mesh(new T.BoxGeometry(size.x,2.24,size.y),new T.MeshBasicMaterial());mesh.name='Ideal road support collision';mesh.position.set(c.x,IDEAL_GROUND+1.12,c.y);mesh.visible=false;mesh.userData.collisionProxy=true;collisionRoot.add(mesh);}
 });
 remove.forEach(o=>o.removeFromParent());
 const trafficRoot=new T.Group();trafficRoot.name='Ideal city moving aircraft';root.add(trafficRoot);const vehicles=[];
 for(const node of vehicleNodes){const spec=IDEAL_SOURCE.vehicles.find(v=>v.id===node.userData.idealVehicle);node.removeFromParent();let source;assets.model.traverse(o=>{if(o.userData.idealVehicle===spec.id)source=o;});const center=new T.Vector3(spec.center[0]/2,(spec.center[1]-IDEAL_GROUND)/2,spec.center[2]/2);const body=centered(source,center);body.position.fromArray(spec.center);body.name=spec.id;body.traverse(o=>o.userData.vehicleId=spec.id);trafficRoot.add(body);vehicles.push({id:spec.id,body,origin:new T.Vector3(...spec.center)});}
 const school=createIdealTrafficSchool(vehicles.find(v=>v.id==='hovercar-a').body);trafficRoot.add(school.root);vehicles.filter(v=>v.id!=='airship').forEach(v=>v.body.visible=false);const airways=createIdealAirways();root.add(airways);
 const area=Math.abs(IDEAL_OUTLINE.reduce((a,p,i)=>{const q=IDEAL_OUTLINE[(i+1)%IDEAL_OUTLINE.length];return a+p[0]*q[1]-q[0]*p[1];},0)/2);root.userData.landArea={total:area,west:area/2,east:area/2,ratio:1};
 const lamp=new T.Group();lamp.name='Ideal city gathering beacon';lamp.position.set(0,IDEAL_GROUND,IDEAL_LAYOUT.gatheringCenter.z);root.add(lamp);lamp.userData.landmark='plaza';const white=paint(0xdde9e7),blue=paint(0x47d9f1,{emissive:0x22b4da,emissiveIntensity:.5});part(lamp,'Gathering beacon base',0,.15,0,.8,.3,.8,white);part(lamp,'Gathering beacon pillar',0,.8,0,.35,1.3,.35,white);const leaves=[];for(let i=0;i<4;i++){const m=new T.Mesh(new T.OctahedronGeometry(.17),blue.clone());m.position.set(Math.cos(i*Math.PI/2)*.36,1.42,Math.sin(i*Math.PI/2)*.36);lamp.add(m);leaves.push(m);}
 const plaza=new T.Mesh(new T.CircleGeometry(3.3,48),paint(0xbecbb8));plaza.rotation.x=-Math.PI/2;plaza.position.set(0,IDEAL_GROUND+.015,IDEAL_LAYOUT.gatheringCenter.z);root.add(plaza);
 // Group ownership is only on the exported parent, so exclude distant scenery by ancestry.
 const staticHits=[];collisionRoot.traverse(o=>{if(o.isMesh)staticHits.push(o);});scenery.traverse(o=>{if(!o.isMesh)return;let p=o,environment=false;while(p&&p!==scenery){if(p.userData.idealCollection==='07_Environment')environment=true;p=p.parent;}if(!environment)staticHits.push(o);});
 const ray=new T.Raycaster();function isOccluded(camera,point){const direction=point.clone().sub(camera.position),distance=direction.length();ray.set(camera.position,direction.normalize());ray.far=distance-.25;return ray.intersectObjects(staticHits,false).some(h=>h.distance>.2);}
 // Shared cached GLB resources stay alive; the new combined buffers belong to this scene.
 batchStatic(scenery);
 let elapsed=0,active=false,selected=vehicles[0]?.id,disposed=false;const frozen=()=>typeof reduced==='boolean'?reduced:reduced.matches;
 const current=()=>selected?.startsWith('school-')?school.vehicle(selected)||vehicles[0]:vehicles.find(v=>v.id===selected)||vehicles[0];
 let flight=idealAirshipPose(0,true);
 function pose(){flight=idealAirshipPose(elapsed,frozen());const ship=vehicles.find(v=>v.id==='airship').body;ship.position.fromArray(flight.position);ship.rotation.set(flight.bank,flight.yaw,0,'YXZ');}
 pose();

 const airship={root:trafficRoot,get ship(){return current().body;},get pickables(){return[...vehicles.filter(v=>v.body.visible).map(v=>v.body),...school.pickables];},selectHit(hit){selected=hit.object.userData.idealTrafficSchool?'school-'+hit.instanceId:hit.object.userData.vehicleId||vehicles[0].id;},selectDefault(){selected=vehicles.find(v=>v.id==='airship')?.id||vehicles[0].id;},getTarget:()=>current().body.position.clone(),followTarget:()=>current().body.position.clone(),staticTarget:()=>current().body.position.clone(),stationTarget:new T.Vector3(35,5.5,0),containsVisiblePoint:()=>true,presentation:{title:'理想城空港',ariaLabel:'理想城空港，随飞艇观景',exitLabel:'回到理想城',icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><ellipse cx="12" cy="9" rx="9" ry="4"/><path d="M9 13v4h6v-4M4 21h16M12 17v4"/></svg>',camera:{forward:8,side:13,height:8,targetForward:0,minX:-45,maxX:45}},snapshot:()=>({animationTime:elapsed,stopped:frozen(),selectedVehicle:selected,school:school.snapshot(),flight,vehicles:vehicles.filter(v=>v.body.visible).map(v=>({id:v.id,position:v.body.position.toArray()}))})};
 const landmarks={root,lamp,pickables:[lamp],leaves,obstacles:[...collisionRoot.children,lamp],updateUnread(ids){leaves.forEach(m=>m.material.emissiveIntensity=ids.size?.8:.3);}};
 return{root,theme:'ideal',layout:IDEAL_LAYOUT,bounds:IDEAL_LAYOUT.bounds,mountains:[],sample:queryIdealSurface,canPlace:idealCanPlace,canWalkStep:idealCanWalkStep,walkways:[],landmarkObstacles:landmarks.obstacles,landmarks,airship,isOccluded,dynamicRoots:[trafficRoot],audit:{theme:'ideal',provider:assets.model.userData.idealProvider||'Authored Blender geometry',groupSlots:9,sourceMeshCount:IDEAL_SOURCE.objects.length,environmentObjects:0,trafficStyle:'single schooling lane',airwayCount:airways.userData.routes.length,adoptedAssets:[assets.model.userData.idealProvider==='Rodin low-poly cartoon'?'ideal-city/lowpoly':'ideal-city'],river:false,railway:false},activate(){active=true;},suspend(){active=false;},update(time,dt){if(!active||disposed||typeof document!=='undefined'&&document.hidden)return;if(!frozen())elapsed+=Math.min(.1,Math.max(0,dt));pose();school.update(elapsed,frozen());},snapshot:()=>({theme:'ideal',...airship.snapshot()}),dispose(){active=false;disposed=true;root.removeFromParent();}};
}
