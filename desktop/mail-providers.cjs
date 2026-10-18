// Fixed official endpoints. Renderer/Agent cannot supply an IMAP host or URL.
const PROVIDERS=Object.freeze({
  qqmail:Object.freeze({platform:'qqmail',id:'mail-qq-real',name:'QQ 邮箱',domain:'qq.com',host:'imap.qq.com',webmail:'https://mail.qq.com/',file:'inbox-mail-v1.enc'}),
  netease:Object.freeze({platform:'netease',id:'mail-netease-real',name:'网易 163 邮箱',domain:'163.com',host:'imap.163.com',webmail:'https://mail.163.com/',file:'inbox-mail-163-v1.enc'}),
});
function providerOf(key='qqmail') {
  if(typeof key!=='string'||!Object.hasOwn(PROVIDERS,key))throw Object.assign(new Error('不支持此邮箱类型。'),{code:'INVALID_INPUT'});
  return PROVIDERS[key];
}
module.exports={PROVIDERS,providerOf};
