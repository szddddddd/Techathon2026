import * as THREE from 'three';
import { isReserved,setReservedFootprints } from './layout.js';
import {FOREST_TREES,FOREST_ROCKS} from './forest-layout.js';
import {groundTree} from './tree-assets.js';

// Authored vegetation and forest details. All geometry is constructed here.
export function buildNature(scene, { rodin = false, expanded = false, terrain, fallbackTrees = false } = {}) {
  let seed = 81397;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const between = (a, b) => a + random() * (b - a);
  const mat = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: .89, ...extra });
  const bark = [mat('#685c43'), mat('#7c7352'), mat('#938561'), mat('#4a5242')];
  const leaves = ['#467351', '#5e8751', '#86a355', '#b2bb68', '#375e4d', '#79954e'].map(c => mat(c));
  const grassMats = ['#7eaa54', '#9aba63', '#b6c67a', '#4d8157'].map(c => mat(c, { side: THREE.DoubleSide }));
  const stoneMats = ['#758b79', '#91a18c', '#627d73', '#9ca98d'].map(c => mat(c));
  const moss = mat('#91b65d');
  const blue = mat('#6fe0ee', { emissive: '#2f94ad', emissiveIntensity: .38, metalness: .13, roughness: .35 });
  const deepBlue = mat('#427fa5');
  const plantLeaf = mat('#4e9b7c', { side: THREE.DoubleSide });
  const gold = mat('#ffda83', { emissive: '#ffb954', emissiveIntensity: .5 });
  const root = new THREE.Group(); root.name = 'Authored forest and flora'; scene.add(root);
  const props=new THREE.Group();props.name='Procedural woodland props';root.add(props);
  const sphere = new THREE.IcosahedronGeometry(1, 2);
  const smallSphere = new THREE.SphereGeometry(1, 8, 6);
  const point = v => new THREE.Vector3(...v);
  function mesh(geometry, material, parent = root) {
    const m = new THREE.Mesh(geometry, material); m.castShadow = true; m.receiveShadow = true; parent.add(m); return m;
  }
  function ellipsoid(pos, scale, material, parent = root, geometry = sphere) {
    const m = mesh(geometry, material, parent); m.position.set(...pos); m.scale.set(...scale); return m;
  }
  function segment(a, b, r0, r1, material, parent = root, sides = 8) {
    const av = point(a), bv = point(b), delta = bv.clone().sub(av);
    const m = mesh(new THREE.CylinderGeometry(r1, r0, delta.length(), sides), material, parent);
    m.position.copy(av.add(bv).multiplyScalar(.5)); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize()); return m;
  }
  // Uneven leaf lobes provide a readable organic silhouette from every camera angle.
  const crownGeo = new THREE.IcosahedronGeometry(1, 2);
  const position = crownGeo.attributes.position;
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i), y = position.getY(i), z = position.getZ(i);
    const factor = 1 + .07 * Math.sin(x * 17 + z * 13) * Math.cos(y * 21);
    position.setXYZ(i, x * factor, y * factor, z * factor);
  }
  crownGeo.computeVertexNormals();
  function tree(x, z, height, width, tint) {
    const g = new THREE.Group(); g.name = 'Branching ancient broadleaf'; g.position.set(x, terrain?.sample(x,z).height??2.22, z); props.add(g);
    const lean = between(-.5, .5), leanZ = between(-.3, .3);
    segment([0, 0, 0], [lean * .5, height * .5, leanZ], width * .52, width * .32, bark[0], g, 11);
    segment([lean * .5, height * .5, leanZ], [lean, height * .87, 0], width * .33, width * .15, bark[1], g, 10);
    for (let i = 0; i < 7; i++) {
      const a = i / 7 * Math.PI * 2 + random() * .4;
      const end = [Math.cos(a) * width * between(1.8, 2.7), .02, Math.sin(a) * width * between(1.8, 2.7)];
      const middle = [end[0] * .45, .25, end[2] * .45];
      segment([0, .6, 0], middle, width * .28, width * .19, bark[0], g);
      segment(middle, end, width * .19, .035, bark[1], g);
    }
    const tips = [];
    for (let i = 0; i < 5; i++) {
      const a = i * Math.PI * 2 / 5 + .4, reach = between(1.5, 2.3) * width;
      const start = [lean * .65, height * between(.43, .62), 0];
      const elbow = [Math.cos(a) * reach * .57, height * .76, Math.sin(a) * reach * .57];
      const end = [Math.cos(a) * reach + lean, height * between(.92, 1.05), Math.sin(a) * reach];
      segment(start, elbow, width * .23, width * .14, bark[i % 3], g);
      segment(elbow, end, width * .15, .045, bark[1], g);
      tips.push(end);
      const fork = [end[0] + Math.sin(a) * .6, end[1] - .2, end[2] + Math.cos(a) * .65];
      segment(elbow, fork, width * .1, .025, bark[2], g);
    }
    tips.push([lean, height * 1.04, 0]);
    tips.forEach((tip, index) => {
      const radius = width * between(1.25, 1.8);
      ellipsoid(tip, [radius * 1.15, radius * .72, radius], leaves[(index + tint) % leaves.length], g, crownGeo);
      for (let j = 0; j < 3; j++) {
        const a = j * 2.094 + random();
        ellipsoid([tip[0] + Math.cos(a) * radius * .65, tip[1] + between(-.35, .6), tip[2] + Math.sin(a) * radius * .65],
          [radius * .69, radius * .52, radius * .66], leaves[(index + j + tint) % leaves.length], g, crownGeo);
      }
    });
    // Raised bark grain and an ivy vine make the trunks visible authored forms.
    for (let j = 0; j < 4; j++) {
      const a = j * Math.PI / 2 + .25;
      segment([Math.cos(a) * width * .45, .55, Math.sin(a) * width * .45],
        [lean * .4 + Math.cos(a) * width * .28, height * .43, Math.sin(a) * width * .28], .025, .012, bark[2], g, 4);
    }
    for (let j = 0; j < 9; j++) {
      const a = j * .61;
      const l = ellipsoid([Math.cos(a) * width * .48, .35 + j * .29, Math.sin(a) * width * .48], [.16, .23, .055], plantLeaf, g, smallSphere); l.rotation.z = a;
    }
    return g;
  }
  if(!rodin||fallbackTrees)for(const [i,p] of FOREST_TREES.entries()){
    const g=tree(p.x,p.z,p.size,p.size*.065,i%leaves.length);
    g.name=p.id;g.rotation.y=p.rotation;g.userData.layoutId=p.id;g.userData.kind=p.kind;g.userData.proceduralTree=true;
    if(terrain)groundTree(g,terrain.sample);
    // Collision captures these meshes before scene-world batches shared materials.
  }

  function rock(x, z, size, parent = root, y = 2.2) {
    const r = ellipsoid([x, y + size * .28, z], [size, size * .62, size * .75], stoneMats[Math.floor(random() * stoneMats.length)], parent);
    r.rotation.set(between(-.2,.2),random()*6.28,between(-.12,.12));
    ellipsoid([x - size*.09, y + size * .65, z], [size*.83,size*.12,size*.61], moss, parent);
  }
  if(!rodin)for(const p of FOREST_ROCKS){
    const g=new THREE.Group();g.name=p.id;g.position.set(p.x,terrain?.sample(p.x,p.z).height??2.22,p.z);g.rotation.y=p.rotation;
    g.userData.layoutId=p.id;g.userData.kind='rock';props.add(g);
    rock(0,0,p.size*.65,g,-p.size*.15);
  }
  if(!rodin||fallbackTrees){
    props.updateWorldMatrix(true,true);
    props.userData.inventory=props.children.map(g=>{
      const bounds=new THREE.Box3().setFromObject(g);
      return{id:g.userData.layoutId,kind:g.userData.kind,bounds:{min:bounds.min.toArray(),max:bounds.max.toArray()}};
    });
    if(!rodin)setReservedFootprints(props.userData.inventory.map(({bounds:b})=>({minX:b.min[0],maxX:b.max[0],minZ:b.min[2],maxZ:b.max[2]})));
  }
  const leafShape = new THREE.Shape(); leafShape.moveTo(0,0);leafShape.quadraticCurveTo(.33,.42,0,1);leafShape.quadraticCurveTo(-.29,.38,0,0);
  const leafGeo = new THREE.ShapeGeometry(leafShape,5);
  function fern(x,z,scale) {
    if (expanded) return;
    const g=new THREE.Group();g.position.set(x,2.24,z);root.add(g);
    for(let i=0;i<7;i++) {
      const a=i*.897, length=scale*between(.65,1.1);
      const tip=[Math.cos(a)*length*.72,length*.55,Math.sin(a)*length*.72];
      segment([0,0,0],tip,.012,.005,plantLeaf,g,4);
      for(let j=1;j<5;j++) {
        const t=j/5;
        for(const side of [-1,1]) {
          const l=mesh(leafGeo,plantLeaf,g);l.position.set(tip[0]*t,tip[1]*t,tip[2]*t);
          l.rotation.set(-.8,a+side*1.1,side*.7);l.scale.setScalar(scale*(1-t)*.46+.06);
        }
      }
    }
  }
  function flower(x,z,scale) {
    if (expanded && isReserved(x,z,scale*.3)) return;
    const y=2.2, h=scale*between(.45,.75);
    segment([x,y,z],[x+.04,y+h,z],.011,.008,plantLeaf,root,5);
    for(let i=0;i<5;i++) {
      const a=i*Math.PI*2/5;
      const petal=ellipsoid([x+Math.cos(a)*scale*.12,y+h+Math.sin(a)*scale*.12,z], [scale*.075,scale*.16,scale*.038],blue,root,smallSphere);petal.rotation.z=-a+Math.PI/2;
    }
    ellipsoid([x,y+h,z+.035],[scale*.06,scale*.06,scale*.06],gold,root,smallSphere);
    const l=mesh(leafGeo,plantLeaf);l.position.set(x,y+h*.3,z);l.rotation.set(-.6,1.1,-.9);l.scale.setScalar(scale*.4);
  }
  const bladeGeo=new THREE.BufferGeometry();bladeGeo.setAttribute('position',new THREE.Float32BufferAttribute([-.045,0,0,.045,0,0,.065,.38,.025, .045,0,0,.11,.68,.06,.065,.38,.025],3));bladeGeo.computeVertexNormals();
  function grass(x,z,scale) {
    if (rodin) return;
    for(let i=0;i<5;i++) {
      const b=mesh(bladeGeo,grassMats[i%4]);b.position.set(x+between(-.11,.11),2.22,z+between(-.11,.11));b.rotation.y=random()*6.28;b.scale.setScalar(scale*between(.7,1.3));
    }
  }
  function suitable(x,z) {
    if(expanded&&Math.abs(x-1.25)<4.2)return false;
    if (expanded && isReserved(x,z,.5)) return false;
    if(x>-1.6&&x<3.8)return false;
    if(x>-8.5&&x<-.8&&z>-6.6&&z<2.3)return false;
    if(z>0&&z<2.7&&x>-3.4&&x<5)return false;
    // Leave the diagonal left-bank walking track readable.
    if(x>-6.1&&x<-3.4&&z>2.6&&z<7.9)return false;
    return true;
  }
  for(let i=0;i<180;i++) {
    const x=between(-10.3,10.3),z=between(-8.7,9.6);
    if(!suitable(x,z))continue;
    grass(x,z,between(.45,1.05));
    if(i%9===0)fern(x+.2,z,between(.6,1));
    if(i%(expanded ? 10 : 5)===0)flower(x-.1,z,between(.7,1));
  }
  [[-8,5.7,1.2],[-7.8,7.8,1.25],[-2.1,7.3,.8],[4.3,7.8,1.2],[9.1,2.9,1.1],[-8.7,-1.3,1]].forEach(p=>fern(...p));
  [[-7.5,6.3,1.2],[-6.9,7.5,1],[-2.3,6.7,.9],[4.4,7.3,1],[8.4,4.7,1.1],[7.8,-3.7,1]].filter(p=>!expanded || (suitable(p[0],p[1])&&!isReserved(p[0],p[1],p[2]*.3))).forEach(p=>flower(...p));

  const butterflies=[];
  const wingMaterial=mat('#89eeed',{emissive:'#3cbbd1',emissiveIntensity:.45,side:THREE.DoubleSide,roughness:.5});
  const wingShape=new THREE.Shape();wingShape.moveTo(0,0);wingShape.bezierCurveTo(.14,.32,.48,.4,.4,.1);wingShape.bezierCurveTo(.53,-.12,.13,-.3,0,0);
  const wingGeo=new THREE.ShapeGeometry(wingShape,9);
  [[-8,4,5],[-2,4.7,-6],[5.6,4.9,-4.5],[7,3.8,4],[-7,3.8,8],[1,7,-8]].forEach((p,i)=>{
    const group=new THREE.Group();group.name='Animated turquoise butterfly';group.position.set(...p);root.add(group);
    const wings=[];
    for(const side of [-1,1]) {const pivot=new THREE.Group();const wing=mesh(wingGeo,wingMaterial,pivot);wing.scale.x=side;group.add(pivot);wings.push(pivot);}
    segment([0,-.12,0],[0,.12,0],.022,.013,deepBlue,group,5);group.scale.setScalar(.55+i*.025);group.rotation.x=-.35;
    butterflies.push({group,wings,origin:point(p),phase:i*1.7});
  });
  // The reference's right-hand escarpment: staggered, fractured stone columns.
  // These occupy only the rear right bank; the bridge and cabin sightlines remain open.
  if (!expanded) {
  const escarpment=new THREE.Group();escarpment.name='Layered moss and ivy escarpment';root.add(escarpment);
  const cliffMats=['#8a9b91','#788d87','#617b78','#a1ada0'].map(c=>mat(c,{flatShading:true}));
  const cliffOutline=[[1,.05],[.74,.65],[.12,.91],[-.62,.76],[-1,.2],[-.79,-.62],[-.12,-.9],[.66,-.72]];
  function cliffColumn(x,z,height,rx,rz,phase) {
    const vertices=[],indices=[];
    const rings=[{h:0,r:1.1,dx:0,dz:0},{h:.28,r:1,dx:-.11,dz:.04},{h:.63,r:.9,dx:.05,dz:-.05},{h:.92,r:.84,dx:-.11,dz:.02},{h:1,r:.67,dx:-.17,dz:0}];
    rings.forEach((ring,k)=>cliffOutline.forEach(([px,pz],i)=>{
      const edge=1+.06*Math.sin(i*2.1+phase+k*.8);
      vertices.push(x+(px*ring.r*edge+ring.dx)*rx,2.2+height*ring.h+(k===4?.10*Math.sin(i*2.8+phase):0),z+(pz*ring.r*edge+ring.dz)*rz);
    }));
    for(let k=0;k<rings.length-1;k++)for(let i=0;i<8;i++) {
      const j=(i+1)%8,a=k*8+i,b=k*8+j,c=(k+1)*8+i,d=(k+1)*8+j;
      indices.push(a,c,b,b,c,d);
    }
    for(let i=1;i<7;i++)indices.push(32,32+i+1,32+i);
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geo.setIndex(indices);
    for(let i=0;i<indices.length;i+=6)geo.addGroup(i,Math.min(6,indices.length-i),(Math.floor(i/6)+phase)%4);
    geo.computeVertexNormals();mesh(geo,cliffMats,escarpment);
    // Broad moss caps, interrupted grassy ledges, and thinner strata at the foot.
    ellipsoid([x-rx*.14,2.2+height+.02,z],[rx*.64,.14,rz*.67],moss,escarpment);
    for(let k=0;k<3;k++) {
      const y=2.2+height*(.2+k*.24), side=k%2===0?-.45:.3;
      ellipsoid([x+rx*side,y,z+rz*.73],[rx*.62,.12,rz*.30],cliffMats[(k+1)%4],escarpment);
      ellipsoid([x+rx*side,y+.10,z+rz*.74],[rx*.57,.07,rz*.27],moss,escarpment);
    }
    for(let v=0;v<3;v++) {
      let previous=null;
      for(let k=0;k<12;k++) {
        const t=k/11,y=2.2+height*(.95-t*.72),px=x+rx*(v*.34-.44)+Math.sin(t*8+v)*.10,pz=z+rz*(.68+.19*t);
        const current=[px,y,pz];if(previous)segment(previous,current,.014,.013,plantLeaf,escarpment,4);
        const leaf=ellipsoid([px+(k%2===0?.09:-.09),y-.04,pz+.035],[.12,.17,.035],leaves[(v+k)%3],escarpment,smallSphere);leaf.rotation.z=k%2===0?-.65:.65;
        previous=current;
      }
    }
  }
  cliffColumn(7.45,-5.7,3.15,1.08,.91,0);
  cliffColumn(8.9,-6.95,4.85,1.12,1.02,1);
  cliffColumn(6.65,-7.75,4.05,.93,.86,2);
  cliffColumn(9.45,-5.45,2.4,.73,.71,3);
  }
  return {butterflies,props};
}
