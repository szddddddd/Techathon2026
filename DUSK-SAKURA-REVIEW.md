# 富士樱町：暮樱粉视觉重设计

交付日期：2026-10-17。

岛面改为玫瑰粉砂地，岩壁采用灰玫瑰与藕紫分层及轻微矿物纹理。粉紫渐变背景、冷灰紫富士山和暖色灯笼共同降低刺眼高光；街道、瓦顶、木墙与界面保留辨识度。原有岛屿边界、建筑、铁路和道路坐标不变。

先用 imagegen 技能的 CLI 路径调用项目已配置的图像接口，完成整体概念、街巷概念及两类树木独立参考图，再调用 Rodin。枝垂樱首轮丢失花冠，未采用；先重新生成参考图，再用唯一一次修订生成补全。最终使用 11 棵舒展型染井吉野与 13 棵枝垂樱，模型分别约 30,000 面，完整树冠避让铁路和屋顶。

## 结果文件

- 实际前后对比：`validation/dusk-sakura/before-after.jpg`
- 默认、街巷、俯视、手机模拟：`validation/dusk-sakura/after/overview.png`、`street.png`、`plan.png`、`mobile.png`
- 带实际 UI 的默认视角：`validation/dusk-sakura/after/overview-ui.png`
- 录像：`validation/dusk-sakura/after/dusk-train-petals.webm`（约 73 秒，后段为动态列车与落瓣）
- 概念图与全部图像提示词：`output/imagegen/dusk-sakura/`；采用说明见其中 `concept-adoption.json`。
- 舒展型 GLB：`assets/rodin-fuji/sakura-yoshino-v3/scene.glb`
- 枝垂型 GLB：`assets/rodin-fuji/sakura-weeping-v3r1/scene.glb`
- 任务号、原始模型、参考哈希与修订记录：`assets/rodin-fuji/DUSK-SAKURA-SOURCES.md`、各目录 `manifest.json`、`validation/dusk-sakura/asset-provenance.json`

## 设计条目 → 实现 → 验证

| 条目 | 实现位置 | 验证证据 |
|---|---|---|
| 玫瑰岛面、紫色岩壁、冷色山体 | `src/fuji-visuals.js`、`src/fuji-scene.js` | 固定视角前后截图；`brightness.json` |
| 独立曝光、天空和灯光 | `src/scene-world.js`、`src/main.js` | `visual-regression.json`：森林灯光恢复、反复切换资源稳定 |
| 新樱花与旧版加载回退 | `src/scene-assets.js`、`src/fuji-layout.js` | 三视图、`assets.json`：24 棵实际模型树冠避让；`legacy-tree-fallback.png` |
| 落瓣发射区与静态积瓣 | `src/sakura-petals.js` | `petals.json`、`visual-regression.json`：屋顶承接、减少动态效果与暂停 |
| 通路、聚会、列车、聊天和手机入口 | 复用现有布局与控制器 | `assets.json`：323 个通路采样、九人聚会；`geometry.json`：停站与道口；`regression/browser.json`：九群九人、五次切换、草稿/附件/未读保留 |

曝光由初始 1.18 微调到 **1.28**。固定 1440×1000 视角，排除天空、UI 和基线最高/最低各 20% 亮度像素，屏幕中间调亮度估计降低 **19.4%**。该指标包含材质和树木几何变化，是视觉比较，不是物理照度测量。

同一 Edge、视角和九群九人，各采样 180 帧：

| 状态 | 改造前均值 / P95 | 改造后均值 / P95 | 绘制调用：前 → 后 |
|---|---|---|---|
| 静态减少动态效果 | 16.68 / 16.80 ms | 16.68 / 16.80 ms | 319 → 319 |
| 列车与落瓣开启 | 16.68 / 16.80 ms | 16.68 / 16.80 ms | 321 → 321 |

构建、现有数据测试、受影响的布局/人物通路/列车/花瓣检查、新视觉回归和完整双场景浏览器流程均通过。没有新增动画循环或每帧射线检测。

## 证据边界

- 手机仅为 391×844 浏览器模拟；真实手机未验证。
- 帧间隔受显示刷新率限制，未观察到退化不等于已经测得全部 GPU 余量。
- Rodin 花簇保留自然分枝和两类轮廓，但属于约 30,000 面的风格化花簇，并非逐朵复刻参考图花瓣。
- 概念中的云景、烘焙光晕与生成图推测的细节没有冒充实际三维实现；实际场景使用可释放的渐变背景和真实现有灯光。
