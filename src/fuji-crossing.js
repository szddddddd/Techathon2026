import {FUJI_CARRIAGE,CROSSING,projectRail} from './fuji-railway.js';

/** Fail-safe level crossing. Existing occupants may leave; new entrants wait. */
export function createCrossingController(){
 const tailClearance=2*FUJI_CARRIAGE.spacing+FUJI_CARRIAGE.length/2+CROSSING.width/2+.3;
 let state='open',timer=0,closure=0,occupants=0;
 const setResidents=people=>{occupants=people.filter(p=>{const r=projectRail(p.x,p.z);return Math.abs(r.d-CROSSING.d)<CROSSING.width/2+.7&&r.distance<1.5+(p.radius??.65);}).length;};
 function update(distance,dt,reduced=false){
  const approach=distance>CROSSING.d-14&&distance<CROSSING.d+tailClearance;
  if(reduced){state='open';timer=0;closure=0;return;}
  if(state==='open'&&approach){state='warning';timer=0;}
  if(state==='warning'){timer+=dt;if(timer>=1.5&&!occupants){state='closing';timer=0;}}
  if(state==='closing'){closure=Math.min(1,closure+dt/1.5);if(closure===1)state='closed';}
  if(distance>CROSSING.d+tailClearance&&state!=='open'){state='opening';}
  if(state==='opening'){closure=Math.max(0,closure-dt/1.5);if(!closure){state='open';timer=0;}}
 }
 function canStep(from,to,radius=.65){
  if(state==='open')return true;
  const a=projectRail(from.x,from.z),b=projectRail(to.x,to.z);
  if(Math.abs(b.d-CROSSING.d)>CROSSING.width/2+radius||b.distance>CROSSING.clearance+radius)return true;
  // Do not trap a character that entered before the signal changed.
  return (Math.abs(a.d-CROSSING.d)<CROSSING.width/2+radius&&a.distance<1.5+radius+.05)||b.distance>=a.distance;
 }
 return{setResidents,update,canStep,shouldHold:distance=>distance>=CROSSING.d-5&&distance<CROSSING.d&&(state!=='closed'||occupants>0),snapshot:()=>({state,closure,occupants,entryAllowed:state==='open'})};
}
