# 平移、广场道路与树木调整

## 已完成

| 要求 | 实现位置 | 验证证据 |
| --- | --- | --- |
| 右键拖动更顺滑 | `src/camera-pan-bounds.js`：水平平移，移除逐帧地形高度吸附和凹岸线投影，保留世界范围限制及原有阻尼 | `validation/scene-polish/pan-bounds.json`；`pan-samples.json`，连续 80 步真实鼠标拖动无高度或朝向跳变 |
| 删除返回原视角按钮 | `src/valley-social.js`、`valley.css`：移除 DOM 与样式；聚会结束仍按原有逻辑恢复镜头 | 场景检查及广场回归；DOM 中无 `.valley-return` |
| 删除截图中的白色栏杆 | `src/valley-landmarks.js`：删除观景木框、透明点击面与观景入口；`src/valley-assets.js` 不再加载该模型 | `after-terrace.jpg`；几何检查确认物件及命中面均不存在。周边棕色细木护栏保留 |
| 移开广场连接路旁两棵树 | `src/layout.js` 的 `tree-f` 移到 (25.9, -5.2)；`valley-landmarks.js` 原 (18.4, -3) 树移到 (25.1, -9.5) | `before-plaza.jpg` / `after-plaza.jpg`、`after-slope.jpg`；连接路及坡路按完整人物半径检查通行 |
| 根部与坡面融合 | `src/tree-assets.js` 的 `groundTree`：只在根部低区一次性贴合地形，树干保持直立；旁侧旧树略作避让 | `geometry.json`：14 棵树的根部接地检查；实拍检查 |
| 同风格的两种新 Rodin 树 | `scripts/generate_rodin_trees.py`、`assets/rodin-trees/`：轻冠桦树与阔冠枫树；在原古树之间混用 | `assets/rodin-trees/manifest.json`：任务 ID、提示词、参数、文件哈希；两款树正反面实拍 |
| 新树颜色变亮 | `tree-assets.js` 的 `lightTreeFoliage`、`src/rodin-props.js`：针对叶片提升至浅鼠尾草绿，保留树干和明暗层次；资产查看器同步 | `lighter-trees.jpg`、`after-plaza.jpg`。调整材质与贴图配色，未改变全场曝光或重新付费生成 |

道路检查发现原左侧弧形坐阶也占用了连接通道，本次为坐阶留出入口缺口；保留其余坐阶和石板。

## Rodin 来源与费用

两次新生成均已完成下载，共 **1 credit**（每款 0.5）。轻冠桦树约 11,972 三角面，阔冠枫树约 13,540 三角面。原始 GLB 保留，场景加载时调整叶片配色；运行网页只读取本地资产。生成密钥仅通过运行时输入使用，没有写入源码或资产清单。可恢复任务原始记录存于 Git 忽略的 `records/rodin-trees/`。

## 检查结果

- `npm run build`、`npm test` 通过。
- `node scripts/test-scene-polish.mjs` 通过：几何、14 棵树根、完整人物通道、真实右键拖动、手机尺寸和两种树正反面检查，浏览器错误列表为空。
- `npm run test:camera` 通过：普通 / 极限平移、缩放边界、键盘旋转、发现与聊天转场后的控制恢复、手机尺寸。
- `node scripts/test-valley.mjs` 与 `test-valley-browser.mjs` 通过：13 项浏览器检查，含坡路、平台四角色安放、聊天与聚会恢复、手机旋转、8 人聚会容量。
- 本机 Edge 广场采样约 59.99fps，P95 帧间隔 16.8ms。属于本机有限样本，不承诺所有设备手感或帧率。

截图与 `scene-polish.webm` 位于 `validation/scene-polish/`。颜色最终版本以 `after-*.jpg` 和 `lighter-trees.jpg` 为准；保留的早期截图、调试失败截图与原始录像不是最终验收结果。

真实手机未实测。平移采用稳定水平面，镜头不会再随山坡自动抬升；仍可旋转与缩放观察高处。
