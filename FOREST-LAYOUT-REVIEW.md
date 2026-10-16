# 植被与装饰调整 · 2026-10-16

普通树木由 15 棵增加为 30 棵，全部重新排列：森林树 24 棵，小镇街树 6 棵。外围形成错落树群，中心草地、建筑入口、桥头及上山通路保持开放；金色树灯仍位于 `(21, 2.22, 2)`。

## 方案与实现

| 方案 | 实现 | 验证证据 |
| --- | --- | --- |
| 西侧 8、东侧 12、山脚 4 棵森林树 | `src/forest-layout.js` 统一世界坐标；古树、桦树、枫树各 8 棵，经 `PLACEMENTS` 同时进入渲染与碰撞 | `validation/forest-layout/geometry.json`、`forest-browser.json` |
| 重新排列并增加街树 | `src/community-layout.js` 同步更新 6 个位置与街区障碍查询 | 515 个实际街道采样点通过；九个建筑模板共 81 次尺寸检查通过 |
| 清除晶体与大多数陆地苔石 | 3 组装饰晶体全部移除，7 处陆地苔石减少到 2 处；正常启动不请求晶体模型 | `forest-browser.json`；河道石块、浮岛、山体、桥梁及铺装不变 |
| 贴地、通行及交互 | 真实模型沿地面调整树根；广场入口、坡道和中心草地留空 | 真实/备用树根均无越界或过深埋入；`bridge.json`、`valley-browser.json`、`character-drag.json` |
| 加载失败后保持布局 | 程序树和苔石使用同一坐标表，提供完整物件清单与碰撞；碰撞建立后继续合并静态材质 | 强制阻断桦树模型后，场景仍完整加载，树木数量、角色出现、聚会和移动视口检查通过 |
| 控制新增树木的初始化开销 | `src/vertical-surface.js` 给静态山体建立 X/Z 索引，仍使用 Three 精确三角形相交与原材质面剔除 | 真实/备用山体共 932 个采样点与原射线结果一致；另测世界变换、绘制范围与正反面 |

山谷浏览器测试原先仅置顶联系人，与当前“最近有消息的好友进入场景”规则不符；测试现在先给四位好友添加消息，并等待四个角色出现，产品规则保持原样。

## 画面

- [森林全景](validation/forest-layout/forest-normal-desktop.jpg)
- [九栋建筑全景](validation/forest-layout/forest-town-desktop.jpg)
- [手机全景](validation/forest-layout/forest-normal-mobile.jpg)
- [手机广场](validation/forest-layout/forest-normal-mobile-plaza.jpg)
- [备用模型全景](validation/forest-layout/forest-fallback-desktop.jpg)

已检查以上实际截图：树群围绕外围，中心草地、瀑布、桥梁及金色树灯可见。手机截图为 391 × 844 浏览器视口；尚未在真实手机硬件上测量性能。

## 性能

同一台机器、Edge headless D3D11、1440 × 1000、空庭院；3 个全新浏览器上下文，各测一次冷加载与热加载，帧采样各 120 帧。时间取三轮中位数，完整数据见 [performance.json](validation/forest-layout/performance.json) 及同目录原始记录。

| 指标 | 修改前 | 修改后 |
| --- | ---: | ---: |
| 冷加载完成 | 3.387 秒 | 3.692 秒 |
| 热加载完成 | 3.189 秒 | 3.340 秒 |
| 帧间隔 P95 | 16.8 毫秒 | 16.8 毫秒 |
| 帧 CPU P95（各轮中位数） | 4.2 毫秒 | 3.6 毫秒 |
| 绘制调用 | 314 | 318 |
| 三角形 | 697,694 | 831,224 |
| 冷加载传输量 | 38.73 MiB | 37.82 MiB |

树木增加后冷加载约增加 9.0%，热加载约增加 4.7%；四位角色聚会实测约 60 FPS。空间索引将本轮初版布局的冷加载中位数从 4.198 秒降到最终布局的 3.692 秒。该结果只代表本地采样，不代表所有设备或网络条件。

## 复现

```powershell
npm run build
npm test
npm run test:performance
npm run test:forest
$env:FOREST_WEB_PORT='48943'
npm start
```

另开终端：

```powershell
$env:FOREST_TEST_URL='http://localhost:48943'
$env:FOREST_TEST_OUTPUT='validation/forest-layout'
npm run test:forest:browser
node scripts/test-valley-browser.mjs
node scripts/test-character-drag.mjs
node scripts/test-performance-browser.mjs
node scripts/test-town-walking.mjs
node scripts/test-group-scene.mjs
node scripts/audit-bridge.mjs --out validation/forest-layout/bridge.json
```

本轮在 `main` 上完成本地修改和验证，未提交或推送 GitHub，未修改本地已有的 `AGENTS.md` 内容。
