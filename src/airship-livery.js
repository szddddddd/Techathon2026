import * as T from 'three';

// Paint hull zones into a private albedo at preparation time. Texture relief,
// warm-window emission and all shared source textures remain independent.
export function applyAirshipLivery(root){
 if(typeof document==='undefined')return;
 root.updateWorldMatrix(true,true);
 const bounds=new T.Box3().setFromObject(root),size=bounds.getSize(new T.Vector3());
 const sources=new Map();
 root.traverse(mesh=>{if(!mesh.isMesh)return;for(const material of [].concat(mesh.material))if(material.map?.image){
  if(!sources.has(material.map))sources.set(material.map,[]);
  sources.get(material.map).push({mesh,material});
 }});
 for(const [source,users] of sources){
  const canvas=document.createElement('canvas');canvas.width=source.image.width;canvas.height=source.image.height;
  const w=canvas.width,h=canvas.height,ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(source.image,0,0);
  const bitmap=ctx.getImageData(0,0,w,h),original=new Uint8ClampedArray(bitmap.data),pixels=bitmap.data;
  const painted=new Uint8Array(w*h),point=new T.Vector3(),uv=new T.Vector2();source.updateMatrix();
  function paint(index,x,y,z){
   const o=index*4,r=original[o],g=original[o+1],b=original[o+2],tone=Math.pow((.2126*r+.7152*g+.0722*b)/255,.7);
   const warm=r>70&&r>g*1.2&&g>b*1.15,cool=g>100&&b>100&&r<Math.min(g,b)*.68;
   let color=[54,87,112]; // Deep ocean blue main hull.
   if(y<.28)color=[40,53,69]; // Keel and passenger gondola framing.
   if(y>.70)color=[42,64,86]; // Dark dorsal spine and fins.
   if((Math.abs(z-.5)>.24&&y>.31&&y<.67&&x>.24&&x<.83)||(x>.83&&y>.30&&y<.67))color=[216,218,205];
   if((y>.445&&y<.477&&x>.24&&x<.92)||(x>.78&&x<.805&&y>.31&&y<.68)||(x<.22&&y>.86))color=[215,139,73];
   if(x<.24&&y>.29&&y<.71)color=[76,95,110]; // Engine housings.
   if(warm&&y<.35)color=[255,183,94];
   if(cool)color=[61,204,219];
   const detail=.58+.65*tone;
   for(let c=0;c<3;c++)pixels[o+c]=Math.min(255,Math.round(color[c]*detail));
   painted[index]=1;
  }
  for(const {mesh,material} of users){
   const geometry=mesh.geometry,pos=geometry.attributes.position,tex=geometry.attributes.uv,index=geometry.index;
   if(!tex)continue;
   const materials=[].concat(mesh.material),groups=geometry.groups.length?geometry.groups:[{start:0,count:index?.count||pos.count,materialIndex:0}];
   for(const group of groups){if(materials[group.materialIndex||0]!==material)continue;
    for(let i=group.start;i<group.start+group.count;i+=3){
     const v=[0,1,2].map(k=>{const id=index?index.getX(i+k):i+k;point.fromBufferAttribute(pos,id).applyMatrix4(mesh.matrixWorld).sub(bounds.min).divide(size);uv.fromBufferAttribute(tex,id).applyMatrix3(source.matrix);return{u:uv.x*w,v:(source.flipY?1-uv.y:uv.y)*h,x:point.x,y:point.y,z:point.z};});
     const [a,b,c]=v,den=(b.v-c.v)*(a.u-c.u)+(c.u-b.u)*(a.v-c.v);if(Math.abs(den)<1e-7)continue;
     const minX=Math.max(0,Math.floor(Math.min(...v.map(p=>p.u)))),maxX=Math.min(w-1,Math.ceil(Math.max(...v.map(p=>p.u)))),minY=Math.max(0,Math.floor(Math.min(...v.map(p=>p.v)))),maxY=Math.min(h-1,Math.ceil(Math.max(...v.map(p=>p.v))));
     for(let py=minY;py<=maxY;py++)for(let px=minX;px<=maxX;px++){
      const a1=((b.v-c.v)*(px+.5-c.u)+(c.u-b.u)*(py+.5-c.v))/den,b1=((c.v-a.v)*(px+.5-c.u)+(a.u-c.u)*(py+.5-c.v))/den,c1=1-a1-b1;
      if(Math.min(a1,b1,c1)<-.015)continue;
      paint(py*w+px,a.x*a1+b.x*b1+c.x*c1,a.y*a1+b.y*b1+c.y*c1,a.z*a1+b.z*b1+c.z*c1);
     }
    }
   }
  }
  // Extend painted texels into UV gutters to avoid pale seams under mip filtering.
  for(let step=0;step<3;step++){const old=painted.slice();for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const i=y*w+x;if(old[i])continue;const n=[i-1,i+1,i-w,i+w].find(j=>old[j]);if(n===undefined)continue;for(let c=0;c<3;c++)pixels[i*4+c]=pixels[n*4+c];painted[i]=1;}}
  ctx.putImageData(bitmap,0,0);const map=source.clone();map.image=canvas;map.colorSpace=T.SRGBColorSpace;map.needsUpdate=true;
  for(const {material} of users){material.map=map;material.color.setHex(0xffffff);material.roughness=.48;material.metalness=.22;material.needsUpdate=true;}
 }
 root.userData.facadePalette='ocean-blue-ivory-copper-airship';
}
