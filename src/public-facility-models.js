import * as T from 'three';

/** Small authored shells; live account/video surfaces remain separate. */
export function createNeonFacility(kind){
 const root=new T.Group();root.name='Neon public '+kind;
 const metal=new T.MeshStandardMaterial({color:0x29394b,roughness:.58,metalness:.55});
 const trim=new T.MeshStandardMaterial({color:0x9eaabd,roughness:.45,metalness:.5});
 const glow=new T.MeshStandardMaterial({color:kind==='music'?0xe69ebc:0x7edbdc,emissive:kind==='music'?0xd56caa:0x42b9cb,emissiveIntensity:.8,roughness:.4});
 function box(name,x,y,z,w,h,d,material=metal){const m=new T.Mesh(new T.BoxGeometry(w,h,d),material);m.name=name;m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;root.add(m);return m;}
 if(kind==='accounts'){
  box('Terminal pedestal',0,.32,0,.86,.64,.56);box('Information terminal body',0,1.27,.035,1.68,1.38,.24);box('Terminal crown',0,2.03,0,1.82,.12,.35,trim);
  for(const x of [-.81,.81])box('Cyan terminal edge',x,1.27,.19,.045,1.36,.04,glow);
  box('Terminal lower light',0,.54,.23,1.55,.035,.04,glow);
 }else if(kind==='scene-video'){
  box('Projection pedestal',0,.2,0,1.8,.4,.72);box('Display stem',0,.65,0,.45,.8,.3);
  box('Holographic display backing',0,2.12,-.02,1.87,3.08,.12);
  for(const x of [-.91,.91])box('Screen luminous edge',x,2.12,.06,.05,3.1,.05,glow);
  for(const y of [.57,3.67])box('Screen silver rail',0,y,0,1.94,.08,.21,trim);
 }else{
  box('Listening console plinth',0,.14,0,1.55,.28,.78);box('Listening console',0,.74,0,1.4,1.02,.68);box('Console sloped desk',0,1.27,.05,1.55,.12,.87,trim).rotation.x=.1;
  for(const x of [-.49,.49]){box('Speaker cabinet',x,.8,.37,.31,.72,.07);for(const y of [.62,.95]){const ring=new T.Mesh(new T.TorusGeometry(.1,.018,6,20),glow);ring.position.set(x,y,.42);root.add(ring);}}
  for(let i=0;i<7;i++)box('Static audio meter',-.28+i*.09,1.38,.07,.035,.06+(i%3)*.035,.16,glow);
 }
 return root;
}
