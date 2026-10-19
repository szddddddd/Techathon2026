# 开发与使用文档

[项目首页](../README.md) / 文档

首次运行从[快速开始](../README.md#快速开始)进入。查代码先看[目录职责](PROJECT-STRUCTURE.md)，查功能配置从下表进入。

直接使用安装包请看[下载安装与升级](INSTALL.md)；开发者制作安装包与发布版本见[发布指南](RELEASING.md)。

## 开发与架构

| 文档 | 内容 |
| --- | --- |
| [开发指南](DEVELOPMENT.md) | 环境、安装、构建、运行、常用命令与调试 |
| [项目结构](PROJECT-STRUCTURE.md) | 目录职责、代码入口、私有数据与构建输出 |
| [技术架构](TECHNICAL-ARCHITECTURE.md) | 浏览器、Electron、Android 与外部服务的数据流 |
| [项目概览](PROJECT-OVERVIEW.md) | 产品定位、已实现能力与交付边界 |
| [性能说明](PERFORMANCE.md) / [移动端性能](MOBILE-PERFORMANCE.md) | 缓存、资源生命周期与测量方法 |
| [贡献指南](../.github/CONTRIBUTING.md) / [安全报告](../.github/SECURITY.md) | 贡献流程与私密问题处理 |

## 功能与平台

| 领域 | 指南 |
| --- | --- |
| 消息与收件箱 | [Universal Inbox](UNIVERSAL-INBOX.md) · [场景信箱桥接](MAILBOX-INTEGRATION.md) |
| 桌面邮箱 | [QQ / 163 接入](MAIL-INTEGRATION.md) · [邮箱 Agent](MAIL-AGENT.md) |
| 场景扩展 | [创意工坊](WORKSHOP.md) · [建筑放置](BUILDINGS.md) |
| 角色 | [头像到模型](AVATAR-PIPELINE.md) · [骨骼与动作](CHARACTER-RIGS.md) |
| Android | [构建与安装](ANDROID.md) · [独立头像演示](ANDROID-AVATAR-DEMO.md) |
| VR | [PICO / WebXR](PICO-VR.md) |

## 资源与历史记录

- [运行资产](../assets/README.md)：当前模型、媒体与资源清单。
- [第三方来源与许可](THIRD-PARTY-RESOURCES.md)：依赖、素材与待补授权。
- [历史档案](archive/README.md)：阶段计划、验收记录和旧测量数据；记录注明的环境与范围不代表当前版本已重新验收。

文档截图位于 `images/`。日常构建、测试与报告输出使用被忽略的 `dist/`、`.test-results/`、`output/`；PDF 按需导出，维护时修改对应 Markdown。
