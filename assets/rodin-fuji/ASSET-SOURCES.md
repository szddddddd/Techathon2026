# 斜穿铁路街区修订（2026-10-16）

本轮 14 项先通过项目配置的 OpenAI 兼容生图接口（gpt-image-2、bundled imagegen CLI）生成独立参考图，再通过 Hyper3D MCP OAuth 各提交一次 Rodin。共 14 次生成、0 次修订。采用模型为 `railway-*` 目录；既有富士山与两种樱花未重新生成，旧建筑与列车资产仍保留。

完整任务编号、输入图片、提示词、原始 GLB、纹理优化版本与三面检查图见 [railway-catalog.json](railway-catalog.json) 和各资产目录。整体构图、灰盒及生图提示词见 `output/imagegen/railway-town/`。车轮、连杆、轨道连续钢轨、蒸汽、栏杆运动与灯光由程序制作。参考图生成的建筑前庭底座随模型保留在预留占地内；并非真实建筑工程模型。

# 富士樱町 · Rodin 资产来源与采用记录

**当前富士山已更新为 v2。** 2026-10-16 按用户要求，先通过项目生图接口制作自然沟壑、雪线与火山口参考图，再额外调用一次 Rodin，任务号 `294064b2-ccd0-4085-aa2d-b1162df9155d`。当前采用文件仍为 `fuji/scene.glb`；原山体归档在 `fuji-v1/`，新参考、原始结果和说明见 [fuji-v2/README.md](fuji-v2/README.md)。下文首批 15 项统计是初次生成记录。

首批 **15 项、15 次生成**，无重复提交、无修订生成。通过本机已授权的 Hyper3D MCP OAuth 调用 Rodin；使用 `Gen-2.5-Medium / Raw / 30,000 triangles / GLB`。资产均以本项目程序绘制的前、后构图参考为输入，没有下载第三方现成模型。

## 资产列表

| ID | 资产 | 使用约定 |
| --- | --- | --- |
| club | 町内会馆 | 正门 +Z |
| classroom | 木造学舍 | 正门 +Z |
| sport | 樱町道场 | 正门 +Z |
| lab | 山麓研究所 | 正门 +Z |
| library | 町立书屋 | 正门 +Z |
| music | 木音堂 | 正门 +Z |
| art | 陶艺工坊 | 正门 +Z |
| cafe | 樱花喫茶 | 正门 +Z |
| observatory | 星见观测所 | 正门 +Z |
| fuji | 富士山 | 完整单锥雪顶山体，无河流 |
| sakura_a | 染井吉野樱 | 直立展开花冠 |
| sakura_b | 垂枝樱 | 倾斜树干、下垂花簇 |
| locomotive | 蒸汽机车车身 | 原始车头 +Z，`rotationY = π/2` 后为 +X；无轮组 |
| carriage | 木窗客车车身 | 长轴 X，无轮组 |
| station | 樱町小站 | 入口及雨棚 +Z |

每个目录包含：`reference-front.png`、`reference-rear.png`、`prompt.txt`、原始 `source.glb`、前端采用 `scene.glb`、`manifest.json`、以及前／后／侧三张 `preview-*.png`。Manifest 记录实际任务编号、参数、参考哈希、源文件与采用文件 SHA-256、朝向和采用说明。带上传凭据或签名链接的任务回执仅存放于已忽略的 `records/fuji-assets/`，不进入前端及公开来源记录。

## 减重与检查

- 保留原始 `source.glb`；前端 `scene.glb` 保持全部源几何和 30,000 三角面。
- 三张 2048 嵌入纹理缩至 1024；漫反射使用 JPEG 93、无色度抽样；法线及金属／粗糙度保持 PNG。
- `optimization.json` 提供每项压缩前后大小；`geometry-inspection.json` 提供真实 GLB 解析的尺寸、网格数及面数。
- 已检查 15 项的前／后／侧共 45 张实物渲染：没有发现严重破洞、悬浮构件或遗漏完整后背；两列车资产确实没有轮组。机车输出未遵循提示的 +X 朝向，已在 manifest 明确补偿角度。
- 富士山采用风格化封闭雪顶锥体；小尺度火山口未由生成结果明确表现。其余几何完整性与场景地表、铁路动力学验收属于不同检查，场景级结果由整体交付记录说明。
- `contact-front.jpg`、`contact-rear.jpg`、`contact-side.jpg` 为实物多视图总览；`reference-contact-sheet.jpg` 为生成前的程序参考总览。

## 复现与恢复

```powershell
node scripts/prepare-fuji-references.mjs
node scripts/generate-fuji-assets.mjs --check
# 仅在首次获授权执行；已有任务自动恢复，不重复付费提交：
node scripts/generate-fuji-assets.mjs
node scripts/generate-fuji-assets.mjs --poll-only
python scripts/optimize-fuji-assets.py
node scripts/inspect-fuji-assets.mjs
```

生成脚本在付费提交前持久化意图；回执不明时停止并保留原记录，禁止自动重新提交。可通过位置参数限定资产 ID 以查询既有任务；没有自动付费修订分支。
