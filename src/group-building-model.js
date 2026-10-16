import * as T from 'three';
// Authored references also serve as honest, recognisable load-failure fallbacks.
export function createGroupBuilding(type){
 const root=new T.Group(),mats={wall:0xe9dfb8,wood:0xa98054,glass:0x91bfba,roof:0x8d9c70,dark:0x52675a};
 const material=key=>new T.MeshStandardMaterial({color:mats[key]??key,roughness:.92,flatShading:true});
 const box=(name,x,y,z,w,h,d,color)=>{const mesh=new T.Mesh(new T.BoxGeometry(w,h,d),material(color));mesh.name=name;mesh.position.set(x,y,z);root.add(mesh);return mesh;};
 box('Warm stone walls',0,1.15,0,3.55,2.3,2.7,'wall');box('Door',0,.72,1.38,.7,1.45,.07,'wood');
 for(const x of [-1.15,1.15]){box('Window frame',x,1.3,1.39,.86,1.03,.09,'wood');box('Window glass',x,1.3,1.45,.71,.88,.04,'glass');box('Window mullion',x,1.3,1.49,.045,.88,.035,'wall');}
 for(const side of [-1,1])for(const z of [-.8,.5])box('Side window',side*1.79,1.3,z,.06,.9,.72,'glass');
 if(type==='library'){
  box('Reading wing roof',0,2.42,0,3.9,.22,3.05,'roof');box('Book entrance tower',0,2.25,.9,1.2,2.35,1.1,'wall');box('Tower cap',0,3.52,.9,1.45,.18,1.25,'roof');
  const round=new T.Mesh(new T.CylinderGeometry(.35,.35,.08,20),material('glass'));round.rotation.x=Math.PI/2;round.position.set(0,2.65,1.49);root.add(round);for(const side of [-1,1])box('Open book emblem',side*.16,3.16,1.49,.3,.23,.08,'wood').rotation.z=side*.16;
 }else if(type==='music'){
  const points=[];for(let i=0;i<8;i++){const a=-2+i*.5,b=a+.5,front=x=>2.5+x*x*.06,back=x=>3.15+x*x*.06;points.push(a,front(a),1.6,b,back(b),-1.5,b,front(b),1.6,a,front(a),1.6,a,back(a),-1.5,b,back(b),-1.5);}const roofGeo=new T.BufferGeometry();roofGeo.setAttribute('position',new T.Float32BufferAttribute(points,3));roofGeo.computeVertexNormals();const roofMat=material(0xb5a3b6);roofMat.side=T.DoubleSide;root.add(new T.Mesh(roofGeo,roofMat));box('Connected rear acoustic wall',0,2.6,-1.28,3.55,1.3,.18,'wall');
  for(const x of [-1.77,1.77]){const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute([x,2.2,1.35,x,3.32,-1.35,x,2.2,-1.35,x,2.2,1.35,x,2.72,1.35,x,3.32,-1.35],3));g.computeVertexNormals();const m=material('wall');m.side=T.DoubleSide;root.add(new T.Mesh(g,m));}
  for(const x of [-1.55,-.8,.8,1.55])box('Concert porch column',x,1.05,1.7,.12,2.1,.12,'wall');box('Glazed concert entrance',0,.9,1.44,1.35,1.8,.08,'glass');box('Note stem',.2,2.16,1.7,.055,.45,.06,'wood');const note=new T.Mesh(new T.SphereGeometry(.12,10,6),material('wood'));note.scale.y=.6;note.position.set(.1,1.96,1.7);root.add(note);
 }else if(type==='art'){
  box('Offset studio wing',1.12,1.5,-.3,1.4,3,2.2,0xe2b69a);for(let i=0;i<3;i++){const roof=box('Sawtooth skylight',-.65+i*.7,2.55,0,.8,.12,3,'glass');roof.rotation.z=.4;box('Sawtooth timber lip',-.99+i*.7,2.55,0,.06,.4,3,'wood');}const palette=new T.Mesh(new T.SphereGeometry(.23,9,6),material(0xd49a71));palette.scale.set(1,.75,.15);palette.position.set(0,2.04,1.49);root.add(palette);
 }else if(type==='cafe'){
  box('Cafe roof',0,2.4,0,3.9,.18,3,'roof');const drum=new T.Mesh(new T.CylinderGeometry(.8,.8,2.6,16),material('wall'));drum.position.set(-1.1,1.3,.85);root.add(drum);const roof=new T.Mesh(new T.ConeGeometry(.96,1.1,16),material('roof'));roof.position.set(-1.1,3.1,.85);root.add(roof);for(let i=0;i<6;i++)box('Striped awning',-.2+i*.32,1.95,1.8,.33,.12,.9,i%2?'wall':'roof').rotation.x=.16;box('Coffee cup sign',.7,2.32,1.55,.33,.26,.09,'wood');
 }else if(type==='observatory'){
  for(const child of [...root.children])root.remove(child);const drum=new T.Mesh(new T.CylinderGeometry(1.6,1.6,2,24),material('wall'));drum.position.y=1;root.add(drum);const dome=new T.Mesh(new T.SphereGeometry(1.7,24,12,0,Math.PI*2,0,Math.PI/2),material(0x92adbd));dome.position.y=2;root.add(dome);box('Dome slit',0,3.1,.7,.32,.05,1.1,'dark').rotation.x=.65;const telescope=new T.Mesh(new T.CylinderGeometry(.12,.18,.95,12),material('wood'));telescope.rotation.x=.65;telescope.position.set(0,3.3,.8);root.add(telescope);box('Entrance annex',0,.65,1.45,1.3,1.3,1.1,'wall');box('Observatory door',0,.6,2.02,.6,1.2,.05,'wood');
 }else if(type==='sport'){
  const arch=new T.Shape();arch.moveTo(-1.92,0);arch.lineTo(1.92,0);arch.absarc(0,0,1.92,0,Math.PI,false);arch.closePath();const roof=new T.Mesh(new T.ExtrudeGeometry(arch,{depth:3.05,bevelEnabled:false,curveSegments:12}),material(0x83ac9f));roof.scale.y=.62;roof.position.set(0,2.25,-1.525);root.add(roof);
  box('Wide gym doors',0,.85,1.43,1.4,1.7,.08,'glass');const ball=new T.Mesh(new T.SphereGeometry(.25,10,6),material(0xd4a277));ball.position.set(0,2.1,1.49);root.add(ball);
 }else if(type==='lab'){
  box('Flat eaves',0,2.42,0,3.9,.24,3.05,'roof');box('Raised laboratory wing',-.65,2.85,-.35,1.7,.7,1.8,'wall');
  const skylight=box('Glass skylight',.7,2.8,.15,1.5,.18,1.8,'glass');skylight.rotation.z=.25;box('Flask neck',0,2.04,1.5,.12,.23,.1,'glass');box('Flask body',0,1.85,1.5,.34,.24,.1,'glass');
 }else{
  for(const side of [-1,1]){const roof=box('Sloping roof',side*.98,2.7,0,2.25,.18,3.15,type==='club'?'roof':0xc9a080);roof.rotation.z=side*-.36;}
  if(type==='club'){box('Porch awning',0,1.92,1.65,2.2,.12,1,'wood');for(const x of [-1,1])box('Porch post',x,.94,1.95,.1,1.88,.1,'wood');for(let i=0;i<4;i++)box('Pennant',-.7+i*.45,2.02,2.17,.22,.24,.035,[0xdbb970,0x92b8a3,0xc58d7d,0xa4bac9][i]);}
  else box('Entrance chalkboard',-.48,.94,1.55,.32,.6,.09,'dark');
 }
 root.traverse(m=>{if(m.isMesh){m.castShadow=true;m.receiveShadow=true;}});return root;
}
