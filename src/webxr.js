import * as T from 'three';

/** PICO/browser WebXR spectator mode. No platform SDK or second scene instance. */
export function createWebXR({renderer, scene, camera, controls, beforeEnter=()=>{}, onError=()=>{}, getSceneName=()=> 'WeRoam'}) {
  const xr=renderer.xr, rig=new T.Group(), events=new AbortController(), viewCamera=camera.clone();
  rig.name='WeRoam XR origin';
  let session=null, pending=false, saved=null, disposed=false, supported=false, resources=null, centered=false, status='checking';
  const eye=new T.Vector3(), after=new T.Vector3(), angles=new T.Euler(0,0,0,'YXZ');
  const raycaster=new T.Raycaster(), rotation=new T.Matrix4(), direction=new T.Vector3();
  const entry=document.createElement('button');entry.id='webxr-entry';entry.type='button';entry.hidden=true;
  entry.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16l2 10-3 2h-4l-3-3-3 3H5l-3-2Z"/><circle cx="7.5" cy="12" r="2"/><circle cx="16.5" cy="12" r="2"/></svg><span>进入 VR</span>';
  entry.setAttribute('aria-label','在 PICO 或其他兼容头盔中进入 VR');document.body.append(entry);
  const showError=error=>onError(error?.name==='NotAllowedError'?'请在头盔中允许 VR 授权后重试':error?.name==='NotSupportedError'?'当前头盔浏览器未提供所需 VR 能力，请更新浏览器后重试':error?.message||'VR 暂时无法启动，请重试');
  const wanted=/pico/i.test(navigator.userAgent)||new URLSearchParams(location.search).has('vr');
  const buttonRects=[
    {x:30,y:155,w:228,h:112,label:'缩小',action:()=>zoom(1.2)},
    {x:275,y:155,w:228,h:112,label:'放大',action:()=>zoom(1/1.2)},
    {x:520,y:155,w:228,h:112,label:'回正',action:()=>recenter()},
    {x:765,y:155,w:228,h:112,label:'退出 VR',action:()=>exit()}
  ];
  function drawPanel(message='扳机选择 · 侧键收起或展开面板') {
    if(!resources)return;
    const ctx=resources.canvas.getContext('2d');ctx.clearRect(0,0,1024,320);
    ctx.fillStyle='#ffffff';ctx.beginPath();ctx.roundRect(0,0,1024,320,28);ctx.fill();
    ctx.fillStyle='#1d1d1f';ctx.font='600 38px system-ui';ctx.fillText('WeRoam · '+getSceneName(),30,57);
    ctx.fillStyle='#64646c';ctx.font='25px system-ui';ctx.fillText(message,30,106);
    for(const b of buttonRects){ctx.fillStyle='#f0f2f5';ctx.beginPath();ctx.roundRect(b.x,b.y,b.w,b.h,18);ctx.fill();ctx.fillStyle='#1d1d1f';ctx.font='30px system-ui';ctx.textAlign='center';ctx.fillText(b.label,b.x+b.w/2,b.y+65);ctx.textAlign='left';}
    resources.texture.needsUpdate=true;
  }
  function makeResources() {
    const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=320;
    const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;
    const panel=new T.Mesh(new T.PlaneGeometry(1.5,1.5*320/1024),new T.MeshBasicMaterial({map:texture,transparent:true,depthTest:false,toneMapped:false}));
    panel.name='WeRoam VR controls';panel.renderOrder=1000;rig.add(panel);
    const geometry=new T.BufferGeometry().setFromPoints([new T.Vector3(),new T.Vector3(0,0,-1)]);
    const material=new T.LineBasicMaterial({color:0x0066cc,toneMapped:false});
    const controllers=[0,1].map(index=>{
      const controller=xr.getController(index),line=new T.Line(geometry,material);line.scale.z=2;controller.add(line);rig.add(controller);
      const select=()=>{
        if(!panel.visible||!session)return;
        controller.updateWorldMatrix(true,false);rotation.extractRotation(controller.matrixWorld);
        raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);raycaster.ray.direction.set(0,0,-1).applyMatrix4(rotation);
        panel.updateWorldMatrix(true,false);const hit=raycaster.intersectObject(panel,false)[0];if(!hit)return;
        const x=hit.uv.x*1024,y=(1-hit.uv.y)*320;
        const button=buttonRects.find(b=>x>=b.x&&x<=b.x+b.w&&y>=b.y&&y<=b.y+b.h);
        if(button)Promise.resolve(button.action()).catch(showError);
      };
      const squeeze=()=>{panel.visible=!panel.visible;if(panel.visible)placePanel();};
      controller.addEventListener('selectstart',select);controller.addEventListener('squeezestart',squeeze);
      return {controller,line,select,squeeze};
    });
    resources={canvas,texture,panel,geometry,material,controllers};drawPanel();
  }
  function placePanel(){
    if(!resources)return;
    angles.setFromQuaternion(camera.quaternion,'YXZ');resources.panel.rotation.set(0,angles.y,0);
    direction.set(0,-.35,-1.45).applyAxisAngle(T.Object3D.DEFAULT_UP,angles.y);
    resources.panel.position.copy(camera.position).add(direction);
  }
  function recenter(){
    if(!saved)return;
    angles.setFromQuaternion(saved.quaternion,'YXZ');const desiredYaw=angles.y;
    angles.setFromQuaternion(camera.quaternion,'YXZ');rig.rotation.set(0,desiredYaw-angles.y,0);
    rig.position.copy(saved.position).sub(after.copy(camera.position).multiply(rig.scale).applyQuaternion(rig.quaternion));
    rig.updateMatrixWorld(true);placePanel();centered=true;
  }
  function zoom(factor){
    if(!session)return;
    camera.getWorldPosition(eye);rig.scale.setScalar(T.MathUtils.clamp(rig.scale.x*factor,3,80));rig.updateMatrixWorld(true);
    camera.getWorldPosition(after);rig.position.add(eye.sub(after));rig.updateMatrixWorld(true);
  }
  function releaseResources(){
    if(!resources)return;
    for(const {controller,line,select,squeeze} of resources.controllers){controller.removeEventListener('selectstart',select);controller.removeEventListener('squeezestart',squeeze);line.removeFromParent();controller.removeFromParent();}
    resources.panel.removeFromParent();resources.panel.geometry.dispose();resources.panel.material.dispose();resources.texture.dispose();resources.geometry.dispose();resources.material.dispose();resources=null;
  }
  function restore(){
    releaseResources();rig.removeFromParent();
    if(saved){
      if(saved.parent)saved.parent.add(camera);else camera.removeFromParent();
      camera.position.copy(saved.position);camera.quaternion.copy(saved.quaternion);camera.scale.copy(saved.scale);
      camera.near=saved.near;camera.far=saved.far;camera.aspect=saved.aspect;camera.fov=saved.fov;camera.updateProjectionMatrix();camera.updateMatrixWorld(true);
      controls.target.copy(saved.target);controls.enabled=saved.enabled;controls.enableDamping=saved.damping;controls.autoRotate=saved.autoRotate;
    }
    saved=null;centered=false;delete document.documentElement.dataset.xr;entry.querySelector('span').textContent='进入 VR';
    pending=false;entry.disabled=false;
  }
  const ended=()=>{session?.removeEventListener('end',ended);session=null;restore();status=disposed?'disposed':'ready';};
  async function enter(){
    if(disposed||pending||session)return false;
    if(!supported){throw Error(!isSecureContext?'请使用 USB 本地连接或可信 HTTPS 地址打开':'当前浏览器未提供 VR，请在 PICO 浏览器中打开');}
    // Synchronous guard preserves the browser's user gesture for requestSession.
    beforeEnter();pending=true;entry.disabled=true;status='requesting';
    try{
      const next=await navigator.xr.requestSession('immersive-vr',{requiredFeatures:['local-floor']});
      if(disposed){await next.end();return false;}
      session=next;session.addEventListener('end',ended);
      saved={parent:camera.parent,position:camera.position.clone(),quaternion:camera.quaternion.clone(),scale:camera.scale.clone(),near:camera.near,far:camera.far,aspect:camera.aspect,fov:camera.fov,target:controls.target.clone(),enabled:controls.enabled,damping:controls.enableDamping,autoRotate:controls.autoRotate};
      controls.enabled=false;controls.autoRotate=false;
      rig.position.copy(saved.position);rig.rotation.set(0,0,0);rig.scale.setScalar(T.MathUtils.clamp(saved.position.distanceTo(saved.target)/3,5,40));
      camera.position.set(0,0,0);camera.quaternion.identity();camera.scale.set(1,1,1);rig.add(camera);scene.add(rig);
      makeResources();xr.enabled=true;xr.setReferenceSpaceType('local-floor');xr.setFoveation(0);
      await xr.setSession(session);
      if(disposed||session!==next)return false;
      document.documentElement.dataset.xr='presenting';entry.querySelector('span').textContent='退出 VR';pending=false;entry.disabled=false;status='presenting';return true;
    }catch(error){
      const failed=session;if(failed){failed.removeEventListener('end',ended);session=null;await failed.end().catch(()=>{});}
      restore();status=disposed?'disposed':'ready';throw error;
    }
  }
  async function exit(){if(session)await session.end();}
  entry.addEventListener('click',()=>{void (session?exit():enter()).catch(showError);},{signal:events.signal});
  const ready=(async()=>{
    try{supported=!!(isSecureContext&&navigator.xr&&await navigator.xr.isSessionSupported('immersive-vr'));}catch{supported=false;}
    if(disposed)return false;
    status=supported?'ready':'unavailable';entry.hidden=!supported&&!wanted;return supported;
  })();
  return {ready,enter,exit,viewCamera,get active(){return !!saved;},get busy(){return pending||!!saved;},
    update(){if(!session||!saved)return;rig.updateMatrixWorld(true);xr.updateCamera(camera);if(!centered)recenter();camera.updateWorldMatrix(true,false);viewCamera.copy(camera,false);camera.matrixWorld.decompose(viewCamera.position,viewCamera.quaternion,viewCamera.scale);viewCamera.updateMatrixWorld(true);},
    snapshot:()=>({status,supported,active:!!saved,scale:rig.scale.x,resources:!!resources,controllers:resources?.controllers.length||0}),
    dispose(){if(disposed)return;disposed=true;events.abort();entry.remove();const previous=session;previous?.removeEventListener('end',ended);session=null;restore();void previous?.end().catch(()=>{});status='disposed';}
  };
}
