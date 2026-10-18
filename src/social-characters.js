import {FRIEND_SCENE_CAPACITY} from './social-presence.js';
import {avatarURL} from './avatar-url.js';
import {loadRiggedCharacter,cloneRigModel,setRigStatus,disposeRigTemplate} from './character-rig.js';
import {createCharacterActions} from './character-actions.js';
import {createPlacementTriangles} from './placement-triangles.js';
import {accelerateStaticRaycast} from './static-raycast.js';
import * as THREE from 'three';
import {buildWalkingGraph,walkingRoute,canWalkStep} from './companion-walk.js';
import {WALKWAYS,distanceToSegment} from './layout.js';
import {createCharacterDrag} from './character-drag.js';

const ANIMALS=['kangaroo','fox','rabbit','bear'];
const PREFERRED={kangaroo:[-5.9,-3],fox:[-9.5,5.4],rabbit:[-6,7.5],bear:[8,4.4]};
const down=new THREE.Vector3(0,-1,0);
export const characterBodyRadius=radius=>Math.max(.3,Math.min(.65,radius*.65));

/** Capture support and obstacle geometry before static scene batching detaches meshes. */
export function createPlacementContext({scene,terrain,generated,obstacleCache}){
  scene.updateMatrixWorld(true);
  const meadows=[],occluders=[],obstacles=[];
  terrain.root.traverse(o=>{if(o.isMesh&&o.name.endsWith(' meadow'))meadows.push(o);});
  const owners=[...(generated?.children||[]),...(terrain.landmarkObstacles||[])];
  (terrain.placementRoot||scene).traverse(o=>{if(o.isGroup&&/campfire|stump|stool/i.test(o.name))owners.push(o);});
  for(const owner of owners){
    const meshes=[];owner.traverse(mesh=>{if(mesh.isMesh&&mesh.geometry?.attributes.position&&!mesh.userData.interactionOnly)meshes.push(mesh);});
    // Discovery placement and companion placement inspect the same static props.
    // Reuse their exact triangle snapshots only while all geometry and world
    // transforms match; the cache is local to this scene's boot, never global.
    const signature=obstacleCache&&[owner.userData.layoutId||owner.name,owner.userData.kind,...meshes.map(m=>[m.id,m.geometry.id,m.geometry.attributes.position.id,m.geometry.attributes.position.version,m.geometry.index?.id,m.geometry.index?.version,...m.matrixWorld.elements].join(','))].join('|');
    const cached=obstacleCache?.get(owner);
    if(cached&&cached.signature===signature){occluders.push(...meshes);obstacles.push(cached.obstacle);continue;}
    const bounds=new THREE.Box2(),solidMeshes=[];
    for(const mesh of meshes){
      accelerateStaticRaycast(mesh);
      occluders.push(mesh);
      // Double-sided geometry views support parity rays without changing the
      // visible material. They remain valid after render batching.
      const solid=new THREE.Mesh(mesh.geometry,new THREE.MeshBasicMaterial({side:THREE.DoubleSide}));
      solid.matrixAutoUpdate=false;solid.matrixWorld.copy(mesh.matrixWorld);accelerateStaticRaycast(solid);solidMeshes.push(solid);
    }
    const triangles=createPlacementTriangles(meshes);triangles.getBounds(bounds);
    const obstacle={owner,id:owner.userData.layoutId||owner.name,kind:owner.userData.kind,bounds,triangles,solidMeshes};
    obstacles.push(obstacle);obstacleCache?.set(owner,{signature,obstacle});
  }
  for(const owner of owners)if(owner.userData.layoutId?.startsWith('discovery-'))owner.traverse(mesh=>{if(!mesh.isMesh||mesh.raycast===mesh.userData.modRaycast)return;const original=mesh.raycast;mesh.raycast=function(ray,hits){if(!owner.userData.modDisabled)return original.call(this,ray,hits);};mesh.userData.modRaycast=mesh.raycast;});
  const ray=new THREE.Raycaster();
  function inspect(x,z,radius,used=[],{walking=false,manual=false}={}){
    const walkway=(terrain.walkways??WALKWAYS).find(w=>distanceToSegment(x,z,w)<w.width/2+radius+.1);
    if(walkway&&!walking&&!manual)return {ok:false,reason:'walkway',id:walkway.id};
    if((!terrain.theme||terrain.theme==='forest')&&Math.hypot(x+8.5,z-1.5)<(manual?.75:1.7)+radius+(manual?.06:.35))return {ok:false,reason:'campfire'};
    if(used.some(p=>Math.hypot(p.x-x,p.z-z)<p.radius+radius+(manual?.15:.6)))return {ok:false,reason:'friend clearance'};
    if(terrain.canPlace&&!terrain.canPlace(x,z,radius))return {ok:false,reason:'crossing barrier'};
    const center=terrain.sample?.(x,z);let groundY=center?.height??2.22;
    for(let i=0;i<13;i++){
      const r=i?radius+(manual?.02:.12):0,a=(i-1)/12*Math.PI*2,px=x+Math.cos(a)*r,pz=z+Math.sin(a)*r;
      if(terrain.sample){const sample=terrain.sample(px,pz,{walking:walking&&!manual});if(!sample.walkable)return {ok:false,reason:'no meadow support',region:sample.region};if(Math.abs(sample.height-groundY)>r*Math.tan(22*Math.PI/180)+.04)return {ok:false,reason:'steep slope'};}
      else{ray.set(new THREE.Vector3(px,20,pz),down);ray.far=25;const hit=ray.intersectObjects(meadows,false)[0];if(!hit)return {ok:false,reason:'no meadow support'};groundY=Math.max(groundY,hit.point.y);}
    }
    const point=new THREE.Vector2(x,z),clearance=radius+(manual?.06:.35);
    for(const obstacle of obstacles){
      if(obstacle.owner?.userData.modDisabled)continue;
      if(manual&&['grass','fern_large'].includes(obstacle.kind))continue;
      if(obstacle.bounds.distanceToPoint(point)>=clearance)continue;
      if(obstacle.triangles.intersects(x,z,clearance,groundY+.06,groundY+2.23))return {ok:false,reason:'obstacle',id:obstacle.id};
      // A point deep inside a closed building can be far from every wall;
      // reject that case using horizontal parity, without reserving tree shade.
      if(obstacle.bounds.containsPoint(point)){
        ray.set(new THREE.Vector3(x,groundY+.88,z),new THREE.Vector3(1,0,0));ray.far=100;
        const hits=ray.intersectObjects(obstacle.solidMeshes,false).map(h=>h.distance);
        const unique=hits.filter((distance,i)=>!i||distance-hits[i-1]>1e-4);
        if(unique.length%2)return {ok:false,reason:'inside obstacle',id:obstacle.id};
      }
    }
    return {ok:true,y:groundY,region:center?.region,normal:center?.normal};
  }
  meadows.forEach(accelerateStaticRaycast);
  return {meadows,occluders:[...occluders,...meadows],obstacles,inspect,dispose(){for(const obstacle of obstacles)for(const mesh of obstacle.solidMeshes)mesh.material.dispose();}};
}

export function pickCharacterSlots(context,friends,{random=false,spawnAreas}={}){
  const result=[];
  for(const [index,friend] of friends.slice(0,FRIEND_SCENE_CAPACITY).entries()){
    const preferred=PREFERRED[friend.animal]||[-5,5],radius=friend.radius??.55;
    const candidates=[];
    const areas=spawnAreas?.length?spawnAreas:[{minX:-15,maxX:random?29:15.5,minZ:random?-13:-9.5,maxZ:random?12:9.5}];
    for(const area of areas)for(let z=area.minZ;z<=area.maxZ;z+=.65)for(let x=area.minX;x<=area.maxX;x+=.65){
      if(!spawnAreas?.length&&!random&&(preferred[0]<0)!==(x<0))continue;
      candidates.push({x,z,score:random?Math.random():Math.hypot(x-preferred[0],z-preferred[1])});
    }
    candidates.sort((a,b)=>a.score-b.score||a.z-b.z||a.x-b.x);
    let placed=null;
    for(const c of candidates){const check=context.inspect(c.x,c.z,radius+.12,result,{walking:true});if(!check.ok||check.region==='railway')continue;
      const room=[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dz])=>[.25,.5,.75,1].every(t=>context.inspect(c.x+dx*t,c.z+dz*t,radius+.12,result,{walking:true}).ok));
      if(room){placed={id:friend.id,animal:friend.animal,x:c.x,y:check.y,z:c.z,radius,height:friend.height||1.9};break;}
    }
    if(placed)result.push(placed);
    else result.push({id:friend.id,animal:friend.animal,unplaced:true,radius,index});
  }
  return result;
}

export function chooseCharacterView(context,target,offset){
  const cast=new THREE.Raycaster();let best=null;
  for(const angle of [0,.3,-.3,.6,-.6,1,-1,Math.PI]){
    const position=target.clone().add(offset.clone().applyAxisAngle(new THREE.Vector3(0,1,0),angle));
    let visibleSamples=0;
    for(const dy of [0,.6,-.6]){
      const to=target.clone().add(new THREE.Vector3(0,dy,0)),direction=to.sub(position),distance=direction.length();
      cast.set(position,direction.normalize());cast.far=Math.max(0,distance-.12);
      if(!cast.intersectObjects(context.occluders,false).length)visibleSamples++;
    }
    if(!best||visibleSamples>best.visibleSamples)best={position,angle,visibleSamples};
    if(visibleSamples===3)break;
  }
  return best;
}

export function createCharacterPlaceholder(friend){
  const root=new THREE.Group(),mat=new THREE.MeshStandardMaterial({color:friend.color||0xddbc72,roughness:1});
  const body=new THREE.Mesh(new THREE.CapsuleGeometry(.28,.62,4,8),mat);body.position.y=.7;root.add(body);
  const head=new THREE.Mesh(new THREE.IcosahedronGeometry(.36,1),mat);head.position.y=1.4;root.add(head);
  // A deliberately simple identity token, never presented as a generated animal.
  const token=new THREE.Mesh(new THREE.OctahedronGeometry(.12),new THREE.MeshBasicMaterial({color:0xfff5d3}));token.position.set(0,1.45,.35);root.add(token);
  root.userData.placeholder=true;return root;
}

export async function createCharacters({scene,camera,controls,renderer,terrain,generated,onSelect,onPlace,onPlacementError,reduced,pickOccluder,obstacleCache}){
  let context=createPlacementContext({scene,terrain,generated,obstacleCache});
  const root=new THREE.Group();root.name='Social companions · interactive';scene.add(root);
  const models=new Map(),records=new Map(),ray=new THREE.Raycaster(),loadingCustom=new Map();
  await Promise.all(ANIMALS.map(async animal=>{
    try{const model=await loadRiggedCharacter(`assets/rodin-friends/${animal}/scene.glb`,{animal});models.set(animal,model);}catch(error){console.warn(`Social companion ${animal}: visible identity placeholder until the local model is available.`);}
  }));
  const leafCanvas=document.createElement('canvas');leafCanvas.width=leafCanvas.height=48;const lc=leafCanvas.getContext('2d');lc.fillStyle='#eff5bd';lc.beginPath();lc.moveTo(7,41);lc.bezierCurveTo(0,10,25,0,42,6);lc.bezierCurveTo(43,25,28,42,7,41);lc.fill();const leafTexture=new THREE.CanvasTexture(leafCanvas);
  let selected=null,saved=null,transition=null,lastOcclusion=0,anchors=[],savedPlacements={},gathering=null,gatherTransition=null,suspended=false,sceneRestoring=null;
  const scenePositions=new Map(),dragSurfaces=[...context.meadows];
  const isReduced=()=>typeof reduced==='boolean'?reduced:!!reduced?.matches;
  const audit={method:'Unified surface and 13-point support disks; slope <=22 degrees; triangles clipped to current foot/head heights; manual body clearance; transient gathering slots.',slots:[],missingModels:ANIMALS.filter(a=>!models.has(a)),unplaced:[]};
  const residents=()=>[...records.values()].filter(r=>r.group.visible&&!r.slot?.unplaced);
  let socialState={statuses:{}};
  function create(friend){
    const group=new THREE.Group(),template=models.get(friend.id)||models.get(friend.animal),body=template?cloneRigModel(template):createCharacterPlaceholder(friend);
    const box=new THREE.Box3().setFromObject(body),size=box.getSize(new THREE.Vector3()),height=friend.height||1.9;
    const scale=height/size.y;body.scale.multiplyScalar(scale);
    body.position.sub(new THREE.Vector3((box.min.x+box.max.x)/2,box.min.y,(box.min.z+box.max.z)/2).multiplyScalar(scale));
    const bodyHolder=new THREE.Group(),poseRoot=new THREE.Group();poseRoot.add(body);bodyHolder.add(poseRoot);group.add(bodyHolder);
    const radius=Math.hypot(size.x,size.z)*scale/2;
    const ring=new THREE.Mesh(new THREE.RingGeometry(radius+.12,radius+.21,40),new THREE.MeshBasicMaterial({color:0xffe3a0,transparent:true,opacity:.8,side:THREE.DoubleSide,depthWrite:false}));
    ring.rotation.x=-Math.PI/2;ring.position.y=.025;ring.visible=false;group.add(ring);
    const gait={phase:{value:0},amount:{value:0}},outline=new THREE.Group();outline.visible=false;
    const materials=[];body.traverse(o=>{if(!o.isMesh)return;o.castShadow=true;o.receiveShadow=true;
      const adapt=m=>{const copy=m.clone();copy.roughness=.96;copy.metalness=0;copy.envMapIntensity=.25;copy.alphaHash=true;materials.push(copy);return copy;};
      o.material=Array.isArray(o.material)?o.material.map(adapt):adapt(o.material);
      o.customDepthMaterial=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,alphaHash:true});materials.push(o.customDepthMaterial);
    });
    const actions=createCharacterActions({body,poseRoot,holder:bodyHolder,animal:friend.animal,height,id:friend.id});setRigStatus(friend.id,body.userData.characterRig||{status:'attention',diagnostics:{reason:'骨骼待校正'}});
    const moteGeo=new THREE.BufferGeometry(),motePositions=new Float32Array(12*3);moteGeo.setAttribute('position',new THREE.BufferAttribute(motePositions,3));
    const motes=new THREE.Points(moteGeo,new THREE.PointsMaterial({color:0xe4ecac,map:leafTexture,size:.2,transparent:true,opacity:1,depthWrite:false}));group.add(motes);
    group.name=`Friend · ${friend.id}`;group.userData.friendId=friend.id;group.userData.placeholder=!!body.userData.placeholder;
    group.traverse(o=>{o.userData.socialCharacter=true;o.userData.friendId=friend.id;});root.add(group);
    return {friend,group,bodyHolder,poseRoot,actions,materials,presentation:{alpha:1},ring,outline,motes,motePositions,height,radius:Math.max(.35,radius),bodyRadius:characterBodyRadius(radius),spawn:performance.now(),occluded:false,gait,walk:null};
  }
  let disposed=false;
  const correctionListener=async event=>{
    for(const [key,template] of [...models])if(template.userData.characterRig?.hash===event.detail.hash){
      const friend=[...records.values()].find(r=>r.friend.id===key||r.friend.animal===key)?.friend;
      const url=ANIMALS.includes(key)?`assets/rodin-friends/${key}/scene.glb`:friend?.modelUrl&&avatarURL(friend.modelUrl);if(!url)continue;
      try{const model=await loadRiggedCharacter(url,{animal:ANIMALS.includes(key)?key:'custom'});if(disposed)return;models.set(key,model);
        for(const r of records.values())if(r.friend.id===key||r.friend.animal===key){
          if(r.placing)drag.cancel();const fresh=create(r.friend),yaw=r.bodyHolder.rotation.y;
          r.actions.dispose();for(const m of r.materials)m.dispose();r.bodyHolder.removeFromParent();
          r.bodyHolder=fresh.bodyHolder;r.poseRoot=fresh.poseRoot;r.actions=fresh.actions;r.materials=fresh.materials;r.bodyHolder.rotation.y=yaw;r.group.add(r.bodyHolder);
          fresh.group.removeFromParent();fresh.ring.geometry.dispose();fresh.ring.material.dispose();fresh.motes.geometry.dispose();fresh.motes.material.dispose();r.pose=null;
        }
        disposeRigTemplate(template);
      }catch(error){console.warn('角色骨骼校正未应用：',error.message);}
    }
  };
  window.addEventListener('character-rig-corrected',correctionListener);
  function resetWalk(record,slot){
    record.slot=slot;const graph=buildWalkingGraph(context,slot,{range:gathering?1.2:3.2});
    record.walk={graph,node:0,route:[],sequence:slot.id.length,wait:4,phase:0,heading:record.walk?.heading??.35,speed:.24+(slot.id.length%3)*.025};
  }
  function refreshAudit(){
    audit.slots=residents().map(r=>r.slot);audit.residents=residents().map(r=>r.friend.id);audit.cached=records.size;
    audit.unplaced=[...records.values()].filter(r=>r.slot?.unplaced).map(r=>r.friend.id);
    audit.walking=[...records.values()].map(r=>({id:r.friend.id,nodes:r.walk?.graph.nodes.length||0,edges:r.walk?.graph.nodes.reduce((n,p)=>n+p.links.length,0)||0}));
  }
  function sync(friends,{transient=false}={}){
    const wanted=new Set(friends.slice(0,FRIEND_SCENE_CAPACITY).map(f=>f.id));
    for(const [id,r] of records)if(!wanted.has(id)&&r.group.visible){if(r.placing)drag.cancel();r.group.visible=false;r.slot=null;r.walk=null;r.actions.reset();}
    const used=residents().map(r=>({x:r.group.position.x,z:r.group.position.z,radius:r.radius+.12}));
    for(const friend of friends.slice(0,FRIEND_SCENE_CAPACITY)){
      if(friend.animal==='custom'&&!models.has(friend.id)){
        if(!friend.modelUrl)continue;
        if(!loadingCustom.has(friend.id)){
          setRigStatus(friend.id,{status:'preparing',diagnostics:{reason:'正在准备骨骼'}});
          const load=loadRiggedCharacter(avatarURL(friend.modelUrl)).then(model=>{models.set(friend.id,model);audit.rosterKey='';}).catch(()=>{audit.modelErrors??={};audit.modelErrors[friend.id]='模型加载失败，请检查本地生成服务。';}).finally(()=>{setTimeout(()=>loadingCustom.delete(friend.id),10000);});
          loadingCustom.set(friend.id,load);
        }
        continue;
      }
      let r=records.get(friend.id);if(r?.group.visible&&r.slot&&!r.slot.unplaced)continue;
      if(!r){r=create(friend);records.set(friend.id,r);}
      let slot;const custom=sceneRestoring?.get(friend.id)||(!transient&&savedPlacements[friend.id]);
      if(custom){const candidates=[custom];if(terrain.theme!=='forest')for(let distance=.4;distance<=4.4;distance+=.4)for(let i=0;i<16;i++)candidates.push({x:custom.x+Math.cos(i*Math.PI/8)*distance,z:custom.z+Math.sin(i*Math.PI/8)*distance});for(const p of candidates){const check=inspectPlacement(r,p.x,p.z);if(check.ok){slot={id:friend.id,animal:friend.animal,...p,y:check.y,radius:r.radius,height:r.height,manualPlacement:true,placementRadius:r.bodyRadius};break;}}}
      if(!slot){
        const reserved={inspect:(x,z,radius,others,options)=>{
          const result=context.inspect(x,z,radius,[...used,...others],options);if(!result.ok)return result;
          if(transient){if((result.normal?.y??1)<.995)return {ok:false};for(let i=0;i<8;i++){const a=i*Math.PI/4;if(Math.abs((terrain.sample?.(x+Math.cos(a)*radius*.9,z+Math.sin(a)*radius*.9).height??result.y)-result.y)>.10)return {ok:false};}const p=new THREE.Vector3(x,result.y+r.height*.6,z).project(camera);if(Math.abs(p.x)>.88||Math.abs(p.y)>.78||p.z>1||blocked(camera.position,new THREE.Vector3(x,result.y+r.height*.65,z)))return {ok:false};}
          return result;
        }};
        slot=pickCharacterSlots(reserved,[{...friend,radius:transient?Math.max(r.radius,r.height*.65):r.radius}],{random:transient,spawnAreas:terrain.layout?.spawnAreas})[0];
      }
      r.group.visible=!slot.unplaced;r.group.scale.setScalar(1);r.slot=slot;r.transient=transient;r.pose=null;r.spawn=performance.now();
      if(!slot.unplaced){r.group.position.set(slot.x,slot.y,slot.z);resetWalk(r,slot);used.push({x:slot.x,z:slot.z,radius:slot.radius+.12});
        if(gathering){gathering.set(friend.id,{position:r.group.position.clone(),slot:{...slot},walk:r.walk});const partySlot=findGatherSlot(r,used.filter(p=>p.x!==slot.x||p.z!==slot.z));if(partySlot){r.group.position.set(partySlot.x,partySlot.y,partySlot.z);resetWalk(r,partySlot);}}
      }
    }
    refreshAudit();scene.updateMatrixWorld(true);if(selected&&!wanted.has(selected))restore({preserveCamera:true});return audit.slots;
  }
  function setPresence(entries,friends){
    const ids=entries.map(e=>e.id).join('|');if(ids!==audit.rosterKey||((audit.unplaced.length||entries.some(e=>!records.has(e.id)))&&performance.now()>(audit.retryAt||0))){audit.retryAt=performance.now()+2000;audit.rosterKey=ids;sync(entries.map(e=>({...friends.find(f=>f.id===e.id),id:e.id})),{transient:true});}
    for(const e of entries){const r=records.get(e.id);if(r)r.presentation=e;}
  }
  function blocked(from,to){if(terrain.isOccluded?.({position:from},to))return true;const delta=to.clone().sub(from),distance=delta.length();ray.set(from,delta.normalize());ray.far=Math.max(0,distance-.12);return ray.intersectObjects(context.occluders,false).length>0;}
  function animateCamera(position,target,done){transition={start:performance.now(),fromPosition:camera.position.clone(),fromTarget:controls.target.clone(),position,target,done};controls.enabled=false;}
  function focus(id){
    const r=records.get(id);if(!r?.group.visible||r.slot?.unplaced)return false;
    if(!saved)saved={position:camera.position.clone(),target:controls.target.clone(),enabled:controls.enabled};
    selected=id;for(const [key,v] of records){v.ring.visible=key===id;v.outline.visible=key===id;}
    const target=r.group.position.clone().add(new THREE.Vector3(0,r.height*.58,0));
    const offset=saved.position.clone().sub(saved.target).multiplyScalar(.85);
    const view=chooseCharacterView(context,target,offset);
    audit.lastFocus={id,angle:view.angle,visibleBodySamples:view.visibleSamples};
    animateCamera(view.position,target,()=>{});return true;
  }
  function restore({preserveCamera=false}={}){
    selected=null;for(const r of records.values()){r.ring.visible=false;r.outline.visible=false;}
    if(preserveCamera){transition=null;controls.enabled=saved?.enabled??controls.enabled;saved=null;return;}
    if(saved){const original=saved;animateCamera(original.position,original.target,()=>{controls.enabled=original.enabled;saved=null;});}
  }
  function pick(x,y){
    if(suspended)return null;
    const rect=renderer.domElement.getBoundingClientRect();camera.updateMatrixWorld(true);
    ray.setFromCamera(new THREE.Vector2((x-rect.left)/rect.width*2-1,1-(y-rect.top)/rect.height*2),camera);ray.far=Infinity;
    const hit=ray.intersectObjects([...records.values()].filter(r=>r.group.visible).map(r=>r.bodyHolder),true).find(h=>h.object.isMesh);
    if(!hit||hit.distance>(pickOccluder?.(x,y)??Infinity)||terrain.isOccluded?.(camera,hit.point))return null;ray.far=Math.max(0,hit.distance-.02);if(ray.intersectObjects(context.occluders,false).length)return null;
    return records.get(hit.object.userData.friendId)||null;
  }
  function inspectPlacement(record,x,z){return context.inspect(x,z,characterBodyRadius(record.radius),[...records.values()].filter(r=>r!==record&&r.group.visible&&!r.slot?.unplaced&&r.slot).map(r=>({x:r.group.position.x,z:r.group.position.z,radius:Math.max(characterBodyRadius(r.radius),(r.pose?.lie||0)>.05?r.height*.65:0)})),{manual:true});}
  const drag=createCharacterDrag({scene:root,camera,controls,canvas:renderer.domElement,surfaces:dragSurfaces,pick,inspect:inspectPlacement,onClick:onSelect,onCommit:(id,p)=>gathering||records.get(id)?.transient?Promise.resolve():onPlace?.(id,p),onError:onPlacementError,onPlaced(record,point){
    const slot={...record.slot,...point,manualPlacement:true,placementRadius:characterBodyRadius(record.radius)};if(!gathering&&!record.transient)savedPlacements[record.friend.id]={x:point.x,z:point.z};resetWalk(record,slot);refreshAudit();
  }});
  const placement={
    activity(){return [...records.values()].map(r=>({id:r.friend.id,visible:r.group.visible,updates:r.actionUpdates||0}));},
    snapshot(){return{...drag.snapshot(),characters:residents().map(r=>({id:r.friend.id,position:r.group.position.toArray(),home:r.slot,radius:r.radius,walking:!!r.walk?.route.length,presentation:r.presentation,pose:r.pose,rig:r.actions.binding})),cached:records.size};},
    reviewView(id){const r=records.get(id);if(!r)return null;const target=r.group.position.clone().add(new THREE.Vector3(0,r.height*.43,0)),view=chooseCharacterView(context,target,new THREE.Vector3(4,2.6,5));return {position:view.position.toArray(),target:target.toArray(),visibleSamples:view.visibleSamples};},
    project(x,y,z){const p=new THREE.Vector3(x,y,z).project(camera),rect=renderer.domElement.getBoundingClientRect();return{x:rect.left+(p.x*.5+.5)*rect.width,y:rect.top+(.5-p.y*.5)*rect.height};},
    inspect(id,x,z){const r=records.get(id);return r?inspectPlacement(r,x,z):{ok:false};},
    pick(x,y){return pick(x,y)?.friend.id||null;},
  };
  const viewerPosition=new THREE.Vector3();
  function update(now,dt){
    camera.getWorldPosition(viewerPosition);
    if(suspended)return;
    drag.update();
    terrain.setResidents?.(residents().map(r=>({x:r.group.position.x,z:r.group.position.z,radius:r.bodyRadius})));
    if(gatherTransition){const t=isReduced()?1:Math.min(1,(now-gatherTransition.start)/600);for(const r of residents().filter(r=>gatherTransition.targets.has(r.friend.id))){r.group.scale.setScalar(Math.max(.015,Math.abs(t*2-1)));if(t>=.5&&!gatherTransition.moved){const p=gatherTransition.targets.get(r.friend.id);if(p)r.group.position.copy(p);r.spawn=now;}}if(t>=.5)gatherTransition.moved=true;if(t===1){for(const r of residents().filter(r=>gatherTransition.targets.has(r.friend.id)))r.group.scale.setScalar(1);gatherTransition=null;}}
    const mobileFocus=selected&&renderer.domElement.clientWidth<=850;
    if(mobileFocus){const w=renderer.domElement.clientWidth,h=renderer.domElement.clientHeight;if(!camera.view?.enabled||camera.view.offsetY!==h*.26)camera.setViewOffset(w,h,0,h*.26,w,h);}
    else if(camera.view?.enabled)camera.clearViewOffset();
    if(transition){const t=isReduced()?1:THREE.MathUtils.clamp((now-transition.start)/450,0,1),s=t*t*(3-2*t);camera.position.lerpVectors(transition.fromPosition,transition.position,s);controls.target.lerpVectors(transition.fromTarget,transition.target,s);camera.lookAt(controls.target);if(t===1){const done=transition.done;transition=null;done?.();}}
    // Project against this frame's camera, before WebGLRenderer updates it.
    camera.updateMatrixWorld(true);
    const rect=renderer.domElement.getBoundingClientRect();anchors=[];
    const checkOcclusion=now-lastOcclusion>300;if(checkOcclusion)lastOcclusion=now;
    for(const [id,r] of records){
      if(!r.group.visible)continue;
      const seconds=now/1000,age=(now-r.spawn)/1000,motion=isReduced()?0:1;
      if(r.modRelocation){const move=r.modRelocation,t=isReduced()?1:Math.min(1,(now-move.start)/400);r.group.position.lerpVectors(move.from,move.to,t*t*(3-2*t));if(t===1)r.modRelocation=null;}
      const walk=r.walk,delta=Math.min(dt||0,.05),status=socialState.statuses?.[id],currentStatus=status?.expiresAt>Date.now()?status:null,policy=r.actions.policy(now,currentStatus,isReduced());let moving=false;
      if(walk&&r.lastStatusKind!==currentStatus?.kind){r.lastStatusKind=currentStatus?.kind;walk.route=[];walk.wait=.3;}
      const displayAlpha=r.presentation.alpha*(r.friend.animal==='custom'?Math.min(1,age/(isReduced()?.1:.65)):1);
      for(const m of r.materials)m.opacity=displayAlpha;
      const poseRadius=Math.max(r.bodyRadius,r.height*.65);
      if(currentStatus?.kind==='tired'&&(!r.restInfo||now-r.restInfo.at>450||Math.hypot(r.group.position.x-r.restInfo.x,r.group.position.z-r.restInfo.z)>.1)){
        const c=context.inspect(r.group.position.x,r.group.position.z,poseRadius,residents().filter(o=>o!==r).map(o=>({x:o.group.position.x,z:o.group.position.z,radius:Math.max(o.bodyRadius,(o.pose?.lie||0)>.05?o.height*.65:0)})),{manual:true});
        r.restInfo={ok:c.ok&&(c.normal?.y??1)>.99,at:now,x:r.group.position.x,z:r.group.position.z};
      }
      const canRest=currentStatus?.kind!=='tired'||!!r.restInfo?.ok;
      if(walk&&!r.modRelocation&&!gatherTransition&&!drag.busy&&selected!==id&&!r.presentation.chatting&&policy.allowed&&motion&&!document.hidden&&age>1){
        walk.wait=Math.max(0,walk.wait-delta);
        if(!walk.route.length&&walk.wait===0){walk.route=walkingRoute(walk.graph,walk.node,walk.sequence++,{range:currentStatus?.kind==='relax'?1.3:currentStatus?.kind==='busy'?1.8:3.2});if(!walk.route.length)walk.wait=3;}
        if(walk.route.length&&walk.wait===0){
          const dest=walk.graph.nodes[walk.route[0]],dx=dest.x-r.group.position.x,dz=dest.z-r.group.position.z,distance=Math.hypot(dx,dz),amount=Math.min(distance,delta*(policy.speed||.20));
          const next={x:r.group.position.x+dx/Math.max(distance,1e-6)*amount,z:r.group.position.z+dz/Math.max(distance,1e-6)*amount};
          const others=[...records.values()].filter(other=>other!==r&&other.group.visible).map(other=>({x:other.group.position.x,z:other.group.position.z,radius:Math.max(r.slot.manualPlacement?characterBodyRadius(other.radius):other.radius+.08,(other.pose?.lie||0)>.05?other.height*.65:0)}));
          if((terrain.canWalkStep?.(r.group.position,next,r.bodyRadius)??true)&&canWalkStep(r.group.position,next,r.slot.manualPlacement?r.slot.placementRadius:r.radius+.08,others,r.slot.manualPlacement?.15:.6)){
            r.group.position.set(next.x,terrain.sample?.(next.x,next.z).height??THREE.MathUtils.lerp(r.group.position.y,dest.y,amount/Math.max(distance,1e-6)),next.z);walk.heading=Math.atan2(dx,dz);moving=amount>0;walk.phase+=amount*17;
            if(distance<.015||amount>=distance){walk.node=walk.route.shift();if(!walk.route.length)walk.wait=policy.wait+(walk.sequence%2);}
          }else walk.wait=.7;
        }
      }
      const facing=Math.atan2(viewerPosition.x-r.group.position.x,viewerPosition.z-r.group.position.z);
      let desired=selected===id||r.placing?facing:(walk?.heading??.35);
      const angle=Math.atan2(Math.sin(desired-r.bodyHolder.rotation.y),Math.cos(desired-r.bodyHolder.rotation.y));r.bodyHolder.rotation.y+=angle*Math.min(1,delta*3);
      let groundPad=0;if(currentStatus?.kind==='tired'&&canRest)for(let i=0;i<8;i++){const a=i*Math.PI/4;groundPad=Math.max(groundPad,(terrain.sample?.(r.group.position.x+Math.cos(a)*poseRadius*.7,r.group.position.z+Math.sin(a)*poseRadius*.7).height??r.group.position.y)-r.group.position.y);}
      r.actionUpdates=(r.actionUpdates||0)+1;r.pose=r.actions.update({now,dt:delta,status:currentStatus,moving,phase:walk?.phase||0,override:r.placing||selected===id||!!r.presentation.chatting||!!gatherTransition,reduced:isReduced(),canRest,groundPad});
      const moteAge=Math.min(age,(now-(r.messageAt||-Infinity))/1000);r.motes.visible=moteAge<1.7&&!isReduced();
      if(r.motes.visible){for(let i=0;i<12;i++){const a=i*2.399+moteAge*2;r.motePositions[i*3]=Math.cos(a)*(r.radius+.15);r.motePositions[i*3+1]=.15+moteAge*.8+i%3*.15;r.motePositions[i*3+2]=Math.sin(a)*(r.radius+.15);}r.motes.geometry.attributes.position.needsUpdate=true;r.motes.material.opacity=Math.max(0,1-moteAge/1.7);}
      const normal=terrain.sample?.(r.group.position.x,r.group.position.z).normal;if(normal)r.ring.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),new THREE.Vector3(normal.x,normal.y,normal.z));
      r.group.updateMatrixWorld(true);
      const anchor=r.pose.anchor;const world=r.group.position.clone().add(new THREE.Vector3(anchor.x,anchor.y,anchor.z));
      if(checkOcclusion)r.occluded=blocked(viewerPosition,r.group.position.clone().add(new THREE.Vector3(0,r.height*.7,0)));
      const bounds=r.pose.bounds;let headY=Infinity;for(const x of [bounds.minX,bounds.maxX])for(const y of [bounds.minY,bounds.maxY])for(const z of [bounds.minZ,bounds.maxZ]){const corner=r.group.localToWorld(new THREE.Vector3(x,y+bounds.groundOffset,z)).project(camera);headY=Math.min(headY,(-.5*corner.y+.5)*rect.height);}const p=world.project(camera);anchors.push({id,headY:headY-6,worldX:r.group.position.x,worldZ:r.group.position.z,walking:moving,x:(p.x*.5+.5)*rect.width,y:(-.5*p.y+.5)*rect.height,visible:p.z>-1&&p.z<1&&Math.abs(p.x)<1.15&&Math.abs(p.y)<1.15,occluded:r.occluded,placeholder:r.group.userData.placeholder,alpha:displayAlpha,phase:r.presentation.phase,pose:r.pose.kind});
    }
  }
  function findGatherSlot(r,used){
    const center=terrain.layout?.gatheringCenter||{x:21,z:2};for(let i=0;i<(terrain.theme==='fuji'?192:128);i++){const a=i*2.399,radius=(terrain.layout?.gatheringRadius??(terrain.theme==='fuji'?2.4:3.5))+Math.floor(i/32)*.6,x=center.x+Math.cos(a)*radius,z=center.z+Math.sin(a)*radius;const check=context.inspect(x,z,r.bodyRadius,used,{manual:true});if(check.ok)return {...r.slot,x,y:check.y,z,gathering:true,manualPlacement:true,placementRadius:r.bodyRadius};}
    return null;
  }
  function beginGather(){
    if(gathering)return {ok:true,count:residents().length,repeated:true};
    const guests=residents().filter(r=>r.presentation.eligible!==false);if(!guests.length)return {ok:false,reason:'先和好友聊聊天，最近联系的朋友会来到森林。'};
    const slots=new Map(),used=[];
    for(const r of guests){const slot=findGatherSlot(r,used);if(!slot)return {ok:false,reason:'广场暂时没有足够空位。'};slots.set(r.friend.id,slot);used.push({...slot,radius:r.bodyRadius});}
    gathering=new Map(guests.map(r=>[r.friend.id,{position:r.group.position.clone(),slot:{...r.slot},walk:r.walk}]));
    const targets=new Map();for(const r of guests){const slot=slots.get(r.friend.id);resetWalk(r,slot);r.walk.wait=3;r.spawn=performance.now();targets.set(r.friend.id,new THREE.Vector3(slot.x,slot.y,slot.z));}
    gatherTransition={start:performance.now(),targets,moved:false};refreshAudit();return {ok:true,count:slots.size};
  }
  function endGather(){
    if(!gathering)return false;drag.cancel();const old=gathering;gathering=null;
    const targets=new Map();for(const [id,state] of old){const r=records.get(id);if(!r)continue;r.slot=state.slot;r.walk=state.walk;targets.set(id,state.position);}
    gatherTransition={start:performance.now(),targets,moved:false};refreshAudit();return true;
  }
  function finishCamera(){if(transition){const t=transition;transition=null;camera.position.copy(t.position);controls.target.copy(t.target);camera.lookAt(controls.target);t.done?.();}}
  function setScene(next,{positions,theme=next.terrain?.theme||'forest'}={}){
    if(drag.snapshot().pending)throw new Error('请等待人物安放完成后再切换场景。');
    // Build before modifying the active context so a bad surface cannot strand residents.
    const nextContext=createPlacementContext({scene:next.scene,terrain:next.terrain,generated:next.generated,obstacleCache:next.obstacleCache});
    drag.cancel();
    const previous=new Map();for(const r of residents()){
      const home=gathering?.get(r.friend.id)?.position||r.group.position;
      previous.set(r.friend.id,{x:home.x,z:home.z});
    }
    scenePositions.set(terrain.theme||'forest',previous);
    const friends=residents().map(r=>r.friend),oldContext=context;
    scene=next.scene;terrain=next.terrain;generated=next.generated;
    if('pickOccluder' in next)pickOccluder=next.pickOccluder;
    context=nextContext;dragSurfaces.splice(0,dragSurfaces.length,...context.meadows);
    scene.add(root);gathering=null;gatherTransition=null;transition=null;controls.enabled=saved?.enabled??controls.enabled;saved=null;anchors=[];lastOcclusion=0;
    sceneRestoring=positions?new Map(Object.entries(positions)):scenePositions.get(theme)||null;
    for(const r of records.values()){r.group.visible=false;r.slot=null;r.walk=null;r.restInfo=null;r.pose=null;r.placing=false;r.group.scale.setScalar(1);}
    sync(friends,{transient:true});sceneRestoring=null;
    for(const [id,r] of records){r.ring.visible=id===selected;r.outline.visible=id===selected;}
    audit.rosterKey='';audit.theme=theme;audit.sceneChanges=(audit.sceneChanges||0)+1;
    oldContext.dispose();return audit.slots;
  }
  function suspend(value){suspended=!!value;if(suspended){drag.cancel();anchors=[];}root.visible=!suspended;}
  function cancelPlacement(){if(drag.snapshot().pending)return false;drag.cancel();return true;}
  function refreshObstacles(){
    drag.cancel();let used=[];
    for(const r of residents()){
      const here={x:r.group.position.x,z:r.group.position.z},check=context.inspect(here.x,here.z,r.bodyRadius,used,{manual:true});let slot={...r.slot,...here,y:check.y??r.slot.y,manualPlacement:true,placementRadius:r.bodyRadius};
      if(!check.ok){
        let found=null;for(let distance=.4;distance<=9&&!found;distance+=.4)for(let i=0;i<24;i++){const x=here.x+Math.cos(i*Math.PI/12)*distance,z=here.z+Math.sin(i*Math.PI/12)*distance,c=context.inspect(x,z,r.bodyRadius,used,{manual:true});if(c.ok){found={x,y:c.y,z};break;}}
        if(found){slot={...slot,...found};r.modRelocation={start:performance.now(),from:r.group.position.clone(),to:new THREE.Vector3(found.x,found.y,found.z)};}
      }
      resetWalk(r,slot);r.restInfo=null;used.push({x:slot.x,z:slot.z,radius:r.bodyRadius});
    }
    lastOcclusion=0;refreshAudit();
  }
  function getSceneState(){return{theme:terrain.theme||'forest',suspended,positions:Object.fromEntries(residents().map(r=>[r.friend.id,{x:r.group.position.x,z:r.group.position.z}])),cachedThemes:[...scenePositions.keys()],cachedCharacters:records.size,contextObstacles:context.obstacles.length,activeObstacles:context.obstacles.filter(o=>!o.owner?.userData.modDisabled).length};}
  function dispose(){disposed=true;window.removeEventListener('character-rig-corrected',correctionListener);drag.dispose();context.dispose();leafTexture.dispose();root.removeFromParent();for(const r of records.values()){r.actions.dispose();for(const m of r.materials)m.dispose();r.motes.geometry.dispose();r.motes.material.dispose();r.ring.geometry.dispose();r.ring.material.dispose();}records.clear();}
  return {root,refreshObstacles,sync,setPresence,setScene,suspend,cancelPlacement,getSceneState,setSocialState:state=>{socialState=state;},get residentIds(){return residents().map(r=>r.friend.id);},focus,restore,finishCamera,beginGather,endGather,get gathering(){return!!gathering;},update,placement,setPlacements:positions=>{savedPlacements=structuredClone(positions||{});},pulse:id=>{const r=records.get(id);if(r)r.messageAt=performance.now();},getAnchors:()=>anchors,getScreenAnchor:id=>anchors.find(a=>a.id===id)||null,dispose,audit};
}
