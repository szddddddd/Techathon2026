export const RIG_VERSION=3;
const configurations={
 kangaroo:{center:[0,.045],hips:.215,spine:.32,chest:.405,neck:.50,head:.64,hipWidth:.085,knee:.115,ankle:.045,footZ:.11,shoulder:[.14,.405,.04],elbow:[.19,.305,.09],hand:[.20,.31,.15],armGate:.148,earBase:.79,earTip:.97,earWidth:.115,tail:[[0,.19,-.09],[0,.10,-.20],[0,.055,-.29]],tailGate:-.14,stride:.16},
 fox:{center:[-.070,.035],hips:.24,spine:.355,chest:.47,neck:.565,head:.70,hipWidth:.11,knee:.13,ankle:.045,footZ:.095,shoulder:[.17,.485,.015],elbow:[.225,.365,.025],hand:[.245,.275,.055],armGate:.155,earBase:.86,earTip:.98,earWidth:.17,tail:[[.10,.18,-.17],[.20,.32,-.27],[.23,.53,-.27]],tailGate:-.22,stride:.17},
 rabbit:{center:[0,-.005],hips:.20,spine:.30,chest:.405,neck:.485,head:.61,hipWidth:.10,knee:.11,ankle:.04,footZ:.07,shoulder:[.14,.43,.005],elbow:[.19,.335,.045],hand:[.22,.275,.07],armGate:.135,earBase:.735,earTip:.97,earWidth:.12,tail:[[0,.18,-.14],[0,.20,-.19]],tailGate:-.175,stride:.13},
 bear:{center:[0,-.04],hips:.235,spine:.35,chest:.46,neck:.57,head:.735,hipWidth:.115,knee:.125,ankle:.045,footZ:.075,shoulder:[.19,.51,-.015],elbow:[.255,.39,.015],hand:[.285,.29,.035],armGate:.17,earBase:.91,earTip:.985,earWidth:.195,tail:[[0,.16,-.16],[0,.16,-.21]],tailGate:-.19,stride:.14},
 humanoid:{center:[0,0],hips:.48,spine:.57,chest:.68,neck:.79,head:.88,hipWidth:.09,knee:.27,ankle:.055,footZ:.04,shoulder:[.15,.72,0],elbow:[.22,.57,0],hand:[.26,.43,.02],armGate:.17,stride:.24},
};
const limits={root:[1.7,1.7,1.7],hips:[.7,.35,.35],spine:[.4,.3,.25],chest:[.4,.35,.3],neck:[.45,.6,.3],head:[.5,.6,.3],upperArm:[1.9,1.0,1.6],forearm:[2.1,.4,.45],hand:[.6,.6,.6],thigh:[1.65,.5,.4],calf:[2.5,.2,.2],foot:[1.5,.3,.3],toe:[.6,.2,.2],ear:[.3,.25,.35],tail:[.4,.5,.3]};
export function createRigProfile(animal='humanoid'){
 const c=structuredClone(configurations[animal]||configurations.humanoid),[cx,cz]=c.center,joints=[];
 const add=(name,parent,position,kind=name)=>joints.push({name,parent,position,limit:limits[kind]||[.4,.4,.4]});
 add('root',null,[0,0,0]);add('hips','root',[cx,c.hips,cz]);add('spine','hips',[cx,c.spine,cz]);add('chest','spine',[cx,c.chest,cz]);add('neck','chest',[cx,c.neck,cz]);add('head','neck',[cx,c.head,cz+.035]);
 for(const [side,sign] of [['L',1],['R',-1]]){
  const sidePoint=([x,y,z])=>[cx+sign*x,y,z];
  add('upperArm'+side,'chest',sidePoint(c.shoulder),'upperArm');add('forearm'+side,'upperArm'+side,sidePoint(c.elbow),'forearm');add('hand'+side,'forearm'+side,sidePoint(c.hand),'hand');
  add('thigh'+side,'hips',[cx+sign*c.hipWidth,c.hips,cz],'thigh');add('calf'+side,'thigh'+side,[cx+sign*c.hipWidth,c.knee,cz+.015],'calf');add('foot'+side,'calf'+side,[cx+sign*c.hipWidth,c.ankle,c.footZ],'foot');add('toe'+side,'foot'+side,[cx+sign*c.hipWidth,.025,c.footZ+.065],'toe');
  if(c.earBase){add('ear'+side,'head',[cx+sign*c.earWidth,c.earBase,cz],'ear');add('earTip'+side,'ear'+side,[cx+sign*c.earWidth,c.earTip,cz],'ear');}
 }
 c.tail?.forEach((p,i)=>add('tail'+i,i?'tail'+(i-1):'hips',p,'tail'));
 return{version:RIG_VERSION,animal,config:c,joints,overrides:[]};
}
export function validateRigProfile(profile){
 if(profile?.version!==RIG_VERSION||!Array.isArray(profile.joints)||profile.joints.length<20||profile.joints.length>96)throw Error('骨骼配置版本或关节数量无效。');
 const names=new Set();for(const j of profile.joints){if(typeof j.name!=='string'||names.has(j.name)||j.parent&&!names.has(j.parent)||j.position?.length!==3||j.position.some(n=>!Number.isFinite(n)||Math.abs(n)>3)||j.limit?.length!==3||j.limit.some(n=>!Number.isFinite(n)||n<0||n>Math.PI))throw Error('骨骼层级或关节参数无效。');names.add(j.name);}
 for(const name of ['root','hips','spine','chest','neck','head',...['L','R'].flatMap(s=>['upperArm','forearm','hand','thigh','calf','foot','toe'].map(n=>n+s))])if(!names.has(name))throw Error('缺少必要关节：'+name);
 if(!profile.config||!Number.isFinite(profile.config.stride)||profile.config.stride<=0||profile.config.stride>1)throw Error('步幅参数无效。');
 return profile;
}
