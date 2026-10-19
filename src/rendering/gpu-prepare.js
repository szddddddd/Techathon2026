import {Group} from 'three';

const nextPaint=()=>new Promise(resolve=>requestAnimationFrame(resolve));
/** Compile in parallel where supported and yield between original texture
 * uploads. Keep every texel, sample count and shadow setting unchanged. */
export async function prepareSceneGPU(renderer,scene,camera){
 const start=performance.now(),warm=new Group(),textures=new Set();let meshes=0;
 scene.traverseVisible(object=>{
  if(!(object.isMesh||object.isPoints||object.isLine||object.isSprite))return;
  warm.add(object.clone(false));meshes++;
  for(const m of Array.isArray(object.material)?object.material:[object.material])if(m)for(const value of Object.values(m))if(value?.isTexture)textures.add(value);
 });
 // compile() traverses invisible collision and picker originals, too. The
 // detached warm-up view includes just the render path without changing live
 // parents, skeletons, visibility or interaction references.
 await nextPaint();
 await renderer.compileAsync(warm,camera,scene);
 let slice=performance.now(),yields=0;
 for(const texture of textures){renderer.initTexture(texture);if(performance.now()-slice>6){yields++;await nextPaint();slice=performance.now();}}
 warm.clear();return{milliseconds:performance.now()-start,meshes,textures:textures.size,yields,parallelShaders:renderer.extensions.has('KHR_parallel_shader_compile')};
}
