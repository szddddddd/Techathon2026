# 霓虹云港资产来源与采用记录

本目录为实际 imagegen → Rodin 生成资产，不是概念图替代模型。项目内图像接口通过 imagegen 技能自带 CLI 调用，未改动客户端全局配置。

## 图像与构图

- 程序布局参考：`output/imagegen/cyber/source-default.png` 与 `source-overhead.png`。
- 总体采用：`output/imagegen/cyber/concept-overview-final.png`；街巷：`concept-street.png`。
- 初版总体图误画两艘飞艇，保留 `concept-overview.png` 作为过程记录；一次定向图像修订仅删除空港额外艇。
- 15 个独立主体参考、逐项提示和批次输入：`output/imagegen/cyber/`；`reference-contact.png` 可快速查看。

## Rodin 与优化

首轮 15 项，追加模型修订 0 项。每次调用均使用对应先生成的独立图像，Gen-2.5-Medium / Raw / 30,000 面 / GLB / texture_delight=true。OAuth 由现有 Hyper3D MCP 提供。原始 `source.glb` 保留；`scene.glb` 仅将贴图缩至最大 1024，几何字节已逐项比较相同。带签名下载 URL 和提交记录仅留在忽略的 `records/cyber/`。

所有资产都有 `reference.png`、`prompt.txt`、`manifest.json`、原始模型、场景模型，以及前/侧/后三视图。`sources.json` 保存任务 ID、大小、hash 检查和各项采用说明；`geometry-inspection.json` 是实际 Three.js 加载结果。

|资产|任务 ID|朝向|检查备注|
|---|---|---|---|
|霓虹社区会馆 `club`|`68fed870-a320-4821-8a06-83de28ccb2c0`|原向，门+Z|完整门廊、环形招牌、露台与背墙；参考中的暖窗需运行时恢复。|
|未来学习中心 `classroom`|`636cf538-69e3-450c-abba-dea46acabc74`|原向，门+Z|窗格与课程牌结构完整；侧后墙较简洁，符合小尺度街区。|
|街头运动馆 `sport`|`83199842-0cac-459a-9e14-622e89dd9a18`|原向，门+Z|拱顶、球形标记和门框完整；两端造型近似，对称门面可接受。|
|生物科技实验室 `lab`|`73febdfe-08b4-4fc6-a0f6-801d5df951d2`|原向，门+Z|玻璃舱、设备与管线连续；透明玻璃以不透明青蓝材质近似。|
|数据书屋 `library`|`4ab9e80b-6f5a-4e30-80ab-147237a31e41`|原向，门+Z|叠层建筑与竖向招牌完整；生图参考的书架内景未保留，需场景局部暖窗与标识辅助识别。|
|合成器录音室 `music`|`346b96ae-668c-4d62-b74e-a6f4677bef4f`|原向，门+Z|声波招牌与入口完整，后墙简化；窗口光由运行时控制。|
|全息艺术工坊 `art`|`709a25dc-aaf4-47fd-8f0c-c67962fad3ca`|原向，门+Z|展示窗、阶梯屋顶与植被完整；窗内艺术细节简化。|
|深夜拉面与咖啡屋 `cafe`|`bce4eaab-009f-4266-80e7-e348a632df28`|原向，门+Z|雨棚、柜台、座位与背部管线完整；烘焙窗光被delight移除。|
|星图观测站 `observatory`|`dbd29f40-af10-44f3-9a6a-7a1c64f62c18`|原向，门+Z|穹顶开口、望远镜与接收盘完整。|
|巡航飞艇 `airship`|`a6ebc2a0-53cb-4e43-9c3d-a68398e60ff8`|绕Y旋转π/2，朝+X|完整机头、尾翼、尾部推进环及下吊舱；原模型长轴Z机头+Z，旋转π/2后长轴X机头+X。|
|空港停泊塔 `dock`|`b60fb8db-1d31-4e94-a710-453501fbdd8a`|原向，门+Z|支撑脚、桁架、控制舱与停泊横梁完整，侧面较薄符合桁架结构。|
|光树会客厅 `light_tree`|`9ef663f4-1265-4cd2-9bb1-0608313430fa`|原向，门+Z|连续银灰树干和分层光纤冠，侧视较窄；不是真实透明纤维，发光由程序补充。|
|舒展光纤街树 `street_tree_a`|`15bfddd0-d051-481b-aa71-cd27015ba269`|原向，门+Z|分层冠与连接枝干完整，纤维喷束被简化为密集冠簇。|
|垂枝光纤街树 `street_tree_b`|`f6050f95-36c4-43e5-8f25-4b83aaa9be1d`|原向，门+Z|下垂纤维束、枝干、底座完整；深玫红材质保留。|
|快递无人机 `drone`|`4c6793e2-4ced-438e-af04-ea62190a365a`|绕Y旋转π/2，朝+X|四导管风扇、货箱、传感器完整；原正向+Z，旋转π/2后机头+X。|

## 真实限制

- 原始模型没有动态灯光；texture_delight 去除了生图中的多数暖窗光。运行时暖窗、推进光和消息强调应由私有材质或程序光片提供。
- 图书室的橱窗书架内景、工坊窗内微小细节被生成模型简化；轮廓及结构可用，不能声称逐像素复刻参考。
- 光纤树是实体枝束近似，不是真实光纤或逐根透明几何。
- 所有三视图均无明显缺面、断裂或失去主体，未使用额外付费修订。模型采用与场景碰撞、交互、性能验收分别记录。

## 复现

已生成模型的安全恢复：`node scripts/generate-cyber-assets.mjs`。已有任务只查询，提交结果未知且无任务号会停止，禁止盲目重交。

优化与三视图：`python scripts/optimize-cyber-assets.py`；`node scripts/inspect-cyber-assets.mjs`。图像批次必须通过已授权项目配置设置子进程环境后运行技能 CLI `generate-batch --input output/imagegen/cyber/references.jsonl --out-dir output/imagegen/cyber --concurrency 3 --max-attempts 1`；已有图片不会覆盖。

尺寸数组为 `[宽X,高Y,深Z]`；运行时先按 `manifest.rotationY` 定向，再归一化至目标大小与底面。
