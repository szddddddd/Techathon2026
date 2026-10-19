import * as T from 'three';

const BUILDINGS=new Set(['club','classroom','sport','lab','library','music','art','cafe','observatory','airship','spire_a','spire_b','spire_c','mid_office','mid_housing','mid_data','mid_commerce','podium_market','podium_arcade']);
const SIZE=512;
const MAX_COVERAGE=.14;
const THRESHOLDS=[35,28,22,16,10];

// Called once while preparing a private, normalized Rodin template. The albedo
// stays intact; only genuinely dark, vertical-wall UV texels gain warm emission.
export function applyCyberWindowLights(root,key){
 if(/^(spire_|mid_|podium_)/.test(key))return applyCityWindowTint(root,key);
 if(root?.userData?.windowLights?.key===key)return root.userData.windowLights;
 const report={key,size:SIZE,materials:[],litPixels:0,skipped:[]};
 if(!root||!BUILDINGS.has(key)||root.userData.provider!=='rodin'||typeof document==='undefined')return report;
 root.updateWorldMatrix(true,true);const bounds=new T.Box3().setFromObject(root),height=bounds.max.y-bounds.min.y;
 if(height<=0)return report;
 const pointA=new T.Vector3(),pointB=new T.Vector3(),pointC=new T.Vector3(),edgeA=new T.Vector3(),edgeB=new T.Vector3(),normal=new T.Vector3(),uvPoint=new T.Vector2();
 root.traverse(mesh=>{
  if(!mesh.isMesh||!mesh.geometry.attributes.uv)return;
  const geometry=mesh.geometry,positions=geometry.attributes.position,uv=geometry.attributes.uv,index=geometry.index,count=index?index.count:positions.count,sourceMaterials=Array.isArray(mesh.material)?mesh.material:[mesh.material],copies=[...sourceMaterials];
  for(let materialIndex=0;materialIndex<sourceMaterials.length;materialIndex++){
   const original=sourceMaterials[materialIndex],map=original.map,image=map?.image;
   if(!original.isMeshStandardMaterial||!image){report.skipped.push({mesh:mesh.name,materialIndex,reason:'no-readable-albedo'});continue;}
   const albedo=document.createElement('canvas');albedo.width=albedo.height=SIZE;const ac=albedo.getContext('2d',{willReadFrequently:true});
   try{ac.drawImage(image,0,0,SIZE,SIZE);}catch{report.skipped.push({mesh:mesh.name,materialIndex,reason:'unreadable-image'});continue;}
   let pixels;try{pixels=ac.getImageData(0,0,SIZE,SIZE).data;}catch{report.skipped.push({mesh:mesh.name,materialIndex,reason:'image-security'});continue;}
   const candidate=document.createElement('canvas');candidate.width=candidate.height=SIZE;const ctx=candidate.getContext('2d',{willReadFrequently:true});ctx.fillStyle=ctx.strokeStyle='#fff';ctx.lineWidth=.8;
   const uvMatrix=new T.Matrix3().setUvTransform(map.offset.x,map.offset.y,map.repeat.x,map.repeat.y,map.rotation,map.center.x,map.center.y);
   const groups=geometry.groups.length?geometry.groups:[{start:0,count,materialIndex:0}];let wallTriangles=0;
   for(const group of groups){if((group.materialIndex||0)!==materialIndex)continue;for(let i=group.start;i<Math.min(count,group.start+group.count);i+=3){
    const ids=[0,1,2].map(k=>index?index.getX(i+k):i+k);pointA.fromBufferAttribute(positions,ids[0]).applyMatrix4(mesh.matrixWorld);pointB.fromBufferAttribute(positions,ids[1]).applyMatrix4(mesh.matrixWorld);pointC.fromBufferAttribute(positions,ids[2]).applyMatrix4(mesh.matrixWorld);
    const verticalSpan=Math.max(pointA.y,pointB.y,pointC.y)-Math.min(pointA.y,pointB.y,pointC.y),horizontalSpan=Math.max(Math.max(pointA.x,pointB.x,pointC.x)-Math.min(pointA.x,pointB.x,pointC.x),Math.max(pointA.z,pointB.z,pointC.z)-Math.min(pointA.z,pointB.z,pointC.z));if(verticalSpan< horizontalSpan*.09)continue;
    if(key==='airship'){const along=((pointA.x+pointB.x+pointC.x)/3-bounds.min.x)/(bounds.max.x-bounds.min.x);if(along<.23||along>.80)continue;}
    normal.crossVectors(edgeA.subVectors(pointB,pointA),edgeB.subVectors(pointC,pointA)).normalize();if(Math.abs(normal.y)>=.30||(key==='airship'&&Math.abs(normal.z)<.6))continue;
    const minH=(Math.min(pointA.y,pointB.y,pointC.y)-bounds.min.y)/height,maxH=(Math.max(pointA.y,pointB.y,pointC.y)-bounds.min.y)/height;
    const lower=key==='airship'?.055:.12,upper=key==='airship'?.35:key==='observatory'?.48:key==='music'?.70:.82;if(maxH<lower||minH>upper)continue;
    // Clip in world-height while linearly interpolating UV coordinates; tall
    // facade triangles cannot accidentally illuminate roof equipment or plinths.
    let polygon=ids.map((id,k)=>({height:([pointA,pointB,pointC][k].y-bounds.min.y)/height,u:uv.getX(id),v:uv.getY(id)}));
    for(const [limit,above]of [[lower,true],[upper,false]]){const clipped=[];for(let j=0;j<polygon.length;j++){const a=polygon[j],b=polygon[(j+1)%polygon.length],ain=above?a.height>=limit:a.height<=limit,bin=above?b.height>=limit:b.height<=limit;if(ain)clipped.push(a);if(ain!==bin){const t=(limit-a.height)/(b.height-a.height);clipped.push({height:limit,u:a.u+(b.u-a.u)*t,v:a.v+(b.v-a.v)*t});}}polygon=clipped;}
    if(polygon.length<3)continue;
    ctx.beginPath();polygon.forEach((p,j)=>{uvPoint.set(p.u,p.v).applyMatrix3(uvMatrix);const x=uvPoint.x*SIZE,y=(map.flipY?1-uvPoint.y:uvPoint.y)*SIZE;if(j===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});ctx.closePath();ctx.fill();ctx.stroke();wallTriangles++;
   }}
   const wall=ctx.getImageData(0,0,SIZE,SIZE).data;let candidatePixels=0;for(let i=0;i<SIZE*SIZE;i++)if(wall[i*4+3]>180)candidatePixels++;
   let selected=null,selectedCount=0,threshold=0;
   for(const maxRGB of THRESHOLDS){const mask=new Uint8Array(SIZE*SIZE);let lit=0;for(let i=0;i<mask.length;i++){const o=i*4,r=pixels[o],g=pixels[o+1],b=pixels[o+2],lum=.2126*r+.7152*g+.0722*b;if(wall[o+3]>180&&pixels[o+3]>200&&Math.max(r,g,b)<maxRGB&&lum<maxRGB*.82){mask[i]=1;lit++;}}
    if(lit/SIZE**2<=MAX_COVERAGE&&lit/Math.max(1,candidatePixels)<=.32){selected=mask;selectedCount=lit;threshold=maxRGB;break;}
   }
   if(!selected||selectedCount<8){report.skipped.push({mesh:mesh.name,materialIndex,reason:selected?'no-window-texels':'too-much-dark-wall',candidatePixels});continue;}
   // Remove isolated dark texture noise. Real panes span multiple texels, while
   // tiny grout/fissure pixels should remain unlit.
   const visited=new Uint8Array(selected.length),queue=new Int32Array(selected.length);let retained=0;
   for(let start=0;start<selected.length;start++){if(!selected[start]||visited[start])continue;let head=0,tail=1,minX=SIZE,minY=SIZE,maxX=0,maxY=0;queue[0]=start;visited[start]=1;while(head<tail){const i=queue[head++],x=i%SIZE,y=Math.floor(i/SIZE);minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);for(const next of[i-SIZE,i+SIZE,x?i-1:-1,x<SIZE-1?i+1:-1])if(next>=0&&next<selected.length&&selected[next]&&!visited[next]){visited[next]=1;queue[tail++]=next;}}const w=maxX-minX+1,h=maxY-minY+1;if(tail<10||Math.min(w,h)<3||Math.max(w/h,h/w)>12)for(let j=0;j<tail;j++)selected[queue[j]]=0;else retained+=tail;}

   if(retained<8){report.skipped.push({mesh:mesh.name,materialIndex,reason:'texture-noise-only'});continue;}
   const canvas=document.createElement('canvas');canvas.width=canvas.height=SIZE;const out=canvas.getContext('2d'),data=out.createImageData(SIZE,SIZE);
   for(let i=0;i<selected.length;i++){const o=i*4;data.data[o+3]=255;if(selected[i]){data.data[o]=255;data.data[o+1]=174;data.data[o+2]=91;}}
   out.putImageData(data,0,0);const texture=new T.CanvasTexture(canvas);texture.name='Cyber private warm-window UV mask '+key;texture.colorSpace=T.SRGBColorSpace;texture.flipY=map.flipY;texture.wrapS=map.wrapS;texture.wrapT=map.wrapT;texture.offset.copy(map.offset);texture.repeat.copy(map.repeat);texture.center.copy(map.center);texture.rotation=map.rotation;texture.channel=map.channel;texture.anisotropy=map.anisotropy;texture.needsUpdate=true;
   const material=original.clone();material.name=(original.name||key)+' · warm window UV';material.emissive.setHex(0xffffff);material.emissiveIntensity=.6;material.emissiveMap=texture;material.needsUpdate=true;copies[materialIndex]=material;
   report.materials.push({mesh:mesh.name,materialIndex,pixels:retained,coverage:retained/(SIZE*SIZE),wallCoverage:retained/Math.max(1,candidatePixels),maxRGB:threshold,wallTriangles,flipY:map.flipY});report.litPixels+=retained;
  }
  mesh.material=Array.isArray(mesh.material)?copies:copies[0];
 });
 root.userData.windowLights=report;return report;
}

// City facade emission follows warm/cyan colored albedo details, never whole black wall panels.
function applyCityWindowTint(root,key){if(typeof document==='undefined'||root.userData.provider!=='rodin')return{};const textures=new Map();root.traverse(o=>{if(!o.isMesh)return;for(const m of [].concat(o.material)){if(!m.map?.image)continue;let texture=textures.get(m.map);if(!texture){const c=document.createElement('canvas');c.width=c.height=512;const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(m.map.image,0,0,512,512);const bitmap=ctx.getImageData(0,0,512,512),p=bitmap.data;for(let i=0;i<p.length;i+=4){const r=p[i],g=p[i+1],b=p[i+2],warm=r>50&&r>g*1.17&&g>b*1.2,cool=g>55&&b>65&&r<g*.65;if(!warm&&!cool)p[i]=p[i+1]=p[i+2]=0;}ctx.putImageData(bitmap,0,0);texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;texture.flipY=m.map.flipY;texture.wrapS=m.map.wrapS;texture.wrapT=m.map.wrapT;textures.set(m.map,texture);}m.emissiveMap=texture;m.emissive.setHex(0xffffff);m.emissiveIntensity=.5;}});return root.userData.windowLights={key,method:'colored window texture details',textures:textures.size};}
