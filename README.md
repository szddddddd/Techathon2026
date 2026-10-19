<div align="center">

<h1><img src="assets/branding/weroam-icon-rounded.png" alt="" width="48" height="48" align="absmiddle"> WeRoam</h1>

**We meet We live**

这是一个模块化空间社交原型。核心设计是把每项功能都可视化为实体，放入场景之中。

基于 Three.js · 浏览器 / Windows 桌宠 / Android · v0.1 beta.1

[![CI](https://github.com/szddddddd/Techathon2026/actions/workflows/ci.yml/badge.svg)](https://github.com/szddddddd/Techathon2026/actions/workflows/ci.yml)
[![Node.js 22+](https://img.shields.io/badge/Node.js-22%2B-43853d)](https://nodejs.org/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

[文档](docs/README.md) · [开发指南](docs/DEVELOPMENT.md) · [参与贡献](.github/CONTRIBUTING.md)

设计指导：[@cios413](https://github.com/cios413)

</div>

## 演示视频

https://github.com/user-attachments/assets/c315ede8-90ab-4a5a-bee8-0b316da6d35d

**[▶ 在 B 站观看演示视频](https://www.bilibili.com/video/BV1yTn36fEZd/)**

## 快速开始

### 下载安装

| Windows 桌面版 | Android 手机版 |
| :---: | :---: |
| **[下载一键安装 EXE](https://github.com/szddddddd/Techathon2026/releases/download/v0.1.0-beta.1/WeRoam-0.1.0-beta.1-windows-x64-setup.exe)** | **[下载 APK](https://github.com/szddddddd/Techathon2026/releases/download/v0.1.0-beta.1/WeRoam-0.1.0-beta.1-android.apk)** |
| Windows 10 / 11 · x64 | Android 8.0+ |

**无需开发环境。** [版本说明](https://github.com/szddddddd/Techathon2026/releases/tag/v0.1.0-beta.1) · [安装与升级](docs/INSTALL.md) · [校验文件](https://github.com/szddddddd/Techathon2026/releases/download/v0.1.0-beta.1/SHA256SUMS.txt)

<details>
<summary>从源码启动（开发者）</summary>

需要 **Node.js 22+、npm** 和支持 WebGL 2 的现代浏览器。

```sh
git clone https://github.com/szddddddd/Techathon2026.git
cd Techathon2026
npm ci
npm start
```

打开 [localhost:8080](http://localhost:8080/)，实际端口以终端输出为准。基础场景与本地消息演示无需服务密钥；修改源码后重新构建并刷新。

</details>

<details>
<summary>桌面端、手机与其他启动方式</summary>

| 入口 | 命令 / 文档 |
| --- | --- |
| Windows 桌面端 | `npm run desktop` |
| Windows 双击启动 | `scripts/windows/启动 WeRoam.cmd` / `scripts/windows/启动桌宠.cmd` |
| 局域网手机浏览器 | `npm run start:lan`，按终端地址访问 |
| Android | `npm run android:build`，见[构建与安装](docs/ANDROID.md) |
| PICO / WebXR | [VR 指南](docs/PICO-VR.md) |

`npm start` 和 `npm run desktop` 会自动构建。服务按 `Ctrl+C` 停止；`npm run dev` 等同于网页启动，当前没有自动监听。Android 另需 JDK、SDK 与 Gradle，手机和电脑数据不自动同步。

</details>

<details>
<summary>功能与使用边界</summary>

| 功能 | 当前范围 |
| --- | --- |
| 三维世界 | 林间来信、富士樱町、理想城；昼夜、好友角色与群聊建筑 |
| 好友与消息 | 本地会话、草稿与合成演示；尚未接入完整的微信 / QQ 社交私信 |
| [Universal Inbox](docs/UNIVERSAL-INBOX.md) | 合成消息、手动收录、来源引用、权限演示与模拟发送 |
| [桌面邮箱](docs/MAIL-INTEGRATION.md) / [邮箱 Agent](docs/MAIL-AGENT.md) | QQ / 163 只读 IMAP；逐次授权的模型处理与本地候选回复；163 尚待真实账号验收 |
| [创意工坊](docs/WORKSHOP.md) | 内置 Mod 管理与场景建筑放置，尚非远程插件市场 |
| [头像到模型](docs/AVATAR-PIPELINE.md) | 独立参考图、Rodin 任务跟踪与 GLB 更新；需要服务配置 |

浏览器数据保存在 IndexedDB；桌面真实邮箱由 Electron 单独加密管理。开发服务默认监听回环地址，本地权限演示不等于公网身份认证。移动端与头显表现需实机验收。

</details>

<details>
<summary>项目结构、配置与开发</summary>

| 目录 | 职责 |
| --- | --- |
| `src/` | 页面、场景、角色、界面、收件箱与工坊；HTML 集中在 `src/pages/` |
| `server/` / `desktop/` | 本地 API、Electron、邮箱与桌宠 |
| `android/` / `mobile/` | Android 容器与网页桥接 |
| `assets/` / `config/` | 运行素材与无密钥配置模板 |
| `scripts/` / `tests/` | 工程工具、Windows 启动器与自动化验证 |
| `docs/` / `.github/` | 当前指南、历史档案与协作规范 |

完整说明见[目录职责](docs/PROJECT-STRUCTURE.md)、[技术架构](docs/TECHNICAL-ARCHITECTURE.md)和[开发指南](docs/DEVELOPMENT.md)。构建输出 `dist/`、报告及本机数据不提交。

可选服务见[配置模板](config/README.md)。Rodin 统一使用项目私有 `.forest-avatar-data/hyper3d-config.json`，通过 `server/rodin-rest-client.mjs` 访问 REST；新物体先生成独立参考图，结果不明时查询原任务。Android 既有原生头像演示与 Node 流程的差异见[平台说明](docs/ANDROID-AVATAR-DEMO.md)。密钥、邮箱授权码和用户私密数据不得提交或写入日志。

构建使用 `npm run build`；按变更范围选择[开发指南](docs/DEVELOPMENT.md)中的验证命令。当前浏览器交互套件主要依赖 Windows Edge，跨平台与实机验收范围以具体记录为准。

</details>

<details>
<summary>更多场景预览</summary>

| 林间来信 | 富士樱町 | 理想城 |
| :---: | :---: | :---: |
| ![森林](docs/images/forest.jpg) | ![富士](docs/images/fuji.jpg) | ![理想城](docs/images/ideal.jpg) |

![夜景](docs/images/weroam-nights.jpg)

以上均为项目实际运行画面。阶段计划与旧验收数据见[历史档案](docs/archive/README.md)。

</details>

项目原创代码使用 [ISC License](LICENSE)；第三方素材与品牌的来源、权利及待补授权见[资源说明](docs/THIRD-PARTY-RESOURCES.md)。反馈请提交 [Issue](https://github.com/szddddddd/Techathon2026/issues)，私密问题按[安全说明](.github/SECURITY.md)处理。
