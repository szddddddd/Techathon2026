import * as T from 'three';

const uniforms=Object.fromEntries(['forest','fuji','ideal'].map(id=>[id,{value:0}]));
// Only called on scene/actor-owned materials. The emissive multiplier is in the
// shader so unread indicators can continue to write their own emissiveIntensity.
export function bindNightMaterial(material,theme,{mappedWindows=false}={}){
 if(!material.isMeshStandardMaterial||!uniforms[theme]||material.userData.dayNightBound)return material;
 const road=/ring-road|straight-road/.test(material.name),core=/colony-core/.test(material.name),tower=/office-tower|bridge-tower/.test(material.name);
 const mask=theme==='ideal'&&!!material.map&&mappedWindows,emits=material.emissive?.getHex()>0;
 if(!mask&&!emits)return material;
 const previous=material.onBeforeCompile,key=material.customProgramCacheKey.bind(material),baseKey=key();
 material.onBeforeCompile=function(shader,renderer){
  previous.call(this,shader,renderer);shader.uniforms.uSceneNight=uniforms[theme];
  shader.vertexShader='varying vec3 vNightWorld;\n'+shader.vertexShader;
   shader.vertexShader=shader.vertexShader.replace('#include <project_vertex>','#include <project_vertex>\nvNightWorld=(modelMatrix*vec4(transformed,1.0)).xyz;');
   shader.fragmentShader='varying vec3 vNightWorld;uniform float uSceneNight;\n'+shader.fragmentShader;
  shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',`#include <emissivemap_fragment>
   totalEmissiveRadiance *= ${material.userData.nightWindowMask?'uSceneNight * 1.65':'mix(0.55, 1.65, uSceneNight)'};
   ${mask?`
   // Conservative albedo mask: colored glass on vertical walls only. White
   // cladding, roofs, foliage and neutral dark rock never become luminous.
   vec3 texel = texture2D(map, vMapUv).rgb;
   float wall = ${road?'1.0':'1.0 - smoothstep(0.25, 0.50, abs(inverseTransformDirection(normal, viewMatrix).y))'};
   float glass = smoothstep(0.035, 0.12, min(texel.g, texel.b) - texel.r * 1.35);
   glass *= smoothstep(0.06, 0.18, min(texel.g,texel.b));
   glass *= 1.0 - smoothstep(0.65, 0.9, max(texel.r, max(texel.g, texel.b)));
   ${tower?`vec3 cell=floor(vNightWorld*vec3(1.35,1.1,1.35));
   float occupied=step(.38,fract(sin(dot(cell,vec3(12.9898,78.233,37.719)))*43758.5453));
   glass*=mix(.025,1.0,occupied);
   totalEmissiveRadiance*=mix(.015,1.0,occupied);`:''}
   totalEmissiveRadiance += vec3(${core?'0.035,0.22,1.0':theme==='ideal'?'0.12,0.58,1.0':'1.0,0.52,0.18'}) * glass * wall * uSceneNight * ${core?'3.2':tower?'2.1':'1.05'};
   `:''}
  `);
 };
 material.customProgramCacheKey=()=>baseKey+'|day-night-v2|'+theme+'|'+mask+'|'+road+'|'+!!material.userData.nightWindowMask;
 material.userData.dayNightBound=true;material.needsUpdate=true;return material;
}

export function createNightEffects(root,theme,{flies}={}){
 const copies=new Map();let emissiveMaterials=0,windowMaterials=0,roadMaterials=0;
 root.traverse(mesh=>{
  if(!mesh.isMesh||mesh.userData.collisionProxy)return;
  let owner=mesh,building=false;while(owner&&owner!==root){if(/house|cottage|building|station|office-tower|bridge-tower|service-building|colony-core|orbital-station/i.test(owner.name+' '+(owner.userData.rodinAsset||'')))building=true;owner=owner.parent;}
  const adapt=source=>{
   const mappedWindows=!!source.map&&(building||/office-tower|bridge-tower|service-building|colony-core|orbital-station|ring-road|straight-road/.test(source.name));
   if(!source.isMeshStandardMaterial||(!mappedWindows&&!source.emissive?.getHex()))return source;
   // Fires keep their daytime flame; the surrounding environment changes.
   if(source.emissiveIntensity>1.8&&!mappedWindows)return source;
   const key=source.uuid+':'+mappedWindows;
   if(!copies.has(key)){const material=source.clone();bindNightMaterial(material,theme,{mappedWindows});copies.set(key,material);if(/ring-road|straight-road/.test(source.name))roadMaterials++;if(mappedWindows)windowMaterials++;else emissiveMaterials++;}
   return copies.get(key);
  };
  mesh.material=Array.isArray(mesh.material)?mesh.material.map(adapt):adapt(mesh.material);
 });
 const decorations=new T.Group();decorations.name='Night scenery · '+theme;root.add(decorations);
 const points=[];for(let i=0;i<(theme==='ideal'?95:50);i++){const x=((i*.61803398875)%1)*1.92-.96,y=.14+((i*.41421356237)%1)*.8;points.push(x*117,y*117,-350);}
 const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(points,3));
 const stars=new T.Points(geometry,new T.PointsMaterial({color:0xd8eaff,size:1.5,sizeAttenuation:false,transparent:true,opacity:0,depthWrite:false,fog:false,toneMapped:false}));stars.name='Quiet night stars';stars.raycast=()=>{};decorations.add(stars);
 let factor=0;
 return{root:decorations,
  // This subtree stays dynamic when scenery freezes. The renderer updates its
  // world matrices after camera-relative transforms, together with other actors.
  setNightFactor(value,camera){factor=T.MathUtils.clamp(value,0,1);uniforms[theme].value=factor;decorations.visible=factor>.001;stars.material.opacity=factor*(theme==='ideal'?.7:.45);if(camera){decorations.position.copy(camera.position);decorations.quaternion.copy(camera.quaternion);stars.scale.x=camera.aspect;}if(flies){flies.visible=factor>.05;flies.material.opacity=factor*.9;}},
  snapshot:()=>({factor,emissiveMaterials,windowMaterials,stars:points.length/3,roadMaterials}),
  // Geometry and materials are released with the owning world resource set.
 };
}
