# 霓虹云港：巨构中心城交付

访问 http://localhost:8080/?scene=cyber 。本轮升级现有云港；森林和富士继续使用原场景。九个群聊地块、朝向、建筑模板及绑定规则保持原状。

## 实现与证据

| 设计条目 | 实现位置 | 证据 |
| --- | --- | --- |
| 三座62/54/46主塔、8栋中高楼、6段商业裙楼、4段连廊 | src/cyber-city-layout.js、src/cyber-city.js、src/cyber-city-geometry.js | validation/cyber-city/final/desktop.png、street.png |
| 原九地块不动、街道与光树会客厅、人物地面活动 | src/cyber-layout.js、src/cyber-profile.js | test-cyber-city.mjs与test-cyber-layout.mjs；174段路径、81种地块/模型组合 |
| 三张概念与12项imagegen→Rodin资产 | assets/rodin-cyber-city-v2/ | CYBER-CITY-ASSETS.md及sources.json；每项前/侧/后三视图 |
| 8辆悬浮车、2艘货运船、原飞艇与2架无人机 | src/cyber-city-traffic.js | 8000航路/体积采样；traffic/checks.json；90秒实际运行录像 |
| 统一载具跟随、停港、减少动态效果、手机减量 | src/train-follow.js | 三种小型载具真实点击跟随；手机由13个交通对象减为7个 |
| 关注目标时高楼局部淡化，关闭恢复 | src/cyber-city.js、src/main.js、src/group-scene.js | browser/focused-fade.png；静止视角不重复检测的单元检查 |
| 三场景共享数据、公共设施与失败回退 | 场景注册、资产加载及现有UI | browser/browser.json，五轮切换、草稿/附件/历史位置/未读及两种资产失败检查 |

## 实际交付

- 全景、俯视、街巷、手机、飞艇近景：validation/cyber-city/final/。
- 俯视地块与交通分层图：validation/cyber-city/layout-and-layers.svg。
- 概念图与独立参考：output/imagegen/cyber-city-v2/。
- 模型：assets/rodin-cyber-city-v2/<id>/source.glb、scene-detail.glb、scene.glb。
- 全程巡航：final/airship-circuit-and-message.webm，真实墙钟约90秒，无时间跳跃；另有三场景切换录像。
- 小型交通跟随：validation/cyber-city/traffic/vehicle-follow.webm。
- 源码、构建dist/world.js及可重复运行的生成/检查/采集脚本均保留。

## 验证边界

真实手机未测试，手机结果为391px浏览器模拟。上层不提供人物寻路、乘车或驾驶。生成模型中的极小机械细节与玻璃多为纹理/不透明材质近似。高楼通过裁分重复楼层段达到指定高度，窗格没有整体拉长，但能看见模块化重复与装配接缝；这是程序装配结果，不冒充Rodin原始比例。

九栋建筑仍原位，因此默认高楼视角会自然遮挡部分后排群聊入口；消息列表仍可访问，关注在场目标后遮挡高楼淡化。手机全景需要缩小整个城市以保留塔顶与岛底，可缩放进入街巷。

现有森林安放历史失败见此前CYBER-REVIEW.md。本轮运行数据、群聊、布局、第三场景和跟随相关检查，不声称修复该无关历史问题。

## 最终性能与回归结果

同设备、同窗口、同一比较镜头、九人九栋：改造前平均16.679ms/P95 16.8ms，改造后平均16.680ms/P95 16.8ms；当前231次绘制、1,771,461个三角面。帧间隔受显示刷新约束，不等于纯GPU耗时。

完整塔顶与岛底全景另行采样：16.679ms/P95 16.8ms，211次绘制、1,889,169个三角面。全景约189万面，略高于约180万目标；同机帧间隔未出现25%以上退化。

五轮三场景往返，各场景几何/纹理计数的观测集合：{'fuji': [(539, 250)], 'forest': [(495, 248)], 'cyber': [(386, 246)]}。没有持续增长，浏览器错误为零。27项模型正常采用（原15项＋本轮12项）；实验室和最高主塔的单项失败回退分别验证。

本轮期间修复了优化网格的交错属性读取问题，并扩展安全出生区域解决九人入场容量不足；交付截图为修复后实际渲染。
