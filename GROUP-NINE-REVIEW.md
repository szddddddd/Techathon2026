# 3×3 九格群聊庭院交付

本次将四格庭院扩为九格，并提供九种真实 Rodin 建筑模板。原有社团会馆、小教室、体育馆、实验室继续采用；新增图书馆、音乐厅、美术工坊、咖啡馆、天文台。格子仍是共享位置，不固定绑定类型；两个同类群可以同时出现。

刷新页面即可使用新布局。建群或群资料中可选择九种类型。点击场景的「···」可进入群列表：首次点击「体验校园群聊」建立十二个示例群；已有示例时可点「补齐九类示例」，只补缺少的群，不覆盖消息，也不添加好友。演示数据不会自动写入用户账号。

## 设计条目 → 实现位置 → 验证证据

| 设计条目 | 实现位置 | 验证证据 |
| --- | --- | --- |
| 3×3 稳定槽位，超过九群候场 | `src/community-layout.js`、`src/group-presence.js` | `validation/group-nine/data.json`：入场、关闭退出、递补、淡出反转、刷新；九个建筑与三个候场群同屏 |
| 西岸扩建、平整地面、交叉步道、建筑用地保留 | `src/world-surface.js`、`src/group-scene.js`、`src/valley-landmarks.js` | `validation/group-nine/scene.json`：九种模型占地检查、398 个步道采样；`valley-geometry.json`：地形检查 |
| 九种类型可创建、修改和展示 | `src/group-catalog.js`、`src/group-store.js`、`src/group-ui.js` | `data.json`：十二群示例与重复补齐；`assets.json`：九种模型均约 30,000 三角面 |
| 点击建筑、列表聊天、草稿、分享、群资料与递补 | `src/social-ui.js`、`src/group-scene.js` | `browser.json`、[完整流程录像](validation/group-nine/group-flow.webm) |
| 手机九个标签可点击，保留暖白玻璃与返回交互 | `src/group-scene.js`、`group-chat.css` | `capture.json`：391×844 模拟窗口，九个目标均可触达且高度 44px，CDP 触摸打开聊天；`browser.json`：手机返回 |
| 保留置顶与常驻分离 | `src/group-store.js`、`src/group-presence.js` | `data.json`、`browser.json`：常驻上限仍为三，列表置顶不受此限 |
| 真实 Rodin 资产与失败回退 | `assets/rodin-groups/`、`src/group-building-model.js` | 九组正背面检查、原始与运行 GLB 哈希一致；`browser.json`：一次模型请求失败仍可聊天 |

扩建时移开用地内植被，调整社区外侧发现设施，并将默认镜头向西平移以容纳更宽的地形。桥、营地、山脉及山腰观景台保留；山腰通道回归检查通过（`validation/terrace-extension/geometry.json`）。

## Rodin 来源与采用

所有采用资产均通过已授权的 Hyper3D MCP OAuth 生成，参数为 Gen-2.5-Medium / Raw / 30,000 面 / GLB。程序参考图只用于引导生成与加载失败回退，没有冒充 Rodin 输出。

| 类型 | 采用任务号 | 模型 |
| --- | --- | --- |
| 社团会馆 | `8e273234-f98d-43f5-bc6a-d4a9e2e15230` | [GLB](assets/rodin-groups/club/scene.glb) |
| 小教室 | `1f053b81-13da-4bc2-ad40-f7210baf9ac7` | [GLB](assets/rodin-groups/classroom/scene.glb) |
| 体育馆 | `41e86f83-7bce-4946-b3aa-1441f57f5b46` | [GLB](assets/rodin-groups/sport/scene.glb) |
| 实验室 | `2161f1e4-b0d9-46f4-9ce5-d9598607133d` | [GLB](assets/rodin-groups/lab/scene.glb) |
| 图书馆 | `7e4e2429-6991-49d5-bf73-328e899cc30f` | [GLB](assets/rodin-groups/library/scene.glb) |
| 音乐厅 | `746012fd-192b-4c03-b9c1-0b8270515169` | [GLB](assets/rodin-groups/music/scene.glb) |
| 美术工坊 | `d776aeeb-1218-4294-916e-8633340d0a83` | [GLB](assets/rodin-groups/art/scene.glb) |
| 咖啡馆 | `c4d20d75-bcef-4a3a-855e-dbadb95c63d4` | [GLB](assets/rodin-groups/cafe/scene.glb) |
| 天文台 | `194ac8a1-66e9-4c53-bb4d-8a51421356fd` | [GLB](assets/rodin-groups/observatory/scene.glb) |

本轮复用四种，新增五种，并对音乐厅修订一次，共六次生成调用。音乐厅首版 `4ece74e9-c9ec-4f71-8b5d-9ea041becb87` 因屋顶悬空未采用，原件留在 `music/attempt-1/`。修订版补齐屋顶与墙面的连接，已检查正背面和场景效果。累计十次生成、九种采用资产；接口未返回实际计费额度。

各类型目录保存提示词、参考图、任务号、原始 `source.glb`、运行 `scene.glb`、SHA-256 与采用记录。统一缩放、底面对齐和实验室朝向调整发生在运行时。汇总见 [资产清单](assets/rodin-groups/manifest.json)。

## 检查与交付

已通过群聊数据测试、九格场景测试、完整浏览器流程、地形与观景台回归。浏览器错误为零，最终截图使用九种成功加载的 Rodin 资产。源码与 `dist/world.js` 构建结果同步。

本机 1440×1000、四个人物与九栋建筑、正常动态模式，300 帧采样：中位帧间隔 16.7ms，P95 16.8ms，345 次绘制、958,233 三角面。先前同机四栋记录为 330 次绘制、824,749 三角面，帧间隔相同；默认视角已随扩建平移，因此这不是严格同视角的 GPU 性能对比。帧间隔受垂直同步约束，不代表 GPU 执行耗时。原始记录见 `validation/group-nine/performance.json`。

- [九种建筑对照](validation/group-nine/asset-contact.jpg)
- [九种正背面对照](validation/group-nine/asset-inspection.jpg)
- [庭院近景](validation/group-nine/community.jpg)、[桌面全景](validation/group-nine/desktop.jpg)
- [手机模拟](validation/group-nine/mobile.jpg)、[手机触摸打开群聊](validation/group-nine/mobile-building-entry.jpg)
- [建筑出现、聊天、消失与递补录像](validation/group-nine/group-flow.webm)

边界：仍是本地群聊体验，不接微信或多人服务器；手机证据来自浏览器模拟，未做真实手机性能验收。减少动态效果已用于最终截图与点击检查，正常动画由流程录像覆盖。
