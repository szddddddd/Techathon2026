import {createRigProfile,validateRigProfile,RIG_VERSION} from './character-rig-profile.js';
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a));return t*t*(3-2*t);};
function distance(p,a,b){const d=b.map((v,i)=>v-a[i]),t=clamp(p.reduce((s,v,i)=>s+(v-a[i])*d[i],0)/(d.reduce((s,v)=>s+v*v,0)||1));return Math.hypot(...p.map((v,i)=>v-a[i]-d[i]*t));}
/** Conservative A-pose check: two separated legs and arms outside a central trunk. */
export function inspectBiped(meshes){
 const points=meshes.flatMap(m=>{const out=[];for(let i=0;i<m.positions.length;i+=3)out.push([m.positions[i],m.positions[i+1],m.positions[i+2]]);return out;});
 const legs=points.filter(p=>p[1]>.10&&p[1]<.31),arms=points.filter(p=>p[1]>.43&&p[1]<.79),head=points.filter(p=>p[1]>.82);
 const left=legs.filter(p=>p[0]>.035).length,right=legs.filter(p=>p[0]<-.035).length,bridge=legs.filter(p=>Math.abs(p[0])<.025).length;
 const leftArm=arms.filter(p=>p[0]>.18).length,rightArm=arms.filter(p=>p[0]<-.18).length;
 const ok=legs.length>=20&&left>10&&right>10&&bridge/legs.length<.08&&leftArm>10&&rightArm>10&&head.length>15;
 return{ok,reason:ok?'双足轮廓检查通过':'无法可靠识别分离的双腿和双臂，需要校正关节。',evidence:{left,right,bridge,legSamples:legs.length,leftArm,rightArm,head:head.length}};
}
/** Local contour centroids fit limb spacing to the supplied biped, in the Worker. */
export function locateBipedJoints(meshes,profile){
 const points=[];for(const m of meshes)for(let i=0;i<m.positions.length;i+=3)points.push(Array.from(m.positions.subarray(i,i+3)));
 const lateral=points.filter(p=>Math.abs(p[0])>.23&&p[1]>.43&&p[1]<.79),armY=lateral.reduce((sum,p)=>sum+p[1],0)/Math.max(1,lateral.length);
 profile.config.tPose=armY>.66;
 if(profile.config.tPose){const reach=Math.max(...lateral.map(p=>Math.abs(p[0])));profile.config.shoulder=[.15,armY,0];profile.config.elbow=[reach*.65,armY,0];profile.config.hand=[reach*.91,armY,0];for(const side of ['L','R'])for(const [name,key] of [['upperArm','shoulder'],['forearm','elbow'],['hand','hand']])profile.joints.find(j=>j.name===name+side).position=profile.config[key].map((v,i)=>i===0&&side==='R'?-v:v);}
 const center=(y,side,limb)=>{const selected=points.filter(p=>Math.abs(p[1]-y)<.045&&(side?p[0]*side>(limb==='arm'?.16:.025):Math.abs(p[0])<.15));if(!selected.length)return null;return [0,1,2].map(axis=>selected.reduce((sum,p)=>sum+p[axis],0)/selected.length);};
 for(const j of profile.joints){const side=j.name.endsWith('L')?1:j.name.endsWith('R')?-1:0;if(j.name==='root'||j.name.startsWith('toe'))continue;const isArm=/upperArm|forearm|hand/.test(j.name),c=isArm&&profile.config.tPose?null:center(j.position[1],side,isArm?'arm':'leg');if(c){j.position[0]=c[0];j.position[2]=c[2];}}
 profile.config.center=[profile.joints.find(j=>j.name==='hips').position[0],profile.joints.find(j=>j.name==='hips').position[2]];
 for(const side of ['L','R']){const foot=profile.joints.find(j=>j.name==='foot'+side),toe=profile.joints.find(j=>j.name==='toe'+side);toe.position=[foot.position[0],.025,foot.position[2]+.065];}
 return profile;
}
export function buildRigWeights(meshes,profile,{automatic=false}={}){
 profile=validateRigProfile(profile||createRigProfile('humanoid'));
 const inspection=automatic?inspectBiped(meshes):{ok:true,reason:'已指定角色绑定配置'};
 if(!inspection.ok)return{version:RIG_VERSION,status:'attention',diagnostics:inspection,profile};
 if(automatic)profile=locateBipedJoints(meshes,structuredClone(profile));
 const c=profile.config,names=profile.joints.map(j=>j.name),joint=name=>profile.joints[names.indexOf(name)]?.position;
 const result=meshes.map(({positions},meshIndex)=>{
  const count=positions.length/3,skinIndex=new Uint16Array(count*4),skinWeight=new Float32Array(count*4),groups=new Map();
  const set=(i,pairs)=>{const sum=pairs.reduce((s,p)=>s+p[1],0)||1;pairs.slice(0,4).forEach(([name,w],k)=>{skinIndex[i*4+k]=names.indexOf(name);skinWeight[i*4+k]=w/sum;});};
  function chain(p,chainNames){const candidates=chainNames.map((name,i)=>{const a=joint(name),b=joint(chainNames[i+1])||a;return[name,1/(.0001+distance(p,a,b)**4)];}).sort((a,b)=>b[1]-a[1]).slice(0,4);return candidates;}
  for(let i=0;i<count;i++){
   const p=Array.from(positions.subarray(i*3,i*3+3)),[x,y,z]=p,side=x>=c.center[0]?'L':'R',dx=Math.abs(x-c.center[0]);let pairs;
   const tail=c.tail&&z<c.tailGate&&(profile.animal!=='fox'||x>c.center[0]+.08);
   const ear=c.earBase&&y>c.earBase&&dx>.055;
   const bag=profile.animal==='bear'&&z>.105&&y<.36&&y>.17||profile.animal==='fox'&&z<-.105&&dx<.18&&y>.28&&y<.56;
   if(tail&&y<(profile.animal==='fox'?.63:.29))pairs=chain(p,c.tail.map((_,k)=>'tail'+k));
   else if(ear){const w=smooth(c.earBase,c.earBase+.045,y);pairs=[['head',1-w],['ear'+side,w]];}
   else if(y>c.neck+.035)pairs=[['head',1]];
   else if(y>c.neck-.035){const w=smooth(c.neck-.035,c.neck+.035,y);pairs=[['neck',1-w],['head',w]];}
   else if(!bag&&dx>c.armGate&&y>c.hand[1]-.055&&y<c.shoulder[1]+.04){
    const arm=chain(p,['upperArm'+side,'forearm'+side,'hand'+side]),w=smooth(c.armGate,c.armGate+.035,dx),sum=arm.reduce((s,q)=>s+q[1],0);pairs=arm.map(([n,v])=>[n,v/sum*w]);pairs.push(['chest',1-w]);
   }else if(y<c.hips-.018&&z>Math.min(-.12,c.footZ-.19)){const leg=chain(p,['thigh'+side,'calf'+side,'foot'+side,'toe'+side]);pairs=leg;}
   else{const levels=['hips','spine','chest','neck'];let lo=0;while(lo<levels.length-2&&y>joint(levels[lo+1])[1])lo++;const a=levels[lo],b=levels[lo+1],w=smooth(joint(a)[1],joint(b)[1],y);pairs=[[a,1-w],[b,w]];}
   set(i,pairs.filter(([,w])=>w>1e-6));
  }
  for(const override of profile.overrides||[]){if(override.mesh!==meshIndex)continue;const i=override.vertex,pairs=override.joints?.map((n,k)=>[n,override.weights?.[k]]);if(!Number.isInteger(i)||i<0||i>=count||!pairs?.length||pairs.length>4||pairs.some(([n,w])=>!names.includes(n)||!Number.isFinite(w)||w<0)||pairs.reduce((s,p)=>s+p[1],0)<=0)throw Error('顶点权重覆盖无效。');skinIndex.fill(0,i*4,i*4+4);skinWeight.fill(0,i*4,i*4+4);set(i,pairs);}
  // Extremal witnesses of each influence combination retain pose bounds without
  // scanning every vertex each frame. Six axes plus diagonals include foot soles.
  const directions=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1],[1,1,1],[-1,1,1],[1,-1,1],[-1,-1,1],[1,1,-1],[-1,1,-1],[1,-1,-1],[-1,-1,-1]];
  for(let i=0;i<count;i++){const dominant=skinIndex[i*4],key=dominant+':'+Math.floor(positions[i*3+1]*12);let list=groups.get(key);if(!list){list=directions.map(()=>({value:-Infinity,index:i}));groups.set(key,list);}directions.forEach((d,k)=>{const value=d[0]*positions[i*3]+d[1]*positions[i*3+1]+d[2]*positions[i*3+2];if(value>list[k].value)list[k]={value,index:i};});}
  const witnesses=new Uint32Array([...new Set([...groups.values()].flatMap(list=>list.map(p=>p.index)))]);
  return{skinIndex,skinWeight,witnesses};
 });
 return{version:RIG_VERSION,status:'ready',profile,meshes:result,diagnostics:{...inspection,vertices:meshes.reduce((s,m)=>s+m.positions.length/3,0),joints:names.length,maxInfluences:4}};
}
