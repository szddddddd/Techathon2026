import {appIcon} from './icons.js';
import {isAndroidApp} from '../platform/mobile-platform.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const platforms={qqmail:'QQ 邮箱',wechat:'微信',qq:'QQ',douyin:'抖音',xiaohongshu:'小红书'};
export function createContactEditor({panel,chrome,open,ui,gateway,safe,openThread,onPrepareCharacter,onRemoveCharacter,onViewCharacter,getCharacter}){
  let saving=false,editing=null,avatarUrl='',reading=Promise.resolve();
  function show(origin,id=null,platform='wechat'){
    saving=false;editing=id;const c=id?gateway.snapshot.contacts?.find(c=>c.id===id):null;
    if(id&&!c)return;avatarUrl=c?.avatarUrl||'';reading=Promise.resolve();const character=c&&getCharacter(c);
    panel.innerHTML=chrome(c?.name||'添加好友','inbox-contact')+`<form class="inbox-scroll inbox-contact-form"><fieldset class="inbox-import-platforms"><legend class="inbox-sr-only">来源软件</legend>${Object.entries(platforms).map(([p,label])=>`<label title="${label}"><input type="radio" name="platform" value="${p}" aria-label="${label}" ${(c?.platform||platform)===p?'checked':''}>${appIcon(p)}</label>`).join('')}</fieldset><label class="inbox-contact-photo"><span>${avatarUrl?`<img src="${esc(avatarUrl)}" alt="好友头像">`:'＋'}</span><small>${avatarUrl?'好友头像':'上传头像'}</small><input type="file" name="avatar" accept="image/png,image/jpeg,image/webp" ${avatarUrl?'disabled hidden':'required'}></label><label>昵称<input name="name" value="${esc(c?.name)}" required maxlength="80" placeholder="怎么称呼这位好友"></label><label>账号<input name="account" value="${esc(c?.account)}" maxlength="160" placeholder="软件账号或邮箱"></label><label>备注<textarea name="note" maxlength="500" rows="2" placeholder="记下你们的联系">${esc(c?.note)}</textarea></label><p class="inbox-caption">${character?(character.modelUrl?'三维形象已就绪':'三维形象准备中'):'保存后根据头像生成三维形象 · 使用服务额度'}</p><div class="inbox-actions">${c?'<button type="button" class="inbox-danger" data-contact-remove>删除记录</button>':''}${character?'<button type="button" data-contact-character>查看形象</button>':''}${c?.threadId?'<button type="button" data-contact-chat>查看消息</button>':''}<button type="submit" class="inbox-primary">保存</button></div><div class="inbox-contact-delete" hidden><p>删除这条好友记录？</p><button type="button" class="inbox-danger" data-contact-confirm>确认删除</button><button type="button" data-contact-cancel>取消</button></div></form>`;
    if(isAndroidApp&&!character?.modelUrl)panel.querySelector('.inbox-caption').textContent='头像仅存手机 · 三维形象生成服务暂未接入';
    return open('inbox-contact',origin,'[name=name]');
  }
  panel.addEventListener('change',e=>{if(e.target.name!=='avatar')return;const file=e.target.files[0];if(!file)return;
    reading=safe(async()=>{if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>6*1024*1024)throw new Error('请选择 6 MB 以内的头像');const bitmap=await createImageBitmap(file);const scale=Math.min(1,512/Math.max(bitmap.width,bitmap.height)),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();avatarUrl=canvas.toDataURL('image/png');panel.querySelector('.inbox-contact-photo>span').innerHTML=`<img src="${esc(avatarUrl)}" alt="好友头像">`;});
  });
  panel.addEventListener('submit',e=>{e.preventDefault();if(saving)return;saving=true;safe(async()=>{await reading;if(!avatarUrl)throw new Error('请添加好友头像');const fd=new FormData(e.target);const c=await gateway.saveContact({id:editing,platform:fd.get('platform'),name:fd.get('name'),account:fd.get('account'),note:fd.get('note'),avatarUrl});editing=c.id;if(c.avatarUrl)await onPrepareCharacter(c);await ui.close('inbox-contact');},e.submitter).finally(()=>saving=false);});
  panel.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
    if(b.hasAttribute('data-contact-remove'))panel.querySelector('.inbox-contact-delete').hidden=false;
    if(b.hasAttribute('data-contact-cancel'))panel.querySelector('.inbox-contact-delete').hidden=true;
    if(b.hasAttribute('data-contact-confirm'))safe(async()=>{const c=gateway.snapshot.contacts.find(c=>c.id===editing);if(c)await onRemoveCharacter(c);await gateway.removeContact(editing);await ui.close('inbox-contact');},b);
    if(b.hasAttribute('data-contact-character')){const c=gateway.snapshot.contacts.find(c=>c.id===editing);if(c)onViewCharacter(c);}
    if(b.hasAttribute('data-contact-chat'))safe(async()=>{const c=gateway.snapshot.contacts?.find(c=>c.id===editing);if(c?.threadId){await ui.close('inbox-contact');await openThread(c.threadId,b);}},b);
  });
  return show;
}
