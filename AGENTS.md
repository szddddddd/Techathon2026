不要读取"C:\Users\user\Desktop\world2"
后续开发主仓库为 https://github.com/szddddddd/Techathon2026.git；提交和推送使用此仓库。

本项目所有 Rodin 调用（场景模型、好友头像生成角色、任务状态与结果查询）统一使用项目私有 `.forest-avatar-data/hyper3d-config.json` 中的 `apiKey`，通过 `server/rodin-rest-client.mjs` 访问 Hyper3D REST。用户已指定本机配置中的密钥作为统一凭据；不得改走 MCP OAuth、客户端全局配置或其他环境密钥，配置缺失时明确报错。密钥不得写入源码、文档、日志或 Git。
每次生成新的 Rodin 物体，先使用 imagegen 生成独立参考图，再将该图提交 Rodin；任务结果不明时查询原任务，不重复提交。
