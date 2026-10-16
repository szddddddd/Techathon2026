// Shared town plan: x/z coordinates, local +Z is each building's front door.
export const GROUP_COLUMNS=3,GROUP_ROWS=3;
export const COMMUNITY_HEIGHT=2.22;
export const COMMUNITY_BOUNDS={minX:-25.3,maxX:-3.6,minZ:-14.5,maxZ:2.7};
const civicBounds={minX:-25.3,maxX:-14.2,minZ:2.7,maxZ:7.5};
export const COMMUNITY_RIVER_WALK_X=-4.95;
export const GROUP_QUEUE={x:-14,z:6.3};
export const COMMUNITY_FACILITIES={cinema:{x:-20,z:4.9},kiosk:{x:-17,z:4.1}};
export function plotPoint(p,x,z){const c=Math.cos(p.rotation),s=Math.sin(p.rotation);return{x:p.x+x*c+z*s,z:p.z-x*s+z*c};}
export const GROUP_SLOTS=[
 {x:-22,z:-12,rotation:0,neighbourhood:'mountain'},
 {x:-16.2,z:-12.4,rotation:0,neighbourhood:'mountain'},
 {x:-9.7,z:-12.6,rotation:0,neighbourhood:'mountain'},
 {x:-22.7,z:-5.8,rotation:Math.PI/2,neighbourhood:'street'},
 {x:-22,z:.2,rotation:Math.PI/2,neighbourhood:'street'},
 {x:-16,z:.4,rotation:Math.PI,neighbourhood:'street'},
 {x:-15.8,z:-6,rotation:0,neighbourhood:'river'},
 {x:-8,z:-7.2,rotation:0,neighbourhood:'river'},
 {x:-8.4,z:-1.8,rotation:Math.PI,neighbourhood:'river'},
].map((p,index)=>({...p,index,width:4.4,depth:3.8,entry:plotPoint(p,0,2.7)}));
export const GROUP_CAPACITY=GROUP_SLOTS.length;
export const COMMUNITY_PATHS=[
 {id:'main',kind:'stone',width:2.2,points:[[-12,1.2],[-12,-2.9],[-19.3,-2.9],[-19.3,-9.2],[-16.2,-9.2]]},
 {id:'mountain-lane',kind:'gravel',width:1.6,points:[[-22,-9.15],[-19.3,-9.2],[-16.2,-9.2],[-16.2,-9.8],[-9.7,-9.8],[-4.95,-9.8]]},
 {id:'riverside',kind:'stone',width:1.6,points:[[-4.95,-13.3],[-4.95,-9.9],[-4.95,-4.5],[-4.95,1.5]]},
 {id:'garden-lane',kind:'gravel',width:1.6,points:[[-12,-2.9],[-11.7,-4.5],[-8,-4.5],[-4.95,-4.5]]},
 {id:'west-lane',kind:'gravel',width:1.6,points:[[-19.3,-2.9],[-19.3,.2],[-19.3,3.2]]},
 {id:'civic-lane',kind:'gravel',width:1.6,points:[[-19.3,3.2],[-22.1,3.2],[-22.1,7.3],[-16.6,7.3],[-15.2,6.3],[-15.2,3.2],[-19.3,3.2]]},
 ...GROUP_SLOTS.map(p=>({id:'door-'+p.index,kind:'gravel',width:1.6,points:[[p.entry.x,p.entry.z],...([
 [[-22,-9.15]], [[-16.2,-9.2]], [[-9.7,-9.9]], [[-19.3,-5.8]], [[-19.3,.2]], [[-16,-2.9]], [[-15.8,-2.9]], [[-8,-4.5]], [[-8.4,-4.5]]
 ][p.index])]})),
];
export const COMMUNITY_PLAZAS=[{id:'street-square',x:-12,z:-.2,rx:1.4,rz:1.3},{id:'entrance-square',x:-18.9,z:3.8,rx:1,rz:.65}];
export const COMMUNITY_GARDENS=[
 {id:'heart-garden',x:-11.95,z:-7.4,width:2.8,depth:3.1},
 {id:'riverside-garden',x:-3.7,z:-6.1,width:.6,depth:5.2},
 {id:'west-garden',x:-24.5,z:3.65,width:1.5,depth:2.2},
];
export const COMMUNITY_TREES=[
 {x:-12.35,z:-7.9,height:2.8},
 {x:-3.75,z:-6.7,height:2.4},
 {x:-24.5,z:3.1,height:2.7},
 {x:-24.8,z:-11,height:3},
 {x:-13.3,z:-11.8,height:2.6},
 {x:-5.9,z:-11.9,height:2.5},
];
export const COMMUNITY_BENCHES=[{x:-13.6,z:-4.5,rotation:0},{x:-23.4,z:4.7,rotation:Math.PI/2},{x:-17.5,z:6.2,rotation:Math.PI}];
export const COMMUNITY_LAMPS=[{x:-13.6,z:2.2},{x:-20.6,z:-2.5},{x:-18.3,z:-10.2},{x:-6.5,z:-8.2}];
export const COMMUNITY_PLANTERS=[{x:-23.6,z:-2.4,width:.75,depth:.65},{x:-14.5,z:-1.4,width:.65,depth:.65},{x:-5.8,z:3.5,width:.65,depth:.65}];
// Parallel curb parking leaves the walking line and every doorway clear.
export const COMMUNITY_CARS=[
 {id:'mountain-car',x:-17.7,z:-3.52,rotation:Math.PI/2,color:0xe7bc68,width:1,depth:1.84},
 {id:'civic-car',x:-18.55,z:-7.5,rotation:Math.PI,color:0x79aaa3,width:1,depth:1.84},
];
export const COMMUNITY_PARKING=[
 {x:-17.7,z:-3.3,rotation:Math.PI/2,width:1.45,depth:2.04},
 {x:-18.8,z:-7.5,rotation:Math.PI,width:1.45,depth:2.04},
];
// Pedestrian route around the parked cars; paving still follows the main street.
export const COMMUNITY_WALKING_PATHS=COMMUNITY_PATHS.map(p=>p.id==='main'?{...p,points:[
 [-12,1.2],[-12,-2.9],[-15.9,-2.2],[-19.4,-2.2],[-19.9,-5.8],[-19.9,-8.6],[-19.3,-9.2],[-16.2,-9.2],
]}:p);
const inRect=(b,x,z,pad=0)=>x>=b.minX-pad&&x<=b.maxX+pad&&z>=b.minZ-pad&&z<=b.maxZ+pad;
export const inCommunity=(x,z,pad=0)=>inRect(COMMUNITY_BOUNDS,x,z,pad)||inRect(civicBounds,x,z,pad);
export function communityBlend(x,z){const distance=b=>Math.max(0,b.minX-x,x-b.maxX,b.minZ-z,z-b.maxZ),t=Math.min(1,distance(COMMUNITY_BOUNDS),distance(civicBounds));return 1-t*t*(3-2*t);}
function inLocalBox(p,x,z,width,depth,radius=0){const c=Math.cos(p.rotation||0),s=Math.sin(p.rotation||0),dx=x-p.x,dz=z-p.z;return Math.abs(dx*c-dz*s)<width/2+radius&&Math.abs(dx*s+dz*c)<depth/2+radius;}
export const groupPlotAt=(x,z,radius=0)=>GROUP_SLOTS.findIndex(p=>inLocalBox(p,x,z,p.width,p.depth,radius));
export function communityObstacleAt(x,z,radius=0){
 if(COMMUNITY_CARS.some(p=>inLocalBox(p,x,z,p.width,p.depth,radius)))return 'car';
 if(COMMUNITY_GARDENS.some(p=>inLocalBox(p,x,z,p.width,p.depth,radius)))return 'garden';
 if(COMMUNITY_PLANTERS.some(p=>inLocalBox(p,x,z,p.width,p.depth,radius)))return 'planter';
 if(COMMUNITY_BENCHES.some(p=>inLocalBox(p,x,z,1.6,.5,radius)))return 'bench';
 if(COMMUNITY_TREES.some(p=>Math.hypot(x-p.x,z-p.z)<.18+radius))return 'tree';
 if(COMMUNITY_LAMPS.some(p=>Math.hypot(x-p.x,z-p.z)<.14+radius))return 'lamp';
 if(Math.hypot(x-GROUP_QUEUE.x,z-GROUP_QUEUE.z)<.42+radius)return 'sign';
 return null;
}
export function distanceToTownPath(x,z,path){let best=Infinity;for(let i=1;i<path.points.length;i++){const [ax,az]=path.points[i-1],[bx,bz]=path.points[i],dx=bx-ax,dz=bz-az,d=dx*dx+dz*dz,t=d?Math.max(0,Math.min(1,((x-ax)*dx+(z-az)*dz)/d)):0;best=Math.min(best,Math.hypot(x-ax-t*dx,z-az-t*dz));}return best;}
