import {createMountainGeometry} from './mountain-profile.js';
import {styleMountainTerraces} from './mountain-terraces.js';
import {TERRACE_EXTENSION,terraceHeight} from './terrace-profile.js';
import * as THREE from 'three';
import {bankOutlines,landAreaAudit,querySurface,surfaceHeight,WORLD_BOUNDS} from '../shared/world-surface.js';
import {createRiver} from './river.js';
import {riverCenter,riverHalfWidth} from './river-profile.js';
import {createFloatingIsland} from './floating-island.js';
import {createVerticalSurfaceSampler} from '../shared/vertical-surface.js';
export {riverCenter,riverHalfWidth} from './river-profile.js';

const mat=(color,extra={})=>new THREE.MeshStandardMaterial({color,roughness:.92,flatShading:true,...extra});
const rockMats=[0x596d63,0x687b6e,0x7c8a77,0x8d9980,0x52665e].map(c=>mat(c));
const grassMats=[0x839c46,0x9aad56,0x718e47,0xb0bb66,0x92a952].map(c=>mat(c));
let seed=194;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
function mesh(parent,name,geo,material,x=0,y=0,z=0){const o=new THREE.Mesh(geo,material);o.name=name;o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
const BANK_SHIFT=1.5;

export function buildTerrain(scene,{rodinBridge=false,riverAssets=null,valleyAssets=null,reduced=false}={}){
  seed=194;
  const root=new THREE.Group();root.name='Terrain · sculpted river canyon';scene.add(root);
  const visualHeight=(x,z)=>surfaceHeight(x,z,{mountain:false}),mountains=[];
  const outlines=bankOutlines();
  root.add(createFloatingIsland(visualHeight));
  const leftOutline=outlines.west.map(([x,z])=>[x+BANK_SHIFT,z]),rightOutline=outlines.east.map(([x,z])=>[x-BANK_SHIFT,z]);
  const area=landAreaAudit();
  const landArea={west:area.west,east:area.east,total:area.after,previousTotal:area.before,ratio:area.ratio,increasePercent:(area.ratio-1)*100};root.userData.landArea=landArea;
  root.userData.bankSeparation={westTranslation:-BANK_SHIFT,eastTranslation:BANK_SHIFT,addedChannelWidth:BANK_SHIFT*2,widthAtBridge:riverHalfWidth(1.5)*2,minimumWidth:9.32*.7,maximumWidth:10.28*.7};
  // Full disk containment keeps even rotated/scaled paint patches over solid ground.
  function containsDisk(points,x,z,radius){
    let inside=false;
    for(let i=0,j=points.length-1;i<points.length;j=i++){
      const a=points[j],b=points[i];
      if((a[1]>z)!==(b[1]>z)&&x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0])inside=!inside;
      const dx=b[0]-a[0],dz=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz)));
      if(Math.hypot(x-a[0]-t*dx,z-a[1]-t*dz)<radius)return false;
    }
    return inside;
  }
  function bank(points,name){
    const bankRoot=new THREE.Group();bankRoot.name=name+' translated bank';bankRoot.position.x=name==='West'?-BANK_SHIFT:BANK_SHIFT;root.add(bankRoot);
    const shape=new THREE.Shape(points.map(([x,z])=>new THREE.Vector2(x,-z)));
    const source=new THREE.ShapeGeometry(shape),vertices=[],colors=[];
    const pos=source.attributes.position,idx=source.index;
    const shift=bankRoot.position.x;
    // Paint meadow variation into the ground itself: no floating, coplanar grass disks.
    const patches=[];
    for(let i=0;i<70;i++){
      const x=(name==='West'?-11:3.4)+rnd()*7.4,z=-10.5+rnd()*21;
      if(name==='West'&&x>riverCenter(z)-2.3||name==='East'&&x<riverCenter(z)+2.4||Math.abs(z)>9.2||Math.abs(x)>9.8)continue;
      const radius=.3+rnd()*.9,color=grassMats[Math.floor(rnd()*5)].color.clone();rnd();const angle=rnd()*6,stretch=.5+rnd()*.6;
      if(containsDisk(points,x,z,radius*Math.max(1,stretch)))patches.push({x,z,radius,color,angle,stretch});
    }
    function triangle(a,b,c){
      const edges=[[a,b,c],[b,c,a],[c,a,b]].sort((u,v)=>v[0].distanceToSquared(v[1])-u[0].distanceToSquared(u[1]));
      const [u,v,w]=edges[0];
      if(u.distanceToSquared(v)>.55*.55){const m=u.clone().lerp(v,.5);triangle(u,m,w);triangle(m,v,w);return;}
      const center=a.clone().add(b).add(c).multiplyScalar(1/3),q=querySurface(center.x+shift,-center.y),stone=visualHeight(center.x+shift,-center.y)>6;
      const color=new THREE.Color(stone?0x819080:0x839c46).multiplyScalar(.94+.08*Math.sin(center.x*2.3+center.y*1.7));
      if(!stone)for(const p of patches){const dx=center.x-p.x,dz=-center.y-p.z,c=Math.cos(p.angle),s=Math.sin(p.angle);if(Math.hypot(dx*c-dz*s,(dx*s+dz*c)/p.stretch)<p.radius)color.copy(p.color);}
      for(const p of [a,b,c]){vertices.push(p.x,visualHeight(p.x+shift,-p.y)-2.22,-p.y);colors.push(color.r,color.g,color.b);}
    }
    for(let i=0;i<idx.count;i+=3)triangle(...[0,1,2].map(k=>new THREE.Vector2(pos.getX(idx.getX(i+k)),pos.getY(idx.getX(i+k)))));
    source.dispose();const top=new THREE.BufferGeometry();top.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));top.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));top.computeVertexNormals();
    const surface=mesh(bankRoot,name+' meadow',top,mat(0xffffff,{vertexColors:true}),0,2.22,0);surface.userData.terrainSurface=true;
    // Seal the meadow edge into the island rock. The rock rim has coarser
    // sampling than the meadow, so sloping coastlines otherwise leave openings.
    const closure=[];
    for(let i=0;i<points.length;i++){
      const a=points[i],b=points[(i+1)%points.length],steps=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/.25);
      for(let j=0;j<steps;j++){
        const x=a[0]+(b[0]-a[0])*j/steps,z=a[1]+(b[1]-a[1])*j/steps,xx=a[0]+(b[0]-a[0])*(j+1)/steps,zz=a[1]+(b[1]-a[1])*(j+1)/steps;
        const y=visualHeight(x+shift,z),yy=visualHeight(xx+shift,zz);
        if(Math.abs(Math.abs((x+xx)/2+shift-riverCenter((z+zz)/2))-riverHalfWidth((z+zz)/2))<.1)continue;
        closure.push(x,y,z,xx,yy,zz,x,-1.9,z,xx,yy,zz,xx,-1.9,zz,x,-1.9,z);
      }
    }
    const closureGeometry=new THREE.BufferGeometry();closureGeometry.setAttribute('position',new THREE.Float32BufferAttribute(closure,3));closureGeometry.computeVertexNormals();
    mesh(bankRoot,name+' sealed meadow rim',closureGeometry,mat(0x8d9770,{side:THREE.DoubleSide}));
    // Only the river cut needs an interior wall; the outer coast belongs to the shared rock volume.
    const onRiver=p=>Math.abs(Math.abs(p[0]+shift-riverCenter(p[1]))-riverHalfWidth(p[1]))<.02;
    const sides=[];for(let i=0;i<points.length;i++){const a=points[i],b=points[(i+1)%points.length];if(!onRiver(a)||!onRiver(b))continue;const steps=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/.5);for(let j=0;j<steps;j++){const t=j/steps,u=(j+1)/steps,x=a[0]+(b[0]-a[0])*t,z=a[1]+(b[1]-a[1])*t,xx=a[0]+(b[0]-a[0])*u,zz=a[1]+(b[1]-a[1])*u,y=visualHeight(x+shift,z),yy=visualHeight(xx+shift,zz);sides.push(x,-1.8,z,xx,yy,zz,x,y,z,x,-1.8,z,xx,-1.8,zz,xx,yy,zz);}}
    const skirt=new THREE.BufferGeometry();skirt.setAttribute('position',new THREE.Float32BufferAttribute(sides,3));skirt.computeVertexNormals();mesh(bankRoot,name+' sculpted escarpment',skirt,mat(0x687b6e,{side:THREE.DoubleSide}));
  }
  bank(leftOutline,'West');bank(rightOutline,'East');
  const mountain=new THREE.Group();mountain.name='Continuous spring mountain range';mountain.userData.kind='mountain';mountain.userData.layoutId='mountain_range';
  if(valleyAssets?.mountain_range)mountain.add(valleyAssets.mountain_range.model.clone(true));
  else{const fallback=new THREE.Mesh(createMountainGeometry(),mat(0xffffff,{vertexColors:true,side:THREE.DoubleSide}));fallback.castShadow=true;fallback.receiveShadow=true;mountain.add(fallback);mountain.userData.fallback=true;}
  styleMountainTerraces(mountain,{cloneMaterials:!mountain.userData.fallback});
  mountain.traverse(o=>{o.userData.generatedProp=true;});root.add(mountain);mountains.push(mountain);
  // Clip the support mesh at the slope breaks so render, ray picking and
  // analytical walking elevations agree exactly without dense tessellation.
  const deckShape=new THREE.Shape(TERRACE_EXTENSION.map(([x,z])=>new THREE.Vector2(x,-z)));
  const flatDeck=new THREE.ShapeGeometry(deckShape).toNonIndexed(),deckVertices=[];
  function clip(points,x,above){const out=[];for(let i=0;i<points.length;i++){const a=points[i],b=points[(i+1)%points.length],ain=above?a.x>=x:a.x<=x,bin=above?b.x>=x:b.x<=x;if(ain)out.push(a);if(ain!==bin)out.push(a.clone().lerp(b,(x-a.x)/(b.x-a.x)));}return out;}
  for(let i=0;i<flatDeck.attributes.position.count;i+=3){const tri=[0,1,2].map(j=>new THREE.Vector3().fromBufferAttribute(flatDeck.attributes.position,i+j));for(const [lo,hi] of [[-100,16],[16,20],[20,100]]){const p=clip(clip(tri,lo,true),hi,false);for(let j=1;j+1<p.length;j++)for(const v of [p[0],p[j],p[j+1]])deckVertices.push(v.x,terraceHeight(v.x),-v.y);}}
  flatDeck.dispose();const deckGeometry=new THREE.BufferGeometry();deckGeometry.setAttribute('position',new THREE.Float32BufferAttribute(deckVertices,3));deckGeometry.computeVertexNormals();
  const deck=mesh(root,'Mountain terrace meadow',deckGeometry,mat(0xbba27c,{side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2}));deck.userData.terraceExtension=true;
  const apron=[];
  for(let i=0;i<TERRACE_EXTENSION.length;i++){
    const a=TERRACE_EXTENSION[i],b=TERRACE_EXTENSION[(i+1)%TERRACE_EXTENSION.length],steps=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/.2);
    for(let j=0;j<steps;j++){const x=a[0]+(b[0]-a[0])*j/steps,z=a[1]+(b[1]-a[1])*j/steps,xx=a[0]+(b[0]-a[0])*(j+1)/steps,zz=a[1]+(b[1]-a[1])*(j+1)/steps;const y=terraceHeight(x),yy=terraceHeight(xx),low=Math.min(y-.18,visualHeight(x,z)-.15),low2=Math.min(yy-.18,visualHeight(xx,zz)-.15);apron.push(x,y,z,xx,yy,zz,x,low,z,xx,yy,zz,xx,low2,zz,x,low,z);}
  }
  const apronGeometry=new THREE.BufferGeometry();apronGeometry.setAttribute('position',new THREE.Float32BufferAttribute(apron,3));apronGeometry.computeVertexNormals();mesh(root,'Closed terrace foundation',apronGeometry,mat(0x8d9980,{side:THREE.DoubleSide}));
  root.updateMatrixWorld(true);
  const mountainHeightAt=createVerticalSurfaceSampler(mountains),heightCache=new Map();
  function sample(x,z){
    const value=querySurface(x,z);if(!mountains.length||value.region==='terrace-extension')return value;
    if(value.region!=='mountain'){
      const height=visualHeight(x,z),e=.025,dx=(visualHeight(x+e,z)-visualHeight(x-e,z))/(2*e),dz=(visualHeight(x,z+e)-visualHeight(x,z-e))/(2*e),n=Math.hypot(dx,1,dz);
      return{...value,height,normal:{x:-dx/n,y:1/n,z:-dz/n},walkable:value.walkable&&Math.hypot(dx,dz)<=Math.tan(22*Math.PI/180)};
    }
    const key=x.toFixed(2)+','+z.toFixed(2);let height=heightCache.get(key);
    if(height===undefined){
      height=Math.max(visualHeight(x,z),mountainHeightAt(x,z));
      if(heightCache.size>5000)heightCache.clear();heightCache.set(key,height);
    }
    return{...value,height};
  }

  // A continuous ochre track winds from the foreground to the cottage and bridge.
  const pathMat=mat(0xc6b47e),pebble=mat(0xb3b18c);
  function path(points,width){const shift=points[0][0]<0?-BANK_SHIFT:BANK_SHIFT;const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(p[0]+shift,2.255,p[1])));const positions=[],indices=[];for(let i=0;i<=64;i++){const p=curve.getPoint(i/64),t=curve.getTangent(i/64),n=new THREE.Vector3(-t.z,0,t.x).multiplyScalar(width*(.95+.07*Math.sin(i)));positions.push(p.x+n.x,p.y,p.z+n.z,p.x-n.x,p.y,p.z-n.z);if(i<64){const j=i*2;indices.push(j,j+2,j+1,j+1,j+2,j+3);}}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setIndex(indices);g.computeVertexNormals();const p=mesh(root,'Winding woodland path',g,pathMat);p.castShadow=false;}
  path([[-12.6,8.4],[-10.3,8],[-8.2,7.3],[-6.5,7],[-5.4,4.8],[-4.5,2.2],[-3.7,1.5],[-1,1.5]],.68);
  path([[-3.7,1.5],[-3.7,-.6],[-9.6,-.6]],.55);
  path([[3,1.5],[5.2,1.8],[7.3,1],[9.9,-.2]],.6);
  for(let i=0;i<50;i++){const z=-1+rnd()*10,x=-5.4-BANK_SHIFT+Math.sin(z*.5)*.8+(rnd()-.5)*2.5;const o=mesh(root,'Path stepping stone',new THREE.CylinderGeometry(.14+rnd()*.13,.2,.06,5),pebble,x,2.29,z);o.rotation.y=rnd()*6;o.scale.z=.65+rnd()*.4;}
  const river=createRiver(root,{assets:riverAssets,reduced});
  if(rodinBridge)buildBridgeTransitions(root);
  else{buildBridge(root);const bridge=root.children.find(o=>o.name==='Stone bridge · complete arch vault');bridge.scale.set(1.4,1,1.4);}
  return{root,river,sample,mountains,bounds:WORLD_BOUNDS};
}

function buildBridgeTransitions(root){
  // Four independent stone patches bridge measured gaps in the generated stone deck.
  // Endpoint heights are exact GLB triangle-ray samples at bridge y=.50, size 13.2x3.8x5.6,
  // raised only .016 m. The generated asset itself is untouched; most of its deck stays exposed.
  const definitions=[
    {name:'west bank',x0:-4.2,x1:-3.2,thickness:.40,ends:[[2.236,2.90522],[2.236,2.89569],[2.236,2.87815],[2.236,2.87397],[2.236,2.7438],[2.236,2.89975],[2.236,2.89395],[2.236,2.88834],[2.236,2.88337]]},
    {name:'west deck seam',x0:-1,x1:-.3,thickness:.36,ends:[[3.83646,3.97298],[3.83735,3.97614],[3.83736,3.98056],[3.83675,3.98451],[3.73975,3.91904],[3.84065,4.01796],[3.84163,4.01554],[3.84167,4.01476],[3.84341,4.01559]]},
    {name:'east deck seam',x0:3.2,x1:3.9,thickness:.22,ends:[[3.91225,3.74379],[3.90681,3.73395],[3.89988,3.72383],[3.89458,3.71463],[3.83218,3.57135],[3.89682,3.6896],[3.90394,3.70544],[3.9106,3.72259],[3.91767,3.73843]]},
    {name:'east bank',x0:6.2,x1:6.9,thickness:.24,ends:[[2.67826,2.236],[2.67132,2.236],[2.66241,2.236],[2.65059,2.236],[2.53921,2.236],[2.66019,2.236],[2.65749,2.236],[2.65189,2.236],[2.64702,2.236]]}
  ];
  const material=mat(0xbab99a);
  for(const d of definitions){
    const positions=[],indices=[],rows=d.ends.length,count=rows*2;
    for(const bottom of [false,true])for(let i=0;i<rows;i++)for(let j=0;j<2;j++)positions.push(j?d.x1:d.x0,d.ends[i][j]-(bottom?d.thickness:0),.7+i*.2);
    for(let i=0;i<rows-1;i++){
      const a=i*2,b=a+1,c=a+2,e=a+3;
      indices.push(a,c,b,b,c,e, count+a,count+b,count+c,count+b,count+e,count+c);
      indices.push(a,count+a,c,c,count+a,count+c,b,e,count+b,e,count+e,count+b);
    }
    indices.push(0,1,count,1,count+1,count,count-2,count*2-2,count-1,count-1,count*2-2,count*2-1);
    const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setIndex(indices);geometry.computeVertexNormals();
    geometry.scale(.7,1,.7);geometry.translate(1.25*.3,0,1.5*.3);
    const ramp=mesh(root,`Bridge approach ramp · ${d.name}`,geometry,material);
    ramp.userData.walkableBridgeTransition=true;ramp.userData.intentionalBridgeContact=true;
    ramp.userData.dimensions={length:(d.x1-d.x0)*.7,width:1.12,thickness:d.thickness};
    ramp.userData.bridgePlacement={x:1.25,z:1.5,y:.5,width:9.24,height:3.8,depth:3.92};
  }
}

function buildBridge(root){
  const bridge=new THREE.Group();bridge.name='Stone bridge · complete arch vault';bridge.position.set(.9,0,1.5);root.add(bridge);
  const materials=[0xaaa980,0xb7b28a,0x999c79,0xc0b990,0x8b977a].map(c=>mat(c));
  const half=3.15,base=2.24;
  const upper=x=>base+.68*Math.cos(x/half*Math.PI/2),lower=x=>.28+2.05*Math.sqrt(Math.max(0,1-(x/half)**2));
  // Each wedge includes front, back, top, and a visible intrados surface.
  for(let i=0;i<19;i++){const a=-half+i/19*half*2,b=-half+(i+1)/19*half*2-.025;const sh=new THREE.Shape();sh.moveTo(a,lower(a));sh.lineTo(b,lower(b));sh.lineTo(b,upper(b));sh.lineTo(a,upper(a));sh.closePath();const g=new THREE.ExtrudeGeometry(sh,{depth:2.05,bevelEnabled:true,bevelThickness:.025,bevelSize:.024,bevelSegments:1,steps:1});const block=mesh(bridge,'Arch voussoir '+i,g,materials[i%5],0,0,-1.025);}
  for(let i=0;i<21;i++){const x=-half+(i+.5)/21*half*2,y=upper(x);const slab=mesh(bridge,'Deck paving slab',new THREE.BoxGeometry(half*2/21-.018,.13,1.94),materials[(i+1)%5],x,y+.05,0);slab.rotation.z=-.68*Math.PI/(2*half)*Math.sin(x/half*Math.PI/2);for(const z of [-1.02,1.02]){const parapet=mesh(bridge,'Mossy stone parapet',new THREE.BoxGeometry(.295,.43,.3),materials[(i+3)%5],x,y+.33,z);parapet.rotation.z=slab.rotation.z;const cap=mesh(bridge,'Parapet coping',new THREE.BoxGeometry(.31,.095,.36),materials[(i+2)%5],x,y+.59,z);cap.rotation.z=slab.rotation.z;}}
  for(const x of [-3.1,3.1])for(const z of [-.9,.9])mesh(bridge,'Bridge footing',new THREE.BoxGeometry(.65,1.65,.7),materials[2],x,1.36,z);
  for(let i=0;i<12;i++){const x=(rnd()-.5)*5.7,z=i%2?1.22:-1.22;const moss=mesh(bridge,'Tiny bridge moss',new THREE.DodecahedronGeometry(.11+rnd()*.08,0),grassMats[i%5],x,upper(x)+.38,z);moss.scale.set(1.7,.55,.4);}
}
