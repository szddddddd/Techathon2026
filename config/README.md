# 本地配置模板

Web 场景、示例消息和基础测试不需要第三方服务密钥。这里的 JSON 只有占位值，不由运行时直接读取。

需要头像生成时，在仓库根目录创建 `.forest-avatar-data/`，将两个 `*.example.json` 模板分别复制为该目录下的 `hyper3d-config.json` 和 `image-config.json`，再在本机填写自己的配置。该私有目录已被 Git 忽略；不要修改模板填入真实值，也不要将配置放到 `assets/` 或 `src/`。

Rodin 生成、状态及结果查询统一通过 `server/rodin-rest-client.mjs` 读取项目私有 `hyper3d-config.json` 的 `apiKey`。配置缺失时明确报错，不从 MCP、全局配置或其他环境密钥回退。每个新物体先生成独立参考图再提交 Rodin；提交结果不明时查询原任务。

完整操作及任务恢复见 [头像流程](../docs/AVATAR-PIPELINE.md)。桌面邮箱与邮箱 Agent 使用独立授权及本地存储，见 [邮箱 Agent](../docs/MAIL-AGENT.md)。Android 现有头像演示的独立配置与统一服务入口的差异见 [开发指南](../docs/DEVELOPMENT.md)。

Web 端口可通过 `FOREST_WEB_PORT` 指定（默认 8080），不涉及生成凭据：

```powershell
$env:FOREST_WEB_PORT = '8088'
npm start
```
