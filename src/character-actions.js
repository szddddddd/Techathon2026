import * as THREE from 'three';

const smooth=(a,b,x)=>THREE.MathUtils.smoothstep(x,a,b);
const SPECIES={kangaroo:{sit:.27,head:.65,step:.045},fox:{sit:.25,head:.55,step:.04},rabbit:{sit:.20,head:.44,step:.035},bear:{sit:.29,head:.56,step:.035}};
const morphCache=new WeakMap();

/** Relative morph positions and normals are shared by instances, never mutated per frame. */
function actionGeometry(source,animal){
  let cache=morphCache.get(source);if(!cache){cache=new Map();morphCache.set(source,cache);}if(cache.has(animal))return cache.get(animal);
  const g=source.clone();g.computeBoundingBox();const box=g.boundingBox,span=box.max.y-box.min.y,midX=(box.min.x+box.max.x)/2,midZ=(box.min.z+box.max.z)/2;
  const cfg=SPECIES[animal]||SPECIES.bear,pos=g.attributes.position,normal=g.attributes.normal;
  const targets=[],normalTargets=[];
  for(let mode=0;mode<7;mode++){
    const target=pos.clone();
    for(let i=0;i<pos.count;i++){
      const x=pos.getX(i),y=pos.getY(i),z=pos.getZ(i),h=(y-box.min.y)/span;
      const body=smooth(.025,.40,h),head=smooth(cfg.head,.93,h);
      let dx=0,dy=0,dz=0;
      if(mode===0){dy=-span*cfg.sit*body;dz=span*.16*(1-smooth(.08,.37,h))*smooth(midZ-span*.08,midZ+span*.1,z);}
      if(mode===1){const a=.32,neck=box.min.y+span*cfg.head,w=smooth(cfg.head,cfg.head+.17,h);dy=((y-neck)*(Math.cos(a)-1)-(z-midZ)*Math.sin(a))*w;dz=((y-neck)*Math.sin(a)+(z-midZ)*(Math.cos(a)-1))*w;}
      if(mode===2||mode===3){const side=mode===2?x<midX:x>=midX;const foot=(1-smooth(.10,.32,h))*smooth(midZ-span*.13,midZ+span*.04,z);if(side){dy=span*cfg.step*foot;dz=span*cfg.step*1.5*foot;}}
      if(mode===4){dy=-span*.10*body;dz=span*.025*body;}
      if(mode===6){const w=smooth(.23,.36,h)*(1-smooth(.52,.67,h))*smooth(span*.13,span*.24,Math.abs(x-midX));dy=span*.05*w;dz=span*.075*w;}
      if(mode===5){const w=(1-smooth(animal==='fox'?.62:.26,animal==='fox'?.80:.56,h))*(1-smooth(box.max.z-span*.48,box.max.z-span*.35,z));dz=Math.max(0,box.max.z-span*(animal==='fox'?.33:.43)-z)*w;}
      target.setXYZ(i,x+dx,y+dy,z+dz);
    }
    const tmp=g.clone();tmp.setAttribute('position',target);tmp.morphAttributes={};tmp.computeVertexNormals();
    const delta=new Float32Array(pos.count*3),dn=new Float32Array(pos.count*3),nn=tmp.attributes.normal;
    for(let i=0;i<pos.count;i++)for(let k=0;k<3;k++){delta[i*3+k]=target.array[i*3+k]-pos.array[i*3+k];dn[i*3+k]=nn.array[i*3+k]-(normal?.array[i*3+k]||0);}
    targets.push(new THREE.Float32BufferAttribute(delta,3));normalTargets.push(new THREE.Float32BufferAttribute(dn,3));tmp.dispose();
  }
  g.morphTargetsRelative=true;g.morphAttributes.position=targets;g.morphAttributes.normal=normalTargets;
  g.computeBoundingBox();g.computeBoundingSphere();cache.set(animal,g);return g;
}

export function movementPolicy(kind,seconds,reduced=false){
  if(reduced)return{allowed:false,speed:0,wait:3};
  if(kind==='emo'||kind==='tired'||kind==='music')return{allowed:false,speed:0,wait:3};
  if(kind==='happy')return{allowed:seconds%8<2.4,speed:.32,wait:1.5};
  if(kind==='busy')return{allowed:seconds%6<2.5,speed:.43,wait:.8};
  if(kind==='relax')return{allowed:seconds%12<5,speed:.16,wait:2.5};
  if(kind==='exercise')return{allowed:seconds%14>4&&seconds%14<10,speed:.55,wait:1};
  if(kind==='travel')return{allowed:seconds%13<10,speed:.34,wait:1.5};
  return{allowed:true,speed:.25,wait:3};
}

export function createCharacterActions({body,poseRoot,holder,animal,height}){
  const meshes=[],samples=[];body.updateMatrixWorld(true);
  body.traverse(mesh=>{
    if(!mesh.isMesh)return;const g=actionGeometry(mesh.geometry,animal);mesh.geometry=g;mesh.updateMorphTargets();meshes.push(mesh);
    const matrix=mesh.matrixWorld.clone(),linear=new THREE.Matrix3().setFromMatrix4(matrix),p=g.attributes.position,d=g.morphAttributes.position;
    const points=new Float32Array(p.count*3),deltas=d.map(()=>new Float32Array(p.count*3));
    for(let i=0;i<p.count;i++){
      const v=new THREE.Vector3().fromBufferAttribute(p,i).applyMatrix4(matrix);v.toArray(points,i*3);
      for(let j=0;j<d.length;j++)new THREE.Vector3().fromBufferAttribute(d[j],i).applyMatrix3(linear).toArray(deltas[j],i*3);
    }
    samples.push({points,deltas});
  });
  const weights=new Float32Array(7);let lie=0,kind=null,started=0,phaseOffset=({kangaroo:0,fox:1.8,rabbit:3.6,bear:5.4}[animal]||0),frame=0;
  const leaf=new THREE.Mesh(new THREE.SphereGeometry(.10,8,5),new THREE.MeshStandardMaterial({color:0x91ac64,roughness:1}));leaf.scale.set(.65,.22,1.5);leaf.position.set(.38,.06,.28);leaf.visible=false;holder.parent.add(leaf);
  const canvas=document.createElement('canvas');canvas.width=canvas.height=64;const ctx=canvas.getContext('2d');ctx.fillStyle='#829b73';ctx.font='48px serif';ctx.fillText('♫',7,49);
  const noteMap=new THREE.CanvasTexture(canvas),note=new THREE.Sprite(new THREE.SpriteMaterial({map:noteMap,transparent:true,opacity:.65,depthWrite:false}));note.scale.set(.28,.28,1);note.visible=false;holder.parent.add(note);
  let bounds={minX:0,maxX:0,minY:0,maxY:height,minZ:0,maxZ:0},lastJump=0;
  function update({now,dt,status,moving=false,phase=0,override=false,reduced=false,canRest=true,groundPad=0}){
    const next=status?.kind||null;if(next!==kind){kind=next;started=now;}
    const t=(now-started)/1000+phaseOffset,amount=reduced?1:1-Math.exp(-Math.min(.05,dt)/.16),targets=[0,0,0,0,0,0,0];
    const rest=!override&&!moving,cycle=t%8;
    let jump=0,roll=0,pitch=0,lieTarget=0;
    if(!override){
      if(kind==='emo'){targets[0]=1;targets[1]=reduced?.9:.85+Math.sin(t*.65)*.1;roll=reduced?0:Math.sin(t*.5)*.025;}
      if(kind==='tired'&&rest&&canRest){lieTarget=reduced?1:(t%28<24?1:0);targets[1]=.12;}
      if(kind==='busy'){pitch=.075;targets[1]=reduced?.25:.25+Math.sin(t*3)*.12;}
      if(kind==='music'){roll=reduced?0:Math.sin(t*2.2)*.10;targets[1]=reduced?.1:(Math.sin(t*4.4)+1)*.12;}
      if(kind==='exercise'&&!moving)targets[4]=reduced?.35:(Math.sin(t*3.2)+1)*.42;
      if(kind==='relax'&&!moving){targets[1]=.25;pitch=.03;roll=reduced?0:Math.sin(t*1.2)*.045;const play=t%12;targets[6]=reduced?.25:(Math.sin(t*3)+1)*.45;if(!reduced&&play>6&&play<6.7){jump=Math.sin((play-6)/.7*Math.PI)*.07;targets[4]=.3;}}
      if(kind==='happy'&&!reduced&&cycle<2.4){const hop=cycle%.8;jump=Math.sin(Math.min(1,Math.max(0,(hop-.15)/.5))*Math.PI)*.19;targets[4]=hop<.15?.55*(1-hop/.15):hop>.65?.25*(hop-.65)/.15:0;}
    }
    targets[5]=lieTarget;
    if(moving&&!reduced){targets[2]=Math.max(0,Math.sin(phase));targets[3]=Math.max(0,-Math.sin(phase));}
    for(let i=0;i<7;i++)weights[i]+=(targets[i]-weights[i])*amount;
    lie+=(lieTarget-lie)*amount;
    for(const mesh of meshes)for(let i=0;i<7;i++)mesh.morphTargetInfluences[i]=weights[i];
    poseRoot.rotation.set(-Math.PI/2*lie+pitch*(1-lie),0,roll*(1-lie));poseRoot.position.z=height*.46*lie;
    holder.scale.y=1+(reduced?0:Math.sin(t*1.7)*.009);holder.position.y=0;
    holder.updateMatrix();poseRoot.updateMatrix();const matrix=new THREE.Matrix4().multiplyMatrices(holder.matrix,poseRoot.matrix),m=matrix.elements;
    // Exact support bounds at 20 Hz; no per-frame vertex uploads or CPU mesh edits.
    if(frame++%3===0||reduced||override||Math.abs(lie-lieTarget)>.002||targets.some((v,i)=>Math.abs(v-weights[i])>.005)||Math.abs(lastJump-jump)>.002){
      const b={minX:Infinity,maxX:-Infinity,minY:Infinity,maxY:-Infinity,minZ:Infinity,maxZ:-Infinity};
      for(const {points,deltas} of samples)for(let i=0;i<points.length;i+=3){
        let x=points[i],y=points[i+1],z=points[i+2];
        for(let j=0;j<7;j++){const w=weights[j];if(w<.001)continue;x+=deltas[j][i]*w;y+=deltas[j][i+1]*w;z+=deltas[j][i+2]*w;}
        const px=m[0]*x+m[4]*y+m[8]*z+m[12],py=m[1]*x+m[5]*y+m[9]*z+m[13],pz=m[2]*x+m[6]*y+m[10]*z+m[14];
        b.minX=Math.min(b.minX,px);b.maxX=Math.max(b.maxX,px);b.minY=Math.min(b.minY,py);b.maxY=Math.max(b.maxY,py);b.minZ=Math.min(b.minZ,pz);b.maxZ=Math.max(b.maxZ,pz);
      }
      bounds=b;
    }
    holder.position.y=-bounds.minY+.018+jump+(lie>.05?groundPad:0);lastJump=jump;
    leaf.visible=kind==='relax'&&!override;leaf.rotation.y=reduced?0:Math.sin(t*.8)*.7;leaf.position.x=.38+(reduced?0:Math.sin(t*.6)*.06);
    note.visible=kind==='music'&&!override&&!reduced;note.position.set(.4,height*.8+Math.sin(t)*.06,0);
    return {kind,lie,sit:weights[0],jump,canRest,anchor:{x:(bounds.minX+bounds.maxX)/2,y:bounds.maxY-bounds.minY+jump+(lie>.05?groundPad:0)+.3,z:(bounds.minZ+bounds.maxZ)/2},bounds:{...bounds,groundOffset:holder.position.y}};
  }
  return {update,policy:(now,status,reduced)=>movementPolicy(status?.kind,(now-started)/1000+phaseOffset,reduced),get meshes(){return meshes;},dispose(){leaf.geometry.dispose();leaf.material.dispose();leaf.removeFromParent();noteMap.dispose();note.material.dispose();note.removeFromParent();}};
}
