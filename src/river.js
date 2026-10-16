import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {riverCenter,riverHalfWidth,riverLevel,riverDepth,sampleRiver,riverWave,RIVER_START,RIVER_END,UPPER_CASCADES} from './river-profile.js';

/** River-owned geometry, materials and animation. Imported GLBs remain shared. */
export function createRiver(parent,{assets=null,reduced=false}={}){
  const root=new THREE.Group();root.name='Clear woodland creek';parent.add(root);
  let seed=7221,time=0,disposed=false,frozen=false;
  const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  const geometries=new Set(),materials=new Set(),uniform={value:0},foam=[],rocks=[],falls=[];
  const ownGeo=g=>(geometries.add(g),g),ownMat=m=>(materials.add(m),m);
  const material=(color,extra={})=>ownMat(new THREE.MeshStandardMaterial({color,roughness:.94,flatShading:true,...extra}));
  function add(name,g,m){const mesh=new THREE.Mesh(g,m);mesh.name=name;mesh.receiveShadow=true;root.add(mesh);return mesh;}
  const stations=[...new Set([...Array.from({length:221},(_,i)=>RIVER_START+i/220*(RIVER_END-RIVER_START)),...UPPER_CASCADES.flatMap(c=>Array.from({length:25},(_,i)=>c.z-c.length/2-.12+i/24*(c.length+.24)))])].sort((a,b)=>a-b);
  function grid(rows,columns,point){
    rows=stations.length-1;const positions=[],uv=[],depth=[],centers=[],indices=[];
    for(let i=0;i<=rows;i++)for(let j=0;j<=columns;j++){const u=j/columns*2-1,z=stations[i],p=point(u,z);positions.push(p.x,p.y,p.z);uv.push(j/columns,i/rows);depth.push(riverDepth(u,z));centers.push(riverCenter(z));}
    for(let i=0;i<rows;i++)for(let j=0;j<columns;j++){const a=i*(columns+1)+j,b=a+columns+1;indices.push(a,b,a+1,a+1,b,b+1);}
    const g=ownGeo(new THREE.BufferGeometry());g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setAttribute('aDepth',new THREE.Float32BufferAttribute(depth,1));g.setAttribute('aRiverCenter',new THREE.Float32BufferAttribute(centers,1));g.setIndex(indices);g.computeVertexNormals();return g;
  }
  const bedGeo=grid(96,24,(u,z)=>{const p=sampleRiver(u,z);return {...p,y:p.bedY};});
  const bedColors=[],sand=new THREE.Color('#b5b68e'),deep=new THREE.Color('#436e65');
  for(let i=0;i<bedGeo.attributes.position.count;i++){const z=bedGeo.attributes.position.getZ(i),u=bedGeo.attributes.uv.getX(i)*2-1,d=riverDepth(u,z),c=sand.clone().lerp(deep,THREE.MathUtils.smoothstep(d,.18,1.1));c.multiplyScalar(.93+.07*Math.sin(z*3+u*11));bedColors.push(c.r,c.g,c.b);}
  bedGeo.setAttribute('color',new THREE.Float32BufferAttribute(bedColors,3));
  const bed=add('Sculpted sandy riverbed',bedGeo,material(0xffffff,{vertexColors:true,flatShading:false}));
  const bedBase=material('#526e61');
  // Closed thickness at the exposed front and rear of the diorama.
  for(const z of [RIVER_END]){
    const positions=[],indices=[];for(let i=0;i<=32;i++){const p=sampleRiver(i/16-1,z);positions.push(p.x,p.bedY,z,p.x,-2.82,z);if(i<32){const a=i*2;indices.push(a,a+1,a+2,a+2,a+1,a+3);}}
    const g=ownGeo(new THREE.BufferGeometry());g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setIndex(indices);g.computeVertexNormals();add('Riverbed exposed rock thickness',g,bedBase).material.side=THREE.DoubleSide;
  }
  const waterMat=ownMat(new THREE.MeshStandardMaterial({color:'#86c9b6',emissive:'#256459',emissiveIntensity:.08,roughness:.28,metalness:.02,transparent:true,opacity:.7,depthWrite:false,side:THREE.FrontSide}));
  waterMat.onBeforeCompile=shader=>{
    shader.uniforms.uRiverTime=uniform;
    const pre='uniform float uRiverTime; attribute float aDepth; attribute float aRiverCenter; varying float vRiverCenter; varying float vRiverDepth; varying vec3 vRiverWorld; varying vec2 vRiverUv;\n';
    shader.vertexShader=pre+shader.vertexShader;
    shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
      float edge=(1.0-pow(abs(uv.x*2.0-1.0),6.0))*(1.0-smoothstep(10.55,11.06,position.z));
      float a=position.z*2.1-uRiverTime*1.15+position.x*1.3;
      float b=position.z*3.6-uRiverTime*1.8-position.x*2.0;
      transformed.y+=.045*(sin(a)*.65+sin(b)*.35)*edge;
      vRiverCenter=aRiverCenter;vRiverDepth=aDepth;vRiverWorld=transformed;vRiverUv=uv;`);
    shader.vertexShader=shader.vertexShader.replace('#include <beginnormal_vertex>',`#include <beginnormal_vertex>
      float edgeN=(1.0-pow(abs(uv.x*2.0-1.0),6.0))*(1.0-smoothstep(10.55,11.06,position.z));
      objectNormal.x-=.045*(cos(position.z*2.1-uRiverTime*1.15+position.x*1.3)*.845-cos(position.z*3.6-uRiverTime*1.8-position.x*2.0)*.7)*edgeN;
      objectNormal.z-=.045*(cos(position.z*2.1-uRiverTime*1.15+position.x*1.3)*1.365+cos(position.z*3.6-uRiverTime*1.8-position.x*2.0)*1.26)*edgeN;`);
    shader.fragmentShader='uniform float uRiverTime; varying float vRiverCenter; varying float vRiverDepth; varying vec3 vRiverWorld; varying vec2 vRiverUv;\n'+shader.fragmentShader;
    shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
      float deep=smoothstep(.2,1.1,vRiverDepth);
      diffuseColor.rgb=mix(vec3(.12,.45,.36),vec3(.025,.23,.22),deep*.92);
      float bend=vRiverCenter;
      float flow=sin((vRiverWorld.x-bend)*5.0+sin(vRiverWorld.z*1.2-uRiverTime*.8)*.6);
      float glint=pow(max(0.0,flow),18.0)*pow(max(0.0,sin(vRiverWorld.z*1.8-uRiverTime*1.0)),10.0);
      diffuseColor.rgb+=vec3(.12,.17,.13)*glint;
      float upperCreek=1.0-smoothstep(-15.0,-11.06,vRiverWorld.z);
      diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.025,.30,.25),upperCreek*.4);
      diffuseColor.a=mix(mix(.43,.78,deep),mix(.68,.82,deep),upperCreek);
      float bank=pow(abs(vRiverUv.x*2.0-1.0),18.0);
      diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.65,.82,.66),bank*.22);`);
  };
  const water=add('Lit translucent flowing creek',grid(160,32,(u,z)=>sampleRiver(u,z)),waterMat);water.renderOrder=3;water.castShadow=false;water.frustumCulled=false;
  const stone=ownGeo(new THREE.DodecahedronGeometry(1,0)),moss=material('#829a56'),cliff=material('#6d8070'),wet=material('#536f64'),pebble=material('#abb49a');
  function instances(name,count,geo,mat,build){const m=new THREE.InstancedMesh(geo,mat,count),dummy=new THREE.Object3D();m.name=name;m.castShadow=true;m.receiveShadow=true;for(let i=0;i<count;i++){dummy.position.set(0,0,0);dummy.rotation.set(0,0,0);dummy.scale.set(1,1,1);build(dummy,i);dummy.updateMatrix();m.setMatrixAt(i,dummy.matrix);}m.instanceMatrix.needsUpdate=true;root.add(m);return m;}
  // Staggered rock ledges; upper meadow surfaces are untouched.
  const shore=[];
  for(const side of [-1,1])for(let z=-10.65;z<10.8;z+=1.05+random()*.7){if(z>-1.8&&z<4.8)continue;shore.push({side,z,x:riverCenter(z)+side*riverHalfWidth(z)});}
  instances('Irregular cliff ledges',shore.length*2,stone,cliff,(o,i)=>{const p=shore[Math.floor(i/2)],upper=i%2;o.position.set(p.x+p.side*.08,upper?1.35:.35,p.z+(upper?-.16:.18));o.scale.set(.52+random()*.15,.62+random()*.23,.8+random()*.3);o.rotation.set(random()*.3,random()*.7,random()*.25);});
  instances('Wet shoreline stones',shore.length,stone,wet,(o,i)=>{const p=shore[i];o.position.set(p.x-p.side*.28,riverLevel(p.z)-.06,p.z+.18);o.scale.set(.38+random()*.2,.26+random()*.23,.65+random()*.3);o.rotation.y=random()*3;});
  instances('Mossy ledge caps',shore.length,stone,moss,(o,i)=>{const p=shore[i];o.position.set(p.x,2.08,p.z);o.scale.set(.68,.16,.78+random()*.22);o.rotation.y=random()*.5;});
  instances('Submerged river pebbles',160,stone,pebble,(o,i)=>{const z=-10.7+random()*21.4,u=(i%2?1:-1)*(.52+random()*.4),p=sampleRiver(u,z),r=.07+random()*.13;o.position.set(p.x,p.bedY+.025,z);o.scale.set(r,r*.3,r*(1+random()*.5));o.rotation.y=random()*6;});
  function cloneAsset(kind,name,x,y,z,width,angle=0){
    const source=assets?.[kind];let group;
    if(source){group=new THREE.Group();const object=source.model.clone(true),bounds=new THREE.Box3().setFromObject(object),size=bounds.getSize(new THREE.Vector3());object.position.sub(new THREE.Vector3((bounds.min.x+bounds.max.x)/2,bounds.min.y,(bounds.min.z+bounds.max.z)/2));group.add(object);group.scale.setScalar(width/Math.max(size.x,size.z));}
    else{group=new THREE.Mesh(stone,kind==='rock'?cliff:moss);group.scale.set(width*.5,width*.28,width*.42);}
    group.name=name;group.position.set(x,y,z);group.rotation.y=angle;root.add(group);group.traverse(o=>{o.userData.riverOwned=true;});return group;
  }
  const placements=[[-.78,-9.0,1.12],[.73,-7.5,1.3],[-.55,-4.5,.9],[.76,-3,1.1],[-.68,6.05,1.22],[.56,7.1,.92],[-.25,8.5,.76],[.79,9.15,1.26],[-.73,10.2,1.08],[.15,-8.3,.72]];
  for(const [u,z,baseWidth] of placements){const width=baseWidth*1.3,limit=1-(width*.7+.12)/riverHalfWidth(z),p=sampleRiver(THREE.MathUtils.clamp(u,-limit,limit),z),rock=cloneAsset('rock','Rodin river moss stone',p.x,p.y-.12,z,width,random()*6);rocks.push({x:p.x,z,width,group:rock});}
  for(const [i,p] of shore.filter((p,i)=>i%5===0).slice(0,6).entries())cloneAsset(i%2?'fern_large':'grass','River ledge plant',p.x-p.side*.08,.6,p.z,.5+random()*.16,random()*6);
  const foamMat=ownMat(new THREE.MeshBasicMaterial({color:'#e4eed0',transparent:true,opacity:.5,depthWrite:false,side:THREE.DoubleSide}));
  function ribbon(name,points,width,mat=foamMat){const vertices=[],indices=[];points.forEach((p,i)=>{const prev=points[Math.max(0,i-1)],next=points[Math.min(points.length-1,i+1)],dx=next[0]-prev[0],dz=next[2]-prev[2],len=Math.hypot(dx,dz)||1;vertices.push(p[0]-dz/len*width,p[1],p[2]+dx/len*width,p[0]+dz/len*width,p[1],p[2]-dx/len*width);if(i<points.length-1){const a=i*2;indices.push(a,a+2,a+1,a+1,a+2,a+3);}});const g=ownGeo(new THREE.BufferGeometry());g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));g.setIndex(indices);g.computeVertexNormals();const m=add(name,g,mat);m.renderOrder=4;return m;}
  for(const p of rocks){const points=[];for(let j=0;j<=22;j++){const a=.12+j/22*Math.PI*1.6;points.push([p.x+Math.cos(a)*p.width*.62,riverLevel(p.z)+.065,p.z+Math.sin(a)*p.width*.52]);}ribbon('Foam wrapping a river stone',points,.018);}
  for(let i=0;i<22;i++){const z=-10+random()*20,u=(random()-.5)*1.5,points=[];for(let j=0;j<=9;j++)points.push([Math.sin(j/9*Math.PI)*.12,0,j/9*(.35+random()*.12)]);const m=ribbon('Short drifting current',points,.012);foam.push({mesh:m,u,z,phase:random()*6});}
  for(let i=0;i<5;i++){const u=-.7+i*.35,points=[];for(let j=0;j<=18;j++){const z=4.75+j/18*.85,p=sampleRiver(u+Math.sin(j*.3)*.015,z);points.push([p.x,p.y+.06,z]);}ribbon('Soft riffle over low drop',points,.025);}
  // Small rapids follow the shared continuous profile; no disconnected waterfall cards.
  const upperFoam=ownMat(foamMat.clone());upperFoam.opacity=.27;
  for(const [index,c] of UPPER_CASCADES.entries()){
    for(let lane=0;lane<4;lane++){const points=[],start=(lane%3)*.16;for(let j=0;j<=12;j++){const z=c.z-c.length/2+(start+j/12*.5)*(c.length+.2),p=sampleRiver(-.6+lane*.4+Math.sin(j*.45+index)*.035,z);points.push([p.x,p.y+.045,z]);}ribbon('Mountain cascade '+(index+1)+' foam '+lane,points,.016,upperFoam);}
    for(const side of [-1,1]){const points=[];for(let j=0;j<=10;j++){const p=sampleRiver(side*(.3+j/10*.5),c.z+c.length/2+.13+Math.sin(j*.3)*.08);points.push([p.x,p.y+.045,p.z]);}ribbon('Mountain cascade settling pool '+(index+1),points,.022,upperFoam);}
  }
  const mountainFoam=root.children.filter(o=>o.name.startsWith('Mountain cascade'));
  const combinedFoam=mergeGeometries(mountainFoam.map(o=>o.geometry),false);
  if(combinedFoam){const batch=add('Mountain cascade foam batch',ownGeo(combinedFoam),upperFoam);batch.renderOrder=4;for(const mesh of mountainFoam){mesh.removeFromParent();geometries.delete(mesh.geometry);mesh.geometry.dispose();}}
  const springMat=ownMat(new THREE.MeshStandardMaterial({color:'#78b8a3',roughness:.3,transparent:true,opacity:.78,depthWrite:false}));
  const spring=add('Recessed mountain spring pool',ownGeo(new THREE.CircleGeometry(1,48)),springMat);spring.rotation.x=-Math.PI/2;spring.scale.set(.83,.35,1);spring.position.set(riverCenter(RIVER_START),riverLevel(RIVER_START)+.005,RIVER_START-.12);spring.renderOrder=3;
  for(const side of [-1,1]){const rock=add('Spring wet rock lip',ownGeo(new THREE.DodecahedronGeometry(.22,1)),wet);rock.position.set(riverCenter(RIVER_START)+side*.96,riverLevel(RIVER_START)+.04,RIVER_START-.12);rock.scale.set(.85,.6,1.5);}
  // Curved sheets roll over the edge; each sheet connects exactly at the waterline.
  const fallMat=ownMat(new THREE.MeshStandardMaterial({color:'#8bc6b0',roughness:.4,metalness:0,transparent:true,opacity:.77,depthWrite:false,side:THREE.DoubleSide}));
  fallMat.onBeforeCompile=shader=>{shader.uniforms.uRiverTime=uniform;shader.vertexShader='varying vec2 vFallUv;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvFallUv=uv;');shader.fragmentShader='uniform float uRiverTime;varying vec2 vFallUv;\n'+shader.fragmentShader;shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
    float stream=sin(vFallUv.x*21.0+sin(vFallUv.y*5.0-uRiverTime*2.4))*.5+.5;
    float pulse=sin(vFallUv.y*24.0-uRiverTime*5.0+vFallUv.x*6.0)*.5+.5;
    diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.8,.92,.79),pow(stream,6.0)*(.15+pulse*.35));
    diffuseColor.a*=1.0-smoothstep(.8,1.0,vFallUv.y);`);};
  const span=riverHalfWidth(RIVER_END)*2,cx=riverCenter(RIVER_END);
  for(let section=0;section<5;section++){
    const positions=[],uv=[],indices=[],start=-span/2+section/5*span,end=-span/2+(section+1)/5*span;
    for(let j=0;j<=28;j++)for(let k=0;k<=8;k++){const t=j/28,s=k/8,center=(start+end)/2,x=cx+center+(s-.5)*(end-start)*(1-.13*t);positions.push(x,riverLevel(RIVER_END)-t*t*2.72,RIVER_END+Math.sin(t*Math.PI*.55)*(.32+section%2*.09+Math.sin(s*Math.PI)*.12));uv.push(s,t);if(j<28&&k<8){const a=j*9+k;indices.push(a,a+9,a+1,a+1,a+9,a+10);}}
    const g=ownGeo(new THREE.BufferGeometry());g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();const m=add('Curved foreground waterfall '+section,g,fallMat);m.renderOrder=3;falls.push(m);
  }
  const lip=[];for(let i=0;i<=48;i++){const p=sampleRiver(i/24-1,RIVER_END-.035);lip.push([p.x,p.y+.025,p.z]);}ribbon('Waterfall rolling lip',lip,.035);
  const mistMat=ownMat(new THREE.PointsMaterial({color:'#c5e3cb',size:.17,transparent:true,opacity:.19,depthWrite:false,sizeAttenuation:true}));
  mistMat.onBeforeCompile=shader=>{shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\nfloat r=length(gl_PointCoord-.5)*2.;diffuseColor.a*=pow(max(0.,1.-r),2.);');};
  const mistPositions=new Float32Array(24*3),mistSeed=[];for(let i=0;i<24;i++)mistSeed.push({x:cx+(random()-.5)*span*.9,z:RIVER_END+.25+random()*.16,phase:random()*6});
  const mistGeo=ownGeo(new THREE.BufferGeometry());mistGeo.setAttribute('position',new THREE.BufferAttribute(mistPositions,3));const mist=new THREE.Points(mistGeo,mistMat);mist.name='Quiet waterfall spray';mist.renderOrder=5;root.add(mist);
  root.traverse(o=>{o.userData.riverOwned=true;});
  function update(seconds,dt=0){if(disposed)return;const still=typeof reduced==='boolean'?reduced:!!reduced?.matches;if(still&&frozen)return;frozen=still;time=still?0:seconds;uniform.value=time;
    for(const p of foam){const z=RIVER_START+((p.z-RIVER_START+time*.23)%(RIVER_END-RIVER_START-.6)),s=sampleRiver(p.u,z);p.mesh.position.set(s.x,0,z);const pos=p.mesh.geometry.attributes.position;for(let i=0;i<pos.count;i++){const x=s.x+pos.getX(i),rz=z+pos.getZ(i);pos.setY(i,riverLevel(rz)+riverWave(x,rz,time,p.u)+.022);}pos.needsUpdate=true;p.mesh.visible=!rocks.some(r=>Math.hypot(r.x-s.x,r.z-z)<r.width*.8);}
    for(let i=0;i<mistSeed.length;i++){const p=mistSeed[i];mistPositions[i*3]=p.x+Math.sin(time*.8+p.phase)*.1;mistPositions[i*3+1]=-2.65+Math.sin(time*.65+p.phase)*.12;mistPositions[i*3+2]=p.z;}mistGeo.attributes.position.needsUpdate=true;
  }
  update(0);return{root,update,sample:sampleRiver,level:riverLevel,bounds:z=>({left:riverCenter(z)-riverHalfWidth(z),right:riverCenter(z)+riverHalfWidth(z)}),audit:{surfaceVertices:water.geometry.attributes.position.count,rodinRocks:assets?.rock?rocks.length:0,fallbackRocks:assets?.rock?0:rocks.length,pebbles:160,waterfallSheets:5,mountainCascades:UPPER_CASCADES.length,sourceLevel:riverLevel(RIVER_START),bridgeLevel:riverLevel(1.5),downstreamLevel:riverLevel(7),rocks:rocks.map(({x,z,width})=>({x,z,width}))},snapshot:()=>({time,foam:foam.map(p=>p.mesh.position.toArray())}),dispose(){disposed=true;root.removeFromParent();root.traverse(o=>{if(o.isInstancedMesh)o.dispose();});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());}};
}
