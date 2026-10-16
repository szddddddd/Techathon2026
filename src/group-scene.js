import {createGroupMessageBoard} from './group-message-board.js';
import {createAnchorLayout} from './social-anchor-layout.js';
import {unreadTier} from './social-presence.js';
import * as T from 'three';import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {GROUP_TYPES,groupOf} from './group-catalog.js';import {GROUP_SLOTS,GROUP_QUEUE} from './community-layout.js';import {createGroupBuilding} from './group-building-model.js';import {createGroupPresence} from './group-presence.js';
export {createCommunityGround} from './town-landscape.js';
/** Prepare and retain a theme once, before committing a visible scene change. */
export async function loadGroupTemplates({basePath='assets/rodin-groups',assetUrls,createTemplate,fallbackTemplate=createGroupBuilding,theme='forest',onLoad=()=>{}}={}){
 const loader=new GLTFLoader(),templates={},failures=[],loading=new Map(),sources=new Set();let disposed=false;
 function retain(model){sources.add(model);onLoad(model);return model;}
 function disposeSource(root){const geometries=new Set(),materials=new Set(),textures=new Set();root.traverse(m=>{if(m.geometry)geometries.add(m.geometry);for(const material of [].concat(m.material||[])){materials.add(material);for(const value of Object.values(material))if(value?.isTexture)textures.add(value);}});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());}
 function get(id){
  if(templates[id])return templates[id];
  templates[id]=retain(fallbackTemplate(id));const type=GROUP_TYPES.find(t=>t.id===id);
  const request=(async()=>{try{
   const source=assetUrls?.[id],url=typeof source==='string'?source:source?.url||`${basePath}/${id}/scene.glb`;
   const model=(await loader.loadAsync(url)).scene;model.rotation.y=typeof source==='object'?source.rotation||0:theme==='forest'?type?.rotation||0:0;
   const box=new T.Box3().setFromObject(model),size=box.getSize(new T.Vector3()),c=box.getCenter(new T.Vector3());if(!size.y)throw Error('Empty model');
   model.position.sub(new T.Vector3(c.x,box.min.y,c.z));const holder=new T.Group();holder.add(model);holder.scale.setScalar(Math.min(4/size.x,3.5/size.z,4.2/size.y));
   if(disposed)disposeSource(holder);else templates[id]=retain(holder);
  }catch{if(!disposed)failures.push(id);}finally{loading.delete(id);}})();loading.set(id,request);return templates[id];
 }
 if(createTemplate)await Promise.all(GROUP_TYPES.map(async type=>templates[type.id]=retain(await createTemplate(type.id))));
 return{templates,failures,get,loading,dispose(){disposed=true;sources.forEach(disposeSource);sources.clear();}};
}
export async function createGroupScene({scene,camera,canvas,controls,reduced,store,socialUI,ui,onFocus=async()=>{},obstacles=()=>[],theme='forest',createTemplate,templates:prepared,slots=GROUP_SLOTS,queue=GROUP_QUEUE}){
 let ownTemplates=prepared?null:await loadGroupTemplates({createTemplate,theme}),bundle=prepared||ownTemplates,templates=bundle.templates||bundle,failures=bundle.failures||[];
 const root=new T.Group();root.name='Live group buildings';scene.add(root);const labels=document.createElement('div');labels.id='group-building-labels';document.body.append(labels);const anchorLayout=createAnchorLayout();let lastFrame=performance.now(),lastViewport='',suspended=false,uiHidden=false,disposed=false;const unsubscribe=ui?.subscribe(s=>{uiHidden=!!s.main||!!s.modal;labels.hidden=suspended||uiHidden;});
 const messageBoard=createGroupMessageBoard({scene:root,store,position:queue});
 const template=id=>bundle.get?bundle.get(id):templates[id];
 function placeBoard(){messageBoard.root.position.set(queue.x,queue.y??2.22,queue.z);messageBoard.root.scale.setScalar(theme==='fuji'?.45:1);}
 placeBoard();
 async function openBoard(){const id=messageBoard.latestId;if(id)await socialUI.openConversation({kind:'group',id},{origin:queueButton});else socialUI.openGroupQueue(()=>presence.snapshot().queue,queueButton);await onFocus(messageBoard.focus());}
 const queueButton=document.createElement('button');queueButton.className='group-queue-anchor';queueButton.setAttribute('aria-label','更多群聊');labels.append(queueButton);queueButton.addEventListener('click',()=>{if(presence.snapshot().queue.length){socialUI.openGroupQueue(()=>presence.snapshot().queue,queueButton);void onFocus(messageBoard.focus());}else void openBoard();});
 const presence=createGroupPresence(),actors=new Map(),ray=new T.Raycaster();let down=null,queueKey='',previousUnread=new Map();
 function removeActor(id){
  const a=actors.get(id);if(!a)return;
  a.group.removeFromParent();if(!disposed&&document.activeElement===a.node)document.querySelector('#dock-reveal')?.focus({preventScroll:true});a.node.remove();
  a.glow.geometry.dispose();a.identity.traverse(m=>m.geometry?.dispose());a.materials.forEach(m=>m.dispose());a.outline.traverse(m=>m.material?.dispose());a.letters.traverse(m=>m.geometry?.dispose());
  actors.delete(id);previousUnread.delete(id);
 }
 async function openGroup(id){const a=actors.get(id);if(!a)return;await socialUI.openConversation({kind:'group',id},{origin:()=>a.node.isConnected?a.node:document.querySelector('[data-action=directory]')});await onFocus(a.group.position.clone().add(new T.Vector3(0,a.height*.5,0)));}
 function make(entry,type){
  const source=template(type),group=new T.Group(),body=source.clone(true),materials=[],outline=new T.Group();group.add(body,outline);body.updateMatrixWorld(true);
  body.traverse(m=>{if(!m.isMesh)return;const adapt=src=>{const mat=src.clone();mat.roughness=.94;mat.metalness=0;mat.alphaHash=true;materials.push(mat);return mat;};m.material=Array.isArray(m.material)?m.material.map(adapt):adapt(m.material);m.castShadow=true;m.receiveShadow=true;m.userData.groupId=entry.id;
   const shell=new T.Mesh(m.geometry,new T.MeshBasicMaterial({color:0xd3efad,side:T.BackSide,depthWrite:false}));shell.applyMatrix4(m.matrixWorld);shell.scale.multiplyScalar(1.025);outline.add(shell);
  });outline.visible=false;group.traverse(o=>o.userData.generatedProp=true);const p=slots[entry.slot];group.position.set(p.x,p.y??2.22,p.z);group.rotation.y=p.rotation;root.add(group);
  const letters=new T.Group();for(let i=0;i<4;i++){const material=new T.MeshStandardMaterial({color:0xf3e6ba,alphaHash:true});materials.push(material);const m=new T.Mesh(new T.BoxGeometry(.38,.055,.26),material);m.position.set(1.5-i*.05,.12+i*.09,1.65+i*.025);letters.add(m);}group.add(letters);
  const glow=new T.Mesh(new T.SphereGeometry(.065,8,6),new T.MeshStandardMaterial({color:0xffdc91,emissive:0xffbd55,emissiveIntensity:.4,alphaHash:true}));glow.position.set(.55,1.7,1.73);materials.push(glow.material);group.add(glow);
  const identity=new T.Group(),colors=[0x88a987,0xd3af73,0xc79688,0x8ea9bd],hash=[...entry.id].reduce((n,c)=>(n*31+c.charCodeAt(0))>>>0,0);
  const pole=new T.Mesh(new T.BoxGeometry(.035,1.05,.035),new T.MeshStandardMaterial({color:0x9b805c,alphaHash:true}));pole.position.set(-1.65,.525,1.65);identity.add(pole);
  const flag=new T.Mesh(new T.PlaneGeometry(.32,.2),new T.MeshStandardMaterial({color:colors[hash%colors.length],side:T.DoubleSide,alphaHash:true}));flag.position.set(-1.49,.92,1.65);identity.add(flag);materials.push(pole.material,flag.material);group.add(identity);
  const node=document.createElement('button');node.className='group-building-anchor';node.dataset.group=entry.id;labels.append(node);node.addEventListener('click',()=>void openGroup(entry.id));
  const height=new T.Box3().setFromObject(body).getSize(new T.Vector3()).y;return{group,body,materials,outline,letters,glow,identity,node,type,height,source};
 }
 function project(x,y,z){const p=new T.Vector3(x,y,z).project(camera);return{x:(p.x*.5+.5)*innerWidth,y:(.5-p.y*.5)*innerHeight,visible:p.z>-1&&p.z<1&&Math.abs(p.x)<1.1&&Math.abs(p.y)<1.1};}
 function hit(x,y){if(suspended||disposed)return;ray.setFromCamera(new T.Vector2(x/innerWidth*2-1,1-y/innerHeight*2),camera);return ray.intersectObjects([...actors.values()].map(a=>a.body),true)[0];}
 function pick(x,y){return hit(x,y)?.object.userData.groupId;}
 const pointerDown=e=>{down=null;if(!suspended&&!disposed&&e.button===0&&controls.enabled&&!document.querySelector('dialog[open]'))down={x:e.clientX,y:e.clientY,id:e.pointerId};};
 const pointerUp=e=>{const d=down;down=null;if(suspended||disposed||!d||e.pointerId!==d.id||Math.hypot(d.x-e.clientX,d.y-e.clientY)>6||!controls.enabled)return;ray.setFromCamera(new T.Vector2(e.clientX/innerWidth*2-1,1-e.clientY/innerHeight*2),camera);if(ray.intersectObject(messageBoard.root,true).length){void openBoard();return;}const id=pick(e.clientX,e.clientY);if(id)void openGroup(id);};
 canvas.addEventListener('pointerdown',pointerDown);canvas.addEventListener('pointerup',pointerUp);
 function releaseActor(a){
  a.group.removeFromParent();if(document.activeElement===a.node)document.querySelector('#dock-reveal')?.focus({preventScroll:true});a.node.remove();a.glow.geometry.dispose();a.identity.traverse(m=>m.geometry?.dispose());for(const m of a.materials)m.dispose();a.outline.traverse(m=>m.material?.dispose());a.letters.traverse(m=>m.geometry?.dispose());
 }
 function update(now){if(suspended||disposed)return;messageBoard.update();const dt=Math.min(.05,(now-lastFrame)/1000);lastFrame=now;const data=presence.update({state:store.state,activeGroup:socialUI.activeConversation?.kind==='group'?socialUI.activeConversation.id:null,chatVisible:socialUI.chatVisible},now,reduced.matches),wanted=new Set(data.entries.map(e=>e.id));
  for(const [id,a] of actors)if(!wanted.has(id)){releaseActor(a);actors.delete(id);previousUnread.delete(id);}
  for(const entry of data.entries){const g=groupOf(store.state,entry.id);if(!g)continue;let a=actors.get(g.id);if(a&&(a.type!==g.type||a.source!==templates[g.type])){releaseActor(a);actors.delete(g.id);a=null;}if(!a){a=make(entry,g.type);actors.set(g.id,a);}for(const m of a.materials)m.opacity=entry.alpha;a.group.visible=entry.alpha>.001;a.outline.visible=entry.selected;a.glow.material.emissiveIntensity=entry.unread?.7:.06;a.letters.children.forEach((m,i)=>m.visible=i<(entry.unread>=20?4:entry.unread>=6?3:entry.unread>=2?2:entry.unread?1:0));
   a.node.title=g.name;a.node.setAttribute('aria-label',g.name+'，'+entry.unread+'条未读来信');a.node.classList.toggle('selected',entry.selected);a.node.dataset.unreadTier=unreadTier(entry.unread);
   const key=g.name+'|'+entry.unread;if(a.key!==key){a.key=key;a.node.replaceChildren();const stack=document.createElement('span');stack.className='letter-stack';stack.setAttribute('aria-hidden','true');for(let i=0;i<unreadTier(entry.unread);i++){const letter=document.createElement('i');letter.style.setProperty('--letter',i);stack.append(letter);}const count=document.createElement('b');count.className='group-unread-count';count.textContent=entry.unread>99?'99+':entry.unread;a.node.append(stack,count);if(entry.unread>(previousUnread.get(g.id)||0)&&!reduced.matches)a.node.animate([{scale:1},{scale:1.08},{scale:1}],{duration:260,easing:'ease-out'});previousUnread.set(g.id,entry.unread);}
   const p=project(a.group.position.x,a.group.position.y+a.height+.4,a.group.position.z),visible=p.visible&&entry.unread>0;a.node.hidden=!visible;a.node.style.opacity=entry.alpha;a.node.style.transform=`translate(${p.x}px,${p.y}px) translate(-50%,-100%)`;
  }
  const viewport=innerWidth+'x'+innerHeight;if(viewport!==lastViewport){anchorLayout.clear();lastViewport=viewport;}
  const qp=project(queue.x,queue.y??(theme==='fuji'?4.3:6.45),queue.z);
  for(const point of anchorLayout.update([...obstacles(),{id:'@queue',x:qp.x,y:qp.y,width:60,height:48,visible:qp.visible}],{now,moving:false,width:innerWidth,height:innerHeight,dt:reduced.matches?1:dt,maxLanes:6})){if(point.id==='@queue'){queueButton.style.transform=`translate(${point.x}px,${point.y}px) translate(-50%,-50%)`;}}
  const p=project(queue.x,queue.y??(theme==='fuji'?4.3:6.45),queue.z);queueButton.hidden=!p.visible;const nextQueueKey=data.queue.join('|');if(nextQueueKey!==queueKey){queueKey=nextQueueKey;socialUI.refreshGroupQueue();}queueButton.textContent=data.queue.length?'··· +'+data.queue.length:'群聊来信';
 }
 function setScene(next){
  const nextBundle=next.templates||bundle,nextTemplates=nextBundle.templates||nextBundle,nextSlots=next.slots||slots;
  if(nextSlots.length<GROUP_SLOTS.length||(!nextBundle.get&&GROUP_TYPES.some(t=>!nextTemplates[t.id])))throw new Error('Scene needs nine plots and complete building templates');
  down=null;for(const actor of actors.values())releaseActor(actor);actors.clear();
  if(ownTemplates&&nextBundle!==ownTemplates){ownTemplates.dispose();ownTemplates=null;}
  scene=next.scene||scene;scene.add(root);slots=nextSlots;queue=next.queue||queue;theme=next.theme||theme;bundle=nextBundle;templates=nextTemplates;failures=bundle.failures||[];placeBoard();
  anchorLayout.clear();lastViewport='';lastFrame=performance.now();previousUnread.clear();
  update(lastFrame);
 }
 function suspend(value){suspended=!!value;root.visible=!suspended;labels.hidden=suspended||uiHidden;if(suspended)down=null;}
 return{root,messageBoard,get assets(){return{ready:Object.keys(templates).filter(id=>!bundle.loading?.has(id)&&!failures.includes(id)),loading:[...bundle.loading?.keys()||[]],failures:[...failures]};},update,setScene,suspend,get theme(){return theme;},get slots(){return slots;},snapshot:presence.snapshot,get failures(){return failures;},project,pick,hit,dispose(){if(disposed)return;disposed=true;messageBoard.dispose();unsubscribe?.();anchorLayout.clear();canvas.removeEventListener('pointerdown',pointerDown);canvas.removeEventListener('pointerup',pointerUp);for(const a of actors.values())releaseActor(a);actors.clear();root.removeFromParent();labels.remove();ownTemplates?.dispose();}};
}
