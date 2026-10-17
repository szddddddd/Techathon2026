import * as THREE from 'three';

/** Contour planting on the existing mountain, without changing its silhouette. */
export function styleMountainTerraces(root,{cloneMaterials=true}={}){
 // Match the meadow and pale tree crowns under the forest's warm lighting.
 const colors={paddy:new THREE.Color('#789750'),young:new THREE.Color('#97ab65'),rim:new THREE.Color('#b4bb7e'),earth:new THREE.Color('#84916b'),meadow:new THREE.Color('#839c46')};
 const materials=new Map();
 function style(source){
  if(materials.has(source))return materials.get(source);
  const material=cloneMaterials?source.clone():source;material.color.set(0xffffff);
  material.onBeforeCompile=shader=>{
   for(const [name,value] of Object.entries(colors))shader.uniforms['terrace_'+name]={value};
   shader.vertexShader='varying float vTerraceHeight;varying vec3 vTerraceNormal;\n'+shader.vertexShader;
   shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
    vTerraceHeight=(modelMatrix*vec4(transformed,1.0)).y;
    vTerraceNormal=normalize(mat3(modelMatrix)*objectNormal);`);
   shader.fragmentShader='varying float vTerraceHeight;varying vec3 vTerraceNormal;uniform vec3 terrace_paddy;uniform vec3 terrace_young;uniform vec3 terrace_rim;uniform vec3 terrace_earth;uniform vec3 terrace_meadow;\n'+shader.fragmentShader;
   shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
    float level=(vTerraceHeight-1.4)/1.7;
    float band=fract(level);
    float alternate=mod(floor(level),3.0)/2.0;
    vec3 field=mix(terrace_paddy,terrace_young,alternate);
    float edge=1.0-smoothstep(0.025,0.095,min(band,1.0-band));
    field=mix(field,terrace_rim,edge*0.45);
    float face=1.0-smoothstep(0.35,0.8,abs(normalize(vTerraceNormal).y));
    vec3 planting=mix(field,terrace_earth,face*0.42);
    planting=mix(terrace_meadow,planting,smoothstep(1.4,4.2,vTerraceHeight));
    // Preserve the source texture's small painted variations and normal detail.
    float detail=clamp(dot(diffuseColor.rgb,vec3(0.2126,0.7152,0.0722))*1.6,0.82,1.12);
    diffuseColor.rgb=planting*detail;`);
  };
  material.customProgramCacheKey=()=> 'mountain-rice-terraces-v2';material.needsUpdate=true;materials.set(source,material);return material;
 }
 root.traverse(object=>{if(object.isMesh)object.material=Array.isArray(object.material)?object.material.map(style):style(object.material);});
}
