import * as T from 'three';
import {GROUP_QUEUE} from './community-layout.js';

export function createGroupMessageBoard({scene,store,position=GROUP_QUEUE}){
 const root=new T.Group();root.name='Group courtyard message board';root.position.set(position.x,position.y??2.22,position.z);scene.add(root);
 const wood=new T.MeshStandardMaterial({color:0x806044,roughness:1}),edge=new T.MeshStandardMaterial({color:0xb99b6f,roughness:1});
 function box(name,x,y,z,w,h,d,material){const m=new T.Mesh(new T.BoxGeometry(w,h,d),material);m.name=name;m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;root.add(m);}
 for(const x of [-1.32,1.32]){box('Message board timber upright',x,1.95,0,.16,3.9,.18,wood);box('Message board stable foot',x,.09,.12,.6,.18,.95,wood);}
 box('Message board backing',0,2.2,0,2.6,2.65,.14,wood);
 for(const y of [.82,3.58])box('Message board horizontal rail',0,y,.1,2.95,.16,.25,edge);
 box('Message board canopy',0,3.82,0,3.2,.16,.85,edge);
 const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=1024;const ctx=canvas.getContext('2d');
 const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;
 const face=new T.Mesh(new T.PlaneGeometry(2.52,2.6),new T.MeshBasicMaterial({map:texture,toneMapped:false}));face.name='Live group message surface';face.position.set(0,2.2,.09);root.add(face);
 let key='',latestId=null;
 function write(text,x,y,maxWidth,font,color){ctx.font=font;ctx.fillStyle=color;let line='';for(const c of String(text)){if(ctx.measureText(line+c).width>maxWidth){line=line.slice(0,-1)+'…';break;}line+=c;}ctx.fillText(line,x,y);}
 function update(){
  const groups=store.state.groups.filter(g=>!g.leftAt),rows=groups.map(g=>({group:g,message:store.state.messagesByGroup[g.id]?.at(-1)})).sort((a,b)=>(b.message?.createdAt||b.group.createdAt)-(a.message?.createdAt||a.group.createdAt));
  latestId=rows[0]?.group.id||null;
  const next=JSON.stringify(rows.slice(0,3).map(r=>[r.group.name,r.message?.id]));if(next===key)return;key=next;
  ctx.fillStyle='#f4f2df';ctx.fillRect(0,0,1024,1024);ctx.strokeStyle='#b7c29b';ctx.lineWidth=8;ctx.strokeRect(28,28,968,968);
  write('林间群聊',76,132,880,'bold 76px sans-serif','#3d6048');write('庭院来信 · 点击查看群聊',78,200,870,'32px sans-serif','#7c8d69');
  rows.slice(0,3).forEach(({group:g,message:m},i)=>{const y=285+i*212;ctx.fillStyle='#e5e9d5';ctx.fillRect(65,y-20,894,185);write(g.name,90,y+35,840,'bold 43px sans-serif','#49644b');const sender=m?.senderId==='me'?store.state.profile.name:store.getFriend(m?.senderId)?.name||'群友';write(m?sender+'：'+(m.text||'[分享了一条消息]'):'朋友们在这里相聚',90,y+105,830,'34px sans-serif','#6d7e60');});
  if(!rows.length){write('让兴趣在森林里相聚',90,410,850,'44px sans-serif','#5d7855');write('点击立牌，创建或查看群聊',90,490,850,'34px sans-serif','#7c8d69');}
  write('点击打开 · 点击外围返回',80,954,870,'29px sans-serif','#7c8d69');texture.needsUpdate=true;
 }
 update();root.traverse(o=>o.userData.generatedProp=true);
 return{root,update,get latestId(){return latestId;},focus:()=>root.position.clone().add(new T.Vector3(0,2.2,0)),snapshot:()=>({position:root.position.toArray(),latestId,size:[3.2,3.9]}),dispose(){root.removeFromParent();root.traverse(o=>o.geometry?.dispose());wood.dispose();edge.dispose();face.material.dispose();texture.dispose();}};
}
