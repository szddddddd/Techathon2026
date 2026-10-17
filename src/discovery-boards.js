import * as THREE from 'three';

const clamp=value=>Math.max(0,Math.min(1,value));
const ease=value=>{const t=clamp(value);return t*t*(3-2*t);};
const mixRect=(a,b,t)=>Object.fromEntries(['left','top','width','height'].map(key=>[key,a[key]+(b[key]-a[key])*t]));

/** One timeline owns the camera, framed surface reveal, and its reverse. */
export function createDiscoveryBoards({camera,facilities,contentUI,player,beforeFocus}){
  const frame=document.createElement('div');frame.id='discovery-morph-frame';frame.setAttribute('aria-hidden','true');frame.hidden=true;
  const paper=document.createElement('div');paper.className='morph-paper';const preview=document.createElement('img');preview.alt='';frame.append(paper,preview);contentUI.shell.append(frame);
  const hero=document.createElement('img');hero.id='discovery-morph-cover';hero.alt='';hero.hidden=true;contentUI.shell.append(hero);let previewData=null;
  let kind=null,stage='closed',start=0,openingRoute=null,finish=null,restoreStarted=false,resizeToken=0;
  const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
  const audit={entries:[],lastOrigin:null,lastDestination:null};
  function setStage(value){stage=value;document.body.dataset.discoveryStage=value;}
  function surfaceRect(){
    const face=facilities.surface(kind),x=new THREE.Vector3(1,0,0).applyQuaternion(face.quaternion),y=new THREE.Vector3(0,1,0).applyQuaternion(face.quaternion);
    camera.updateMatrixWorld();
    const points=[[-1,1],[1,1],[1,-1],[-1,-1]].map(([u,v])=>face.position.clone().addScaledVector(x,u*face.width/2).addScaledVector(y,v*face.height/2).project(camera));
    const xs=points.map(p=>(p.x*.5+.5)*innerWidth),ys=points.map(p=>(-.5*p.y+.5)*innerHeight);
    return {left:Math.min(...xs),top:Math.min(...ys),width:Math.max(...xs)-Math.min(...xs),height:Math.max(...ys)-Math.min(...ys)};
  }
  function showFrame(){
    const data=facilities.preview(kind);previewData=data;if(data?.src)preview.src=data.src;if(data?.cover)hero.src=data.cover;hero.hidden=false;
    frame.dataset.frame=kind==='accounts'?'journal':'cinema';frame.hidden=false;
  }
  function paint(rect,contentAlpha,previewAlpha,backdrop){
    for(const property of ['left','top','width','height'])frame.style[property]=rect[property]+'px';
    preview.style.opacity=String(previewAlpha);paper.style.opacity=String(1-contentAlpha);
    contentUI.reveal(rect,contentAlpha,backdrop);
    contentUI.shell.style.setProperty('--secondary-alpha',String(ease((contentAlpha-.55)/.45)));
  }
  function paintHero(origin,p,reverse=false){
    const data=previewData;if(!data?.coverRect){hero.hidden=true;return;}
    const cover=data.coverRect,from={left:origin.left+origin.width*cover.x/data.width,top:origin.top+origin.height*cover.y/data.height,width:origin.width*cover.width/data.width,height:origin.height*cover.height/data.height};
    const target=contentUI.windowNode.querySelector('.d-reading-cover,.d-card-cover,.d-video-stage');
    if(!target){hero.hidden=true;return;}const to=target.getBoundingClientRect();if(!to.width||to.bottom<0){hero.hidden=true;return;}
    const t=reverse?1-ease(p):ease(p),r=mixRect(from,to,t);
    for(const property of ['left','top','width','height'])hero.style[property]=r[property]+'px';
    hero.style.opacity=String(reverse?Math.sin(Math.PI*p):ease(p/.12)*(1-ease((p-.78)/.22)));
  }
  async function open(nextKind,route){
    if(facilities.isModuleEnabled&&!facilities.isModuleEnabled(nextKind==='accounts'?'accounts':'scene-video'))return false;
    await beforeFocus?.();
    if(facilities.isModuleEnabled&&!facilities.isModuleEnabled(nextKind==='accounts'?'accounts':'scene-video'))return false;
    finish?.(false);finish=null;
    if(kind){facilities.setEmphasis(kind,0);facilities.setBoardActive(kind,false);}
    contentUI.stopScene();frame.hidden=true;hero.hidden=true;player.pause();
    kind=nextKind==='accounts'?'accounts':'scene-video';openingRoute=route;start=performance.now();restoreStarted=false;
    setStage('approaching');document.body.classList.add('in-scene-board');
    facilities.setBoardActive(kind,false);facilities.setEmphasis(kind,1);facilities.focus(kind,{duration:reduced()?0:750});
    audit.entries.push({kind,at:start,original:facilities.pose()});
    return new Promise(resolve=>{finish=resolve;});
  }
  function exit(){
    if(!kind||stage==='closing')return;
    finish?.(false);finish=null;
    if(stage==='approaching'){
      player.pause();contentUI.stopScene();frame.hidden=true;restoreStarted=true;facilities.restore({duration:reduced()?0:850});
    }else{
      contentUI.startClosing();showFrame();restoreStarted=false;
    }
    setStage('closing');start=performance.now();facilities.setEmphasis(kind,0);
  }
  function completeExit(){
    frame.hidden=true;hero.hidden=true;contentUI.stopScene();facilities.setBoardActive(kind,false);kind=null;setStage('closed');document.body.classList.remove('in-scene-board');
  }
  function update(now=performance.now()){
    if(!kind)return;
    const elapsed=now-start,isReduced=reduced();
    if(stage==='approaching'&&elapsed>=(isReduced?0:550)){
      facilities.setBoardActive(kind,true);contentUI.prepareScene(kind,openingRoute);showFrame();audit.lastOrigin=surfaceRect();audit.lastDestination=contentUI.shell.getBoundingClientRect().toJSON();setStage('expanding');
    }
    if(stage==='expanding'){
      const p=clamp(isReduced?elapsed/150:(elapsed-550)/600),destination=contentUI.shell.getBoundingClientRect();
      const rect=isReduced?destination:mixRect(surfaceRect(),destination,ease(p));
      paint(rect,isReduced?p:ease((p-.42)/.53),1-ease(p/.42),ease(p));if(!isReduced)paintHero(surfaceRect(),p);else hero.hidden=true;
      if(p===1){frame.hidden=true;hero.hidden=true;facilities.setEmphasis(kind,0);setStage('browsing');contentUI.settleScene();finish?.(true);finish=null;}
    }
    if(stage==='closing'){
      const shrink=isReduced?150:400,total=isReduced?150:850;
      if(!restoreStarted){
        const p=clamp(elapsed/shrink),rect=isReduced?contentUI.shell.getBoundingClientRect():mixRect(contentUI.shell.getBoundingClientRect(),surfaceRect(),ease(p));
        paint(rect,1-ease(p/.5),ease((p-.5)/.5),1-ease(p));if(!isReduced)paintHero(surfaceRect(),p,true);else hero.hidden=true;
        if(p===1){frame.hidden=true;hero.hidden=true;contentUI.stopScene();facilities.setBoardActive(kind,false);facilities.restore({duration:isReduced?0:450});restoreStarted=true;}
      }
      if(elapsed>=total&&!facilities.transitioning)completeExit();
    }
  }
  const key=e=>{if(e.key!=='Escape'||!kind||document.querySelector('#content-share-dialog[open],#photo-dialog[open]'))return;e.preventDefault();e.stopImmediatePropagation();exit();};
  const outside=e=>{if(stage==='approaching'&&e.target.closest('canvas')&&performance.now()-start>180)exit();};
  window.addEventListener('keydown',key,{capture:true});document.addEventListener('click',outside);
  const resize=()=>{const ticket=++resizeToken;requestAnimationFrame(()=>{if(ticket!==resizeToken||!kind||stage==='closing')return;facilities.focus(kind,{duration:0});});};
  window.addEventListener('resize',resize);
  function dismiss(){if(!kind)return;finish?.(false);finish=null;facilities.setEmphasis(kind,0);facilities.setBoardActive(kind,false);facilities.restore({duration:0});kind=null;frame.hidden=true;hero.hidden=true;setStage('closed');document.body.classList.remove('in-scene-board');}
  return {open,exit,dismiss,update,audit,get kind(){return kind;},get stage(){return stage;},surfaceRect,dispose(){finish?.(false);player.pause();window.removeEventListener('keydown',key,{capture:true});document.removeEventListener('click',outside);window.removeEventListener('resize',resize);frame.remove();hero.remove();}};
}
