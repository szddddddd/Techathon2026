# 樱花模型筛选与定向替换

最终采用原图第 3、5 款生成结果，剔除第 1、2、4、6 款。仅替换此前使用 `sakura-weeping-v3r1` 的 13 个位置，新款分别使用 7、6 棵；11 棵舒展型仍使用原 `sakura-yoshino-v3`，没有移动任何树根或修改聚会树 ID。

被剔除模型的主要问题为大片面片、花冠封闭、花簇过粗或质感不协调。保留的两款枝干与花冠层次相对较好；它们仍是风格化近似。

## 实现与证据

| 条目 | 实现位置 | 验证 |
| --- | --- | --- |
| 只加载两款精选新树和原舒展树 | `src/fuji-visuals.js`、`src/scene-assets.js` | `assets.json`、`selection.json` |
| 仅替换原垂枝樱的地块 | `src/fuji-layout.js` | 原 13 处条件保留；实际新模型 7+6，原舒展型 11 |
| 保留比例并限制树冠占地 | `src/fuji-scene.js` | 树冠不侵入轨道及建筑；实际姿态截图 |
| 落瓣跟随新模型实际包围盒 | `src/sakura-petals.js` | `petals.json`、`capture.json` |
| 场景切换、回退、减少动态效果 | 现有场景生命周期 | `visual-regression.json`、`switch-resources.json` |

已运行构建、实际 GLB 地形与占地检查（336 个道路采样、九个聚会位置）、落瓣与生命周期检查、两场景切换及模型加载失败回退。最终截图覆盖桌面与手机模拟，九栋建筑及九个人物同屏；未做真实手机实测。

- [最终街景](blossom-season.png)
- [全景](overview.png)
- [手机模拟](mobile.png)
- [完整来源及采用记录](../../assets/rodin-fuji/SAKURA-REFERENCE-SOURCES.md)

`validation/reference-sakura/` 保存六款候选的三视图及筛选前场景，不代表最终采用版本；最终版本以本目录和 `selection.json` 为准。
