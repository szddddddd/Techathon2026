# 富士樱町 · 实现与验收

山体后续更新：2026-10-16 已先生成新参考图，再调用 Rodin 重建并采用富士山 v2，增加可见火山口和自然沟壑。见 [更新记录](assets/rodin-fuji/fuji-v2/README.md) 与 [新场景画面](validation/fuji-mountain-v2/landscape.jpg)；下文原首批模型的火山口限制属于 v1。

新增独立的昭和风樱花铁路小镇；主界面顶部悬浮条在森林与富士樱町之间进行页面内切换。首次仍进入森林，记住最后成功的选择。切换不重建聊天 UI、IndexedDB store、渲染器或动画循环。

## 设计条目 → 实现位置 → 验证证据

| 设计条目 | 实现位置 | 验证证据 |
| --- | --- | --- |
| 场景准备、挂载、更新、暂停与释放；失败保留旧场景 | `src/scene-world.js`、`src/main.js`、`src/scene-assets.js` | `validation/scene-switching/browser.json`、`edge-cases.json` |
| 独立地块、富士山、无河流/观景台、岩石浮岛 | `src/fuji-layout.js`、`src/fuji-profile.js`、`src/fuji-scene.js` | 俯视图、全景图与地表检查 |
| 九种日式群建筑、两种樱花、车站及列车模型 | `assets/rodin-fuji/`、`src/group-scene.js` | 15 份 manifest、45 张模型多视图、`ASSET-SOURCES.md` |
| 24 棵樱花、四处庭院、三栋小店、公共庭园、街道配景与两辆车 | `src/fuji-scene.js`、`src/fuji-layout.js` | `fuji-overview.jpg`、`fuji-street.jpg` |
| 弯道车厢独立定位、70 秒循环、8 秒停站、平滑减速与启动、蒸汽 | `src/fuji-train.js` | 列车运动检查、`steam-train.webm` |
| 点击列车/站牌跟随，Esc 或拖动返回，减少动态效果静态停站 | `src/train-follow.js`、`train-follow.css` | `train-follow-camera.json`、`train-follow.jpg`、浏览器检查 |
| 顶部胶囊、悬停/点击/键盘展开、闲置收起、模态期间禁用 | `src/scene-switcher.js`、`scene-switcher.css` | `edge-cases.json`、`mobile-scene-picker.jpg` |
| 同一会话保留草稿、附件、阅读位置与未读，好友位置分场景保留 | `src/social-ui.js`、`src/social-characters.js`、`src/group-scene.js` | 五次热切换及九人物/九建筑检查 |
| 场景公众号阅读切换后保留滚动并正常关闭 | `src/discovery-ui.js`、`src/discovery-scene.js` | `content-travel.json`：滚动位置 700 保持，Esc 与右键平移通过 |
| 场景专属资源释放、共享模型缓存、实例化缓冲释放 | `src/scene-assets.js`、`src/scene-world.js` | 五次切换资源计数稳定；释放路径检查覆盖 `InstancedMesh.dispose()` |

## 已执行的检查

- 构建通过：`npm run build`。
- 原有数据测试、好友在场规则、群聊数据测试及群聊浏览器流程通过。
- 原森林街区 515 个实际通行采样全部通过。
- 新场景九个人物、九栋建筑同屏；建筑点击、聚会与返回、公众号/视频号/唱片机入口通过。
- 五次页面内切换保持同一 canvas、UI 与 store；没有重复的场景根节点、标签容器或拖动提示。
- 草稿、图片附件、历史滚动位置与未读保持；模拟资产加载失败后仍可使用原场景，重试成功；快速重复点击只提交一次切换。
- 手机模拟尺寸 391×844 下，悬浮条选项保持在屏幕内、可点击区域至少 44px，群名可打开聊天。
- 最终手机镜头完整容纳主体岛岸；九个群名标签全部通过中心点击命中检查，证据见 `capture-mobile.json`。密集好友状态提示仍可能覆盖部分山体。
- 程序回退场景的 368 个正常行走采样通过；7,000 个列车运动采样确认停站八秒、隐藏复位与弯道车厢间距。此项回退几何验证与 Rodin 加载后的浏览器检查分别记录，见 `geometry.json`。
- 同一设备、1440×1000 窗口、相同镜头与九人物/九建筑、减少动态效果条件下，各采样 180 帧：森林平均约 16.68ms、P95 16.8ms；富士樱町平均约 16.68ms、P95 16.8ms。对应约 377/266 次绘制、105/141 万三角面。这是该浏览器场景的帧间隔观察，不是各设备的帧率保证。

## 资产与交付

首轮调用 Rodin **15 次，15 项成功，0 次追加修订**。采用 `Gen-2.5-Medium / Raw / 30,000 面 / GLB`。原始模型合计约 122.16MB，前端采用模型约 33.22MB，保留源几何，缩减嵌入纹理。每项保留参考图、提示词、任务号、源文件、优化文件、哈希和采用记录；OAuth 与签名链接不进入前端。

- [资产来源及复现方法](assets/rodin-fuji/ASSET-SOURCES.md)
- [模型总览](assets/rodin-fuji/contact-front.jpg)
- [俯视布局](validation/scene-switching/fuji-plan.jpg)
- [桌面全景](validation/scene-switching/fuji-overview.jpg)
- [街区近景](validation/scene-switching/fuji-street.jpg)
- [手机画面](validation/scene-switching/fuji-mobile.jpg)
- [列车录像](validation/scene-switching/steam-train.webm)
- [场景切换录像](validation/scene-switching/scene-transition.webm)

运行 `node scripts/test-scene-switching.mjs` 验证完整热切换流程；`--content-only` 验证跨场景阅读，`--follow-only` 验证列车跟随；`node scripts/test-scene-edge-cases.mjs` 验证展开/收纳、失败重试与快速点击。

## 实际边界

手机使用 Edge 浏览器窗口模拟，未做真实手机或跨 GPU 实测。富士山为 Rodin 风格化封闭雪顶山体，小尺度火山口未明确生成；场景采用记录已注明。模型加载失败有程序回退，但本次正常加载实测全部 15 项 Rodin 资产均成功采用。列车提供观景跟随，没有乘车或驾驶任务。
