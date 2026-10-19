/** Keep authored transforms; skip recalculating immutable scenery every frame.
 * Animated subtrees retain Three.js' ordinary transform update behaviour.
 */
export function freezeStaticTransforms(scene,dynamicRoots=[]){
 const animated=new Set();for(const root of dynamicRoots)root?.traverse(object=>animated.add(object));
 scene.updateMatrixWorld(true);
 let frozen=0;
 scene.traverse(object=>{if(animated.has(object))return;object.updateMatrix();object.matrixAutoUpdate=false;frozen++;});
 return frozen;
}
