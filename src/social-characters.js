import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {buildWalkingGraph,walkingRoute,canWalkStep} from './companion-walk.js';
import {WALKWAYS,distanceToSegment} from './layout.js';
import {createCharacterDrag} from './character-drag.js';

const ANIMALS=['kangaroo','fox','rabbit','bear'];
const PREFERRED={kangaroo:[-5.9,-3],fox:[-9.5,5.4],rabbit:[-6,7.5],bear:[8,4.4]};
const down=new THREE.Vector3(0,-1,0);
export const characterBodyRadius=radius=>Math.max(.3,Math.min(.65,radius*.65));
const segmentDistance=(x,z,a,b)=>{const dx=b[0]-a[0],dz=b[1]-a[1],d=dx*dx+dz*dz,t=d?THREE.MathUtils.clamp(((x-a[0])*dx+(z-a[1])*dz)/d,0,1):0;return Math.hypot(x-a[0]-t*dx,z-a[1]-t*dz);};
function triangleDistance(x,z,t){
  const cross=(a,b)=>(b[0]-a[0])*(z-a[1])-(b[1]-a[1])*(x-a[0]);
  // Filled projection, except vertical/degenerate faces which are line segments.
  const area=(t[1][0]-t[0][0])*(t[2][1]-t[0][1])-(t[1][1]-t[0][1])*(t[2][0]-t[0][0]);
  const signs=[cross(t[0],t[1]),cross(t[1],t[2]),cross(t[2],t[0])];
  if(Math.abs(area)>1e-8&&(signs.every(v=>v>=0)||signs.every(v=>v<=0)))return 0;
  return Math.min(segmentDistance(x,z,t[0],t[1]),segmentDistance(x,z,t[1],t[2]),segmentDistance(x,z,t[2],t[0]));
}

/** Capture support and obstacle geometry before static scene batching detaches meshes. */
export function createPlacementContext({scene,terrain,generated}){
  scene.updateMatrixWorld(true);
  const meadows=[],occluders=[],obstacles=[];
  terrain.root.traverse(o=>{if(o.isMesh&&o.name.endsWith(' meadow'))meadows.push(o);});
  const owners=[...(generated?.children||[])];
  scene.traverse(o=>{if(o.isGroup&&/campfire|stump|stool/i.test(o.name))owners.push(o);});
  for(const owner of owners){
    const triangles=[],bounds=new THREE.Box2(),solidMeshes=[];
    owner.traverse(mesh=>{
      if(!mesh.isMesh||!mesh.geometry?.attributes.position)return;
      occluders.push(mesh);
      // Double-sided geometry views support parity rays without changing the
      // visible material. They remain valid after render batching.
      const solid=new THREE.Mesh(mesh.geometry,new THREE.MeshBasicMaterial({side:THREE.DoubleSide}));
      solid.matrixAutoUpdate=false;solid.matrixWorld.copy(mesh.matrixWorld);solidMeshes.push(solid);
      const pos=mesh.geometry.attributes.position,index=mesh.geometry.index;
      const count=index?index.count:pos.count;
      for(let i=0;i<count;i+=3){
        const points=[0,1,2].map(k=>new THREE.Vector3().fromBufferAttribute(pos,index?index.getX(i+k):i+k).applyMatrix4(mesh.matrixWorld));
        if(Math.max(...points.map(p=>p.y))<2.27||Math.min(...points.map(p=>p.y))>4.45)continue;
        // Clip triangles to the vertical body band, so crowns above a head do not
        // reserve their whole shadow and distant roots do not reserve whole trees.
        let clipped=points;
        for(const [height,above] of [[2.27,true],[4.45,false]]){
          const input=clipped;clipped=[];
          for(let j=0;j<input.length;j++){
            const a=input[j],b=input[(j+1)%input.length],ain=above?a.y>=height:a.y<=height,bin=above?b.y>=height:b.y<=height;
            if(ain)clipped.push(a);
            if(ain!==bin)clipped.push(a.clone().lerp(b,(height-a.y)/(b.y-a.y)));
          }
        }
        for(let j=1;j+1<clipped.length;j++){
          const t=[clipped[0],clipped[j],clipped[j+1]].map(p=>[p.x,p.z]);
          const box=new THREE.Box2().setFromPoints(t.map(p=>new THREE.Vector2(...p)));
          bounds.union(box);triangles.push({points:t,box});
        }
      }
    });
    obstacles.push({id:owner.userData.layoutId||owner.name,kind:owner.userData.kind,bounds,triangles,solidMeshes});
  }
  const ray=new THREE.Raycaster();
  function inspect(x,z,radius,used=[],{walking=false,manual=false}={}){
    const walkway=WALKWAYS.find(w=>distanceToSegment(x,z,w)<w.width/2+radius+.1);
    if(walkway&&!walking&&!manual)return {ok:false,reason:'walkway',id:walkway.id};
    if(Math.hypot(x+8.5,z-1.5)<(manual?.75:1.7)+radius+(manual?.06:.35))return {ok:false,reason:'campfire'};
    if(used.some(p=>Math.hypot(p.x-x,p.z-z)<p.radius+radius+(manual?.15:.6)))return {ok:false,reason:'friend clearance'};
    let groundY=2.22;
    for(let i=0;i<13;i++){
      const r=i?radius+(manual?.02:.12):0,a=(i-1)/12*Math.PI*2;
      ray.set(new THREE.Vector3(x+Math.cos(a)*r,8,z+Math.sin(a)*r),down);ray.far=8;
      const hit=ray.intersectObjects(meadows,false)[0];
      if(!hit)return {ok:false,reason:'no meadow support'};
      groundY=Math.max(groundY,hit.point.y);
    }
    const point=new THREE.Vector2(x,z),clearance=radius+(manual?.06:.35);
    for(const obstacle of obstacles){
      if(manual&&['grass','fern_large'].includes(obstacle.kind))continue;
      if(obstacle.bounds.distanceToPoint(point)>=clearance)continue;
      for(const triangle of obstacle.triangles){
        if(triangle.box.distanceToPoint(point)>=clearance)continue;
        if(triangleDistance(x,z,triangle.points)<clearance)return {ok:false,reason:'obstacle',id:obstacle.id};
      }
      // A point deep inside a closed building can be far from every wall;
      // reject that case using horizontal parity, without reserving tree shade.
      if(obstacle.bounds.containsPoint(point)){
        ray.set(new THREE.Vector3(x,3.1,z),new THREE.Vector3(1,0,0));ray.far=100;
        const hits=ray.intersectObjects(obstacle.solidMeshes,false).map(h=>h.distance);
        const unique=hits.filter((distance,i)=>!i||distance-hits[i-1]>1e-4);
        if(unique.length%2)return {ok:false,reason:'inside obstacle',id:obstacle.id};
      }
    }
    return {ok:true,y:groundY};
  }
  return {meadows,occluders,obstacles,inspect};
}

export function pickCharacterSlots(context,friends){
  const result=[];
  for(const [index,friend] of friends.slice(0,8).entries()){
    const preferred=PREFERRED[friend.animal]||[-5,5],radius=friend.radius??.55;
    const candidates=[];
    for(let z=-9.5;z<=9.5;z+=.65)for(let x=-15;x<=15.5;x+=.65){
      if((preferred[0]<0)!==(x<0))continue;
      candidates.push({x,z,score:Math.hypot(x-preferred[0],z-preferred[1])});
    }
    candidates.sort((a,b)=>a.score-b.score||a.z-b.z||a.x-b.x);
    let placed=null;
    for(const c of candidates){const check=context.inspect(c.x,c.z,radius+.12,result,{walking:true});if(!check.ok)continue;
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

export async function createCharacters({scene,camera,controls,renderer,terrain,generated,onSelect,onPlace,onPlacementError,reduced}){
  const context=createPlacementContext({scene,terrain,generated});
  const root=new THREE.Group();root.name='Social companions · interactive';scene.add(root);
  const loader=new GLTFLoader(),models=new Map(),records=new Map(),ray=new THREE.Raycaster();
  await Promise.all(ANIMALS.map(async animal=>{
    try{const gltf=await loader.loadAsync(`assets/rodin-friends/${animal}/scene.glb`);models.set(animal,gltf.scene);}catch(error){console.warn(`Social companion ${animal}: visible identity placeholder until the local model is available.`);}
  }));
  let selected=null,saved=null,transition=null,lastOcclusion=0,anchors=[],savedPlacements={};
  const isReduced=()=>typeof reduced==='boolean'?reduced:!!reduced?.matches;
  const audit={method:'Ground disk raycasts; actual obstacle triangles clipped to 2.27–4.45m; body radius plus 0.35m; WALKWAYS; 0.6m inter-character separation.',slots:[],missingModels:ANIMALS.filter(a=>!models.has(a)),unplaced:[]};
  function create(friend){
    const group=new THREE.Group(),body=(models.get(friend.animal)?.clone(true)||createCharacterPlaceholder(friend));
    const box=new THREE.Box3().setFromObject(body),size=box.getSize(new THREE.Vector3()),height=friend.height||1.9;
    const scale=height/size.y;body.scale.multiplyScalar(scale);
    body.position.sub(new THREE.Vector3((box.min.x+box.max.x)/2,box.min.y,(box.min.z+box.max.z)/2).multiplyScalar(scale));
    const bodyHolder=new THREE.Group();bodyHolder.add(body);group.add(bodyHolder);
    const radius=Math.hypot(size.x,size.z)*scale/2;
    const ring=new THREE.Mesh(new THREE.RingGeometry(radius+.12,radius+.21,40),new THREE.MeshBasicMaterial({color:0xffe3a0,transparent:true,opacity:.8,side:THREE.DoubleSide,depthWrite:false}));
    ring.rotation.x=-Math.PI/2;ring.position.y=.025;ring.visible=false;group.add(ring);
    const gait={phase:{value:0},amount:{value:0}};
    const outline=new THREE.Group();outline.visible=false;body.traverse(o=>{
      if(!o.isMesh)return;
      o.castShadow=true;o.receiveShadow=true;
      o.geometry.computeBoundingBox();const local=o.geometry.boundingBox,lo=local.min.y,span=local.max.y-lo,mid=(local.min.x+local.max.x)/2;
      const adapt=m=>{const copy=m.clone();if(copy.isMeshStandardMaterial){copy.roughness=.96;copy.metalness=0;copy.envMapIntensity=.25;}
        copy.onBeforeCompile=shader=>{shader.uniforms.walkPhase=gait.phase;shader.uniforms.walkAmount=gait.amount;shader.vertexShader='uniform float walkPhase; uniform float walkAmount;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
          float legWeight=1.0-smoothstep(${(lo+span*.13).toFixed(6)},${(lo+span*.34).toFixed(6)},position.y);
          float stride=sin(walkPhase+(position.x<${mid.toFixed(6)}?0.0:3.141593));
          transformed.z+=stride*${(span*.035).toFixed(6)}*legWeight*walkAmount;
          transformed.y+=max(0.0,stride)*${(span*.022).toFixed(6)}*legWeight*walkAmount;`);};copy.customProgramCacheKey=()=>`companion-walk-${lo}-${span}-${mid}`;return copy;};
      o.material=Array.isArray(o.material)?o.material.map(adapt):adapt(o.material);
    });
    body.updateMatrixWorld(true);
    body.traverse(o=>{if(!o.isMesh)return;const edge=new THREE.LineSegments(new THREE.EdgesGeometry(o.geometry,38),new THREE.LineBasicMaterial({color:0xffe5a4,transparent:true,opacity:.36}));edge.applyMatrix4(o.matrixWorld);outline.add(edge);});bodyHolder.add(outline);
    const moteGeo=new THREE.BufferGeometry(),motePositions=new Float32Array(12*3);moteGeo.setAttribute('position',new THREE.BufferAttribute(motePositions,3));
    const motes=new THREE.Points(moteGeo,new THREE.PointsMaterial({color:0xe4ecac,size:.09,transparent:true,opacity:1,depthWrite:false}));group.add(motes);
    group.name=`Friend · ${friend.id}`;group.userData.friendId=friend.id;group.userData.placeholder=!!body.userData.placeholder;
    group.traverse(o=>{o.userData.socialCharacter=true;o.userData.friendId=friend.id;});root.add(group);
    return {friend,group,bodyHolder,ring,outline,motes,motePositions,height,radius:Math.max(.35,radius),bodyRadius:characterBodyRadius(radius),spawn:performance.now(),occluded:false,gait,walk:null};
  }
  function resetWalk(record,slot){
    record.slot=slot;const graph=buildWalkingGraph(context,slot);
    record.walk={graph,node:0,route:[],sequence:slot.id.length,wait:4,phase:0,heading:record.walk?.heading??.35,speed:.24+(slot.id.length%3)*.025};
  }
  function refreshAudit(){
    audit.slots=[...records.values()].map(r=>r.slot);
    audit.unplaced=audit.slots.filter(s=>s?.unplaced).map(s=>s.id);
    audit.walking=[...records.values()].map(r=>({id:r.friend.id,nodes:r.walk?.graph.nodes.length||0,edges:r.walk?.graph.nodes.reduce((n,p)=>n+p.links.length,0)||0}));
  }
  function sync(friends){
    const visible=friends.slice(0,8),wanted=new Set(visible.map(f=>f.id));
    for(const [id,record] of records)if(!wanted.has(id)){record.group.removeFromParent();records.delete(id);}
    const used=[...records.values()].filter(r=>r.group.visible&&r.slot&&!r.slot.unplaced).map(r=>({x:r.group.position.x,z:r.group.position.z,radius:r.radius+.12}));
    const order=visible.slice().sort((a,b)=>Number(!!savedPlacements[b.id])-Number(!!savedPlacements[a.id]));
    for(const friend of order){
      let record=records.get(friend.id);if(record?.slot&&!record.slot.unplaced)continue;
      if(!record){record=create(friend);records.set(friend.id,record);}
      const custom=savedPlacements[friend.id];let slot;
      if(custom&&Number.isFinite(custom.x)&&Number.isFinite(custom.z)){
        const check=inspectPlacement(record,custom.x,custom.z);
        if(check.ok)slot={id:friend.id,animal:friend.animal,x:custom.x,y:check.y,z:custom.z,radius:record.radius,height:record.height,manualPlacement:true,placementRadius:characterBodyRadius(record.radius)};
      }
      if(!slot){const reserved={inspect:(x,z,radius,others,options)=>context.inspect(x,z,radius,[...used,...others],options)};slot=pickCharacterSlots(reserved,[{...friend,radius:record.radius}])[0];}
      record.group.visible=!slot.unplaced;record.slot=slot;
      if(!slot.unplaced){record.group.position.set(slot.x,slot.y,slot.z);resetWalk(record,slot);used.push({x:slot.x,z:slot.z,radius:slot.radius+.12});}
    }
    refreshAudit();scene.updateMatrixWorld(true);
    if(selected&&!wanted.has(selected))restore();return audit.slots;
  }
  function blocked(from,to){const delta=to.clone().sub(from),distance=delta.length();ray.set(from,delta.normalize());ray.far=Math.max(0,distance-.12);return ray.intersectObjects(context.occluders,false).length>0;}
  function animateCamera(position,target,done){transition={start:performance.now(),fromPosition:camera.position.clone(),fromTarget:controls.target.clone(),position,target,done};controls.enabled=false;}
  function focus(id){
    const r=records.get(id);if(!r||r.slot?.unplaced)return false;
    if(!saved)saved={position:camera.position.clone(),target:controls.target.clone(),enabled:controls.enabled};
    selected=id;for(const [key,v] of records){v.ring.visible=key===id;v.outline.visible=key===id;}
    const target=r.group.position.clone().add(new THREE.Vector3(0,r.height*.58,0));
    const offset=saved.position.clone().sub(saved.target).multiplyScalar(.85);
    const view=chooseCharacterView(context,target,offset);
    audit.lastFocus={id,angle:view.angle,visibleBodySamples:view.visibleSamples};
    animateCamera(view.position,target,()=>{});return true;
  }
  function restore(){
    selected=null;for(const r of records.values()){r.ring.visible=false;r.outline.visible=false;}
    if(saved){const original=saved;animateCamera(original.position,original.target,()=>{controls.enabled=original.enabled;saved=null;});}
  }
  function pick(x,y){
    const rect=renderer.domElement.getBoundingClientRect();camera.updateMatrixWorld(true);
    ray.setFromCamera(new THREE.Vector2((x-rect.left)/rect.width*2-1,1-(y-rect.top)/rect.height*2),camera);ray.far=Infinity;
    const hit=ray.intersectObjects([...records.values()].filter(r=>r.group.visible).map(r=>r.bodyHolder),true).find(h=>h.object.isMesh);
    if(!hit)return null;ray.far=Math.max(0,hit.distance-.02);if(ray.intersectObjects(context.occluders,false).length)return null;
    return records.get(hit.object.userData.friendId)||null;
  }
  function inspectPlacement(record,x,z){return context.inspect(x,z,characterBodyRadius(record.radius),[...records.values()].filter(r=>r!==record&&r.group.visible&&!r.slot?.unplaced&&r.slot).map(r=>({x:r.group.position.x,z:r.group.position.z,radius:characterBodyRadius(r.radius)})),{manual:true});}
  const drag=createCharacterDrag({scene,camera,controls,canvas:renderer.domElement,pick,inspect:inspectPlacement,onClick:onSelect,onCommit:onPlace,onError:onPlacementError,onPlaced(record,point){
    const slot={...record.slot,...point,manualPlacement:true,placementRadius:characterBodyRadius(record.radius)};savedPlacements[record.friend.id]={x:point.x,z:point.z};resetWalk(record,slot);refreshAudit();
  }});
  const placement={
    snapshot(){return{...drag.snapshot(),characters:[...records.values()].map(r=>({id:r.friend.id,position:r.group.position.toArray(),home:r.slot,radius:r.radius,walking:!!r.walk?.route.length}))};},
    project(x,y,z){const p=new THREE.Vector3(x,y,z).project(camera),rect=renderer.domElement.getBoundingClientRect();return{x:rect.left+(p.x*.5+.5)*rect.width,y:rect.top+(.5-p.y*.5)*rect.height};},
    inspect(id,x,z){const r=records.get(id);return r?inspectPlacement(r,x,z):{ok:false};},
    pick(x,y){return pick(x,y)?.friend.id||null;},
  };
  function update(now,dt){
    drag.update();
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
      const walk=r.walk,delta=Math.min(dt||0,.05);let moving=false;
      if(walk&&!drag.busy&&selected!==id&&motion&&!document.hidden&&age>1){
        walk.wait=Math.max(0,walk.wait-delta);
        if(!walk.route.length&&walk.wait===0){walk.route=walkingRoute(walk.graph,walk.node,walk.sequence++);if(!walk.route.length)walk.wait=3;}
        if(walk.route.length&&walk.wait===0){
          const dest=walk.graph.nodes[walk.route[0]],dx=dest.x-r.group.position.x,dz=dest.z-r.group.position.z,distance=Math.hypot(dx,dz),amount=Math.min(distance,delta*walk.speed);
          const next={x:r.group.position.x+dx/Math.max(distance,1e-6)*amount,z:r.group.position.z+dz/Math.max(distance,1e-6)*amount};
          const others=[...records.values()].filter(other=>other!==r&&other.group.visible).map(other=>({x:other.group.position.x,z:other.group.position.z,radius:r.slot.manualPlacement?characterBodyRadius(other.radius):other.radius+.08}));
          if(canWalkStep(r.group.position,next,r.slot.manualPlacement?r.slot.placementRadius:r.radius+.08,others,r.slot.manualPlacement?.15:.6)){
            r.group.position.set(next.x,dest.y,next.z);walk.heading=Math.atan2(dx,dz);moving=amount>0;walk.phase+=amount*17;
            if(distance<.015||amount>=distance){walk.node=walk.route.shift();if(!walk.route.length)walk.wait=2+(walk.sequence%4);}
          }else walk.wait=.7;
        }
      }
      r.gait.phase.value=walk?.phase||0;r.gait.amount.value=THREE.MathUtils.lerp(r.gait.amount.value,moving?1:0,Math.min(1,delta*8));
      r.bodyHolder.scale.y=1+Math.sin(seconds*1.8+id.length)*.013*motion;
      const messageAge=(now-(r.messageAt||-Infinity))/1000;
      r.bodyHolder.rotation.z=Math.sin((walk?.phase||0)*.5)*.012*r.gait.amount.value;
      r.bodyHolder.position.y=age<.7?Math.sin(age/.7*Math.PI)*.16*motion:messageAge<.55?Math.sin(messageAge/.55*Math.PI)*.12*motion:0;
      const facing=Math.atan2(camera.position.x-r.group.position.x,camera.position.z-r.group.position.z);
      // Shortest-angle turn follows the route, or faces the camera during a chat.
      const desired=selected===id||r.placing?facing:(walk?.heading??.35),angle=Math.atan2(Math.sin(desired-r.bodyHolder.rotation.y),Math.cos(desired-r.bodyHolder.rotation.y));
      r.bodyHolder.rotation.y+=angle*Math.min(1,delta*3);
      r.motes.visible=age<1.7&&!isReduced();
      if(r.motes.visible){for(let i=0;i<12;i++){const a=i*2.399+age*2;r.motePositions[i*3]=Math.cos(a)*(r.radius+.15);r.motePositions[i*3+1]=.15+age*.8+i%3*.15;r.motePositions[i*3+2]=Math.sin(a)*(r.radius+.15);}r.motes.geometry.attributes.position.needsUpdate=true;r.motes.material.opacity=Math.max(0,1-age/1.7);}
      r.group.updateMatrixWorld(true);
      const world=r.group.position.clone().add(new THREE.Vector3(0,r.height+.3,0));
      if(checkOcclusion)r.occluded=blocked(camera.position,r.group.position.clone().add(new THREE.Vector3(0,r.height*.7,0)));
      const p=world.project(camera);anchors.push({id,worldX:r.group.position.x,worldZ:r.group.position.z,walking:moving,x:(p.x*.5+.5)*rect.width,y:(-.5*p.y+.5)*rect.height,visible:p.z>-1&&p.z<1&&Math.abs(p.x)<1.15&&Math.abs(p.y)<1.15,occluded:r.occluded,placeholder:r.group.userData.placeholder});
    }
  }
  function dispose(){drag.dispose();root.removeFromParent();records.clear();}
  return {sync,focus,restore,update,placement,setPlacements:positions=>{savedPlacements=structuredClone(positions||{});},pulse:id=>{const r=records.get(id);if(r)r.messageAt=performance.now();},getAnchors:()=>anchors,getScreenAnchor:id=>anchors.find(a=>a.id===id)||null,dispose,audit};
}
