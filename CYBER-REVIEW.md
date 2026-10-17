# 霓虹云港交付与验证

入口：`http://localhost:8080/?scene=cyber`。顶部玻璃小球靠近展开，点击按钮按森林 → 富士 → 云港循环，名称在按钮内滑动。

## 实现与证据

| 设计条目 | 实现位置 | 验证证据 |
| --- | --- | --- |
| 岩石机械浮空岛、三个街坊、九地块、庭院和公共空港 | `src/cyber-layout.js`、`src/cyber-scene.js` | `validation/cyber-layout/checks.json`、`validation/cyber-final/overhead.png` |
| 先生图后 Rodin，15项真实模型 | `assets/rodin-cyber/`、`scripts/generate-cyber-assets.mjs` | `CYBER-ASSET-SOURCES.md`、45张三视图、源/优化hash与几何比较 |
| 真实窗面暖光、私有材质、完整地块尺寸 | `src/cyber-window-lights.js`、`src/scene-assets.js` | `validation/cyber-window-lights/review.json`、`validation/cyber-final/street.png` |
| 飞艇85秒循环、10秒停靠、两架无人机、近景跟随 | `src/cyber-airship.js`、`src/train-follow.js` | 1000航线净空采样、浏览器跟随/退出/暂停检查、实际运行录像 |
| 九人活动与光树聚会，九群建筑及消息灯带 | `src/social-characters.js`、`src/group-scene.js` | `validation/cyber-browser/browser.json` |
| 新闻终端、放映屏、音乐台与群聊候场牌 | `src/public-facility-models.js`、`src/discovery-scene.js`、`src/record-player.js` | 三个原有内容流程真实打开与返回，桌面/手机截图 |
| 三场景注册、热切换、位置存储及加载反馈 | `src/scene-world.js`、`src/scene-theme.js`、`src/scene-switcher.js` | 三场景往返、草稿/附件/阅读位置保持、加载失败回退、十五次切换资源检查 |

## 资产与视觉边界

概念图是 imagegen 输出，真实场景截图位于 `validation/cyber-final/`，二者分开交付。原始15项GLB约146.83MB，场景贴图优化后约50.44MB；优化不改变几何。生成服务去掉了多数窗内灯光，运行时按真实窗面UV补光，保留原始漫反射贴图。

图书室书架内景与工坊微小细节有所简化；光纤树采用实体枝束近似。局部原模型窗面仍有细小不规则边缘。上层连廊作为景观，人物活动在地面与连续步道；不提供上下层导航、登艇或驾驶。

## 检查范围

构建、现有四组数据测试、群聊业务与地块检查、第三场景出生/设施契约、飞艇镜头契约、三场景胶囊，以及新增布局和完整浏览器流程均已运行。正常模型加载与单项模型失败程序回退分别验证，程序回退不计为Rodin采用。

额外运行的既有 `test-placement-clearance.mjs` 在 `previously valid land must remain valid` 断言失败，使用 Git HEAD 原角色实现也复现；本轮没有修改该历史断言。新增赛博道路、聚会点、建筑/岛外禁放及真实九人活动检查通过。

手机证据为391px浏览器模拟，真实手机未实测。手动把桌面近景缩到手机尺寸可能造成标签遮挡；采用注册手机默认视角的可见群标签已逐个检查真实点击位置。

## 最终性能记录

同设备、相同窗口和九人九栋条件下，霓虹云港平均帧间隔16.680ms、P95为16.8ms，147次绘制、981951个三角面；富士樱町为16.679ms、P95为16.8ms，340次绘制、1953532个三角面。帧间隔接近显示刷新周期，不等同于纯GPU耗时。

五轮完整三场景往返共15次切换，逐轮几何/纹理计数保持一致：云港326/201、富士491/205、森林447/203；场景根节点、标签及共享数据未持续增长。浏览器记录零错误。正常加载采用15项Rodin模型，无程序回退；另行强制实验室模型失败时验证了单项回退。详情见 [browser.json](validation/cyber-browser/browser.json)。

## 交付索引

- 概念：[整体](output/imagegen/cyber/concept-overview-final.png)、[街巷](output/imagegen/cyber/concept-street.png)、[15项参考图](output/imagegen/cyber/reference-contact.png)。
- 实际场景：[桌面](validation/cyber-final/desktop.png)、[手机模拟](validation/cyber-final/mobile.png)、[俯视](validation/cyber-final/overhead.png)、[街巷](validation/cyber-final/street.png)、[飞艇近景](validation/cyber-final/airship-follow.png)。
- 实际运行录像：[90秒飞艇巡航、停泊及群来信](validation/cyber-final/airship-circuit-and-message.webm)、[三场景按钮切换](validation/cyber-final/three-scene-switch.webm)。巡航录像墙钟90.173秒、场景动画90.172秒，未跳时间。
- 资产：[来源与采用记录](CYBER-ASSET-SOURCES.md)，原始和优化GLB位于 `assets/rodin-cyber/<资产ID>/`。
- 构建：`dist/world.js`；源码及必要验证脚本已保留，本轮未自动提交或推送。
