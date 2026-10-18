const apps={qqmail:['QQ 邮箱','qqmail.svg'],netease:['网易 163 邮箱','netease.svg'],wechat:['微信','wechat.png'],qq:['QQ','qq.png'],douyin:['抖音','douyin.png'],xiaohongshu:['小红书','xiaohongshu.png']};
export function appIcon(platform,{className='inbox-app-icon'}={}){
  const app=apps[platform];
  return app?`<img class="${className}" src="assets/inbox-icons/${app[1]}" alt="${app[0]}" title="${app[0]}" width="28" height="28" decoding="async">`:'';
}
