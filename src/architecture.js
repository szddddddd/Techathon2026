import * as THREE from 'three';

// Every object is authored from primitives; all dimensions are world metres.
export function buildArchitecture(scene, { rodin=false, expanded=false }={}) {
  const root = new THREE.Group(); root.name = 'Handcrafted woodland settlement'; scene.add(root);
  const mat = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: .88, flatShading: true, ...extra });
  const wood = mat('#64452f'), edge = mat('#a47b4c'), dark = mat('#3d3228');
  const plaster = mat('#d9c99b'), stone = mat('#84887b'), stoneLight = mat('#a4a38c');
  const tileMats = ['#b65d3b','#c77548','#d28a54','#b96d47','#d79b65'].map(c=>mat(c));
  const blueMats = ['#427579','#4f8c8b','#639c96','#3d6e73'].map(c=>mat(c));
  const gold = mat('#c4a65d',{metalness:.35}), iron = mat('#545d55',{metalness:.55});
  const glow = mat('#ffce75',{emissive:'#ffb54c',emissiveIntensity:1.35});
  const canvas = mat('#b9b386',{side:THREE.DoubleSide});
  let serial = 0;
  function mesh(geo, material, name, p, parent=root) {
    const m = new THREE.Mesh(geo,material); m.name=name || `Settlement detail ${++serial}`;
    if(p)m.position.set(...p); m.castShadow=true; m.receiveShadow=true; parent.add(m); return m;
  }
  function box(name,p,s,m=wood,parent=root){return mesh(new THREE.BoxGeometry(...s),m,name,p,parent);}
  function beam(name,a,b,width=.1,m=wood,parent=root,depth=width){
    const av=new THREE.Vector3(...a), bv=new THREE.Vector3(...b),d=bv.clone().sub(av);
    const o=mesh(new THREE.BoxGeometry(width,d.length(),depth),m,name,av.clone().add(bv).multiplyScalar(.5).toArray(),parent);
    o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());return o;
  }
  function cyl(name,p,r1,r2,h,m=wood,parent=root,n=10){return mesh(new THREE.CylinderGeometry(r1,r2,h,n),m,name,p,parent);}
  function group(name,p,parent=root){let g=new THREE.Group();g.name=name;g.position.set(...p);parent.add(g);return g;}
  function roof(parent, w,d,eave,rise,palette,prefix){
    const half=w/2, angle=Math.atan2(rise,half),len=Math.hypot(half,rise);
    for(const side of [-1,1]){
      const slab=box(`${prefix} roof deck ${side}`,[side*half/2,eave+rise/2,0],[len+.12,.13,d],dark,parent);slab.rotation.z=-side*angle;
      const rows=Math.ceil(len/.36), cols=Math.ceil(d/.37);
      for(let i=0;i<rows;i++) for(let j=0;j<cols;j++){
        const t=(i+.5)/rows,x=side*half*t,y=eave+rise*(1-t)+.085;
        const z=-d/2+(j+.5)*d/cols+(i%2?.07:0);
        const tile=box(`${prefix} fired tile ${side} ${i} ${j}`,[x,y,z],[len/rows+.075,.075,d/cols+.025],palette[(i*3+j*7+(side+1))%palette.length],parent);
        tile.rotation.z=-side*angle;
      }
      beam(`${prefix} carved eave ${side}`,[side*(half+.035),eave,-d/2-.11],[side*(half+.035),eave,d/2+.11],.16,edge,parent);
    }
    beam(`${prefix} ridge cap`,[0,eave+rise+.17,-d/2-.15],[0,eave+rise+.17,d/2+.15],.18,edge,parent);
    for(const z of [-d/2-.08,d/2+.08]){
      beam(`${prefix} gable fascia left`,[-half-.08,eave,z],[0,eave+rise+.1,z],.16,edge,parent);
      beam(`${prefix} gable fascia right`,[0,eave+rise+.1,z],[half+.08,eave,z],.16,edge,parent);
      beam(`${prefix} ridge finial`,[0,eave+rise+.06,z],[0,eave+rise+.43,z+(z>0?.15:-.15)],.11,wood,parent);
    }
  }
  if (!expanded) {
  const home=group('Wayfarer cottage',[-5.4,2.2,-3.9]);
  // A raised, individually coursed stone foundation.
  box('Cottage foundation',[0,.24,0],[4.3,.48,3.5],stone,home);
  for(let row=0;row<2;row++)for(let i=0;i<8;i++)box(`Front foundation block ${row} ${i}`,[-1.86+i*.53+(row%2)*.08,.12+row*.23,1.77],[.48,.20,.13],i%3?stoneLight:stone,home);
  box('Cream plaster cottage walls',[0,1.65,0],[4.05,2.45,3.35],plaster,home);
  for(const z of [-1.69,1.69]){
    const shape=new THREE.Shape();shape.moveTo(-2.025,2.83);shape.lineTo(2.025,2.83);shape.lineTo(0,4.35);shape.closePath();
    mesh(new THREE.ExtrudeGeometry(shape,{depth:.12,bevelEnabled:false}),plaster,'Cream gable wall',[0,0,z],home);
    beam('Gable central king post',[0,2.8,z+.14],[0,4.23,z+.14],.14,wood,home);
    beam('Gable diagonal left',[-1.85,2.83,z+.14],[0,4.25,z+.14],.12,wood,home);
    beam('Gable diagonal right',[1.85,2.83,z+.14],[0,4.25,z+.14],.12,wood,home);
    for(const x of [-2.05,-.52,2.05])box('Cottage vertical timber',[x,1.65,z+.1],[.15,2.5,.17],wood,home);
    for(const y of [.58,1.18,2.82])box('Cottage horizontal timber',[0,y,z+.12],[4.23,.15,.17],wood,home);
  }
  for(const x of [-2.08,2.08]){
    for(const z of [-1.7,0,1.7])box('Side wall post',[x,1.66,z],[.17,2.5,.16],wood,home);
    for(const y of [.58,1.18,2.82])box('Side wall beam',[x,y,0],[.17,.15,3.45],wood,home);
  }
  roof(home,4.75,4.08,2.87,1.62,tileMats,'Terracotta main');
  // A blue-tiled rear wing is deliberately visible from the approach.
  const annex=group('Blue roof rear annex',[1.03,0,-2.18],home);
  box('Annex stone foot',[0,.25,0],[2.8,.5,2.2],stone,annex);
  box('Annex plaster',[0,1.5,0],[2.65,2.2,2.1],plaster,annex);
  for(const x of [-1.36,1.36])for(const z of [-1.05,1.05])box('Annex corner beam',[x,1.52,z],[.15,2.28,.15],wood,annex);
  roof(annex,3.13,2.65,2.6,1.17,blueMats,'Teal rear');
  box('Chimney shaft',[-1.12,4.02,-1.1],[.52,1.45,.56],stoneLight,home);
  box('Chimney cap',[-1.12,4.77,-1.1],[.7,.17,.74],stone,home);
  box('Chimney dark opening',[-1.12,4.87,-1.1],[.38,.015,.42],dark,home);
  for(let j=0;j<5;j++)box('Chimney stone seam',[-1.12,3.5+j*.25,-.806],[.53,.025,.015],stone,home);
  function window(p,parent,side=false){
    const g=group('Warm leaded cottage window',p,parent);if(side)g.rotation.y=Math.PI/2;
    box('Window dark inset',[0,0,0],[1.08,1.2,.12],dark,g);
    box('Window honey glass',[0,0,.075],[.89,1.01,.045],glow,g);
    for(const x of [-.49,0,.49])box('Window mullion',[x,0,.13],[.075,1.17,.07],wood,g);
    for(const y of [-.55,0,.55])box('Window cross rail',[0,y,.13],[1.08,.07,.07],wood,g);
    box('Window sill',[0,-.64,.17],[1.27,.13,.36],edge,g);
    for(const side of [-1,1]){
      box('Open shutter',[side*.76,0,.02],[.39,1.13,.08],edge,g);
      for(let i=0;i<3;i++)box('Shutter board seam',[side*.76-.13+i*.13,0,.075],[.025,1.06,.02],wood,g);
      for(const y of [-.38,.38])box('Shutter brace',[side*.76,y,.09],[.42,.065,.03],wood,g);
    }
  }
  window([-1.25,1.98,1.87],home);window([2.19,1.98,-.65],home,true);
  box('Door recess',[.89,1.46,1.85],[1.2,1.9,.16],dark,home);
  for(let i=0;i<6;i++)box(`Oak door plank ${i}`,[.40+i*.19,1.43,1.96],[.176,1.74,.10],i%2?edge:wood,home);
  for(const y of [.82,1.98])box('Door iron crossbar',[.88,y,2.03],[1.03,.07,.055],iron,home);
  mesh(new THREE.TorusGeometry(.075,.021,5,12),gold,'Door brass ring',[1.19,1.39,2.09],home);
  box('Door carved lintel',[.88,2.46,1.96],[1.45,.16,.29],edge,home);
  // Timber porch beneath the left window, and generous stone entry stairs.
  for(let i=0;i<8;i++)box('Porch floorboard',[-1.35+i*.24,.54,2.2],[.225,.12,.92],edge,home);
  for(const x of [-2.1,-.35]){
    box('Porch upright',[x,1.7,2.63],[.14,2.35,.14],wood,home);
    beam('Porch corner brace',[x,2.32,2.63],[x+(x< -1?.4:-.4),2.68,2.63],.09,edge,home);
  }
  box('Porch railing',[-1.24,1.18,2.63],[1.86,.12,.12],edge,home);
  for(let i=0;i<6;i++)box('Porch rail spindle',[-2+i*.31,.87,2.63],[.065,.56,.065],wood,home);
  const awning=box('Small porch canopy',[-1.22,2.77,2.22],[2.12,.14,1.2],wood,home);awning.rotation.x=.13;
  for(let j=0;j<6;j++)box('Porch canopy slat',[-2.08+j*.35,2.87,2.22],[.31,.08,1.2],tileMats[j%5],home).rotation.x=.13;
  for(let i=0;i<4;i++)box('Entry stair '+i,[.95,.08+i*.12,3.05-i*.28],[1.58,.15+i*.24,.4],i%2?stone:stoneLight,home);
  const lantern=group('Entry hanging lantern',[1.75,2.2,2.05],home);
  box('Lantern wall bracket',[0,.29,-.09],[.06,.07,.36],iron,lantern);
  box('Lantern glowing core',[0,0,.1],[.18,.25,.18],glow,lantern);
  for(const x of [-.12,.12])for(const z of [-.02,.22])box('Lantern metal corner',[x,0,z],[.025,.31,.025],iron,lantern);
  box('Lantern top',[0,.18,.1],[.31,.07,.31],iron,lantern);box('Lantern bottom',[0,-.18,.1],[.29,.06,.29],iron,lantern);
  }
  function barrel(p,scale=1,parent=root){
    const b=group('Coopered oak barrel',p,parent);b.scale.setScalar(scale);
    cyl('Barrel stave body',[0,.43,0],.34,.34,.82,edge,b,12);
    for(let i=0;i<12;i++){const a=i*Math.PI/6;beam('Barrel stave dark joint',[Math.cos(a)*.343,.06,Math.sin(a)*.343],[Math.cos(a)*.343,.8,Math.sin(a)*.343],.017,wood,b);}
    for(const y of [.14,.7])cyl('Barrel iron hoop',[0,y,0],.36,.36,.055,iron,b,12);
    cyl('Barrel wooden lid',[0,.86,0],.32,.32,.04,wood,b,12);
    for(let i=-2;i<=2;i++)box('Barrel lid seam',[i*.11,.885,0],[.014,.01,.49],dark,b);
    return b;
  }
  function crate(p,size=.7,parent=root){
    const c=group('Braced supply crate',p,parent);
    box('Crate boards',[0,size/2,0],[size,size,size],edge,c);
    for(const z of [-size/2-.02,size/2+.02]){
      for(let i=0;i<5;i++)box('Crate plank joint',[-size/2+(i+.5)*size/5,size/2,z],[.018,size,.018],wood,c);
      for(const x of [-size/2+.05,size/2-.05])box('Crate corner batten',[x,size/2,z],[.09,size,.06],wood,c);
      for(const y of [.06,size-.06])box('Crate horizontal batten',[0,y,z],[size,.09,.06],wood,c);
      beam('Crate diagonal brace',[-size*.39,.13,z+.04],[size*.39,size-.13,z+.04],.085,wood,c,.04);
    } return c;
  }
  if (!expanded) { barrel([-3.14,2.2,-1.59],.85);barrel([-3.7,2.2,-1.17],.7); }
  if (!rodin) {
  const cart=group('Merchant wooden handcart',[-7,2.2,-.4]);cart.rotation.y=-.18;
  for(let i=0;i<6;i++)box('Cart bed plank',[-.66+i*.26,.64,0],[.24,.12,1.85],edge,cart);
  for(const x of [-.83,.83]){
    for(let i=0;i<3;i++)box('Cart sideboard',[x,.85+i*.19,0],[.09,.16,1.93],edge,cart);
    for(const z of [-.85,.85])box('Cart side stake',[x,1.04,z],[.13,.9,.13],wood,cart);
    beam('Cart forward shaft',[x,.66,.6],[x,.34,2.22],.105,wood,cart);
  }
  for(const z of [-.93,.93])for(let i=0;i<3;i++)box('Cart end board',[0,.85+i*.19,z],[1.65,.16,.10],edge,cart);
  beam('Cart wheel axle',[-1.13,.52,0],[1.13,.52,0],.14,iron,cart);
  for(const x of [-1.02,1.02]){
    const wheel=group('Spoked wooden cart wheel',[x,.55,0],cart);
    const rim=mesh(new THREE.TorusGeometry(.51,.075,6,16),wood,'Wooden wheel rim',[0,0,0],wheel);rim.rotation.y=Math.PI/2;
    const tire=mesh(new THREE.TorusGeometry(.55,.025,4,16),iron,'Wheel iron tire',[0,0,0],wheel);tire.rotation.y=Math.PI/2;
    const hub=cyl('Wheel wooden hub',[0,0,0],.12,.12,.24,edge,wheel,10);hub.rotation.z=Math.PI/2;
    for(let i=0;i<10;i++){const a=i*Math.PI/5;beam('Wheel radial spoke',[0,0,0],[0,Math.cos(a)*.49,Math.sin(a)*.49],.045,edge,wheel);}
  }
  crate([-.35,.71,-.43],.65,cart);crate([.4,.71,-.42],.55,cart);
  for(const x of [-.35,.3]){
    const sack=mesh(new THREE.IcosahedronGeometry(.37,2),mat('#c8bc88'),'Linen grain sack',[x,1.04,.4],cart);sack.scale.set(.8,1.2,.8);
    cyl('Tied sack neck',[x,1.49,.4],.065,.12,.12,wood,cart,7);
  }
  }
  // The camp is built as a double-sided pitched canvas, poles and guy ropes.
  if (!expanded) {
  const tent=group('Ranger canvas tent',[-2.25,2.2,-2.7]);tent.rotation.y=.28;
  const tg=new THREE.BufferGeometry();tg.setAttribute('position',new THREE.Float32BufferAttribute([
    -1,0,-.85, 0,1.75,-.85, -1,0,.85, 0,1.75,-.85,0,1.75,.85,-1,0,.85,
    1,0,-.85,1,0,.85,0,1.75,-.85,0,1.75,-.85,1,0,.85,0,1.75,.85,
    -1,0,-.85,1,0,-.85,0,1.75,-.85,
  ],3));tg.computeVertexNormals();mesh(tg,canvas,'Stitched olive canvas',null,tent);
  for(const z of [-.88,.88]){
    beam('Tent pole left',[-1.03,0,z],[.11,1.96,z],.055,wood,tent);
    beam('Tent pole right',[1.03,0,z],[-.11,1.96,z],.055,wood,tent);
    for(const x of [-1.4,1.4]){
      beam('Tent rope',[0,1.68,z],[x,.07,z+(z>0?.55:-.55)],.014,edge,tent);
      beam('Tent peg',[x,0,z+(z>0?.55:-.55)],[x,.23,z+(z>0?.55:-.55)],.035,wood,tent);
    }
  }
  beam('Tent ridge pole',[0,1.77,-1.0],[0,1.77,1.03],.07,wood,tent);
  // Open front flaps preserve a readable dark entrance.
  const flap=new THREE.BufferGeometry();flap.setAttribute('position',new THREE.Float32BufferAttribute([-1,0,.86,-.25,0,.86,0,1.75,.86, 1,0,.86,0,1.75,.86,.52,0,.86],3));flap.computeVertexNormals();mesh(flap,canvas,'Open folded tent doorway',null,tent);
  box('Tent bedroll',[0,.1,.1],[.55,.16,1.15],mat('#758c7c'),tent);
  crate([-1.05,2.2,-2.25],.65);crate([-3.4,2.2,-3.05],.55);
  }
  const campfire=group('Stone ring campfire',expanded ? [-8.5,2.2,1.5] : [-2.5,2.2,0]);
  for(let i=0;i<9;i++){
    const a=i*Math.PI*2/9;const rock=mesh(new THREE.DodecahedronGeometry(.2,0),i%2?stone:stoneLight,'Fire ring stone',[Math.cos(a)*.56,.12,Math.sin(a)*.56],campfire);rock.scale.set(1.15,.68,.9);rock.rotation.y=i;
  }
  for(let i=0;i<4;i++){
    const log=cyl('Firewood log',[0,.14+i*.03,0],.09,.11,.9,i%2?wood:dark,campfire,7);log.rotation.z=Math.PI/2;log.rotation.y=i*Math.PI/4;
  }
  const ember=mat('#ff671f',{emissive:'#ff4913',emissiveIntensity:2});
  const fireMats=[mat('#ff992b',{emissive:'#ff7417',emissiveIntensity:2.4}),mat('#ffcc48',{emissive:'#ffb52b',emissiveIntensity:2.7}),mat('#fff19b',{emissive:'#ffda4f',emissiveIntensity:3})];
  mesh(new THREE.SphereGeometry(.25,9,5),ember,'Glowing coal bed',[0,.18,0],campfire).scale.y=.25;
  const flames=[];
  for(let i=0;i<7;i++){
    const a=i*2.4,r=i? .19:0;const f=mesh(new THREE.ConeGeometry(i?.13:.21,i?.43:.73,5),fireMats[i%3],'Animated golden flame '+i,[Math.cos(a)*r,.36+(i?0:.13),Math.sin(a)*r],campfire);
    f.rotation.z=Math.sin(i)*.18;f.userData.baseY=f.position.y;f.userData.phase=i*1.71;f.castShadow=false;flames.push(f);
  }
  const fireLight=new THREE.PointLight('#ff9c43',11,7,2);fireLight.position.set(0,.85,0);campfire.add(fireLight);
  const doorLight=new THREE.PointLight('#ffd38c',4,5,2);doorLight.position.set(...(expanded ? [-8,4.0,-1.7] : [-3.7,4.2,-1.7]));root.add(doorLight);
  for(const p of (expanded ? [[-9.65,2.2,1.5],[-8.7,2.2,2.7]] : [[-3.55,2.2,.65],[-1.37,2.2,.63]])){
    const st=group('Camp tree stump stool',p);cyl('Stump bark',[0,.24,0],.30,.38,.48,wood,st,9);cyl('Stump cut wood',[0,.49,0],.29,.29,.035,edge,st,12);
    for(const r of [.1,.2]){const ring=mesh(new THREE.TorusGeometry(r,.008,3,16),wood,'Tree stump growth ring',[0,.514,0],st);ring.rotation.x=Math.PI/2;}
  }
  if (!expanded) {
  const chest=group('Forgotten brass-bound treasure chest',[7,2.2,-1]);chest.rotation.y=-.35;
  box('Chest bottom',[0,.29,0],[1.12,.58,.77],wood,chest);
  for(let i=0;i<5;i++)box('Chest face oak plank',[0,.07+i*.11,.397],[1.09,.095,.035],edge,chest);
  const vertices=[],indices=[];const n=10;
  for(const x of [-.57,.57])for(let i=0;i<=n;i++){const a=i*Math.PI/n;vertices.push(x,.57+Math.sin(a)*.38,Math.cos(a)*.39);}
  for(let i=0;i<n;i++)indices.push(i,n+1+i,i+1, i+1,n+1+i,n+2+i);
  // Solid semicircular end boards close both sides of the barrel lid.
  const leftCenter=vertices.length/3;vertices.push(-.57,.57,0);
  const rightCenter=vertices.length/3;vertices.push(.57,.57,0);
  for(let i=0;i<n;i++)indices.push(leftCenter,i+1,i, rightCenter,n+1+i,n+2+i);
  const lidGeo=new THREE.BufferGeometry();lidGeo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));lidGeo.setIndex(indices);lidGeo.computeVertexNormals();
  mesh(lidGeo,mat('#997347',{side:THREE.DoubleSide}),'Chest curved wooden lid',null,chest);
  for(const x of [-.45,.45]){
    for(let i=0;i<n;i++){const a=i*Math.PI/n,b=(i+1)*Math.PI/n;beam('Chest lid brass strap',[x,.58+Math.sin(a)*.39,Math.cos(a)*.40],[x,.58+Math.sin(b)*.39,Math.cos(b)*.40],.055,gold,chest);}
    for(const z of [-.41,.41])box('Chest vertical brass binding',[x,.29,z],[.065,.59,.035],gold,chest);
  }
  for(const y of [.06,.56])for(const z of [-.41,.41])box('Chest brass rim',[0,y,z],[1.15,.045,.035],gold,chest);
  box('Chest lock plate',[0,.47,.433],[.17,.23,.05],gold,chest);box('Chest keyhole',[0,.47,.465],[.035,.07,.012],dark,chest);
  for(const x of [-.6,.6]){const h=mesh(new THREE.TorusGeometry(.11,.02,5,12),gold,'Chest carrying ring',[x,.33,0],chest);h.rotation.y=Math.PI/2;}
  }
  return { campfire, flames, lights:[fireLight,doorLight], root };
}
