// Analytic critically damped velocity: frame-rate independent and continuous on reversal.
export function createRecordMotion(){
  let speed=0,acceleration=0,angle=0;
  return {step(dt,playing,reduced=false){
    if(reduced){speed=0;acceleration=0;return angle;}
    dt=Math.max(0,Math.min(dt||0,.1));
    const target=playing?Math.PI*2*33.333/60:0,omega=playing?5:3.8;
    const error=speed-target,b=acceleration+omega*error,decay=Math.exp(-omega*dt);
    angle+=(target*dt+error*(1-decay)/omega+b*(1-decay*(1+omega*dt))/(omega*omega));
    speed=target+(error+b*dt)*decay;acceleration=(acceleration-omega*b*dt)*decay;
    if(!playing&&Math.abs(speed)<.002&&Math.abs(acceleration)<.01){speed=0;acceleration=0;}
    angle%=Math.PI*2;return angle;
  },snapshot(){return{speed,acceleration,angle};}};
}
