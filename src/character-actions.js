import * as THREE from 'three';
const clamp=THREE.MathUtils.clamp;
export function movementPolicy(kind,seconds,reduced=false){
 if(reduced||['emo','tired','music'].includes(kind))return{allowed:false,speed:0,wait:3};
 const rules={happy:[8,0,2.4,.32],busy:[6,0,2.5,.43],relax:[12,0,5,.16],exercise:[14,4,10,.55],travel:[13,0,10,.34]},r=rules[kind];
 return r?{allowed:seconds%r[0]>=r[1]&&seconds%r[0]<r[2],speed:r[3],wait:1.5}:{allowed:true,speed:.25,wait:3};
}
/** Bones own articulation; neither mesh positions nor character scale are animated. */
export function createCharacterActions({body,poseRoot,holder,animal,height,id=animal}){
 const rig=body.userData.characterRig,profile=rig?.profile,bones={},meshes=[],props=[];
 body.traverse(o=>{if(o.isBone)bones[o.name]=o;if(o.isSkinnedMesh)meshes.push(o);});
 const rest={},limits={};for(const j of profile?.joints||[]){rest[j.name]=new THREE.Vector3().fromArray(j.position);limits[j.name]=j.limit;}
 const seed=[...id].reduce((s,c)=>(s*31+c.charCodeAt(0))>>>0,7),offset=(seed%1000)/137;
 let kind=null,started=0,sit=0,lie=0,frame=0,holdBlend=0,wantsWalk=false,lastPose,disposed=false;
 const ready=rig?.status==='ready'&&bones.hips,targets={},q=new THREE.Quaternion(),e=new THREE.Euler(),v=new THREE.Vector3(),inverse=new THREE.Matrix4(),relative=new THREE.Matrix4(),box=new THREE.Box3(),point=new THREE.Vector3();
 const skeletons=new Set(meshes.map(m=>m.skeleton));
 const contacts={L:{locked:null,stance:false},R:{locked:null,stance:false}};
 function prop(type){const group=new THREE.Group(),material=new THREE.MeshStandardMaterial({color:type==='book'?0x687b75:0xe8dfc5,roughness:.85});
  if(type==='book'){const cover=new THREE.Mesh(new THREE.BoxGeometry(.15,.012,.14),material);group.add(cover);const pages=new THREE.Mesh(new THREE.BoxGeometry(.138,.016,.128),new THREE.MeshStandardMaterial({color:0xfff6df,roughness:1}));pages.position.y=.009;group.add(pages);const hinge=new THREE.Group(),page=new THREE.Mesh(new THREE.PlaneGeometry(.067,.126),new THREE.MeshStandardMaterial({color:0xfff6df,side:THREE.DoubleSide,roughness:1}));page.rotation.x=-Math.PI/2;page.position.x=.034;hinge.position.y=.019;hinge.add(page);group.add(hinge);group.userData.page=hinge;}
  else{const cup=new THREE.Mesh(new THREE.CylinderGeometry(.032,.026,.065,12,1,true),material);cup.position.y=.025;group.add(cup);const handle=new THREE.Mesh(new THREE.TorusGeometry(.022,.006,5,12),material);handle.position.set(.034,.025,0);group.add(handle);const drink=new THREE.Mesh(new THREE.CircleGeometry(.028,12),new THREE.MeshStandardMaterial({color:0x7a5741,side:THREE.DoubleSide}));drink.rotation.x=-Math.PI/2;drink.position.y=.051;group.add(drink);}
  group.position.set(type==='book'?-.07:0,.005,.025);group.visible=false;bones['hand'+(type==='book'?'L':'R')]?.add(group);props.push(group);return group;}
 const book=ready?prop('book'):null,cup=ready?prop('cup'):null;
 function rotate(name,x=0,y=0,z=0){if(!bones[name])return;const l=limits[name];if(profile.config.tPose&&name.startsWith('upperArm'))z+=(name.endsWith('L')?-1:1)*1.2;targets[name]=q.setFromEuler(e.set(clamp(x,-l[0],l[0]),clamp(y,-l[1],l[1]),clamp(z,-l[2],l[2]))).clone();}
 // Solve a two-link leg in normalized model space, bending the knee forward.
 function solveLeg(side,target,blend=1){const upper=bones['thigh'+side],lower=bones['calf'+side],foot=bones['foot'+side];if(!upper)return;
  body.updateWorldMatrix(true,false);body.updateMatrixWorld(true);inverse.copy(body.matrixWorld).invert();const hip=upper.getWorldPosition(new THREE.Vector3()).applyMatrix4(inverse),a=rest['calf'+side].distanceTo(rest['thigh'+side]),b=rest['foot'+side].distanceTo(rest['calf'+side]),direction=target.clone().sub(hip),distance=clamp(direction.length(),Math.abs(a-b)+.0001,a+b-.0001);direction.normalize();
  const along=(a*a-b*b+distance*distance)/(2*distance),bend=new THREE.Vector3(0,0,1).addScaledVector(direction,-direction.z).normalize(),knee=hip.clone().addScaledVector(direction,along).addScaledVector(bend,Math.sqrt(Math.max(0,a*a-along*along)));
  const worldQ=body.getWorldQuaternion(new THREE.Quaternion());
  function aim(bone,restDirection,to){const parent=bone.parent.getWorldQuaternion(new THREE.Quaternion()).invert(),desired=to.clone().applyQuaternion(worldQ).applyQuaternion(parent).normalize();bone.quaternion.slerp(new THREE.Quaternion().setFromUnitVectors(restDirection.clone().normalize(),desired),blend);bone.updateWorldMatrix(false,true);}
  aim(upper,rest['calf'+side].clone().sub(rest['thigh'+side]),knee.clone().sub(hip));aim(lower,rest['foot'+side].clone().sub(rest['calf'+side]),target.clone().sub(knee));
  foot.quaternion.copy(foot.parent.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(worldQ));
 }
 function solveArm(side,target,amount){
  const upper=bones['upperArm'+side],lower=bones['forearm'+side],hand=bones['hand'+side];body.updateWorldMatrix(true,false);body.updateMatrixWorld(true);inverse.copy(body.matrixWorld).invert();
  const shoulder=upper.getWorldPosition(new THREE.Vector3()).applyMatrix4(inverse),a=rest['forearm'+side].distanceTo(rest['upperArm'+side]),b=rest['hand'+side].distanceTo(rest['forearm'+side]),direction=target.clone().sub(shoulder),distance=clamp(direction.length(),Math.abs(a-b)+.001,a+b-.001);direction.normalize();
  const along=(a*a-b*b+distance*distance)/(2*distance),bend=new THREE.Vector3(side==='L'?1:-1,-1,0);bend.addScaledVector(direction,-bend.dot(direction)).normalize();const elbow=shoulder.clone().addScaledVector(direction,along).addScaledVector(bend,Math.sqrt(Math.max(0,a*a-along*along))),world=body.getWorldQuaternion(new THREE.Quaternion());
  for(const [bone,from,to] of [[upper,rest['forearm'+side].clone().sub(rest['upperArm'+side]),elbow.clone().sub(shoulder)],[lower,rest['hand'+side].clone().sub(rest['forearm'+side]),target.clone().sub(elbow)]]){const desired=to.applyQuaternion(world).applyQuaternion(bone.parent.getWorldQuaternion(new THREE.Quaternion()).invert()).normalize();bone.quaternion.slerp(new THREE.Quaternion().setFromUnitVectors(from.normalize(),desired),amount);bone.updateWorldMatrix(false,true);}
  hand.quaternion.copy(hand.parent.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(world));
 }
 function measure(exact=false){body.updateWorldMatrix(true,false);body.updateMatrixWorld(true);for(const s of skeletons)s.update();inverse.copy(holder.parent.matrixWorld).invert();box.makeEmpty();
  if(!meshes.length){box.setFromObject(body,true).applyMatrix4(inverse);}
  for(const mesh of meshes){relative.multiplyMatrices(inverse,mesh.matrixWorld);const positions=mesh.geometry.attributes.position,indices=exact?null:mesh.geometry.userData.rigWitnesses;
   const skinIndex=mesh.geometry.attributes.skinIndex.array,skinWeight=mesh.geometry.attributes.skinWeight.array,matrices=mesh.skeleton.boneMatrices,skinToHolder=new THREE.Matrix4().multiplyMatrices(relative,mesh.bindMatrixInverse);
   for(let k=0,n=indices?.length??positions.count;k<n;k++){const i=indices?indices[k]:k;point.fromBufferAttribute(positions,i);
    if(exact){mesh.applyBoneTransform(i,point);point.applyMatrix4(relative);}else{point.applyMatrix4(mesh.bindMatrix);const x=point.x,y=point.y,z=point.z;let sx=0,sy=0,sz=0;for(let j=0;j<4;j++){const w=skinWeight[i*4+j];if(!w)continue;const b=skinIndex[i*4+j]*16;sx+=(matrices[b]*x+matrices[b+4]*y+matrices[b+8]*z+matrices[b+12])*w;sy+=(matrices[b+1]*x+matrices[b+5]*y+matrices[b+9]*z+matrices[b+13])*w;sz+=(matrices[b+2]*x+matrices[b+6]*y+matrices[b+10]*z+matrices[b+14])*w;}point.set(sx,sy,sz).applyMatrix4(skinToHolder);}box.expandByPoint(point);
   }
   // A conservative broad phase prevents stale rest-pose raycast rejection.
   mesh.boundingSphere??=new THREE.Sphere(new THREE.Vector3(0,.5,0),2);mesh.boundingBox=null;
  }
  return{minX:box.min.x,maxX:box.max.x,minY:box.min.y,maxY:box.max.y,minZ:box.min.z,maxZ:box.max.z};
 }
 function update({now,dt=1/60,status,moving=false,phase=0,override=false,reduced=false,canRest=true,groundPad=0}){
  if(disposed)return lastPose;const next=status?.kind||null;if(next!==kind){kind=next;started=now;}const elapsed=Math.max(0,(now-started)/1000),t=reduced?0:elapsed+offset,alpha=reduced?1:1-Math.exp(-Math.min(dt,.05)/.10),resting=!moving&&!override;
  const sitTarget=ready&&!override&&!wantsWalk&&resting&&['emo','tired','relax'].includes(kind)?1:0,lieTarget=ready&&kind==='tired'&&resting&&canRest&&!override&&(reduced||elapsed>4)?1:0;
  sit+=(sitTarget-sit)*(reduced?1:1-Math.exp(-dt/(override?.12:.32)));lie+=(lieTarget-lie)*(reduced?1:1-Math.exp(-dt/(override?.10:.48)));let jump=0;
  holder.scale.set(1,1,1);poseRoot.rotation.set(0,0,0);poseRoot.position.set(0,0,0);holder.position.y=0;
  if(ready){
   for(const name of Object.keys(targets))delete targets[name];
   const wave=reduced?0:Math.sin(t*1.7),breath=reduced?0:Math.sin(t*1.4)*.012;
   for(let i=0;i<3;i++)rotate('tail'+i,0,reduced?0:Math.sin(t*.65-i*.3)*.04,0);
   rotate('spine',breath+(kind==='emo'?.14:0));rotate('neck',kind==='emo'?.22:kind==='busy'?.18:kind==='relax'?.08:0,reduced?0:Math.sin(t*.43)*.07);
   rotate('head',kind==='music'&&!reduced?Math.sin(t*3)*.055:0);rotate('chest',0,0,kind==='music'&&!reduced?wave*.025:0);
   for(const [s,sign] of [['L',1],['R',-1]]){rotate('upperArm'+s,-sit*.55,0,-sign*.07);rotate('forearm'+s,-sit*.70);rotate('ear'+s,reduced?0:wave*.025,0,sign*sit*.05);}
   if(kind==='happy'&&!override){rotate('chest',-.05);rotate('neck',-.08);rotate('upperArmL',-.65,0,.65);rotate('forearmL',-1.0,0,reduced?0:wave*.18);if(!reduced&&['rabbit','kangaroo'].includes(animal)&&!moving){const cycle=t%7;jump=cycle<.7?Math.sin(cycle/.7*Math.PI)*height*.055:0;}}
   if(kind==='busy'&&resting){for(const s of ['L','R']){rotate('upperArm'+s,-.45,0,s==='L'?-.10:.10);rotate('forearm'+s,-.85);rotate('hand'+s,0,reduced?0:Math.sin(t*.9)*.06);}rotate('head',.08);}
   if(kind==='relax'&&resting){rotate('upperArmR',-.40);rotate('forearmR',-.9);rotate('head',0,reduced?.1:Math.sin(t*.55)*.14);}
   if(kind==='tired'&&resting){rotate('neck',.12);rotate('upperArmR',lie>0?-.4:-.65);rotate('forearmR',-1.1);rotate('head',0,0,-lie*.16);rotate('root',0,0,-lie*1.42);rotate('thighL',-.6*lie);rotate('calfL',.9*lie);rotate('thighR',-.8*lie);rotate('calfR',1.0*lie);}
   if(kind==='music'&&!override){rotate('forearmL',-.3+(reduced?0:wave*.08));rotate('forearmR',-.25);}
   if(kind==='exercise'&&!override&&!moving){rotate('upperArmL',-.15,0,reduced?.6:.55+wave*.2);rotate('upperArmR',-.15,0,reduced?-.6:-.55-wave*.2);rotate('forearmL',-.3);rotate('forearmR',-.3);}
   if(kind==='travel'&&resting&&!override){rotate('neck',0,reduced?.15:Math.sin(t*.6)*.24);if(t%9>6||reduced){rotate('upperArmL',-.9,0,.15);rotate('forearmL',-.25);}}
   if(moving&&!reduced&&!override)for(const [s,sign]of[['L',1],['R',-1]]){rotate('upperArm'+s,Math.sin(phase)*.16*sign);rotate('forearm'+s,-.15);}
   if(override)for(const name of Object.keys(targets)){targets[name].identity();if(profile.config.tPose&&name.startsWith('upperArm'))targets[name].setFromEuler(e.set(0,0,(name.endsWith('L')?-1:1)*1.2));}
   for(const [name,bone]of Object.entries(bones))bone.quaternion.slerp(targets[name]||q.identity(),alpha);
   const hopCycle=t%7,landing=kind==='happy'&&!moving&&!override&&!reduced&&['kangaroo','rabbit'].includes(animal)&&hopCycle<.95?.025*Math.max(0,1-Math.abs(hopCycle-.72)/.23):0;
   const crouch=landing+(kind==='exercise'&&!moving&&!override?(reduced?.025:(wave+1)*.015):0);
   bones.root.position.x=-.32*lie;
   bones.hips.position.copy(rest.hips).add(new THREE.Vector3(0,-(profile.config.hips-profile.config.ankle)*.62*sit-crouch-(moving?.015:0),0));
   const cycleLength=2*Math.PI/(17*height);
   for(const [s,shift]of[['L',0],['R',Math.PI]]){
    const p=((phase+shift)%(Math.PI*2)+Math.PI*2)%(Math.PI*2),stance=p<Math.PI||!moving||reduced,target=rest['foot'+s].clone();
    target.z+=sit*.075;
    if(moving&&!reduced&&!override){target.z+=(p<Math.PI?.25-p/(2*Math.PI):-.25+(p-Math.PI)/(2*Math.PI))*cycleLength;target.y+=p>=Math.PI?Math.sin(p-Math.PI)*.035:0;}
    if(lie<.01)solveLeg(s,target);contacts[s].stance=stance&&lie<.01&&jump<.001;contacts[s].locked=null;
   }
   holdBlend+=((resting&&['busy','relax'].includes(kind)?1:0)-holdBlend)*alpha;
   if(resting&&kind==='busy'){for(const side of ['L','R'])solveArm(side,new THREE.Vector3(profile.config.center[0]+(side==='L'?.07:-.07),profile.config.shoulder[1]-.09,.20),holdBlend);}
   if(resting&&kind==='relax')solveArm('R',new THREE.Vector3(profile.config.center[0]-.15,profile.config.shoulder[1]-.11,.21),holdBlend);
   if(book.userData.page)book.userData.page.rotation.z=reduced?0:Math.sin(clamp((t%7-4)/1.2,0,1)*Math.PI)*2.6;
   book.visible=kind==='busy'&&resting&&sit<.1;cup.visible=kind==='relax'&&resting;
  }
  if(ready){for(const [name,bone]of Object.entries(bones)){const limit=limits[name];e.setFromQuaternion(bone.quaternion);bone.quaternion.setFromEuler(e.set(clamp(e.x,-limit[0],limit[0]),clamp(e.y,-limit[1],limit[1]),clamp(e.z,-limit[2],limit[2])));}body.updateWorldMatrix(true,false);body.updateMatrixWorld(true);const world=body.getWorldQuaternion(new THREE.Quaternion());for(const prop of props){prop.quaternion.copy(prop.parent.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(world));prop.position.set(prop===book?-.07:0,.005,.025).applyQuaternion(prop.quaternion);}}
  const bounds=measure();holder.position.y=-bounds.minY+.008*height+jump+(lie>.05?groundPad:0);body.updateWorldMatrix(true,false);body.updateMatrixWorld(true);
  const contactPoints=[];for(const s of ['L','R'])if(bones['foot'+s]){const foot=bones['foot'+s],position=foot.getWorldPosition(new THREE.Vector3()),sole=new THREE.Vector3(0,-rest['foot'+s].y,0).applyQuaternion(foot.getWorldQuaternion(new THREE.Quaternion())).multiplyScalar(body.getWorldScale(v).y);position.add(sole);contactPoints.push({side:s,stance:contacts[s].stance,position:position.toArray()});}
  frame++;lastPose={kind,lie,sit,jump,canRest,rig:rig?.status||'attention',contactPoints,anchor:{x:(bounds.minX+bounds.maxX)/2,y:bounds.maxY+holder.position.y+.3,z:(bounds.minZ+bounds.maxZ)/2},bounds:{...bounds,groundOffset:holder.position.y}};return lastPose;
 }
 function reset(){for(const b of Object.values(bones))b.quaternion.identity();if(ready){bones.hips.position.copy(rest.hips);bones.root.position.set(0,0,0);}sit=lie=0;kind=null;for(const p of props)p.visible=false;holder.position.y=0;}
 return{update,reset,measure,policy:(now,status,reduced)=>{if(!ready)return{allowed:false,speed:0,wait:3};const policy=movementPolicy(status?.kind,(now-started)/1000+offset,reduced);wantsWalk=policy.allowed;return policy.allowed&&(sit>.08||lie>.03)?{...policy,allowed:false}:policy;},meshes,get ready(){return!!ready;},binding:rig?{status:rig.status,hash:rig.hash,profileHash:rig.profileHash,version:rig.version}:null,diagnostics:rig?.diagnostics||{reason:'骨骼待校正'},dispose(){disposed=true;for(const p of props){p.traverse(o=>{if(o.isMesh){o.geometry.dispose();o.material.dispose();}});p.removeFromParent();}for(const s of skeletons)s.dispose();}};
}
