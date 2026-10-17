import { getContent } from './discovery-catalog.js';

// One decoder is shared by the DOM viewer and the Three.js projection screen.
export function createContentPlayer({store}) {
  const video=document.createElement('video');
  video.className='discovery-video';video.playsInline=true;video.muted=true;video.preload='metadata';video.loop=true;
  video.setAttribute('playsinline','');video.setAttribute('aria-label','森林视频');
  let activeId=null,surface='ui',lastSave=0,loadToken=0,disposed=false;
  let controller=null,loading=null,blobUrl=null,failed=false,wantsPlay=false,restoreMetadata=null;
  const progress=()=>{if(activeId&&video.readyState>=1&&Number.isFinite(video.currentTime))store.setContentProgress({type:'video',id:activeId},video.currentTime).catch(console.warn);};
  const time=()=>{if(Date.now()-lastSave>3000){lastSave=Date.now();progress();}};
  const pause=()=>{wantsPlay=false;video.pause();};
  const visibility=()=>{if(document.hidden)pause();};
  video.addEventListener('timeupdate',time);video.addEventListener('pause',progress);document.addEventListener('visibilitychange',visibility);
  return {
    video,
    get activeId(){return activeId;},
    get surface(){return surface;},
    get wantsPlayback(){return wantsPlay;},
    async load(id,{autoplay=true,force=false}={}){
      const content=getContent({type:'video',id});if(!content)throw new Error('这条视频暂时找不到了。');
      if(disposed)return;
      if(activeId!==id||force||failed||(!loading&&!blobUrl)){
        progress();video.pause();controller?.abort();const token=++loadToken;
        controller=new AbortController();const signal=controller.signal;
        if(restoreMetadata)video.removeEventListener('loadedmetadata',restoreMetadata);
        video.removeAttribute('src');video.load();
        if(blobUrl){URL.revokeObjectURL(blobUrl);blobUrl=null;}
        activeId=id;failed=false;wantsPlay=autoplay;video.poster=content.poster||content.cover||'';video.style.objectFit=content.objectFit||'cover';
        const saved=store.state.discovery?.progress?.[`video:${id}`];
        const position=typeof saved==='object'?saved.value:Number(saved)||0;
        // The bundled Python server does not serve byte ranges. A complete local
        // Blob gives the browser a seekable source without changing the server.
        loading=(async()=>{
          try{
            const response=await fetch(content.src,{signal});
            if(!response.ok)throw new Error('视频加载失败，请重试。');
            const blob=await response.blob();
            if(disposed||token!==loadToken||signal.aborted)return;
            if(!blob.size)throw new Error('视频文件为空，请重试。');
            blobUrl=URL.createObjectURL(blob);
            restoreMetadata=()=>{if(token===loadToken&&position>0&&position<video.duration-0.25)video.currentTime=position;};
            video.addEventListener('loadedmetadata',restoreMetadata,{once:true});
            video.src=blobUrl;video.load();
          }catch(error){if(token!==loadToken||signal.aborted||disposed)return;failed=true;throw error;}
          finally{if(token===loadToken)loading=null;}
        })();
      }else{wantsPlay=autoplay;}
      const token=loadToken;
      if(loading)await loading;
      if(token!==loadToken||disposed||failed)return;
      if(wantsPlay&&!document.hidden){try{await video.play();}catch(error){if(error.name!=='AbortError'&&error.name!=='NotAllowedError')throw error;}}
    },
    pause,
    async play(){
      wantsPlay=true;const token=loadToken;
      if(loading)await loading;
      if(token===loadToken&&!disposed&&!document.hidden&&wantsPlay){
        if(failed||!blobUrl)throw new Error('视频还没有准备好，请重新加载。');
        await video.play();
      }
    },
    setSurface(value){surface=value;video.dataset.surface=value;},
    dispose(){progress();disposed=true;pause();++loadToken;controller?.abort();if(restoreMetadata)video.removeEventListener('loadedmetadata',restoreMetadata);video.removeAttribute('src');video.load();if(blobUrl)URL.revokeObjectURL(blobUrl);blobUrl=null;video.remove();video.removeEventListener('timeupdate',time);video.removeEventListener('pause',progress);document.removeEventListener('visibilitychange',visibility);},
  };
}
