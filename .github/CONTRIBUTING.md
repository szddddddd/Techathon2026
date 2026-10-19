# 参与 WeRoam 开发

主仓库为 [szddddddd/Techathon2026](https://github.com/szddddddd/Techathon2026)。先阅读 [README](../README.md)、[开发指南](../docs/DEVELOPMENT.md)、[项目结构](../docs/PROJECT-STRUCTURE.md) 和仓库 `AGENTS.md`。本项目处于 beta 阶段，功能边界与验证限制应随代码一起更新。

## 准备与分支

使用 Node.js 22+，从仓库根目录运行：

```powershell
npm ci
npm run build
npm test
```

从最新主分支创建独立工作分支，例如 `codex/clarify-inbox-state`。多人并行工作时使用独立 worktree，明确每个人负责的文件，并由一位维护者顺序集成。不要提交 `node_modules/`、`dist/`、测试输出、下载包或本机用户数据。

## 修改约定

- 保持原生 ES Modules 与现有模块边界；Electron 主进程沿用 `.cjs`，Node 工具使用 `.mjs`。
- 页面入口放入 `src/pages/`，前端逻辑放入 `src/` 相应功能目录，CSS 放入 `src/styles/`，测试放入 `tests/`，工程工具放入 `scripts/`。
- 将纯状态与计算逻辑和 DOM、场景、网络副作用分开。新增角色、场景或 UI 监听时，同时处理卸载、场景切换和后台恢复。
- 通过现有适配层访问邮箱、IPC、生成服务和存储；不要让前端直接获得桌面凭据或提供任意网络/代码执行接口。
- 保留 URL、消息数据、草稿与用户配置的兼容性。确需迁移时，说明触发条件和恢复办法。
- 新增依赖时说明用途并同步 `package-lock.json`；新增资产记录来源、作者、许可与必要署名，不将“生成成功”写成“许可已确认”。

## 私有配置与外部调用

真实凭据只留在 `.forest-avatar-data/`、`.weroam-private/` 等对应私有位置。不要读取、复制或公开他人的本地配置；测试使用临时目录和合成数据。

所有 Rodin 调用必须通过 `server/rodin-rest-client.mjs`，统一读取项目 `.forest-avatar-data/hyper3d-config.json` 中的 `apiKey`。配置缺失时明确报错，不回退到 MCP OAuth、全局配置或其他环境密钥。每个新物体先用 imagegen 生成独立参考图再提交 Rodin；超时或提交结果不明时查询原任务，不直接重新提交。真实生成、探针和邮箱连接应明确标注它们会访问哪个外部服务；常规回归使用模拟服务。

## 验证与 Pull Request

按改动运行相关逻辑测试，涉及页面、布局、交互或生命周期时再运行对应浏览器检查；命令索引见[开发指南](../docs/DEVELOPMENT.md)。为修复的问题保留有意义的回归验证，避免把实现逐行复写成测试。

PR 描述应包括：

1. 具体问题或触发条件，以及修改后的行为。
2. 涉及的模块与兼容性影响；有界面改动时附使用合成数据的截图。
3. 实际执行的构建和测试命令、结果，以及未完成的设备或真实账号验收。
4. 新依赖、资产许可变化、数据迁移或外部服务调用情况。

提交前检查暂存区与差异，确认没有密钥、授权码、真实邮箱、私人头像、签名文件或生成任务的私密订阅凭据。只提交本次相关文件。不要通过批量重写格式掩盖行为修改。

功能问题可到 [Issues](https://github.com/szddddddd/Techathon2026/issues) 提交最小复现、平台和版本；安全问题遵循 [SECURITY.md](SECURITY.md)，不要在公开 Issue 中附敏感内容。
