const freeze=value=>{if(value&&typeof value==='object'){Object.freeze(value);for(const v of Object.values(value))freeze(v);}return value;};
export const PERMISSIONS=freeze({
  'messages.read.metadata':'读取标题与发件人','messages.read.body':'读取正文','attachments.read':'查看附件',
  'messages.search.local':'搜索已收录消息','messages.search.remote':'平台远端搜索','drafts.write.local':'保存本地草稿',
  'messages.send':'逐次确认发送','messages.modify':'修改远端状态','messages.delete':'删除远端消息',
  'ai.process':'本地助手处理消息','ai.export.cloud':'传给云端模型','notifications.read':'读取系统通知','browser.interact':'浏览器代操作',
});
const limited=(id,name,url)=>({id,name,label:name,identityKind:'personal',authMethod:'manual',available:true,url,
  evidence:'官方完整个人私信接入未获本项目验证',status:'manual',description:'手动收录或查看通知模拟；回复请回原应用。',
  limitation:'未接入私人聊天 API；通知为合成演示，系统监听尚未实现。',
  capabilities:{read:'manual',send:'unsupported',search:'local'},sendReason:'该来源未开放已验证的个人消息发送能力',});
export const PLATFORM_CATALOG=freeze([
  {id:'qqmail',name:'QQ 邮箱',label:'QQ 邮箱',identityKind:'personal-mailbox',authMethod:'demo',available:true,status:'demo',url:'https://mail.qq.com/',
    evidence:'合成演示；IMAP/SMTP 真实账号尚待验证',description:'模拟邮箱授权、增量同步与逐次确认发送。',limitation:'不连接真实邮箱，不收集密码或授权码。',
    capabilities:{read:'demo',send:'demo',search:'local'},sendReason:''},
  limited('wechat','微信','https://weixin.qq.com/'),limited('qq','QQ','https://im.qq.com/'),
  limited('douyin','抖音','https://www.douyin.com/'),limited('xiaohongshu','小红书','https://www.xiaohongshu.com/'),
  {id:'netease',name:'网易 163 邮箱',label:'网易 163 邮箱',available:false,status:'desktop',authMethod:'IMAP authorization code',evidence:'官方授权码及协议路径有据；真实账号需本地验证',description:'桌面端独立的只读邮箱连接。',limitation:'本版仅 @163.com；不发送、不修改远端状态。',url:'https://mail.163.com/'},
  {id:'gmail',name:'Gmail',label:'Gmail',available:false,status:'planned',authMethod:'OAuth',evidence:'官方 API 有据；本项目未获批、未实测',description:'后续独立 OAuth Connector。',limitation:'读取权限审核与数据使用要求待满足。',url:'https://mail.google.com/'},
  {id:'outlook',name:'Outlook',label:'Outlook',available:false,status:'planned',authMethod:'OAuth',evidence:'Graph 文档有据；本项目未授权、未实测',description:'后续委托权限 Connector。',limitation:'需账号授权与租户策略验证。',url:'https://outlook.live.com/'},
]);
export const platformOf=id=>PLATFORM_CATALOG.find(p=>p.id===id);
export function capabilitiesFor(platform){
  const mail=platform==='qqmail';
  return Object.fromEntries(Object.keys(PERMISSIONS).map(key=>{
    const supported=['messages.read.metadata','messages.read.body','attachments.read','messages.search.local','drafts.write.local','ai.process'].includes(key)||(mail&&key==='messages.send');
    return [key,{supported,mode:supported?(mail?'demo':'manual'):'unsupported',evidence:'demo',reason:supported?'':key==='messages.send'?'仅模拟邮箱支持模拟发送':'本产品演示未实现此权限'}];
  }));
}
