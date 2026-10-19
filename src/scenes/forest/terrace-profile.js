// Shared footprint and elevation for the mountain boardwalk, picking and walking.
export const TERRACE_EXTENSION=[
 [22,-15.6],[16.8,-19],[15.7,-20.4],[12.2,-20.4],[11.8,-19.5],
 [11.8,-18.2],[12.6,-17.2],[15.2,-17.2],[20,-12.9],[22,-13.3],
];
export function terraceHeight(x){return 5.5+1.4*Math.max(0,Math.min(1,(20-x)/4));}
export function onTerraceExtension(x,z){
 let inside=false;const p=TERRACE_EXTENSION;
 for(let i=0,j=p.length-1;i<p.length;j=i++)if((p[i][1]>z)!==(p[j][1]>z)&&x<(p[j][0]-p[i][0])*(z-p[i][1])/(p[j][1]-p[i][1])+p[i][0])inside=!inside;
 return inside;
}
