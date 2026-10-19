import * as THREE from 'three';
/** Deliberately simple test figures, never used as user avatars. */
export function createRigFixture(kind='biped'){
 const root=new THREE.Group(),material=new THREE.MeshStandardMaterial({color:0x7eabc1,roughness:.8});
 const add=(size,at)=>{const mesh=new THREE.Mesh(new THREE.BoxGeometry(...size,2,2,2),material);mesh.position.set(...at);root.add(mesh);};
 if(kind==='unsupported'){const mesh=new THREE.Mesh(new THREE.SphereGeometry(.5,16,12),material);mesh.position.y=.5;root.add(mesh);return root;}
 add([.23,.25,.14],[0,.61,0]);add([.16,.19,.16],[0,.9,0]);add([.09,.08,.09],[0,.775,0]);
 for(const side of [-1,1]){add([.09,.39,.1],[side*.09,.255,0]);add([.11,.065,.18],[side*.09,.0325,.035]);if(kind==='tpose'){add([.16,.075,.08],[side*.22,.72,0]);add([.18,.07,.075],[side*.38,.72,0]);}else{add([.075,.16,.08],[side*.185,.66,0]);add([.07,.17,.075],[side*.24,.5,0]);}}
 return root;
}
