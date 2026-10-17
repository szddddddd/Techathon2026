import * as T from 'three';

/** A compact graphite city with the main scene's cyan/rose lights and layered traffic. */
export function createCyberPet({root,minimal=false}){
 const owned=new Set(),moving=[];
 const mat=(color,emissive=false)=>{const m=new T.MeshStandardMaterial({color,roughness:.55,metalness:.35,...(emissive?{emissive:color,emissiveIntensity:1.7}:{})});owned.add(m);return m;};
 const steel=mat(0x536078),dark=mat(0x303442),glass=mat(0x263c51),cyan=mat(0x58e5ed,true),rose=mat(0xed79ba,true),warm=mat(0xf4dba5,true);
 function mesh(geometry,material,x,y,z,parent=root){owned.add(geometry);const m=new T.Mesh(geometry,material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 const box=(w,h,d,m,x,y,z,parent)=>mesh(new T.BoxGeometry(w,h,d),m,x,y,z,parent);
 const base=mesh(new T.CylinderGeometry(minimal?1.8:3.15,minimal?1.65:2.9,.24,8),dark,0,-.12,0);base.scale.z=.52;base.name='Neon harbor floating platform';
 for(const side of [-1,1])box(minimal?2.8:5,.035,.04,side<0?cyan:rose,0,.025,side*(minimal?.65:1.1));
 function tower(x,z,w,h,d,index){const g=new T.Group();g.name='Graphite stepped tower '+index;g.position.set(x,0,z);root.add(g);box(w,h,d,steel,0,h/2,0,g);box(w*.68,.32,d*.76,dark,0,h+.16,0,g);box(w*.83,h*.78,.015,glass,0,h*.52,d/2+.012,g);for(let y=.32;y<h-.1;y+=.3)for(let xx=-w*.3;xx<=w*.3;xx+=.24)box(.09,.065,.024,(Math.round(y*10+xx*10)+index)%3?cyan:warm,xx,y,d/2+.025,g);box(.045,h*.92,.035,index%2?rose:cyan,-w/2-.015,h*.5,d/2,g);box(.035,.3,.035,cyan,0,h+.45,0,g);return g;}
 if(minimal){tower(-.9,-.22,.65,1.7,.6,0);}
 else{tower(-1.9,-.45,.85,2.6,.8,0);tower(-.65,-.8,.9,3.3,.8,1);tower(.65,-.75,.7,2.35,.65,2);tower(1.8,-.4,.8,1.65,.75,3);box(2.8,.12,.28,steel,-.25,1.45,-.48);box(2.8,.025,.035,rose,-.25,1.53,-.32);}
 function ship(){const g=new T.Group();g.name='Neon harbor observation airship';root.add(g);const hull=mesh(new T.SphereGeometry(1,20,12),steel,0,0,0,g);hull.scale.set(.64,.2,.23);box(.35,.15,.22,glass,0,-.2,0,g);for(const z of [-.235,.235])box(.78,.035,.025,cyan,0,-.02,z,g);const fin=box(.22,.32,.045,dark,-.47,.13,0,g);fin.rotation.z=-.4;mesh(new T.SphereGeometry(.055,8,6),rose,-.65,0,0,g);return g;}
 const airship=ship();airship.scale.setScalar(minimal?.72:1);moving.push({object:airship,kind:'airship'});
 if(!minimal)for(let i=0;i<4;i++){const car=new T.Group();car.name='Layered hover taxi';root.add(car);box(.3,.09,.14,i%2?steel:dark,0,0,0,car);box(.14,.07,.12,glass,0,.07,0,car);box(.25,.02,.16,i%2?rose:cyan,0,-.06,0,car);moving.push({object:car,kind:'car',index:i});}
 function update(t,reduced=false){const time=reduced?0:t;for(const item of moving){const o=item.object;if(item.kind==='airship'){o.position.set((minimal?.45:1.05)+Math.sin(time*.18)*(minimal?.4:1.05),minimal?1.65:2.85+Math.sin(time*.27)*.28, .3+Math.cos(time*.18)*(minimal?.15:.42));o.rotation.z=Math.sin(time*.4)*(minimal?.025:.07);}else{const a=time*.35+item.index*Math.PI*.5;o.position.set(Math.sin(a)*2.65,.5+(item.index%2)*.45,Math.cos(a)*.85);o.rotation.y=Math.atan2(Math.cos(a)*2.65,-Math.sin(a)*.85);}}}
 update(0,true);return{update,dispose(){for(const resource of owned)resource.dispose();}};
}
