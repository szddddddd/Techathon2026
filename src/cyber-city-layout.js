// Ground footprints and upper volumes are separate: bridges never block the street below.
const tower=(id,x,z,width,depth,height,type=id)=>({id,type,x,z,width,depth,height,rotation:0});
export const CITY_TOWERS=[tower('spire_a',-3,-4,6,5,62),tower('spire_b',5,0,5,4.5,54),tower('spire_c',-7,3,5,4,46),
 tower('rear-office',-19,-19,3.4,3.4,22,'mid_office'),tower('rear-housing',-10,-20,3.6,3.4,28,'mid_housing'),tower('rear-data',1,-20,3.8,3.6,32,'mid_data'),tower('rear-commerce',11,-20,3.6,3.2,26,'mid_commerce'),tower('rear-east',21,-19,3.4,3.4,22,'mid_office'),
 tower('west-mid',-11,-4,3,3,18,'mid_housing'),tower('east-mid',11,-4,3.2,3.2,20,'mid_data'),tower('east-front',11,5,3,3,14,'mid_commerce')];
export const CITY_PODIUMS=[
 tower('retail-a',-3,-1,4.7,1.4,3.4,'podium_market'),tower('retail-b',5,2.5,4.4,1.3,3.2,'podium_arcade'),tower('retail-c',-7,5.2,4.3,1.3,3.5,'podium_market'),
 tower('retail-d',-3,-5.8,4.5,1.2,3,'podium_arcade'),tower('retail-e',5,-3,4.4,1.2,3.4,'podium_market'),tower('retail-f',-7,1.5,4.3,1.2,3,'podium_arcade')];
export const CITY_BRIDGES=[{from:'spire_a',to:'spire_b',height:26,width:1.1},{from:'spire_a',to:'spire_c',height:18,width:1.1},{from:'spire_b',to:'east-front',height:12,width:1},{from:'spire_a',to:'spire_c',height:32,width:1}];
export const CITY_ASSETS={spire_a:[6,62,5],spire_b:[5,54,4.5],spire_c:[5,46,4],mid_office:[3.4,22,3.4],mid_housing:[3.6,28,3.4],mid_data:[3.8,32,3.6],mid_commerce:[3.6,26,3.2],podium_market:[4.7,3.5,1.4],podium_arcade:[4.5,3.4,1.3],hover_taxi:[2.8,1.05,1.3],hover_car:[3.1,.95,1.4],cargo_ship:[4.8,1.8,2.3]};
// Compact skyline: lower floor count and a broader base, shared by rendering and collision.
export const CITY_HEIGHT_SCALE=.65;
export const CITY_WIDTH_SCALE=1.10;
for(const p of CITY_TOWERS){p.width*=CITY_WIDTH_SCALE;p.depth*=CITY_WIDTH_SCALE;p.height=Number((p.height*CITY_HEIGHT_SCALE).toFixed(2));}
for(const b of CITY_BRIDGES)b.height*=CITY_HEIGHT_SCALE;
for(const [key,size]of Object.entries(CITY_ASSETS))if(/^(spire_|mid_)/.test(key)){size[0]*=CITY_WIDTH_SCALE;size[2]*=CITY_WIDTH_SCALE;size[1]*=CITY_HEIGHT_SCALE;}
export function cityVolumes(ground=2.22){const boxes=[...CITY_TOWERS,...CITY_PODIUMS].map(p=>({id:p.id,min:[p.x-p.width/2,ground,p.z-p.depth/2],max:[p.x+p.width/2,ground+p.height,p.z+p.depth/2]}));for(const b of CITY_BRIDGES){const a=CITY_TOWERS.find(t=>t.id===b.from),c=CITY_TOWERS.find(t=>t.id===b.to);boxes.push({id:b.from+'-'+b.to+'-'+b.height,min:[Math.min(a.x,c.x)-b.width/2,ground+b.height-.3,Math.min(a.z,c.z)-b.width/2],max:[Math.max(a.x,c.x)+b.width/2,ground+b.height+1,Math.max(a.z,c.z)+b.width/2]});}return boxes;}

