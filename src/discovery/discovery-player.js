import { getContent } from './discovery-catalog.js';
import {isAndroidApp} from '../platform/mobile-platform.js';

// One decoder is shared by the DOM viewer and the Three.js projection screen.
export function createContentPlayer({store}) {
  const video=document.createElement('video');
  video.className='discovery-video';video.playsInline=true;video.muted=true;video.preload='metadata';video.loop=true;
  video.setAttribute('playsinline','');video.setAttribute('aria-label','森林视频');
  let activeId=null,surface='ui',lastSave=0,loadToken=0,disposed=false;
  let controller=null,loading=null,sourceUrl=null,blobUrl=null,failed=false,wantsPlay=false;
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
      if(activeId!==id||force||failed||(!loading&&!sourceUrl)){
        progress();video.pause();controller?.abort();const token=++loadToken;
        controller=new AbortController();const signal=controller.signal;
        video.removeAttribute('src');video.load();
        if(blobUrl){URL.revokeObjectURL(blobUrl);blobUrl=null;}
        sourceUrl=null;
        activeId=id;failed=false;wantsPlay=autoplay;video.poster=content.poster||content.cover||'';video.style.objectFit=content.objectFit||'cover';
        const saved=store.state.discovery?.progress?.[`video:${id}`];
        const position=typeof saved==='object'?saved.value:Number(saved)||0;
        // Real HTTP servers support Range streaming. The offline APK's older
        // WebView asset transport needs a single seekable Blob for compatibility.
        loading=(async()=>{
         try{
          if(isAndroidApp){const response=await fetch(content.src,{signal});if(!response.ok)throw Error('视频加载失败，请重试。');const blob=await response.blob();if(signal.aborted||disposed||token!==loadToken)return;if(!blob.size)throw Error('视频文件为空，请重试。');blobUrl=URL.createObjectURL(blob);sourceUrl=blobUrl;}
          else sourceUrl=content.src;
          await new Promise((resolve,reject)=>{
          const cleanup=()=>{video.removeEventListener('loadedmetadata',metadata);video.removeEventListener('error',error);signal.removeEventListener('abort',cancel);};
          const metadata=()=>{cleanup();if(token===loadToken&&position>0&&position<video.duration-.25)video.currentTime=position;resolve();};
          const error=()=>{cleanup();if(token!==loadToken||disposed){resolve();return;}failed=true;reject(Error('视频加载失败，请重试。'));};
          const cancel=()=>{cleanup();resolve();};
          video.addEventListener('loadedmetadata',metadata,{once:true});video.addEventListener('error',error,{once:true});signal.addEventListener('abort',cancel,{once:true});
          video.src=sourceUrl;video.load();
          });
         }catch(error){if(signal.aborted||disposed||token!==loadToken)return;failed=true;throw error;}
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
        if(failed||!sourceUrl)throw new Error('视频还没有准备好，请重新加载。');
        await video.play();
      }
    },
    setSurface(value){surface=value;video.dataset.surface=value;},
    dispose(){progress();disposed=true;pause();++loadToken;controller?.abort();video.removeAttribute('src');video.load();if(blobUrl)URL.revokeObjectURL(blobUrl);sourceUrl=blobUrl=null;video.remove();video.removeEventListener('timeupdate',time);video.removeEventListener('pause',progress);document.removeEventListener('visibilitychange',visibility);},
  };
}
