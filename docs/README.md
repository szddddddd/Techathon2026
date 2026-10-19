# 文档索引

新开发者从根目录 [README](../README.md) 开始，随后阅读[开发指南](DEVELOPMENT.md)与[项目结构](PROJECT-STRUCTURE.md)。源码是当前行为的依据；专题中的历史验证记录只证明记录时的环境与范围。

## 工程与架构

| 文档 | 内容 |
| --- | --- |
| [DEVELOPMENT](DEVELOPMENT.md) | 安装、构建、运行、命令分组、可选服务与调试 |
| [PROJECT-STRUCTURE](PROJECT-STRUCTURE.md) | 目录职责、代码入口、运行数据与构建输出 |
| [TECHNICAL-ARCHITECTURE](TECHNICAL-ARCHITECTURE.md) | 前端、桌面、服务端与外部服务的数据流 |
| [PROJECT-OVERVIEW](PROJECT-OVERVIEW.md) | 产品与项目整体说明 |
| [Resources](Resources.md) | 项目介绍与既有材料记录；不用于配置或授权凭证 |
| [THIRD-PARTY-RESOURCES](THIRD-PARTY-RESOURCES.md) | 依赖、素材来源、许可记录及待补授权 |
| [贡献约定](../CONTRIBUTING.md) / [安全报告](../SECURITY.md) | 协作流程、PR 要求与私密问题处理 |

## 功能与平台

| 文档 | 内容 |
| --- | --- |
| [UNIVERSAL-INBOX](UNIVERSAL-INBOX.md) | 统一收件箱、合成演示、手动收录与权限 |
| [MAILBOX-INTEGRATION](MAILBOX-INTEGRATION.md) | 场景信箱与共享收件箱的桥接 |
| [MAIL-INTEGRATION](MAIL-INTEGRATION.md) | Electron QQ / 163 只读 IMAP 接入 |
| [MAIL-AGENT](MAIL-AGENT.md) | 邮箱 AI 配置、逐次授权、引用与本地草稿 |
| [MAIL-AGENT-VALIDATION](MAIL-AGENT-VALIDATION.md) | 模拟与真实服务验证的范围和限制 |
| [WORKSHOP](WORKSHOP.md) | 创意工坊与内置 Mod 生命周期 |
| [BUILDINGS](BUILDINGS.md) | 模块建筑放置、搬迁、碰撞与视角 |
| [AVATAR-PIPELINE](AVATAR-PIPELINE.md) | 头像参考图、Rodin 任务、私有配置与恢复 |
| [CHARACTER-RIGS](CHARACTER-RIGS.md) | 角色骨骼与动作实现 |
| [CHARACTER-RIG-PLAN](CHARACTER-RIG-PLAN.md) | 骨骼系统的历史设计计划 |
| [ANDROID](ANDROID.md) | Android 工具链、签名、打包、安装与验收 |
| [ANDROID-AVATAR-DEMO](ANDROID-AVATAR-DEMO.md) | Android 头像演示的独立实现与配置说明 |
| [PICO-VR](PICO-VR.md) | WebXR、USB 转发、交互与头显验收边界 |

## 性能、计划与证据

- [PERFORMANCE](PERFORMANCE.md)：构建、静态文件与场景性能说明。
- [MOBILE-PERFORMANCE](MOBILE-PERFORMANCE.md)：移动端渲染、资源生命周期与测量。
- [移动性能计划](plans/mobile-performance.md)：历史阶段计划，完成状态以实现和验证为准。
- [工程整理计划](plans/engineering-layout.md)与[验收记录](validation/engineering-layout-2026-10-19.md)：目录迁移、实际检查及未验证范围。
- [角色验证数据](character-rig-validation.json) 与 `validation/`：仓库保留的验证材料；本机新测试输出另存 `.test-results/`，不纳入 Git。
- `images/`：文档使用的产品截图。

部分历史资料保留 PDF，后续维护优先修改对应 Markdown。资产本身的来源还可从 [`assets/README.md`](../assets/README.md) 和各资产旁 manifest 查找；任务记录不等于许可证明。
