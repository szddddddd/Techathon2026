import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

const mat=(color,extra={})=>new T.MeshStandardMaterial({color,roughness:.85,flatShading:true,...extra});
const M={wood:mat(0x816044),dark:mat(0x4c453e),wall:mat(0xf0dfb8),paper:mat(0xf7ebcf),roof:mat(0x5d7478),edge:mat(0x7d9290),stone:mat(0xb6b5a0),red:mat(0xba5747),sage:mat(0x9cae84),blue:mat(0x8bb8bb),pink:mat(0xd6a8a0),glass:mat(0x93bcc0,{metalness:.1}),brass:mat(0xc8aa69),light:mat(0xffdea0,{emissive:0xffc97e,emissiveIntensity:.22})};
function mesh(p,n,g,m,x=0,y=0,z=0){const o=new T.Mesh(g,m);o.name=n;o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;p.add(o);return o;}
const box=(p,n,x,y,z,w,h,d,m=M.wood)=>mesh(p,n,new T.BoxGeometry(w,h,d),m,x,y,z);
function gable(p,x,y,z,w,d,rise=.7,roof=M.roof){
  const half=w/2,verts=[-half,0,-d/2,half,0,-d/2,0,rise,-d/2,-half,0,d/2,0,rise,d/2,half,0,d/2];
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(verts,3));g.setIndex([0,2,1,3,5,4,0,3,4,0,4,2,2,4,5,2,5,1,0,1,5,0,5,3]);g.computeVertexNormals();mesh(p,'Kawara tiled gable',g,roof,x,y,z);
  box(p,'Ceramic ridge',x,y+rise+.045,z,.16,.13,d+.15,M.edge);
  for(const side of [-1,1]){
    const angle=side*Math.atan2(rise,half),len=Math.hypot(half,rise);
    for(let j=0;j<=Math.floor(d/.3);j++){const tile=box(p,'Tile rib',x+side*half/2,y+rise/2+.04,z-d/2+j*d/Math.floor(d/.3),len,.045,.07,M.edge);tile.rotation.z=-angle;}
    box(p,'Upturned eave',x+side*half,y+.015,z,.1,.16,d+.09,M.dark);
  }
}
function window(p,x,y,z,w=.65,h=.8){box(p,'Shoji window frame',x,y,z,w+.1,h+.1,.09,M.wood);box(p,'Shoji paper',x,y,z+.055,w,h,.025,M.paper);for(const dx of [-w/4,0,w/4])box(p,'Shoji mullion',x+dx,y,z+.075,.027,h,.025);box(p,'Shoji cross rail',x,y,z+.08,w,.032,.03);}
function entrance(p,{x=0,z=1.35,y=.21,color=M.sage}={}){
  box(p,'Timber entrance step',x,y,z+.13,1.25,.2,.48,M.stone);window(p,x,y+.91,z,.88,1.55);
  for(const dx of [-.31,0,.31])box(p,'Noren split curtain',x+dx,y+1.35,z+.17,.285,.47,.05,color);
  box(p,'Noren pole',x,y+1.61,z+.18,1.12,.055,.055,M.dark);
}
function lantern(p,x,y,z){mesh(p,'Paper lantern',new T.SphereGeometry(.16,8,5),M.light,x,y,z).scale.y=1.4;for(const dy of [-.19,.19])box(p,'Lantern cap',x,y+dy,z,.19,.04,.19,M.red);}
function timber(p,w,d,h){
  box(p,'Raised stone foundation',0,.12,0,w+.2,.24,d+.2,M.stone);box(p,'Warm plaster walls',0,.24+h/2,0,w,h,d,M.wall);
  for(const x of [-w/2,w/2])for(const z of [-d/2,d/2])box(p,'Timber corner post',x,.24+h/2,z,.12,h+.08,.12);
  for(const y of [.3,.24+h])box(p,'Front timber rail',0,y,d/2+.025,w,.12,.1);
  for(const side of [-1,1]){
    const wall=new T.Group();wall.position.set(side*(w/2+.025),0,0);wall.rotation.y=side*Math.PI/2;p.add(wall);
    for(const z of[-d*.24,d*.24])window(wall,z,.35+h*.49,0,Math.min(.72,d*.26),h*.53);
    box(wall,'Side timber sill',0,.39,0,d,.11,.1,M.wood);box(wall,'Side eave beam',0,.24+h,0,d,.12,.12,M.wood);
    for(let i=0;i<7;i++)box(wall,'Side timber wainscot',-d*.43+i*d*.143,.53,0,.055,.32,.08,M.wood);
  }
}
function seal(p,type,x,y,z){
  const color={club:M.red,classroom:M.sage,sport:M.blue,lab:M.blue,library:M.sage,music:M.pink,art:M.red,cafe:M.brass,observatory:M.blue}[type];
  mesh(p,'Community crest',new T.CylinderGeometry(.22,.22,.06,12),color,x,y,z).rotation.x=Math.PI/2;
  if(type==='library'){for(const s of [-1,1]){const b=box(p,'Open book crest',x+s*.075,y,z+.045,.14,.15,.025,M.paper);b.rotation.z=-s*.16;}}
  else if(type==='music'){box(p,'Music note stem',x+.06,y+.02,z+.05,.028,.22,.025,M.paper);mesh(p,'Music note',new T.SphereGeometry(.065,8,4),M.paper,x,y-.08,z+.06).scale.set(1,.7,.25);}
  else if(type==='lab'){box(p,'Flask neck',x,y+.06,z+.05,.055,.14,.03,M.paper);mesh(p,'Flask vessel',new T.ConeGeometry(.10,.13,3),M.paper,x,y-.05,z+.05).rotation.z=Math.PI;}
  else{box(p,'Crest mark',x,y,z+.05,.13,.035,.025,M.paper);box(p,'Crest mark',x,y,z+.05,.035,.13,.025,M.paper);}
}

/** Authored, reusable Japanese miniatures. Front is +Z; all props remain inside each plot. */
export function createJapaneseBuilding(type='club'){
  const p=new T.Group();p.name='Japanese '+type;p.userData.japaneseBuilding=true;
  if(type==='sport'){
    timber(p,3.45,2.8,1.8);gable(p,0,2.05,0,3.9,3.25,.85);entrance(p,{z:1.42,color:M.blue});
    for(const x of [-1.24,1.24])window(p,x,1.15,1.43,.65,1.05);seal(p,type,0,2.36,1.645);
    for(const x of [-1.6,1.6])box(p,'Dojo roof bracket',x,1.92,1.45,.16,.3,.4);
  }else if(type==='observatory'){
    mesh(p,'Observatory foundation',new T.CylinderGeometry(1.37,1.4,.25,16),M.stone,0,.125,-.2);
    const drum=mesh(p,'Observatory pale drum',new T.CylinderGeometry(1.28,1.35,1.8,16),M.wall,0,1.15,-.2);
    mesh(p,'Copper blue dome',new T.SphereGeometry(1.38,16,8,0,Math.PI*2,0,Math.PI/2),M.blue,0,2.05,-.2);
    box(p,'Dome meridian',0,2.75,-.12,.1,.14,2.1,M.brass);
    box(p,'Entrance annex',0,.85,1.05,1.65,1.3,.9,M.wall);gable(p,0,1.54,1.1,1.95,1.1,.38);entrance(p,{z:1.53,color:M.blue});
    for(const x of [-.95,.95])window(p,x,1.16,.75,.42,.7);seal(p,type,.9,1.85,.85);
  }else if(type==='lab'){
    timber(p,3.15,2.6,1.85);box(p,'Laboratory clerestory',-.5,2.27,-.3,1.7,.55,1.7,M.glass);gable(p,-.5,2.52,-.3,2,1.95,.44);
    gable(p,.95,2.08,.1,1.65,2.95,.38);entrance(p,{x:.65,z:1.33,color:M.blue});window(p,-.91,1.15,1.34,.85,1.1);seal(p,type,-.8,2.43,.71);
    box(p,'Air vent stack',1.05,2.77,-.7,.28,.5,.28,M.stone);box(p,'Vent cap',1.05,3.05,-.7,.45,.09,.45,M.dark);
  }else if(type==='music'){
    timber(p,3.15,2.6,1.65);gable(p,0,1.94,0,3.8,3.1,.86,M.roof);entrance(p,{z:1.34,color:M.pink});
    for(const x of [-1.05,1.05]){window(p,x,1.02,1.34,.6,1);lantern(p,x,1.81,1.55);}seal(p,type,0,2.33,1.57);
    for(const x of [-1.5,1.5])box(p,'Music hall porch column',x,1.02,1.45,.13,1.85,.13,M.red);
  }else if(type==='art'){
    timber(p,3.2,2.6,1.75);gable(p,-.8,2.0,0,1.95,3.05,.72);gable(p,.85,2.0,.05,1.85,2.95,.47,M.sage);
    window(p,-.83,1.2,1.34,1.04,1.2);entrance(p,{x:.83,z:1.34,color:M.red});
    for(let i=0;i<3;i++)box(p,'Atelier upper glazing',-.8,2.39,-.7+i*.65,.55,.08,.37,M.glass);
    box(p,'Gallery signboard',-.85,.57,1.59,.56,.7,.1,M.wood);box(p,'Gallery painting',-.85,.59,1.66,.4,.49,.025,M.pink);
  }else if(type==='library'){
    timber(p,3.05,2.55,2.15);gable(p,0,2.4,0,3.65,3.05,.68);gable(p,0,1.85,1.26,1.55,.92,.42);entrance(p,{z:1.31,color:M.sage});
    for(const x of [-1.05,1.05]){window(p,x,1.28,1.31,.58,1.27);for(let i=0;i<5;i++)box(p,'Window books',x-.2+i*.09,.9,1.38,.055,.2+(i%2)*.08,.04,i%2?M.red:M.sage);}
    seal(p,type,0,2.66,1.54);
  }else if(type==='classroom'){
    timber(p,3.35,2.6,1.8);gable(p,0,2.06,0,3.85,3.1,.65);entrance(p,{x:1.05,z:1.34,color:M.sage});
    for(const x of [-1.13,-.28])window(p,x,1.28,1.34,.68,1.03);mesh(p,'School clock',new T.CylinderGeometry(.22,.22,.06,16),M.paper,0,2.38,1.57).rotation.x=Math.PI/2;
    box(p,'Clock hour hand',0,2.42,1.62,.035,.13,.025,M.dark);box(p,'Clock minute hand',.055,2.38,1.62,.13,.025,.025,M.dark);
  }else if(type==='cafe'){
    timber(p,2.95,2.55,1.75);gable(p,0,2.0,-.15,3.55,2.9,.72);entrance(p,{x:.74,z:1.31,color:M.red});window(p,-.7,1.11,1.31,1.05,1.15);
    const awning=box(p,'Tea shop striped awning',0,1.81,1.39,3.15,.12,.62,M.paper);awning.rotation.x=.14;
    for(let i=0;i<7;i++){const s=box(p,'Awning sage stripe',-1.35+i*.45,1.88,1.4,.22,.025,.62,M.sage);s.rotation.x=.14;}
    lantern(p,-1.25,1.4,1.61);box(p,'Tea house menu',-.9,.55,1.57,.43,.68,.1,M.dark);for(let i=0;i<3;i++)box(p,'Menu writing',-.9,.7-i*.13,1.63,.26,.025,.015,M.paper);
  }else{
    timber(p,3.1,2.6,1.7);gable(p,-.3,1.98,-.12,3.35,2.95,.86);gable(p,1.0,1.72,.55,1.6,1.5,.5);entrance(p,{x:-.2,z:1.34,color:M.red});
    window(p,-1.13,1.08,1.34,.47,.85);window(p,1.05,.98,1.34,.55,.75);lantern(p,-.86,1.58,1.53);seal(p,type,-.3,2.31,1.38);
  }
  // Material batches keep nine live buildings inexpensive while retaining one selectable root.
  p.updateMatrixWorld(true);const buckets=new Map();p.traverse(o=>{if(o.isMesh){if(!buckets.has(o.material))buckets.set(o.material,[]);buckets.get(o.material).push(o);}});
  for(const [material,meshes] of buckets){const geometries=meshes.map(o=>{let g=o.geometry.clone().applyMatrix4(o.matrixWorld);if(g.index){const flat=g.toNonIndexed();g.dispose();g=flat;}return g;});const combined=mergeGeometries(geometries);for(const o of meshes){o.removeFromParent();o.geometry.dispose();}geometries.forEach(g=>g.dispose());if(combined)mesh(p,'Japanese architectural detail',combined,material);}
  p.traverse(o=>{o.userData.generatedProp=true;});return p;
}
