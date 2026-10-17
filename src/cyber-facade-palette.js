import {applyAirshipLivery} from './airship-livery.js';
import * as T from 'three';

// Recolor private city albedo copies once at load time. Original GLBs and
// other scenes stay intact; normal maps and the source-derived window glow remain.
export function applyCyberFacadePalette(root,key){
 if(typeof document==='undefined')return;
 if(key==='airship'){applyAirshipLivery(root);return;}
 const copies=new Map();
 root.traverse(mesh=>{if(!mesh.isMesh)return;for(const material of [].concat(mesh.material)){
  const source=material.map;if(!source?.image)continue;
  if(!copies.has(source)){
   const canvas=document.createElement('canvas'),image=source.image;
   canvas.width=image.width;canvas.height=image.height;
   const context=canvas.getContext('2d',{willReadFrequently:true});context.drawImage(image,0,0);
   const bitmap=context.getImageData(0,0,canvas.width,canvas.height),data=bitmap.data;
   for(let i=0;i<data.length;i+=4){
    const r=data[i],g=data[i+1],b=data[i+2],luma=(.2126*r+.7152*g+.0722*b)/255;
    const tone=Math.pow(luma,.8),warm=r>65&&r>g*1.16&&g>b*1.12;
    const cool=b>r*1.8&&g>r*1.6&&Math.min(g,b)>115;
    const pink=r>g*1.65&&b>g*1.35&&r>125;
    let color;
    if(warm)color=[110+140*tone,53+142*tone,22+85*tone];
    else if(cool)color=[26+65*tone,91+153*tone,116+139*tone];
    else if(pink)color=[114+132*tone,25+68*tone,84+118*tone];
    else if(/tree/.test(key)&&g>r*1.1)color=[28+50*tone,60+105*tone,65+100*tone];
    else color=[30+138*tone,39+143*tone,57+146*tone];
    if(key==='hover_taxi'&&warm)color=[166+80*tone,99+103*tone,15+48*tone];
    for(let channel=0;channel<3;channel++)data[i+channel]=Math.round(color[channel]);
   }
   context.putImageData(bitmap,0,0);
   const map=source.clone();map.image=canvas;map.colorSpace=T.SRGBColorSpace;map.needsUpdate=true;copies.set(source,map);
  }
  material.map=copies.get(source);material.color.setHex(0xffffff);material.roughness=/tree/.test(key)?.76:.5;material.metalness=/tree/.test(key)?.08:.24;material.needsUpdate=true;
 }});
 root.userData.facadePalette='graphite-cyan-magenta-amber';
}
