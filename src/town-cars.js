import * as T from 'three';
import {COMMUNITY_CARS,COMMUNITY_HEIGHT} from './community-layout.js';

// Static miniature cars: merged with the other street furniture by the caller.
export function addTownCars(root){
 const mat=(color,roughness=.8)=>new T.MeshStandardMaterial({color,roughness,flatShading:true});
 const cream=mat(0xf5ecd4),glass=mat(0x466d72,.35),rubber=mat(0x384340),rim=mat(0xb8beb0),rear=mat(0xc36c55),lamp=mat(0xffe9b3);
 function part(parent,name,g,m,x,y,z){const mesh=new T.Mesh(g,m);mesh.name=name;mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
 function rounded(parent,name,w,h,d,m,x,y,z,bevel=.04){
  const s=new T.Shape(),a=w/2-bevel,b=h/2-bevel;s.moveTo(-a,-b);s.lineTo(a,-b);s.lineTo(a,b);s.lineTo(-a,b);s.closePath();
  const g=new T.ExtrudeGeometry(s,{depth:d-2*bevel,bevelEnabled:true,bevelThickness:bevel,bevelSize:bevel,bevelSegments:1,steps:1,curveSegments:1});g.translate(0,0,-d/2+bevel);
  return part(parent,name,g,m,x,y,z);
 }
 for(const p of COMMUNITY_CARS){
  const car=new T.Group();car.name=p.id;car.position.set(p.x,COMMUNITY_HEIGHT+.03,p.z);car.rotation.y=p.rotation;root.add(car);
  const paint=mat(p.color,.64);
  rounded(car,'Soft faceted compact body',.86,.32,1.76,paint,0,.39,0,.07);
  rounded(car,'Front hood',.8,.12,.49,paint,0,.55,.57);
  // Side profile extrusion makes a sloped windshield and short rear hatch.
  const profile=new T.Shape();profile.moveTo(-.51,.5);profile.lineTo(.49,.5);profile.lineTo(.25,.94);profile.lineTo(-.35,.94);profile.closePath();
  const cabin=new T.ExtrudeGeometry(profile,{depth:.69,bevelEnabled:false,steps:1});
  cabin.rotateY(-Math.PI/2);cabin.translate(.345,0,0);part(car,'Blue green glazing',cabin,glass,0,0,0);
  rounded(car,'Ivory roof',.73,.09,.68,cream,0,.95,-.05,.035);
  for(const side of [-1,1]){
   rounded(car,'Window centre pillar',.035,.37,.055,paint,side*.352,.74,-.12,.012);
   rounded(car,'Door handle',.035,.035,.13,cream,side*.443,.52,-.13,.01);
   rounded(car,'Wing mirror',.12,.09,.13,paint,side*.44,.66,.36,.02);
   for(const z of [-.55,.55]){
    const tire=part(car,'Small rubber wheel',new T.CylinderGeometry(.195,.195,.12,12),rubber,side*.414,.195,z);tire.rotation.z=Math.PI/2;
    const hub=part(car,'Ivory wheel hub',new T.CylinderGeometry(.10,.10,.125,10),rim,side*.42,.195,z);hub.rotation.z=Math.PI/2;
   }
   rounded(car,'Front headlamp',.19,.10,.04,lamp,side*.255,.47,.875,.012);
   rounded(car,'Rear lamp',.14,.09,.035,rear,side*.29,.45,-.88,.01);
  }
  for(const z of [-.89,.89])rounded(car,'Cream bumper',.66,.065,.06,cream,0,.29,z,.02);
 }
}
