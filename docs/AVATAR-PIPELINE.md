# 好友头像到三维形象

[项目首页](../README.md) / [文档索引](README.md)

在「消息 → ＋ → 添加好友」搜索或录入本机联系人，添加后立即可以聊天。后台使用头像生成卡通全身参考图，再调用 Rodin 制作 GLB，完成后更新原好友的场景形象。资料页显示进度、失败重试和形象预览。

## 项目私有配置

图片编辑接口读取 `.forest-avatar-data/image-config.json`：

```json
{
  "baseURL": "https://your-image-service.example/v1",
  "apiKey": "YOUR_LOCAL_KEY",
  "model": "gpt-image-2",
  "size": "1024x1536"
}
```

本项目所有 Rodin 调用统一读取 `.forest-avatar-data/hyper3d-config.json`，包括场景资产、好友形象、任务状态和结果查询：

```json
{
  "baseURL": "https://api.hyper3d.com/api/v2",
  "apiKey": "YOUR_LOCAL_KEY"
}
```

统一调用入口为 `server/rodin-rest-client.mjs`。配置由服务端在每次请求时读取，密钥更新后下次请求即生效；网页没有密钥设置界面。缺失或无效时停止并报错，不使用 MCP OAuth、客户端全局配置或环境变量中的其他密钥。新场景资产先用 imagegen 生成参考图，再通过同一 REST 客户端调用 Rodin。

## 任务行为

- 好友关系与消息先保存，模型任务不阻塞聊天。
- 任务按稳定编号持久化；刷新后先查询原任务。
- 图像完成后提交 Rodin，模型就绪后更新同一好友，保留消息和草稿。
- 超时、5xx 或提交结果不明时暂停付费步骤，避免重复生成；可以在资料页处理失败任务。
- 服务端需要持续运行才能继续任务；没有待处理任务时前端停止轮询，后台页面暂停轮询。
- 本机任务、生成资产和配置均位于 `.forest-avatar-data/`，不通过静态路由公开，不提交到 Git。

实现入口：`src/ui/avatar-friend-ui.js`、`src/characters/friend-models.js`、`server/avatar-api.mjs`、`server/avatar-pipeline.mjs`。`asset-review.html` 为完成后的 GLB 提供嵌入式预览，桌宠可读取同一自定义好友模型。

运行 `npm run test:avatar` 检查本地流程。自动测试使用模拟供应商，不产生生成费用，也不代表任意头像的真实生成质量。
