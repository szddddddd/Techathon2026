// Fixed community plot footprints shared by the current cyber scene checks.
const slot=(x,z,rotation=0,index=0)=>({index,x,z,rotation,width:4.4,depth:3.8,entry:{x:x+Math.sin(rotation)*2.65,z:z+Math.cos(rotation)*2.65}});
const slots=[[-8,-11,0],[0,-13,0],[8,-10,0],[-17,-8,Math.PI/2],[-16,-1,Math.PI/2],[-17,7,Math.PI/2],[-8,12,Math.PI],[0,13,Math.PI],[8,12,Math.PI]].map((p,i)=>slot(...p,i));
export const CYBER_LAYOUT={slots};
