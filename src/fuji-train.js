import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {FUJI_CARRIAGE,FUJI_RAIL,railCurve,railLength,sampleRail,railTangent,RAIL_START,RAIL_END,STATION,CROSSING,railOffset} from './fuji-railway.js';
import {createCrossingController} from './fuji-crossing.js';
import {FUJI_LAYOUT} from './fuji-layout.js';

const material=(color,extra={})=>new T.MeshStandardMaterial({color,roughness:.84,flatShading:true,...extra});
function addMesh(p,name,g,m,x=0,y=0,z=0){const o=new T.Mesh(g,m);o.name=name;o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;o.userData.generatedProp=true;p.add(o);return o;}
const box=(p,n,x,y,z,w,h,d,m)=>addMesh(p,n,new T.BoxGeometry(w,h,d),m,x,y,z);
function batch(p){p.updateMatrixWorld(true);const inverse=p.matrixWorld.clone().invert(),buckets=new Map();p.traverse(o=>{if(!o.isMesh||o.userData.sharedAssetGeometry)return;if(!buckets.has(o.material))buckets.set(o.material,[]);buckets.get(o.material).push(o);});for(const[mat,items]of buckets){const geometries=items.map(o=>{let g=o.geometry.clone().applyMatrix4(new T.Matrix4().multiplyMatrices(inverse,o.matrixWorld));if(g.index){const n=g.toNonIndexed();g.dispose();g=n;}return g;});const g=mergeGeometries(geometries);geometries.forEach(g=>g.dispose());items.forEach(o=>{o.removeFromParent();o.geometry.dispose();});if(g)addMesh(p,'Merged train detail',g,mat);}}
function cloneAsset(asset){if(!asset)return null;const g=asset.clone(true);g.traverse(o=>{o.userData.generatedProp=true;if(o.isMesh){o.userData.sharedAssetGeometry=true;o.userData.sharedAssetMaterial=true;}});return g;}

/** A 70-second arc-length route with an eight-second station stop. No own RAF. */
export function createFujiTrain(parent,{reduced=false,assets={}}={}){
  const root=new T.Group();root.name='Fuji railway and steam train';parent.add(root);
  const M={dark:material(0x354d4c),wood:material(0x897056),cream:material(0xe7d5a6),red:material(0xb45d50),brass:material(0xc4aa69,{metalness:.3}),glass:material(0xa9c5ba),rail:material(0x778582,{metalness:.5}),gravel:material(0xa2a99b),light:material(0xffe4b3,{emissive:0xffcb83,emissiveIntensity:.3})};
  const curve=railCurve,length=railLength,sample=sampleRail,tangent=railTangent,start=RAIL_START,end=RAIL_END,stop=STATION.stop;
  const crossing=createCrossingController();
  const track=new T.Group();track.name='Curving railway infrastructure';root.add(track);
  // Ribbons follow the exact same arc-length curve as all three vehicles.
  function ribbon(offset,width,height,mat,name){const vertices=[],indices=[],steps=Math.ceil((end-start)/.35);for(let i=0;i<=steps;i++){const d=start+(end-start)*i/steps,p=sample(d),t=tangent(d),n=new T.Vector3(-t.z,0,t.x);for(const side of[-1,1]){const v=p.clone().addScaledVector(n,offset+side*width/2);vertices.push(v.x,height,v.z);}if(i<steps){const k=i*2;indices.push(k,k+1,k+2,k+1,k+3,k+2);}}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(vertices,3));g.setIndex(indices);g.computeVertexNormals();const o=addMesh(track,name,g,mat);o.castShadow=false;}
  ribbon(0,1.65,2.29,M.gravel,'Bowed railway gravel');for(const side of[-1,1])ribbon(side*.48,.09,2.46,M.rail,'Continuous curved steel rail');
  for(let d=start;d<=end;d+=.58){const p=sample(d),t=tangent(d),s=box(track,'Railway oak sleeper',p.x,2.35,p.z,.16,.12,1.48,M.wood);s.rotation.y=-Math.atan2(t.z,t.x);}
  if(assets.track){
    for(let d=start+1.74;d<end-1.74;d+=3.48){if(Math.abs(d-CROSSING.d)<3.5)continue;const g=cloneAsset(assets.track),p=railOffset(d,0);g.position.set(p.x,2.23,p.z);g.rotation.y=p.rotation;track.add(g);}
  }
  batch(track);
  const gateRoot=new T.Group();gateRoot.name='Automatic street level crossing';root.add(gateRoot);const cp=railOffset(CROSSING.d,0);gateRoot.position.set(cp.x,2.22,cp.z);gateRoot.rotation.y=cp.rotation;
  const yellow=material(0xe6c459),signal=material(0x5d2926,{emissive:0xe83824,emissiveIntensity:0}),arms=[];
  box(gateRoot,'Crossing road deck',0,.075,0,3.8,.15,3.4,M.wood);
  for(const side of[-1,1]){
    const post=new T.Group();post.position.set(side*2.15,0,side*2.7);post.rotation.y=side<0?0:Math.PI;gateRoot.add(post);
    const model=cloneAsset(assets.gate);if(model)post.add(model);else{
      box(post,'Crossing signal post',0,1.1,0,.14,2.2,.14,yellow);box(post,'Barrier motor cabinet',0,.48,0,.42,.85,.4,M.cream);
      for(const angle of[-.75,.75]){const cross=box(post,'Railway crossing crossbuck',0,2.14,0,.78,.09,.08,yellow);cross.rotation.z=angle;}
    }
    for(const x of[-.23,.23]){const light=addMesh(post,'Red warning lens',new T.SphereGeometry(.12,10,6),signal,x,1.75,.22);light.scale.z=.4;}
    const hinge=new T.Group();hinge.position.set(0,1.02,.18);post.add(hinge);arms.push(hinge);
    box(hinge,'Animated barrier arm',1.95,0,0,3.9,.12,.12,yellow);
    for(let i=0;i<9;i++)box(hinge,'Barrier black stripe',.2+i*.42,0,.002,.2,.125,.125,M.dark);
    for(let i=0;i<5;i++)box(gateRoot,'Crossing waiting stripe',-.7+i*.35,.015,side*3.5,.18,.03,.22,M.cream);
  }


  const wheels=[],vehicles=[],pickables=[],rods=[];let chimneyHeight=1.95;
  function wheel(parent,x,r=.3){for(const z of[-FUJI_CARRIAGE.wheelOffset,FUJI_CARRIAGE.wheelOffset]){const w=new T.Group();w.position.set(x,r,z);parent.add(w);addMesh(w,'Locomotive wheel',new T.CylinderGeometry(r,r,.13,12),M.dark).rotation.x=Math.PI/2;addMesh(w,'Polished wheel hub',new T.CylinderGeometry(.075,.075,.16,8),M.brass).rotation.x=Math.PI/2;for(let i=0;i<6;i++){const s=box(w,'Wheel spoke',0,0,z>0?.083:-.083,r*1.65,.025,.025,M.brass);s.rotation.z=i*Math.PI/3;}batch(w);wheels.push({node:w,radius:r});}}
  function makeVehicle(key,index){
    const g=new T.Group();g.name=key==='locomotive'?'Sakura steam locomotive':'Sakura passenger carriage '+index;g.userData.trainPart=true;root.add(g);pickables.push(g);vehicles.push(g);
    const model=cloneAsset(assets[key]);if(model){model.position.y=.42;g.add(model);if(key==='locomotive')chimneyHeight=new T.Box3().setFromObject(model).max.y-.02;}else{
      const body=new T.Group();g.add(body);
      if(key==='locomotive'){
        box(body,'Locomotive chassis',0,.34,0,3.65,.24,1.1,M.dark);const boiler=addMesh(body,'Forest green boiler',new T.CylinderGeometry(.46,.46,1.92,14),M.dark,.35,.95,0);boiler.rotation.z=Math.PI/2;
        for(const x of[-.38,.36,1.08]){const ring=addMesh(body,'Boiler brass band',new T.TorusGeometry(.47,.025,5,14),M.brass,x,.95,0);ring.rotation.y=Math.PI/2;}
        box(body,'Driver cab',-1.15,1.02,0,1.0,1.18,1.02,M.dark);box(body,'Cab maroon roof',-1.15,1.68,0,1.25,.14,1.3,M.red);for(const z of[-.525,.525])box(body,'Driver cab window',-1.15,1.21,z,.57,.45,.025,M.glass);
        addMesh(body,'Steam chimney',new T.CylinderGeometry(.19,.13,.65,10),M.dark,.95,1.55,0);addMesh(body,'Chimney brass lip',new T.CylinderGeometry(.24,.2,.12,10),M.brass,.95,1.92,0);addMesh(body,'Brass steam dome',new T.SphereGeometry(.21,8,5),M.brass,.05,1.45,0);
        const lamp=addMesh(body,'Engine headlamp',new T.CylinderGeometry(.14,.14,.13,10),M.light,1.42,1.0,0);lamp.rotation.z=Math.PI/2;box(body,'Front red buffer',1.83,.41,0,.14,.16,1.2,M.red);
      }else{
        box(body,'Carriage underframe',0,.31,0,2.7,.23,1.11,M.dark);box(body,'Cream carriage',0,.95,0,2.57,1.1,1.04,M.cream);box(body,'Maroon carriage skirt',0,.56,0,2.61,.35,1.07,M.red);box(body,'Carriage roof',0,1.58,0,2.85,.18,1.25,M.dark);
        for(const z of[-.54,.54])for(let j=0;j<5;j++){box(body,'Framed carriage window',-.99+j*.495,1.15,z,.39,.48,.03,M.wood);box(body,'Carriage glass',-.99+j*.495,1.15,z+Math.sign(z)*.022,.32,.39,.02,M.glass);}for(const x of[-1.48,1.48])box(body,'Carriage coupling',x,.35,0,.25,.08,.12,M.dark);
      }
      if(key==='carriage'){
        const b=new T.Box3().setFromObject(body),size=b.getSize(new T.Vector3()),center=b.getCenter(new T.Vector3());
        const fit=new T.Group();g.add(fit);fit.add(body);body.position.set(-center.x,-b.min.y,-center.z);
        fit.scale.set(FUJI_CARRIAGE.length/size.x,FUJI_CARRIAGE.height/size.y,FUJI_CARRIAGE.width/size.z);fit.position.y=.42;
      }
      batch(body);
    }
    // Visible rim/hub overlays provide real wheel rotation even on a static GLB.
    (key==='locomotive'?[-1.05,-.05,.95]:[-1,1]).forEach(x=>wheel(g,x,key==='locomotive'?.33:FUJI_CARRIAGE.wheelRadius));
    return g;
  }
  makeVehicle('locomotive',0);makeVehicle('carriage',1);makeVehicle('carriage',2);
  for(const side of[-1,1])rods.push(box(vehicles[0],'Moving drive connecting rod',0,.33,side*.615,2.15,.075,.055,M.brass));
  const portalA=sample(start+2.75),portalB=sample(end-2.75),ta=tangent(start+2.75),tb=tangent(end-2.75);
  const clipShader=shader=>{
    shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vTrainWorld;').replace('#include <project_vertex>','#include <project_vertex>\nvTrainWorld=(modelMatrix*vec4(transformed,1.0)).xyz;');
    shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 vTrainWorld;').replace('#include <clipping_planes_fragment>',`#include <clipping_planes_fragment>\nif(dot(vTrainWorld.xz-vec2(${portalA.x.toFixed(6)},${portalA.z.toFixed(6)}),vec2(${ta.x.toFixed(6)},${ta.z.toFixed(6)}))<0.0 || dot(vTrainWorld.xz-vec2(${portalB.x.toFixed(6)},${portalB.z.toFixed(6)}),vec2(${tb.x.toFixed(6)},${tb.z.toFixed(6)}))>0.0) discard;`);
  };
  const depth=new T.MeshDepthMaterial({depthPacking:T.RGBADepthPacking});depth.onBeforeCompile=clipShader;depth.customProgramCacheKey=()=> 'fuji-curve-train-depth';const clips=new Map();
  vehicles.forEach(g=>g.traverse(o=>{o.userData.generatedProp=true;if(!o.isMesh)return;const adapt=source=>{if(clips.has(source))return clips.get(source);const m=source.clone();m.onBeforeCompile=clipShader;m.customProgramCacheKey=()=> 'fuji-curve-train-clip';clips.set(source,m);return m;};o.material=Array.isArray(o.material)?o.material.map(adapt):adapt(o.material);o.userData.sharedAssetMaterial=false;o.customDepthMaterial=depth;}));
  const steamGeometry=new T.IcosahedronGeometry(1,1),steamAlpha=new T.InstancedBufferAttribute(new Float32Array(18),1),steamMaterial=material(0xfaf4e9,{transparent:true,opacity:.4,depthWrite:false});steamGeometry.setAttribute('aSteamOpacity',steamAlpha);
  steamMaterial.onBeforeCompile=shader=>{shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nattribute float aSteamOpacity;varying float vSteamOpacity;').replace('#include <begin_vertex>','#include <begin_vertex>\nvSteamOpacity=aSteamOpacity;');shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying float vSteamOpacity;').replace('#include <color_fragment>','#include <color_fragment>\ndiffuseColor.a*=vSteamOpacity;');};steamMaterial.customProgramCacheKey=()=> 'fuji-steam-lifetime-opacity';
  const steam=new T.InstancedMesh(steamGeometry,steamMaterial,18);steam.name='Soft rising locomotive steam';steam.userData.generatedProp=true;steam.frustumCulled=false;root.add(steam);const dummy=new T.Object3D();
  // Integrating smoothstep velocity loses half a ramp at each end. Account for
  // that distance up front so easing, the exact dwell, and the 70s loop agree.
  const duration=FUJI_RAIL.loopSeconds,stopSeconds=FUJI_RAIL.stationSeconds,ramp=2.5,speed=length/(duration-stopSeconds-ramp),arrival=stop/speed+ramp/2,offset=8;
  let elapsed=0,distance=0,stopped=false,disposed=false,holding=false;
  const isReduced=()=>typeof reduced==='boolean'?reduced:!!reduced?.matches;
  let wasReduced=isReduced();
  function update(time,dt=0){
    if(disposed)return;const frozen=isReduced(),delta=Math.max(0,Math.min(.1,dt));
    if(wasReduced&&!frozen)elapsed=arrival+stopSeconds-offset;wasReduced=frozen;
    crossing.update(distance,delta,frozen);holding=!frozen&&crossing.shouldHold(distance);
    if(!frozen&&!holding)elapsed+=delta;const clock=(elapsed+offset)%duration;
    stopped=frozen||(clock>=arrival&&clock<arrival+stopSeconds);
    if(frozen||stopped)distance=stop;
    else if(clock<arrival-ramp)distance=clock*speed;
    else if(clock<arrival){const u=(clock-arrival+ramp)/ramp;distance=stop-speed*ramp/2+speed*ramp*(u-u*u*u+.5*u*u*u*u);}
    else{const t=clock-arrival-stopSeconds;if(t<ramp){const u=t/ramp;distance=stop+speed*ramp*(u*u*u-.5*u*u*u*u);}else distance=stop+speed*(t-ramp/2);}
    const gate=crossing.snapshot();for(const arm of arms)arm.rotation.z=(1-gate.closure)*Math.PI/2;
    signal.emissiveIntensity=gate.state==='open'?0:(.4+.6*(Math.sin(time*7)>0));
    vehicles.forEach((g,i)=>{const d=distance-i*FUJI_CARRIAGE.spacing,p=sample(d),t=tangent(d);g.position.copy(p);g.rotation.y=-Math.atan2(t.z,t.x);g.visible=d>0;g.updateMatrixWorld(true);});
    wheels.forEach(w=>w.node.rotation.z=-distance/w.radius);for(const rod of rods){rod.position.x=.11*Math.cos(distance/.33);rod.position.y=.33+.11*Math.sin(distance/.33);}
    const head=vehicles[0],visible=distance>start+3&&distance<end-3;steam.visible=!frozen&&visible;
    const source=head.localToWorld(new T.Vector3(1.25,chimneyHeight,0));
    if(steam.visible)for(let i=0;i<18;i++){const age=(elapsed*.25+i/18)%1,s=(.16+age*.65)*(1-age*.43);const dir=tangent(distance);dummy.position.set(source.x-dir.x*age*(stopped||holding?.4:2.5),source.y+age*3.1,source.z-dir.z*age*(stopped||holding?.4:2.5)+Math.sin(i*1.3+age*3)*age*.5);dummy.scale.setScalar(s);dummy.rotation.set(i*.19,age,0);dummy.updateMatrix();steam.setMatrixAt(i,dummy.matrix);steamAlpha.setX(i,Math.pow(Math.sin(Math.PI*age),.8));}steam.instanceMatrix.needsUpdate=true;steamAlpha.needsUpdate=true;
  }
  update(0,0);
  const target=()=>vehicles[0].position.clone().add(new T.Vector3(0,1.05,0));
  return{root,pickables,containsVisiblePoint:p=>p.clone().sub(portalA).dot(ta)>=0&&p.clone().sub(portalB).dot(tb)<=0,followTarget:target,getTarget:target,stationTarget:new T.Vector3(FUJI_LAYOUT.station.x,3.7,FUJI_LAYOUT.station.z),update,curve,crossing,
    snapshot:()=>({trainX:vehicles[0].position.x,trainZ:vehicles[0].position.z,animationTime:elapsed,distance,stopped,holding,crossing:crossing.snapshot(),steamVisible:steam.visible,cycleSeconds:duration,stationSeconds:stopSeconds,easingSeconds:ramp,arrivalSeconds:arrival,carriageDimensions:{...FUJI_CARRIAGE},carriagePositions:vehicles.map(g=>g.position.toArray()),reduced:isReduced(),assets:{locomotive:!!assets.locomotive,carriage:!!assets.carriage,track:!!assets.track,gate:!!assets.gate}}),
    dispose(){if(disposed)return;disposed=true;root.removeFromParent();},
  };
}
