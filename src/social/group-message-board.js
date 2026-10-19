import {groupUnread} from './group-catalog.js';
import * as T from 'three';
import {GROUP_QUEUE} from '../scenes/shared/community-layout.js';

export function createGroupMessageBoard({scene,store,position=GROUP_QUEUE,theme='forest'}){
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
 let key='',latestId=null,lastQueue=[];
 function setTheme(next){theme=next;const neon=theme==='cyber';wood.color.setHex(neon?0x33415a:0x806044);edge.color.setHex(neon?0x73aab9:0xb99b6f);wood.metalness=edge.metalness=neon?.4:0;wood.roughness=edge.roughness=neon?.55:1;edge.emissive.setHex(neon?0x356a7b:0);edge.emissiveIntensity=neon?.25:0;key='';update(lastQueue);}
 function write(text,x,y,maxWidth,font,color){ctx.font=font;ctx.fillStyle=color;let line='';for(const c of String(text)){if(ctx.measureText(line+c).width>maxWidth){line=line.slice(0,-1)+'…';break;}line+=c;}ctx.fillText(line,x,y);}
 function update(queueIds=[]){
  lastQueue=queueIds;const neon=theme==='cyber',ink=neon?'#dcefea':'#3d6048',muted=neon?'#98c7cc':'#7c8d69';
  const groups=queueIds.map(id=>store.state.groups.find(g=>g.id===id&&!g.leftAt)).filter(Boolean).filter(g=>groupUnread(store.state,g.id).length),rows=groups.map(g=>({group:g,message:store.state.messagesByGroup[g.id]?.at(-1)}));
  latestId=rows[0]?.group.id||null;
  const next=theme+JSON.stringify(rows.slice(0,3).map(r=>[r.group.name,r.message?.id]));if(next===key)return;key=next;
  ctx.fillStyle=neon?'#1c2940':'#f4f2df';ctx.fillRect(0,0,1024,1024);ctx.strokeStyle=neon?'#5acbd1':'#b7c29b';ctx.lineWidth=8;ctx.strokeRect(28,28,968,968);
  write(rows.length?'群聊候场':'群聊',76,132,880,'bold 76px sans-serif',ink);write('未读来信 · 点击查看群聊',78,200,870,'32px sans-serif',muted);
  rows.slice(0,3).forEach(({group:g,message:m},i)=>{const y=285+i*212;ctx.fillStyle=neon?'#2b3c58':'#e5e9d5';ctx.fillRect(65,y-20,894,185);write(g.name,90,y+35,840,'bold 43px sans-serif',ink);const sender=m?.senderId==='me'?store.state.profile.name:store.getFriend(m?.senderId)?.name||'群友';write(m?sender+'：'+(m.text||'[分享了一条消息]'):'朋友们在这里相聚',90,y+105,830,'34px sans-serif',muted);});
  if(!rows.length){write(neon?'让兴趣在云港相聚':'让兴趣在这里相聚',90,410,850,'44px sans-serif',ink);write('点击立牌，创建或查看群聊',90,490,850,'34px sans-serif',muted);}
  write('点击打开 · 点击外围返回',80,954,870,'29px sans-serif',muted);texture.needsUpdate=true;
 }
 setTheme(theme);root.traverse(o=>o.userData.generatedProp=true);
 return{root,update,setTheme,get latestId(){return latestId;},focus:()=>root.position.clone().add(new T.Vector3(0,2.2,0)),snapshot:()=>({position:root.position.toArray(),latestId,size:[3.2,3.9]}),dispose(){root.removeFromParent();root.traverse(o=>o.geometry?.dispose());wood.dispose();edge.dispose();face.material.dispose();texture.dispose();}};
}
