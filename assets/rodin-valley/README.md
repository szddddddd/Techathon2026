# Rodin 山谷资产

用户授权生成，用于当前森林场景。8 个独立任务，每次 0.5 credits，共 4 credits。模型采用 Gen-2.5-Medium、Raw 三角网格、PBR 材质、2K 级贴图，详细提示词、任务 ID、面数目标、SHA-256 见 manifest.json。

scene.glb 为实际运行时资产；原始响应、订阅密钥、下载签名链接位于被 Git 忽略的 records/rodin-valley，不随项目发布。生成凭证仅在进程运行时提供。

`python scripts/generate_rodin_valley.py` 读取 RODIN_API_KEY 环境变量或交互输入，可续接本地任务；不要删除 records 后重跑，以免重复付费。模型单独检查入口为 `asset-review.html?asset=mountain_crag`，其他名称见 manifest。

调整说明：山体按岛屿边界适配长宽高；坐阶缩浅；石环模型实际为半圆，通过复用、薄化和着色器裁切保留三道草缝石环及出口；树灯只使用生成木质主体，四片未读叶灯为可控程序几何；告示牌文字为本地清晰纹理，避免依赖生成文字。
