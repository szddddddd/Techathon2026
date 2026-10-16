import * as THREE from 'three';

/** Restrict the point of interest before OrbitControls computes the camera pose. */
export function constrainCameraPan(controls,camera){
  const center=new THREE.Vector3(0,2.1,0),originalUpdate=controls.update.bind(controls);
  controls.cursor.copy(center);
  const limit=()=>{
    const distance=camera.position.distanceTo(controls.target);
    const halfView=distance*Math.tan(THREE.MathUtils.degToRad(camera.fov)/2)*Math.min(1,camera.aspect);
    return Math.min(6.5,Math.max(.1,halfView*.45));
  };
  controls.update=(...args)=>{
    // Scripted close-ups own the camera until the user regains orbit control.
    controls.maxTargetRadius=controls.enabled?limit():Infinity;
    return originalUpdate(...args);
  };
  return {
    snapshot(){
      camera.updateMatrixWorld(true);const projected=center.clone().project(camera);
      return {enabled:controls.enabled,target:controls.target.toArray(),center:center.toArray(),offset:controls.target.distanceTo(center),limit:limit(),projected:projected.toArray()};
    },
    dispose(){controls.update=originalUpdate;controls.maxTargetRadius=Infinity;},
  };
}
