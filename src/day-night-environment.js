import * as T from 'three';

const profile=(sky,lights)=>({top:sky[0],background:sky[1],bottom:sky[2],...lights});
const day={hemi:0xc7e3d2,ground:0x3e5233,hemiIntensity:2.2,sun:0xffe3a1,sunIntensity:3.7,rim:0x9acbc5,rimIntensity:1.2,fill:0x9bb6ad,fillIntensity:.8,exposure:1.42,angle:-.46,night:0};
const dusk={hemi:0xd6b9d9,ground:0x675271,hemiIntensity:1.65,sun:0xffb975,sunIntensity:2.1,rim:0xc8b0e2,rimIntensity:1.1,fill:0xb8c3e3,fillIntensity:.75,exposure:1.25,angle:-1.08,night:.45};
const night={hemi:0x9fb9e5,ground:0x354868,hemiIntensity:1.35,sun:0xb6d6ff,sunIntensity:.85,rim:0xa9c8ff,rimIntensity:1.25,fill:0x99b9da,fillIntensity:.75,exposure:1.12,angle:.55,night:1};
export const DAY_NIGHT_PROFILES={
 forest:{day:profile([0x203a32,0x203a32,0x52735f],day),dusk:profile([0x5d586b,0x886e69,0xd9af87],{...dusk,ground:0x60513b}),night:profile([0x101d32,0x1b3043,0x3e5866],{...night,ground:0x304b42})},
 fuji:{day:profile([0x98bcd9,0xc3d3df,0xf3dce5],{...day,hemi:0xe3e7f5,ground:0x927284,hemiIntensity:2.05,sun:0xffedda,sunIntensity:2.8,rim:0xc2b1e3,rimIntensity:.95,fill:0xc6b6cf,fillIntensity:.65,exposure:1.28}),dusk:profile([0x9c89aa,0xb797ac,0xe1b8b1],{...dusk,hemi:0xe6d3e8,ground:0x927284,sun:0xffd6bd,sunIntensity:2.8,exposure:1.28}),night:profile([0x171d3c,0x33365e,0x696487],{...night,hemi:0xb5bce5,ground:0x665376,rim:0xd0bded,exposure:1.18})},
 ideal:{day:profile([0x559bd8,0x78b7e4,0xc7e5f5],{...day,hemi:0xd5edff,ground:0x829a7c,hemiIntensity:2,sun:0xfff2d5,sunIntensity:2.5,rim:0xb8ddff,rimIntensity:1,fill:0xdcefff,exposure:1.15}),dusk:profile([0x635e9b,0xb58ca5,0xf6bc91],{...dusk,ground:0x606c85,exposure:1.12}),night:profile([0x0d1836,0x1c3458,0x476a87],{...night,hemi:0xa4c9ef,ground:0x425c69,exposure:1.08})},
};
const colorKeys=['top','background','bottom','hemi','ground','sun','rim','fill'];
const numberKeys=['hemiIntensity','sunIntensity','rimIntensity','fillIntensity','exposure','angle','night'];
const smooth=t=>t*t*(3-2*t);
// Reuse the result, colors, pixels and GPU texture for the entire app lifetime.
export function createEnvironmentSampler(){
 const result=Object.fromEntries(colorKeys.map(k=>[k,new T.Color()]));
 const palettes=new Map();for(const profiles of Object.values(DAY_NIGHT_PROFILES))for(const p of Object.values(profiles))palettes.set(p,Object.fromEntries(colorKeys.map(k=>[k,new T.Color(p[k])])));
 let previousFrom,previousTo,previousU;
 const sample=(id,seconds)=>{
  const p=DAY_NIGHT_PROFILES[id],t=((seconds%720)+720)%720;let from,to,u;
  if(t<300){from=to=p.day;u=0;}else if(t<360){from=p.day;to=p.dusk;u=(t-300)/60;}else if(t<420){from=p.dusk;to=p.night;u=(t-360)/60;}else if(t<660){from=to=p.night;u=0;}else if(t<690){from=p.night;to=p.dusk;u=(t-660)/30;}else{from=p.dusk;to=p.day;u=(t-690)/30;}
  u=smooth(u);
  // Day/night plateaus last minutes. Their exact palette does not change even
  // though the clock advances every frame; transitions still sample every frame.
  if(from===previousFrom&&to===previousTo&&u===previousU)return result;
  previousFrom=from;previousTo=to;previousU=u;
  const a=palettes.get(from),b=palettes.get(to);
  for(const k of colorKeys)result[k].copy(a[k]).lerp(b[k],u);for(const k of numberKeys)result[k]=T.MathUtils.lerp(from[k],to[k],u);
  sample.revision++;return result;
 };
 sample.revision=0;return sample;
}
export function createDayNightEnvironment({scene,camera,renderer,hemi,sun,rim,fill,ground}){
 const sample=createEnvironmentSampler(),pixels=new Uint8Array(128*4),sky=new T.DataTexture(pixels,1,128),color=new T.Color();
 sky.colorSpace=T.SRGBColorSpace;sky.magFilter=T.LinearFilter;sky.minFilter=T.LinearFilter;sky.name='Shared day/night sky';let lastSky='',lastSkyRevision=-1;
 return{
  apply(world,seconds){
   const e=sample(world.id,seconds);scene.background=sky;ground.visible=false;
   if(sample.revision!==lastSkyRevision){
    lastSkyRevision=sample.revision;const key=e.top.getHex()+':'+e.background.getHex()+':'+e.bottom.getHex();
    if(key!==lastSky){lastSky=key;for(let i=0;i<128;i++){const u=i/127;color.copy(u<.4?e.bottom:e.background).lerp(u<.4?e.background:e.top,u<.4?u/.4:(u-.4)/.6).convertLinearToSRGB();pixels[i*4]=Math.round(color.r*255);pixels[i*4+1]=Math.round(color.g*255);pixels[i*4+2]=Math.round(color.b*255);pixels[i*4+3]=255;}sky.needsUpdate=true;}
   }
   hemi.color.copy(e.hemi);hemi.groundColor.copy(e.ground);hemi.intensity=e.hemiIntensity;sun.color.copy(e.sun);sun.intensity=e.sunIntensity;rim.color.copy(e.rim);rim.intensity=e.rimIntensity;fill.color.copy(e.fill);fill.intensity=e.fillIntensity;renderer.toneMappingExposure=e.exposure;
   const distance=world.id==='ideal'?95:42;sun.position.set(Math.sin(e.angle)*distance,Math.cos(e.angle)*distance,world.id==='ideal'?30:18);
   if(scene.fog)scene.fog.color.copy(e.background);ground.material.color.copy(e.background).multiplyScalar(.65);world.setNightFactor(e.night,camera);
   return e.night;
  },dispose(){sky.dispose();},
 };
}
