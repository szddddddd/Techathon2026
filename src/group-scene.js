import {createAnchorLayout} from './social-anchor-layout.js';
import * as T from 'three';import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {GROUP_TYPES,groupOf} from './group-catalog.js';import {GROUP_SLOTS,GROUP_QUEUE,GROUP_COLUMNS,GROUP_ROWS} from './community-layout.js';import {createGroupBuilding} from './group-building-model.js';import {createGroupPresence} from './group-presence.js';
export {createCommunityGround} from './town-landscape.js';
/** Prepare and retain a theme once, before committing a visible scene change. */
export async function loadGroupTemplates({basePath='assets/rodin-groups',assetUrls,createTemplate,fallbackTemplate=createGroupBuilding,theme='forest'}={}){
 const loader=new GLTFLoader(),templates={},failures=[];
 await Promise.all(GROUP_TYPES.map(async type=>{
  if(createTemplate){templates[type.id]=await createTemplate(type.id);return;}
  try{
   const source=assetUrls?.[type.id],url=typeof source==='string'?source:source?.url||`${basePath}/${type.id}/scene.glb`;
   const model=(await loader.loadAsync(url)).scene;model.rotation.y=typeof source==='object'?source.rotation||0:theme==='forest'?type.rotation||0:0;
   const box=new T.Box3().setFromObject(model),s=box.getSize(new T.Vector3()),c=box.getCenter(new T.Vector3());if(!s.y)throw new Error('Empty model');
   const k=Math.min(4/s.x,3.5/s.z,4.2/s.y);model.position.sub(new T.Vector3(c.x,box.min.y,c.z));const holder=new T.Group();holder.add(model);holder.scale.setScalar(k);templates[type.id]=holder;
  }catch{failures.push(type.id);templates[type.id]=fallbackTemplate(type.id);}
 }));
 return{templates,failures,dispose(){const geometries=new Set(),materials=new Set(),textures=new Set();for(const root of Object.values(templates))root.traverse(m=>{if(m.geometry)geometries.add(m.geometry);for(const material of Array.isArray(m.material)?m.material:m.material?[m.material]:[]){materials.add(material);for(const value of Object.values(material))if(value?.isTexture)textures.add(value);}});for(const g of geometries)g.dispose();for(const m of materials)m.dispose();for(const t of textures)t.dispose();}};
}
export async function createGroupScene({scene,camera,canvas,controls,reduced,store,socialUI,ui,obstacles=()=>[],theme='forest',createTemplate,templates:prepared,slots=GROUP_SLOTS,queue=GROUP_QUEUE}){
 let ownTemplates=prepared?null:await loadGroupTemplates({createTemplate,theme}),bundle=prepared||ownTemplates,templates=bundle.templates||bundle,failures=bundle.failures||[];
 const root=new T.Group();root.name='Live group buildings';scene.add(root);const labels=document.createElement('div');labels.id='group-building-labels';document.body.append(labels);const anchorLayout=createAnchorLayout();let lastFrame=performance.now(),lastViewport='',suspended=false,uiHidden=false,disposed=false;const unsubscribe=ui?.subscribe(s=>{uiHidden=!!s.main||!!s.modal;labels.hidden=suspended||uiHidden;});const lines=document.createElementNS('http://www.w3.org/2000/svg','svg');lines.classList.add('group-anchor-lines');labels.append(lines);
 const queueButton=document.createElement('button');queueButton.className='group-queue-anchor';queueButton.setAttribute('aria-label','更多群聊');labels.append(queueButton);queueButton.addEventListener('click',()=>socialUI.openGroupQueue(()=>presence.snapshot().queue,queueButton));
 const presence=createGroupPresence(),actors=new Map(),ray=new T.Raycaster();let down=null,queueKey='',previousUnread=new Map();
 function make(entry,type){
  const group=new T.Group(),body=templates[type].clone(true),materials=[],outline=new T.Group();group.add(body,outline);body.updateMatrixWorld(true);
  body.traverse(m=>{if(!m.isMesh)return;const adapt=src=>{const mat=src.clone();mat.roughness=.94;mat.metalness=0;mat.alphaHash=true;materials.push(mat);return mat;};m.material=Array.isArray(m.material)?m.material.map(adapt):adapt(m.material);m.castShadow=true;m.receiveShadow=true;m.userData.groupId=entry.id;
   const shell=new T.Mesh(m.geometry,new T.MeshBasicMaterial({color:0xd3efad,side:T.BackSide,depthWrite:false}));shell.applyMatrix4(m.matrixWorld);shell.scale.multiplyScalar(1.025);outline.add(shell);
  });outline.visible=false;group.traverse(o=>o.userData.generatedProp=true);const p=slots[entry.slot];group.position.set(p.x,p.y??2.22,p.z);group.rotation.y=p.rotation;root.add(group);
  const letters=new T.Group();for(let i=0;i<4;i++){const material=new T.MeshStandardMaterial({color:0xf3e6ba,alphaHash:true});materials.push(material);const m=new T.Mesh(new T.BoxGeometry(.38,.055,.26),material);m.position.set(1.5-i*.05,.12+i*.09,1.65+i*.025);letters.add(m);}group.add(letters);
  const glow=new T.Mesh(new T.SphereGeometry(.065,8,6),new T.MeshStandardMaterial({color:0xffdc91,emissive:0xffbd55,emissiveIntensity:.4,alphaHash:true}));glow.position.set(.55,1.7,1.73);materials.push(glow.material);group.add(glow);
  const identity=new T.Group(),colors=[0x88a987,0xd3af73,0xc79688,0x8ea9bd],hash=[...entry.id].reduce((n,c)=>(n*31+c.charCodeAt(0))>>>0,0);
  const pole=new T.Mesh(new T.BoxGeometry(.035,1.05,.035),new T.MeshStandardMaterial({color:0x9b805c,alphaHash:true}));pole.position.set(-1.65,.525,1.65);identity.add(pole);
  const flag=new T.Mesh(new T.PlaneGeometry(.32,.2),new T.MeshStandardMaterial({color:colors[hash%colors.length],side:T.DoubleSide,alphaHash:true}));flag.position.set(-1.49,.92,1.65);identity.add(flag);materials.push(pole.material,flag.material);group.add(identity);
  const node=document.createElement('button');node.className='group-building-anchor';node.dataset.group=entry.id;labels.append(node);node.addEventListener('click',()=>socialUI.openConversation({kind:'group',id:entry.id},{origin:()=>node.isConnected?node:document.querySelector('[data-action=directory]')}));
  const line=document.createElementNS('http://www.w3.org/2000/svg','line');lines.append(line);const height=new T.Box3().setFromObject(body).getSize(new T.Vector3()).y;return{group,body,materials,outline,letters,glow,identity,node,line,type,height};
 }
 function project(x,y,z){const p=new T.Vector3(x,y,z).project(camera);return{x:(p.x*.5+.5)*innerWidth,y:(.5-p.y*.5)*innerHeight,visible:p.z>-1&&p.z<1&&Math.abs(p.x)<1.1&&Math.abs(p.y)<1.1};}
 function hit(x,y){if(suspended||disposed)return;ray.setFromCamera(new T.Vector2(x/innerWidth*2-1,1-y/innerHeight*2),camera);return ray.intersectObjects([...actors.values()].map(a=>a.body),true)[0];}
 function pick(x,y){return hit(x,y)?.object.userData.groupId;}
 const pointerDown=e=>{down=null;if(!suspended&&!disposed&&e.button===0&&controls.enabled&&!document.querySelector('dialog[open]'))down={x:e.clientX,y:e.clientY,id:e.pointerId};};
 const pointerUp=e=>{const d=down;down=null;if(!d||e.pointerId!==d.id||Math.hypot(d.x-e.clientX,d.y-e.clientY)>6||!controls.enabled)return;const id=pick(e.clientX,e.clientY);if(id){const a=actors.get(id);socialUI.openConversation({kind:'group',id},{origin:()=>a.node.isConnected?a.node:document.querySelector('[data-action=directory]')});}};
 canvas.addEventListener('pointerdown',pointerDown);canvas.addEventListener('pointerup',pointerUp);
 function releaseActor(a){
  a.group.removeFromParent();if(document.activeElement===a.node)document.querySelector('#dock-reveal')?.focus({preventScroll:true});a.node.remove();a.line.remove();a.glow.geometry.dispose();a.identity.traverse(m=>m.geometry?.dispose());for(const m of a.materials)m.dispose();a.outline.traverse(m=>m.material?.dispose());a.letters.traverse(m=>m.geometry?.dispose());
 }
 function update(now){if(suspended||disposed)return;const projected=[],dt=Math.min(.05,(now-lastFrame)/1000);lastFrame=now;const data=presence.update({state:store.state,activeGroup:socialUI.activeConversation?.kind==='group'?socialUI.activeConversation.id:null,chatVisible:socialUI.chatVisible},now,reduced.matches),wanted=new Set(data.entries.map(e=>e.id));
  for(const [id,a] of actors)if(!wanted.has(id)){releaseActor(a);actors.delete(id);previousUnread.delete(id);}
  for(const entry of data.entries){const g=groupOf(store.state,entry.id);if(!g)continue;let a=actors.get(g.id);if(a&&a.type!==g.type){releaseActor(a);actors.delete(g.id);a=null;}if(!a){a=make(entry,g.type);actors.set(g.id,a);}for(const m of a.materials)m.opacity=entry.alpha;a.group.visible=entry.alpha>.001;a.outline.visible=entry.selected;a.glow.material.emissiveIntensity=entry.unread?.7:.06;a.letters.children.forEach((m,i)=>m.visible=i<(entry.unread>=20?4:entry.unread>=6?3:entry.unread>=2?2:entry.unread?1:0));
   const title=g.name;a.node.title=title;a.node.setAttribute('aria-label',g.name+'，'+entry.unread+'条未读');a.node.classList.toggle('selected',entry.selected);const key=title+'|'+entry.unread;if(a.key!==key){a.key=key;a.node.replaceChildren();const name=document.createElement('span');name.textContent=title;a.node.append(name);if(entry.unread){const n=document.createElement('b');n.textContent=entry.unread>99?'99+':entry.unread;a.node.append(n);}if(entry.unread>(previousUnread.get(g.id)||0)&&!reduced.matches)a.node.animate([{scale:1},{scale:1.07},{scale:1}],{duration:220});previousUnread.set(g.id,entry.unread);}
   const p=project(a.group.position.x,a.group.position.y+a.height+.4,a.group.position.z);a.node.hidden=!p.visible;a.node.style.opacity=entry.alpha;a.projected=p;projected.push({id:g.id,x:p.x,y:p.y-22,width:innerWidth<=760?Math.min(112,innerWidth/GROUP_COLUMNS-10):Math.min(170,40+g.name.length*11),height:48,visible:p.visible});
  }
  const viewport=innerWidth+'x'+innerHeight;if(viewport!==lastViewport){anchorLayout.clear();lastViewport=viewport;}const visibleLabels=projected.filter(p=>p.visible);if(innerWidth<=760&&visibleLabels.length>4&&Math.max(...visibleLabels.map(p=>p.x))-Math.min(...visibleLabels.map(p=>p.x))<(innerWidth<=760?230:340)){const top=theme==='fuji'?92:Math.max(95,Math.min(...visibleLabels.map(p=>p.y))-GROUP_ROWS*50),step=innerWidth<=760?innerWidth/GROUP_COLUMNS:140,center=innerWidth<=760?innerWidth/2:Math.max(220,Math.min(innerWidth-220,(Math.min(...visibleLabels.map(p=>p.x))+Math.max(...visibleLabels.map(p=>p.x)))/2));for(const p of visibleLabels){const slot=data.entries.find(e=>e.id===p.id).slot;p.x=center+(slot%GROUP_COLUMNS-1)*step;p.y=top+Math.floor(slot/GROUP_COLUMNS)*50;p.fixed=true;}}
  const qp=project(queue.x,queue.y??3.5,queue.z);
  for(const point of anchorLayout.update([...obstacles(),{id:'@queue',x:qp.x,y:qp.y,width:60,height:48,visible:qp.visible},...projected],{now,moving:false,width:innerWidth,height:innerHeight,dt:reduced.matches?1:dt,maxLanes:6})){if(point.id==='@queue'){queueButton.style.transform=`translate(${point.x}px,${point.y}px) translate(-50%,-50%)`;continue;}const a=actors.get(point.id);if(!a)continue;a.node.style.transform=`translate(${point.x}px,${point.y}px) translate(-50%,-50%)`;a.line.style.display=a.projected.visible&&Math.abs(point.y-a.projected.y+22)>12?'':'none';for(const [key,value] of Object.entries({x1:point.x,y1:point.y+22,x2:a.projected.x,y2:a.projected.y}))a.line.setAttribute(key,value);}
  const p=project(queue.x,queue.y??3.5,queue.z);queueButton.hidden=!p.visible;const nextQueueKey=data.queue.join('|');if(nextQueueKey!==queueKey){queueKey=nextQueueKey;socialUI.refreshGroupQueue();}queueButton.textContent=data.queue.length?'··· +'+data.queue.length:'···';
 }
 function setScene(next){
  const nextBundle=next.templates||bundle,nextTemplates=nextBundle.templates||nextBundle,nextSlots=next.slots||slots;
  if(nextSlots.length<GROUP_SLOTS.length||GROUP_TYPES.some(t=>!nextTemplates[t.id]))throw new Error('Scene needs nine plots and complete building templates');
  down=null;for(const actor of actors.values())releaseActor(actor);actors.clear();
  if(ownTemplates&&nextBundle!==ownTemplates){ownTemplates.dispose();ownTemplates=null;}
  scene=next.scene||scene;scene.add(root);slots=nextSlots;queue=next.queue||queue;theme=next.theme||theme;bundle=nextBundle;templates=nextTemplates;failures=bundle.failures||[];
  anchorLayout.clear();lastViewport='';lastFrame=performance.now();previousUnread.clear();
  update(lastFrame);
 }
 function suspend(value){suspended=!!value;root.visible=!suspended;labels.hidden=suspended||uiHidden;if(suspended)down=null;}
 return{update,setScene,suspend,get theme(){return theme;},get slots(){return slots;},snapshot:presence.snapshot,get failures(){return failures;},project,pick,hit,dispose(){if(disposed)return;disposed=true;unsubscribe?.();anchorLayout.clear();canvas.removeEventListener('pointerdown',pointerDown);canvas.removeEventListener('pointerup',pointerUp);for(const a of actors.values())releaseActor(a);actors.clear();root.removeFromParent();labels.remove();ownTemplates?.dispose();}};
}
