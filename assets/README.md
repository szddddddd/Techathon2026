# 当前运行资产

当前运行资源清单包含三个场景、好友与桌宠实际加载的资源，以及加载失败时的显式模型回退。

| 目录 | 内容 |
| --- | --- |
| `rodin/`、`rodin-trees/`、`rodin-valley/`、`rodin-mountain/` | 森林道具、树木、聚会设施与山脉 |
| `rodin-groups/` | 森林的九种群聊建筑 |
| `rodin-fuji/` | 富士山、采用的樱花与回退、日式建筑、列车、车站和道口 |
| `ideal-city/` | 原生 Blender 理想城、网页 GLB 与共享布局元数据 |
| `rodin-friends/` | 四种好友模型与头像 |
| `social/` | 本地示例动态插画 |
| `discovery/` | 公众号封面、示例视频和缩略图 |
| `audio/` | 场景音乐 |

森林与富士采用 Hyper3D Rodin 生成模型；理想城采用用户提供的原生 Blender 场景。程序地形、动态结构与回退几何位于 `src/`。运行模型使用 `scene.glb`；相邻 `manifest.json` 记录当前文件、布局、朝向和校验值。模型纹理嵌入 GLB。示例媒体不是真实好友照片，公众号内容的来源链接随正文保留。

霓虹云港已从运行入口和资产清单移除，原模型目录保留作历史素材。

`scripts/project-assets.mjs` 解析当前场景的动态模型路径及媒体引用。执行 `npm run test:assets` 检查完整性；添加或替换模型时同步更新运行路径和该清单。
