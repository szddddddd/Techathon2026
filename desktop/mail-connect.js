const form=document.querySelector('#mail-form'),status=document.querySelector('#status'),done=document.querySelector('#done');
const providers={qqmail:{name:'QQ 邮箱',placeholder:'123456@qq.com',setup:'在 QQ 邮箱网页版打开“设置 → 账号”'},netease:{name:'网易 163 邮箱',placeholder:'yourname@163.com',setup:'在网易邮箱网页版打开“设置 → POP3/SMTP/IMAP”'}};
const initial=new URLSearchParams(location.search).get('provider');
if(Object.hasOwn(providers,initial))form.elements.provider.value=initial;
function updateProvider(){const p=providers[form.elements.provider.value];document.querySelector('h1').textContent='连接'+p.name;document.title='连接'+p.name+' · WeRoam';form.elements.account.placeholder=p.placeholder;form.elements.account.value='';form.elements.code.value='';form.elements.consent.checked=false;document.querySelector('#mail-setup').textContent=p.setup;status.textContent='';}
updateProvider();form.elements.provider.addEventListener('change',updateProvider);
form.addEventListener('submit',async event=>{
  event.preventDefault(); if(!form.reportValidity())return;
  const button=form.querySelector('button');button.disabled=true;form.elements.provider.disabled=true;
  status.dataset.error='false';status.textContent='正在连接并收取，请稍候…';
  let input={provider:form.elements.provider.value,account:form.elements.account.value,code:form.elements.code.value};
  form.elements.code.value='';
  try {
    const result=await window.mailAuthorization.connect(input);
    input=null;
    if(!result?.ok)throw new Error(result?.error?.message||'连接未完成，请重试。');
    form.hidden=true;done.hidden=false;
    status.textContent=`连接成功，已收取 ${result.value.count} 封邮件。`;done.focus();
  } catch(error) { status.dataset.error='true';status.textContent=error.message; }
  finally { input=null;button.disabled=false;form.elements.provider.disabled=false; }
});
done.addEventListener('click',()=>window.mailAuthorization.close());
