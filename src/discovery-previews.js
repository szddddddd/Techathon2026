import * as THREE from 'three';
import {ARTICLES,JOURNAL_ARTICLES,VIDEOS,getAccount,getCreator} from './discovery-catalog.js';

const images=new Map();
function loadImage(src){
  if(!images.has(src))images.set(src,new Promise(resolve=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>resolve(null);img.src=src;}));
  return images.get(src);
}
function cover(ctx,img,x,y,w,h){
  ctx.fillStyle='#dce3ce';ctx.fillRect(x,y,w,h);if(!img)return;
  const scale=Math.max(w/img.width,h/img.height),sw=w/scale,sh=h/scale;
  ctx.drawImage(img,(img.width-sw)/2,(img.height-sh)/2,sw,sh,x,y,w,h);
}
function line(ctx,text,x,y,max){
  let value=text;while(value.length&&ctx.measureText(value).width>max)value=value.slice(0,-1);
  ctx.fillText(value===text?text:value.slice(0,-1)+'…',x,y);
}

/** Compact editorial pages are textures on real meshes, so trees occlude them. */
export function createDiscoveryPreview(kind){
  if(typeof document==='undefined')return null;
  const journal=kind==='accounts',canvas=document.createElement('canvas');
  canvas.width=journal?1200:720;canvas.height=journal?940:1280;
  const ctx=canvas.getContext('2d'),texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4;
  let content=null,version=0,ready=Promise.resolve(),imageURL='',coverRect=null;
  function paint(photo,avatar){
    const w=canvas.width,h=canvas.height;ctx.fillStyle=journal?'#fbf8ec':'#f5f1e4';ctx.fillRect(0,0,w,h);
    ctx.fillStyle='#698264';ctx.font=`500 ${journal?21:18}px sans-serif`;ctx.fillText(journal?'THE FOREST JOURNAL':'MOMENTS IN MOTION',journal?64:44,journal?58:43);
    ctx.fillStyle='#304a38';ctx.font=`600 ${journal?56:42}px sans-serif`;ctx.fillText(journal?'公众号':'视频号',journal?60:42,journal?126:100);
    ctx.font=`${journal?22:20}px sans-serif`;ctx.fillStyle='#8e9b7d';ctx.textAlign='right';ctx.fillText('林间来信',w-(journal?64:44),journal?120:96);ctx.textAlign='left';
    ctx.strokeStyle='#dce1d0';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(journal?64:44,journal?160:130);ctx.lineTo(w-(journal?64:44),journal?160:130);ctx.stroke();
    if(journal){
      coverRect={x:64,y:198,width:1072,height:360};cover(ctx,photo,64,198,1072,360);
      ctx.fillStyle='#8c9a7f';ctx.font='24px sans-serif';ctx.fillText(getAccount(content.accountId)?.name||'Hyper3D',64,610);
      ctx.fillStyle='#334d3b';ctx.font='500 40px sans-serif';line(ctx,content.title,64,673,1072);
      ctx.font='25px sans-serif';ctx.fillStyle='#869279';line(ctx,content.summary,64,720,1072);
      const others=JOURNAL_ARTICLES.filter(a=>a.id!==content.id).slice(0,2);
      others.forEach((a,i)=>{const y=790+i*64;ctx.strokeStyle='#e1e5d6';ctx.beginPath();ctx.moveTo(64,y-25);ctx.lineTo(1136,y-25);ctx.stroke();ctx.fillStyle='#526c4a';ctx.font='27px sans-serif';line(ctx,a.title,64,y+15,990);ctx.fillText('↗',1090,y+15);});
    }else{
      ctx.font='25px sans-serif';ctx.fillStyle='#526d45';ctx.fillText('推荐',206,180);ctx.fillStyle='#9ba58c';ctx.fillText('关注',330,180);ctx.fillText('朋友',454,180);
      coverRect={x:44,y:220,width:632,height:740};cover(ctx,photo,44,220,632,740);
      ctx.fillStyle='#163c2a88';ctx.beginPath();ctx.arc(360,590,61,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fffbed';ctx.beginPath();ctx.moveTo(346,556);ctx.lineTo(346,624);ctx.lineTo(395,590);ctx.closePath();ctx.fill();
      cover(ctx,avatar,44,995,59,59);ctx.font='27px sans-serif';ctx.fillStyle='#344e3b';line(ctx,getCreator(content.creatorId)?.name||'林间朋友',120,1034,540);
      ctx.font='500 32px sans-serif';line(ctx,content.title,44,1100,632);
      ctx.font='23px sans-serif';ctx.fillStyle='#8a977e';ctx.fillText('♡ 喜欢       ☆ 收藏       ↗ 分享',44,1166);
      ctx.fillStyle='#d9e0cd';ctx.fillRect(44,1207,632,2);ctx.font='19px sans-serif';ctx.fillStyle='#8e9c7f';ctx.fillText('点击，走近这一刻',44,1250);
    }
    texture.needsUpdate=true;imageURL='';
  }
  function update(id){
    const next=(journal?ARTICLES:VIDEOS).find(item=>item.id===id)||(journal?JOURNAL_ARTICLES:VIDEOS)[0];
    if(content?.id===next.id)return ready;content=next;const token=++version;paint(null,null);
    ready=Promise.all([loadImage(content.cover),journal?Promise.resolve(null):loadImage(getCreator(content.creatorId).avatar)]).then(([photo,avatar])=>{if(token===version)paint(photo,avatar);});return ready;
  }
  update();
  return {texture,canvas,update,get ready(){return ready;},get data(){return {get src(){return imageURL||(imageURL=canvas.toDataURL('image/png'));},contentId:content.id,title:content.title,cover:content.cover,coverRect,width:canvas.width,height:canvas.height};},dispose(){++version;texture.dispose();}};
}
