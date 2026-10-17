# 巨构中心城资产

12项资产均先由项目授权的imagegen接口生成独立参考图，再通过Hyper3D MCP OAuth提交Rodin。Gen-2.5-Medium / Raw / 30000面 / GLB，追加Rodin修订0次。

- 图像：output/imagegen/cyber-city-v2/（3张概念、12张单体参考、提示词、catalog和合成预览）。
- 模型：assets/rodin-cyber-city-v2/<id>/，保留source.glb、贴图缩至1024的scene-detail.glb、网格简化scene.glb、三视图及manifest。
- 简化：glTF Transform 4.5.1，meshoptimizer ratio 0.45/error 0.002；实际比例受误差与UV接缝限制，不保证每项恰好45%。
- 出处：sources.json记录生成任务号、参考hash、源模型和最终场景hash。
- 原始生成高楼相对设计高度较矮。运行时按原有横向尺度裁分核心楼层段并重复装配，保留裙楼与塔冠，不拉长窗格。形成楼层接缝与模块化重复，属于程序装配而非Rodin原始输出。
- 车辆统一机头朝+X；没有新增轮子，推进光程序制作。
- 概念图仅指导材质与构图：整体概念中的远处浮岛未采用；图像光照与模型实际渲染分别交付。
- 细节限制：Rodin去光照导致窗内暖光减弱，以真实墙面UV发光补足；部分微小机械细节为纹理近似。
