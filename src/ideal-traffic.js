import * as T from 'three';

// Coherent schools follow closed lanes. Neighbours keep their order and spacing;
// a delayed lateral wave travels through each school like a group of fish.
export const IDEAL_TRAFFIC_LANES=[{radius:29,height:14,period:82,direction:1,phase:.5}];
export const IDEAL_DOCK=new T.Vector3(35.6,9.4,0);
const cruise=new T.CatmullRomCurve3([[35.6,24,0],[31,28,22],[8,29,35],[-23,30,29],[-36,29,0],[-25,28,-28],[4,27,-35],[29,26,-24],[35.6,24,0]].map(p=>new T.Vector3(...p)),false,'centripetal');
cruise.arcLengthDivisions=512;cruise.updateArcLengths();
const smooth=t=>t*t*t*(t*(t*6-15)+10);
const yawAt=u=>{const d=cruise.getTangentAt(u);return-Math.atan2(d.z,d.x);};
export function idealAirshipPose(time,frozen=false){
 const t=frozen?0:((time%90)+90)%90,position=IDEAL_DOCK.clone();let phase='docked',yaw=0,bank=0;
 if(t>=10&&t<20){const u=smooth((t-10)/10);position.y=T.MathUtils.lerp(9.4,24,u);yaw=yawAt(0)*u;phase='taking-off';}
 else if(t>=20&&t<80){const u=smooth((t-20)/60);position.copy(cruise.getPointAt(u));yaw=yawAt(u);const next=yawAt(Math.min(1,u+.004));bank=T.MathUtils.clamp(Math.atan2(Math.sin(next-yaw),Math.cos(next-yaw))*4,-.075,.075);phase=u>.86?'approaching':'cruising';}
 else if(t>=80){const u=smooth((t-80)/10);position.y=T.MathUtils.lerp(24,9.4,u);yaw=yawAt(1)*(1-u);phase='landing';}
 return{position:position.toArray(),yaw,bank,phase,cycleTime:t};
}
export function createIdealAirways(){
 const root=new T.Group();root.name='Ideal city · visible flight corridors';
 const lane=IDEAL_TRAFFIC_LANES[0];
 const flight=[IDEAL_DOCK.clone(),new T.Vector3(35.6,24,0),...cruise.getSpacedPoints(192).slice(1),IDEAL_DOCK.clone()];
 const traffic=Array.from({length:193},(_,i)=>{const a=i/192*Math.PI*2;return new T.Vector3(Math.cos(a)*lane.radius,lane.height,Math.sin(a)*lane.radius);});
 const routes=[{id:'airship-port-departure-arrival',points:flight,color:0xc2edff},{id:'school-lane',points:traffic,color:0x84e9ed}];
 for(const route of routes){
  const geometry=new T.BufferGeometry().setFromPoints(route.points);
  const base=new T.Line(geometry,new T.LineBasicMaterial({color:route.color,transparent:true,opacity:.22,depthWrite:false,toneMapped:false}));base.name='Flight corridor '+route.id;root.add(base);
  const marks=new T.Line(geometry,new T.LineDashedMaterial({color:route.color,transparent:true,opacity:.65,dashSize:.65,gapSize:.8,depthWrite:false,toneMapped:false}));marks.computeLineDistances();root.add(marks);
  const arrows=new T.InstancedMesh(new T.ConeGeometry(.12,.48,3),new T.MeshBasicMaterial({color:route.color,transparent:true,opacity:.65,depthWrite:false,toneMapped:false}),10);
  const pose=new T.Object3D(),up=new T.Vector3(0,1,0);
  for(let i=0;i<10;i++){const index=route.id==='school-lane'?Math.floor(i/10*191):i===0?0:i===9?route.points.length-2:Math.floor(i/9*(route.points.length-2));const a=route.points[index],b=route.points[index+1];pose.position.copy(a).lerp(b,.5);pose.quaternion.setFromUnitVectors(up,b.clone().sub(a).normalize());pose.updateMatrix();arrows.setMatrixAt(i,pose.matrix);}
  arrows.name='Flight direction '+route.id;root.add(arrows);
 }
 // A quiet vertical docking beam makes the take-off/landing column legible.
 const beam=new T.Mesh(new T.CylinderGeometry(.2,.62,3.8,12,1,true),new T.MeshBasicMaterial({color:0x81e8ff,transparent:true,opacity:.09,side:T.DoubleSide,depthWrite:false}));beam.position.set(35.6,6.9,0);beam.name='Airship docking alignment';root.add(beam);
 root.userData.routes=routes.map(({id})=>({id}));return root;
}
export function idealTrafficPose(index,time){
 const lane=IDEAL_TRAFFIC_LANES[0],order=index,row=Math.floor(order/2),side=order%2?1:-1;
 const envelope=.42+Math.sin((row+1)/10*Math.PI)*.82;
 const a=lane.phase+lane.direction*(time/lane.period*Math.PI*2-(row*2.8+side*.45+Math.sin(order*2.399)*.2)/lane.radius);
 const sway=Math.sin(time*.36-row*.35+lane.phase)*.32,r=lane.radius+side*envelope+Math.sin(order*2.399)*.16+sway;
 const y=lane.height+side*.28+Math.sin(time*.5-row*.42+lane.phase)*.22;
 return{x:Math.cos(a)*r,y,z:Math.sin(a)*r,yaw:-Math.atan2(Math.cos(a)*lane.direction,-Math.sin(a)*lane.direction),bank:Math.sin(time*.36-row*.35+lane.phase)*.035};
}
export function createIdealTrafficSchool(template,{compact=()=>typeof innerWidth!=='undefined'&&innerWidth<700}={}){
 const root=new T.Group();root.name='Ideal city · schooling hover traffic';
 const source=template.clone(true);source.position.set(0,0,0);source.rotation.set(0,0,0);source.updateMatrixWorld(true);
 const box=new T.Box3().setFromObject(source),size=box.getSize(new T.Vector3()),center=box.getCenter(new T.Vector3());
 const normalize=new T.Matrix4().makeScale(1.7/size.x,1.7/size.x,1.7/size.x).multiply(new T.Matrix4().makeTranslation(-center.x,-center.y,-center.z));
 const parts=[],targets=Array.from({length:18},(_,i)=>{const body=new T.Object3D();body.name='Hover school '+i;root.add(body);return{id:'school-'+i,body};});
 source.traverse(o=>{if(!o.isMesh)return;const mesh=new T.InstancedMesh(o.geometry,o.material,18);mesh.name='Instanced low-poly hover cars';mesh.userData.idealTrafficSchool=true;mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);mesh.castShadow=false;mesh.frustumCulled=false;root.add(mesh);parts.push({mesh,local:normalize.clone().multiply(o.matrixWorld)});for(let i=0;i<18;i++)mesh.setColorAt(i,new T.Color([0xe6f6ff,0xffffff,0xbddfe9][i%3]));});
 const matrix=new T.Matrix4(),rotation=new T.Quaternion(),euler=new T.Euler(),position=new T.Vector3(),scale=new T.Vector3();let count=18;
 function update(time,frozen=false){count=compact()?10:18;for(let i=0;i<count;i++){const p=idealTrafficPose(i,frozen?0:time),target=targets[i];position.set(p.x,p.y,p.z);euler.set(p.bank,p.yaw,0,'YXZ');rotation.setFromEuler(euler);scale.setScalar(.93+(i%4)*.045);matrix.compose(position,rotation,scale);target.body.position.copy(position);target.body.quaternion.copy(rotation);for(const part of parts)part.mesh.setMatrixAt(i,matrix.clone().multiply(part.local));}for(const part of parts){part.mesh.count=count;part.mesh.instanceMatrix.needsUpdate=true;}}
 update(0,true);
 return{root,pickables:parts.map(p=>p.mesh),update,vehicle:id=>{const i=Number(id.slice(7));return Number.isInteger(i)&&i>=0&&i<count?targets[i]:null;},snapshot:()=>({count,lanes:1,positions:targets.slice(0,count).map(v=>v.body.position.toArray())})};
}
