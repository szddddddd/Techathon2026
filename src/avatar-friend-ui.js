import {avatarURL} from './avatar-url.js';
import {friendAvatar} from './social-store.js';

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const phaseText={queued:'正在准备森林形象',waiting_connection:'形象稍后继续准备',image_submitting:'正在准备森林形象',image_review:'正在准备森林形象',model_uploading:'正在准备森林形象',rodin_submitting:'正在准备森林形象',model_processing:'森林形象正在成形',downloading:'森林形象即将就绪',ready:'森林形象已就绪',failed:'形象暂未完成',attention:'形象准备已暂停',cancelled:'形象暂未完成'};
const phaseProgress={queued:4,image_submitting:16,image_review:28,model_uploading:38,rodin_submitting:45,model_processing:72,downloading:92};
const activePhases=new Set(Object.keys(phaseProgress));

/** Ordinary contact profile. Model creation never gates adding a friend or chatting. */
export function createAvatarFriendUI({store,ui,models,onComplete=()=>{},onChat=()=>{},onError=()=>{}}){
  const shell=document.createElement('dialog');shell.id='friend-profile';shell.className='avatar-window';shell.setAttribute('aria-label','好友资料');
  shell.innerHTML='<header class="ui-titlebar"><span>好友资料</span><button class="ui-close" data-ui-close="friend-profile" aria-label="关闭好友资料">×</button></header><div class="contact-profile-body"></div>';
  document.body.append(shell);const body=shell.querySelector('.contact-profile-body');
  let selected=null,avatarUrl='',adding=false,requestId=null,preview=false;
  const draft={name:'',account:'',signature:''};
  ui.register('friend-profile',{el:shell,kind:'child',modal:true,onClose:capture,onClosed(){preview=false;body.querySelector('iframe')?.remove();}});
  function capture(){const form=body.querySelector('#contact-form');if(form)for(const k of Object.keys(draft))draft[k]=form.elements[k].value;}
  const current=()=>selected&&(store.getFriend(selected.id)||selected);
  function modelHTML(f){
    if(!store.state.friends.includes(f.id))return '';
    const ready=!!f.modelUrl,phase=ready?'ready':f.modelPhase||'queued';
    const progress=phaseProgress[phase];
     return `<div class="contact-model-line" data-model-phase="${esc(phase)}"><span class="contact-model-dot ${ready?'is-ready':''}"></span><span>${esc(phaseText[phase]||'正在准备森林形象')}</span>${ready&&f.jobId?'<button type="button" data-profile-action="preview">查看形象 ›</button>':['failed','waiting_connection'].includes(phase)?'<button type="button" data-profile-action="retry">重试</button>':''}</div>${progress!==undefined&&activePhases.has(phase)?`<div class="contact-model-progress" role="progressbar" aria-label="虚拟形象生成进度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress}"><span style="width:${progress}%"></span><small>${progress}%</small></div>`:''}${!ready?'<p class="contact-model-note">形象准备不影响聊天，就绪后会自动用于森林场景。</p>':''}${preview&&ready&&f.jobId?`<iframe class="contact-model-preview" title="好友森林形象" src="${esc(avatarURL('/asset-review.html?avatar-job='+f.jobId+'&embed=1'))}"></iframe>`:''}`;
  }
  function draw(){
    const f=current();
    if(!f){
      body.innerHTML=`<form id="contact-form"><label class="contact-photo"><input name="avatar" type="file" accept="image/png,image/jpeg,image/webp" ${avatarUrl?'':'required'}><span>${avatarUrl?`<img src="${esc(avatarUrl)}" alt="联系人头像">`:'<b>＋</b><small>联系人头像</small>'}</span></label><label class="contact-field">昵称<input name="name" maxlength="40" required autocomplete="off" value="${esc(draft.name)}" placeholder="好友昵称"></label><label class="contact-field">账号<input name="account" minlength="3" maxlength="64" pattern="[a-zA-Z0-9_.-]{3,64}" required autocomplete="off" value="${esc(draft.account)}" placeholder="字母、数字、点、下划线或短横线"></label><label class="contact-field">个性签名 <small>选填</small><input name="signature" maxlength="100" value="${esc(draft.signature)}" placeholder="这位朋友的个性签名"></label><p class="contact-feedback" role="status"></p><button class="contact-primary" type="submit">添加到通讯录</button><p class="contact-privacy">添加后会根据头像自动准备森林形象，可直接开始聊天。头像将用于形象生成，使用相应服务额度。</p></form>`;
    }else{
      const added=store.state.friends.includes(f.id);
      body.innerHTML=`<div class="contact-identity"><img src="${esc(friendAvatar(f))}" alt="${esc(f.name)}的头像"><div><h2>${esc(f.name)}</h2><p>账号：${esc(f.account||f.id)}</p></div></div><div class="contact-details"><span>个性签名</span><p>${esc(f.signature||'这位朋友还没有填写签名。')}</p></div><div class="contact-model-status">${modelHTML(f)}</div><p class="contact-feedback" role="status"></p><button class="contact-primary" data-profile-action="${added?'chat':'add'}">${added?'发消息':'添加到通讯录'}</button>${!added&&!f.modelUrl?'<p class="contact-privacy">添加后会根据头像自动准备森林形象。</p>':''}`;
    }
  }
  function feedback(text){const el=body.querySelector('.contact-feedback');if(el)el.textContent=text;}
  async function addExisting(){
    if(adding)return;adding=true;
    try{await store.addFriend(selected.id);draw();onComplete(selected.name);}catch(e){feedback(e.message);onError(e);}finally{adding=false;}
  }
  shell.addEventListener('click',async e=>{
    const button=e.target.closest('[data-profile-action]');if(!button)return;const action=button.dataset.profileAction;
    try{
      if(action==='add')await addExisting();
      if(action==='chat'){const id=current().id;await ui.close('friend-profile',{immediate:true,restoreFocus:false});onChat(id);}
      if(action==='retry'){button.disabled=true;await models.retry(current().id);}
      if(action==='preview'){preview=!preview;body.querySelector('.contact-model-status').innerHTML=modelHTML(current());}
    }catch(error){feedback(error.message);onError(error);}finally{if(button.isConnected)button.disabled=false;}
  });
  shell.addEventListener('change',async e=>{
    if(e.target.name!=='avatar')return;capture();const file=e.target.files[0];if(!file)return;
    try{
      if(file.size>6*1024*1024)throw new Error('请选择 6MB 以内的头像。');
      const bitmap=await createImageBitmap(file),ratio=Math.min(1,512/Math.max(bitmap.width,bitmap.height)),canvas=document.createElement('canvas');
      canvas.width=Math.max(1,Math.round(bitmap.width*ratio));canvas.height=Math.max(1,Math.round(bitmap.height*ratio));canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();
      avatarUrl=canvas.toDataURL('image/png');requestId=null;draw();
    }catch(error){feedback(error.message);}
  });
  shell.addEventListener('submit',async e=>{
    if(e.target.id!=='contact-form')return;e.preventDefault();if(adding)return;capture();if(!avatarUrl)return feedback('请选择联系人头像。');
    adding=true;const button=e.target.querySelector('[type=submit]');button.disabled=true;
    try{
      requestId??=crypto.randomUUID();const id=await store.addAvatarContact({...draft,avatarUrl,jobId:requestId});
      selected=store.getFriend(id);preview=false;draw();onComplete(selected.name);avatarUrl='';requestId=null;for(const key of Object.keys(draft))draft[key]='';
    }catch(error){feedback(error.message);onError(error);}finally{adding=false;if(button.isConnected)button.disabled=false;}
  });
  const unsubscribe=store.subscribe((state,event)=>{
    if(selected&&event.type==='friend-model'&&event.friendId===selected.id){const el=body.querySelector('.contact-model-status');if(el)el.innerHTML=modelHTML(current());}
  });
  return{open(profile=null,{account='',origin}={}){capture();selected=profile;preview=false;if(!profile&&account&&!draft.account)draft.account=account;draw();ui.open('friend-profile',{origin:origin||ui.source()});},dispose(){unsubscribe();shell.remove();}};
}
