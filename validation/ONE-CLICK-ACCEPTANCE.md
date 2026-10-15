# 一次点击进入林间内容

2026-10-15。本次替代此前“板面浏览后再次点击展开”的交互。

| 需求 | 实现 | 验证证据 |
|---|---|---|
| 拉近前已是简略公众号／视频号页面 | discovery-previews.js 生成 CanvasTexture，直接贴到真实场景网格；文章主图/标题/两条条目，视频封面/作者/播放标识 | one-click-kiosk-overview.jpg、one-click-cinema-overview.jpg；推进截图能看清简略排版 |
| 一次点击，无二次展开操作 | discovery-boards.js 的 approaching → expanding → browsing 状态；页面不再生成展开按钮 | test-discovery-boards.mjs 验证自动进入和无展开按钮；原社交回归包含真实鼠标点击报刊亭 |
| 更近的镜头 | focus 默认750ms，板面按82%视口高度及92%宽度约束拟合，宽度含细边框余量 | 桌面测试检查投影板面高度介于72%–90%；动画窗口于550ms开始与镜头重叠 |
| 边框与正文渐变展开 | 简略封面沿空间位置移动至正式封面，边框插值扩大；完整DOM按最终字号排版，以裁切和淡入显示，没有整页文字缩放 | 两段 journey.webm、approach/morph/window 截图 |
| 两种设施对应木框 | discovery-frames.css：公众号浅木纹／奶油纸面；视频号深木／暖色内沿；桌面14px、手机7px | one-click-kiosk-window.jpg、one-click-cinema-window.jpg、手机截图 |
| 一次外点完整反向退出 | 约400ms收回板面＋450ms镜头拉远；退出开始暂停视频，等待相机真正归位后才结束状态 | 自动比较位置误差<0.001、controls恢复；原交互位置不被新的保存覆盖 |
| 内页返回与退出分工 | 返回箭头沿页面导航；根页面返回、窗外点击或Esc退出到场景 | 浏览器导航与退出测试 |
| 阅读、草稿和播放意愿保留 | 界面会话缓存保存页面栈、列表状态和滚动；评论草稿按内容ID隔离；同一video与播放器复用 | 文章、720px阅读位置、未发评论；视频seek到50%、暂停再打开仍暂停且进度保持 |
| 快速切换和网络失败 | 单一时间线接管最新选择；暂停取消待播放意图；重试继续使用同一播放器 | 快速切换测试、延迟2200ms视频加载后退出仍暂停；社交回归覆盖网络失败重试 |
| 手机、旋转、减少动态 | 391×844以及844×391；减少动态使用150ms淡入淡出 | one-click-mobile-accounts.jpg、one-click-mobile-video.jpg；无横向溢出测试 |
| 从底部发现直接进入 | 同木框主题，正常打开DOM窗口，不触发场景相机 | 比较前后相机位置与enabled，误差<0.001 |

## 验证结果

- `npm run build`、`npm test` 通过。
- `npm run test:boards` 通过，结果 `one-click-browser.json`，页面错误为空。
- `npm run test:browser` 通过，结果 `discovery-browser.json`；四好友桌面测得40.5 FPS。性能是本机该次采样，非所有设备保证。
- `npm run audit:discovery` 通过，设施支撑、Rodin实体包围盒避让、四／八角色站位与路线有效。
- 全部浏览器测试使用独立上下文，不清除日常页面数据，不把测试评论写入日常页面。

## 过程录屏与截图

- `one-click-kiosk-journey.webm`：报刊亭完整进入与退出。
- `one-click-cinema-journey.webm`：放映场完整进入与退出。
- `one-click-{kiosk,cinema}-{overview,approach,morph,window,return}.jpg`：阶段截图。
- `one-click-mobile-accounts.jpg`、`one-click-mobile-video.jpg`：手机窗口。

录屏为实际浏览器交互，包含开始加载与全景停留。正式窗口仍为本地演示内容，没有改变桥河尺寸、发布接口或好友数据。未推送GitHub。
