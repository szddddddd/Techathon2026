export const GROUP_COLUMNS=3,GROUP_ROWS=3;
export const COMMUNITY_SHIFT={x:3.4,z:.5};
export const communityPoint=(x,z)=>({x:x+COMMUNITY_SHIFT.x,z:z+COMMUNITY_SHIFT.z});
export const GROUP_SLOTS=Array.from({length:GROUP_COLUMNS*GROUP_ROWS},(_,i)=>communityPoint(-23.8+(i%GROUP_COLUMNS)*6,-12.6+Math.floor(i/GROUP_COLUMNS)*5.1));
export const GROUP_CAPACITY=GROUP_SLOTS.length;
export const COMMUNITY_BOUNDS={minX:-26.7+COMMUNITY_SHIFT.x,maxX:-7.75+COMMUNITY_SHIFT.x,minZ:-14.9+COMMUNITY_SHIFT.z,maxZ:-.1+COMMUNITY_SHIFT.z};
export const COMMUNITY_RIVER_WALK_X=-8.55+COMMUNITY_SHIFT.x;
export const GROUP_QUEUE=communityPoint(-27.5,-7.5);
export const COMMUNITY_STREETS={x:[-20.8,-14.8].map(x=>x+COMMUNITY_SHIFT.x),z:[-10.05,-4.95].map(z=>z+COMMUNITY_SHIFT.z)};
export const inCommunity=(x,z,pad=0)=>x>=COMMUNITY_BOUNDS.minX-pad&&x<=COMMUNITY_BOUNDS.maxX+pad&&z>=COMMUNITY_BOUNDS.minZ-pad&&z<=COMMUNITY_BOUNDS.maxZ+pad;
export function communityBlend(x,z){const b=COMMUNITY_BOUNDS,d=Math.max(0,b.minX-x,x-b.maxX,b.minZ-z,z-b.maxZ),t=Math.min(1,d);return 1-t*t*(3-2*t);}
export const groupPlotAt=(x,z,radius=0)=>GROUP_SLOTS.findIndex(p=>Math.abs(x-p.x)<2.3+radius&&Math.abs(z-p.z)<1.86+radius);
