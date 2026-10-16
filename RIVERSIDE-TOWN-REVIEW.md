# 临河花园街区交付

九个共享地块已改为山脚、街心、临河三个错落的小组，建筑按入口朝向街道摆放。暖灰石板主街约 2.2 单位宽，碎石支巷与桥边接入通道至少 1.6 单位宽；道路与小广场使用统一裁切铺装，消除了交叉处的叠层和逐栋占位框。

街心花园、临河花带、西侧街角花园配有四棵小街树、三张长椅、四盏矮灯和三个花箱。报刊亭和视频号入口位于南侧公共步道，更多群聊牌位于公共步道与营地之间。为留出完整通行空间，清除了道路附近一块旧苔石，并将南侧一棵原有树向前移 1.2 单位。城镇平地向西最多拓宽 2 单位，浮空岛外轮廓、桥、河流与营地保持原有位置。

## 实现与证据

| 设计条目 | 实现位置 | 验证证据 |
| --- | --- | --- |
| 九个地块、朝向、入口、道路、花园和设施共用布局 | `src/community-layout.js` | `geometry.json`：81 组模型与地块尺寸组合、九个入口、地块之间和花园之间无重叠 |
| 石板、碎石、低花坛、街树、长椅与矮灯 | `src/town-landscape.js` | 俯视和近景实际截图；`landscape-cost.json`：14 个静态网格，21,088 三角面 |
| 建筑、轮廓、信件和小旗按地块转向 | `src/group-scene.js` | 群聊浏览器流程通过；仍在最近九群中的建筑保持地块，已读后保留 |
| 人物通行与花园保护 | `src/world-surface.js`、共享布局 | `geometry.json`：658 个道路采样；`actual-paths.json`：包含现有场景资产的 505 个实际通行采样全部通过 |
| 公共入口与南侧步道 | `src/discovery-scene.js`、`src/layout.js` | `browser.json`：公众号、视频号、唱片机入口打开与返回通过 |
| 桌面投影标签、手机紧凑避让 | `src/group-scene.js` | `browser.json`：九栋建筑和九个人物共存，九个手机标签均可触达且高度至少 44px |

没有新增 Rodin 生成任务。九种现有 GLB 继续复用；人物和群聊的最近九个会话规则、聊天数据和草稿继续使用。建筑消失时，只收起动态建筑，前庭步道和公共街景保留。

## 交付画面

- [俯视布局](validation/riverside-town/plan.jpg)
- [街区近景](validation/riverside-town/town.jpg)
- [默认视角](validation/riverside-town/overview.jpg)
- [手机模拟](validation/riverside-town/mobile.jpg)

截图使用隔离的演示账号，九种建筑与九个人物同屏；没有修改用户当前页面的数据。手机证据来自 391×844 浏览器模拟，未进行真实手机实测。

## 检查

构建通过；群聊规则、好友在场规则、模型地块适配、人物通行、浮空岛地表以及群聊浏览器流程通过。捕获的页面错误和建筑加载失败均为零。最终同屏渲染记录为 367 次绘制、1,053,010 三角面，包含九栋建筑、九个人物和完整森林；该记录只用于说明本轮规模，不作为设备间性能比较。

复现命令：

```powershell
npm run build
node scripts/test-group-scene.mjs
node scripts/test-group-chat.mjs
node scripts/test-presence-policy.mjs
# 以下命令需要本地服务已启动
node scripts/test-town-walking.mjs
node scripts/test-group-browser.mjs
node scripts/capture-riverside-town.mjs
```

本轮证据集中在 `validation/riverside-town/`。完整群聊流程证据由现有测试写入 `validation/group-nine/browser.json`。
