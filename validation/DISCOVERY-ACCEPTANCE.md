# 林间发现：需求、实现与验证

最新交互已改为一次点击自动展开，当前规范与证据见 [ONE-CLICK-ACCEPTANCE.md](ONE-CLICK-ACCEPTANCE.md)。下方板面二次展开段为此前版本记录。

日期：2026-10-15。完成本地可操作首版；没有接入真实微信、后端、直播或上传发布。

| 需求 | 实现位置 | 验证证据 |
|---|---|---|
| 好友／朋友圈／发现／我入口 | src/social-ui.js | discovery-home.jpg、浏览器脚本从真实按钮进入 |
| 3公众号、9完整文章、账号主页、搜索 | src/discovery-catalog.js、src/discovery-ui.js | npm test目录完整性；discovery-article.jpg、mobile-accounts.jpg |
| 订阅、字号、进度、点赞、评论、收藏 | src/social-store.js、src/discovery-ui.js | test-discovery-store.mjs持久化/旧库迁移；浏览器20字号、点赞收藏评论后刷新恢复 |
| 4作者、6真实12秒片段 | assets/discovery、scripts/record-discovery.mjs | 540×960 VP9；真实流水、火焰及角色运动；独立录制路径不打开用户IDB |
| 播放暂停、拖进度、切换、音量、失败重试 | src/discovery-player.js、src/discovery-ui.js | discovery-browser.json：实际播放推进、50%进度跳转、暂停后展开评论不自动播、网络中断再重试成功 |
| 推荐／关注／朋友、作者作品主页 | src/discovery-ui.js | 固定推荐与真实预置点赞来源；关注独立于好友；无匹配内容展示空页 |
| 报刊亭和放映场、场景入口 | src/discovery-scene.js | discovery-kiosk.jpg、discovery-projection.jpg；实际鼠标点击亭子进入公众号 |
| 幕布与完整UI共享播放器 | src/main.js、src/discovery-player.js | 一个video对象＋VideoTexture；幕布展开不创建第二个播放器 |
| 指定好友分享、附言转朋友圈 | src/social-ui.js、src/social-store.js | 浏览器将文章发阿栗、视频发山山；文章转朋友圈、聊天/朋友圈卡片均可重新打开 |
| 我的关注、收藏和最近浏览 | src/discovery-ui.js、src/social-ui.js | 独立按文章/视频分类，store历史去重测试 |
| 外部关闭、返回层级、保留浏览 | src/discovery-ui.js、src/social-ui.js | 浏览器Esc从公众号返回发现，点击外部关闭；分享不关闭原页面；导航保存查询、页签和scroll |
| 四/八角色站位与散步 | scripts/audit-discovery.mjs | discovery-placement.json：全部12个检查有效，两设施与Rodin包围盒无交叉，设施支撑成立 |
| 窄屏和性能 | discovery.css | 391×844无横向溢出；mobile截图；1440×1000、四好友测得39.6 FPS，errors为空 |

## 可复现验证

- `npm run build`：通过。
- `npm test`：旧社交存储、公共朋友圈查询、新发现存储三套全部通过。
- `npm run audit:discovery`：真实GLB＋设施边界、地面采样、4/8角色路线插值检查通过。
- `npm run test:browser`：独立Edge无痕上下文，全链路通过；记录在discovery-browser.json。
- 浏览器脚本模拟hidden-document事件，验证后台暂停；操作系统真实切换前后台未单独人工测量。
- 30 FPS是本机测量目标，不代表所有设备保证。高分屏、GPU与后台负载会影响结果。

## 素材说明

九篇文章为本项目原创森林故事；发现页、账号及文章配图使用本次真实场景视频封面。六片使用独立演示角色录制，视频画面不是静态图片轮播。原始录制12秒，添加Opus后容器时长约12.008秒。

声音由scripts/add-discovery-audio.py原创合成，为模拟溪水、风和篝火的环境音效，并非实地录音；来源见assets/discovery/audio-provenance.json。首次进入静音，用户主动开启。

WebM经FFmpeg无损重封装建立索引；播放器fetch完整Blob，解决Python静态服务器无Range导致的拖动失败。单片约1.4–2MB，只保留一个当前视频BlobURL。

角色避障与设施安全采用地面/三角投影/包围盒和路径采样，非所有三角形连续空间的穷举证明。六片保留录制时场景，袋鼠片的报刊亭朝向早于最终朝东微调，影片仍为真实场景记录。

## 截图

- discovery-panorama.jpg：全景。
- discovery-home.jpg：发现入口。
- discovery-kiosk.jpg：报刊亭无遮挡近景。
- discovery-article.jpg：文章阅读。
- discovery-projection.jpg：实际幕布视频投影。
- discovery-video-comments.jpg：桌面视频与评论布局。
- discovery-mobile-accounts.jpg、discovery-mobile-article.jpg、discovery-mobile-video.jpg：窄屏。

本轮修改保存在本地，没有自动推送GitHub。日常页面原有好友、聊天和照片未清除；验收新增数据仅在独立无痕上下文中。


## 板面交互改版（2026-10-15）

报刊亭与放映场统一为三级：场景封面缩略 → 700ms镜头推进 → 可操作的完整板面内容 → 点击展开按钮560ms放大正式窗口。正式窗口外点会480ms缩回板面，再点击板外或返回溪谷恢复原相机。

板面是公众号/视频号同一份DOM内容，按物理四角透视投影贴合，不是截图或装饰预览。文章页、滚动、评论输入和同一个video元素随展开迁移；视频进度连续，暂停后收回仍暂停。场景内隐藏好友头顶提示和底部导航，避免干扰阅读。独立底部发现入口仍可直接打开常规窗口。

新增`npm run test:boards`通过：板面9篇文章可点击、板内阅读、文章/滚动保留、双向展开/收回、窗外关闭逐级返回、Esc恢复场景、同一video及播放进度、暂停意愿、391px手机板面与正式窗口。结果`board-browser.json`；截图`board-kiosk.jpg`、`board-cinema.jpg`、`board-window.jpg`、`board-mobile-kiosk.jpg`、`board-mobile-window.jpg`。

新版`npm run test:browser`再次通过（errors为空），旧测试已改为板面先行。`npm test`和设施审计通过。减少动态模式跳过镜头与窗口大幅移动。
