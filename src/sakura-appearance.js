import * as T from 'three';

/** Tint light blossom texels while preserving the dark, warm bark from Rodin. */
export function createBlossomMaterial(source,geometry,tone,palette){
 const material=source.clone();geometry.computeBoundingBox();
 const box=geometry.boundingBox,span=Math.max(.001,box.max.y-box.min.y);
 material.onBeforeCompile=shader=>{
  shader.uniforms.uBlossomColor={value:new T.Color(palette[tone])};
  shader.uniforms.uTreeBase={value:box.min.y};shader.uniforms.uTreeSpan={value:span};
  shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nuniform float uTreeBase;uniform float uTreeSpan;varying float vBlossomHeight;')
   .replace('#include <begin_vertex>','#include <begin_vertex>\nvBlossomHeight=(position.y-uTreeBase)/uTreeSpan;');
  shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nuniform vec3 uBlossomColor;varying float vBlossomHeight;')
   .replace('#include <color_fragment>',`#include <color_fragment>
float blossomLight=dot(diffuseColor.rgb,vec3(.2126,.7152,.0722));
float blossomMask=smoothstep(.12,.34,blossomLight)*smoothstep(.65,.95,diffuseColor.b/max(.001,diffuseColor.g))*smoothstep(.24,.42,vBlossomHeight);
vec3 blossomAlbedo=uBlossomColor*mix(.78,1.06,clamp(blossomLight*1.5,0.0,1.0));
diffuseColor.rgb=mix(diffuseColor.rgb,blossomAlbedo,blossomMask);`);
 };
 material.customProgramCacheKey=()=> 'sakura-three-blossom-tones-v1';
 material.userData.blossomTone=tone;
 return material;
}
