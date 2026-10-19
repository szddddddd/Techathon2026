import * as T from 'three';

/** Authored moving landmark. Cabins share instanced geometry and stay upright. */
export function createFujiFerrisWheel(parent,layout,{reduced=false}={}){
 const root=new T.Group();root.name='Sakura foothill Ferris wheel';root.position.set(layout.x,2.22,layout.z);root.rotation.y=layout.rotation;parent.add(root);
 const make=color=>new T.MeshStandardMaterial({color,roughness:.72,metalness:.12});
 const cream=make(0xe7d9c4),rose=make(0xb97694),metal=make(0x6d6176),glass=make(0x91a5b1),stone=make(0xb8a2ad);
 const add=(p,g,m,x=0,y=0,z=0)=>{const o=new T.Mesh(g,m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;o.userData.generatedProp=true;p.add(o);return o;};
 const beam=(a,b,r,m)=>{const v=new T.Vector3(...a),w=new T.Vector3(...b),o=add(root,new T.CylinderGeometry(r,r,v.distanceTo(w),8),m);o.position.copy(v).add(w).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),w.sub(v).normalize());};
 const radius=3.65,hubY=4.85,cabins=12;
 const base=add(root,new T.CylinderGeometry(2.5,2.65,.22,12),stone,0,.11,0);base.scale.z=.68;
 for(const z of[-.85,.85])for(const x of[-1.85,1.85]){
  add(root,new T.BoxGeometry(.75,.28,.65),cream,x,.22,z);
  beam([x,.30,z],[0,hubY,z*.55],.13,cream);
 }
 beam([0,hubY,-.95],[0,hubY,.95],.23,metal);
 const rotor=new T.Group();rotor.position.y=hubY;rotor.name='Rotating wheel';root.add(rotor);
 for(const z of[-.32,.32]){
  add(rotor,new T.TorusGeometry(radius,.072,7,96),cream,0,0,z);
  add(rotor,new T.TorusGeometry(radius-.17,.035,6,96),rose,0,0,z);
 }
 const spokes=new T.InstancedMesh(new T.CylinderGeometry(.025,.025,radius*2,6),cream,cabins);spokes.castShadow=true;rotor.add(spokes);
 const dummy=new T.Object3D();for(let i=0;i<cabins;i++){dummy.position.set(0,0,i%2?.32:-.32);dummy.rotation.set(0,0,Math.floor(i/2)*Math.PI/6);dummy.scale.set(1,1,1);dummy.updateMatrix();spokes.setMatrixAt(i,dummy.matrix);}
 add(rotor,new T.CylinderGeometry(.37,.37,.85,16),rose).rotation.x=Math.PI/2;
 // Each part is one draw call for all twelve cabins, rather than twelve objects.
 const parts=[];
 function part(geometry,material,offset){const mesh=new T.InstancedMesh(geometry,material,cabins);mesh.castShadow=mesh.receiveShadow=true;mesh.frustumCulled=false;mesh.userData.generatedProp=true;root.add(mesh);parts.push({mesh,offset});return mesh;}
 const bodies=part(new T.BoxGeometry(.66,.36,.63),rose,[0,-.62,0]);
 const colors=[0xc7829d,0xd7c18e,0x93aaa5];for(let i=0;i<cabins;i++)bodies.setColorAt(i,new T.Color(colors[i%3]));
 part(new T.BoxGeometry(.59,.30,.57),glass,[0,-.30,0]);
 part(new T.CylinderGeometry(.49,.43,.13,8),cream,[0,-.08,0]);
 part(new T.BoxGeometry(.72,.07,.69),cream,[0,-.82,0]);
 part(new T.CylinderGeometry(.035,.035,.22,6),metal,[0,.07,0]);
 for(const x of[-.30,.30])for(const z of[-.29,.29])part(new T.BoxGeometry(.035,.39,.035),cream,[x,-.3,z]);
 let angle=0,active=true,disposed=false;
 function pose(){rotor.rotation.z=angle;for(const {mesh,offset}of parts){for(let i=0;i<cabins;i++){const a=i*Math.PI*2/cabins+angle;dummy.position.set(radius*Math.cos(a)+offset[0],hubY+radius*Math.sin(a)+offset[1],offset[2]);dummy.rotation.set(0,0,0);dummy.scale.set(1,1,1);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);}mesh.instanceMatrix.needsUpdate=true;}}
 pose();
 return{root,update(dt){if(disposed||!active||(typeof reduced==='boolean'?reduced:reduced?.matches)||globalThis.document?.hidden)return;angle=(angle+Math.min(.1,Math.max(0,dt))*Math.PI*2/110)%(Math.PI*2);pose();},suspend(){active=false;},activate(){active=true;},snapshot:()=>({x:layout.x,z:layout.z,radius,cabins,angle,cycleSeconds:110}),dispose(){disposed=true;root.removeFromParent();}};
}
