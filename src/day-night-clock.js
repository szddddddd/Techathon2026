export const DAY_NIGHT_KEY='forest-letters-day-night-v1';
export const DAY_LENGTH=720;
export const TIME_MODES=['auto','day','dusk','night'];
const targets={day:150,dusk:360,night:540};
const wrap=t=>((t%DAY_LENGTH)+DAY_LENGTH)%DAY_LENGTH;
export function timePhase(seconds){
 const t=wrap(seconds);
 return t<300?'day':t<420?'dusk':t<660?'night':'dawn';
}
export function createDayNightClock({storage,reduced=()=>false,hidden=()=>false}={}){
 let mode='auto',seconds=150,transition=null,disposed=false,saveElapsed=0;
 try{const saved=JSON.parse(storage?.getItem(DAY_NIGHT_KEY)||'null');if(saved?.version===1&&TIME_MODES.includes(saved.mode)&&Number.isFinite(saved.seconds)){
  mode=saved.mode;seconds=wrap(saved.seconds);
  if(mode!=='auto'&&Math.abs(seconds-targets[mode])>.001)transition={from:seconds,to:targets[mode],elapsed:0};
 }}catch{}
 function save(){try{storage?.setItem(DAY_NIGHT_KEY,JSON.stringify({version:1,mode,seconds}));}catch{}}
 function setMode(next){if(disposed||!TIME_MODES.includes(next))return false;mode=next;transition=null;
  if(next!=='auto'){if(reduced())seconds=targets[next];else transition={from:seconds,to:targets[next],elapsed:0};}save();return true;
 }
 function update(dt){if(disposed||hidden()||!Number.isFinite(dt)||dt<0)return;
  if(transition){if(reduced()){seconds=transition.to;transition=null;save();}else{transition.elapsed+=dt;const p=Math.min(1,transition.elapsed/2),smooth=p*p*(3-2*p);seconds=transition.from+(transition.to-transition.from)*smooth;if(p===1){transition=null;save();}}}
  else if(mode==='auto'&&!reduced())seconds=wrap(seconds+dt);
  saveElapsed+=dt;if(saveElapsed>=5){saveElapsed=0;save();}
 }
 return{setMode,update,save,snapshot:()=>({mode,seconds,phase:timePhase(seconds),transitioning:!!transition,paused:hidden()||reduced(),cycleSeconds:DAY_LENGTH}),dispose(){save();disposed=true;transition=null;}};
}
