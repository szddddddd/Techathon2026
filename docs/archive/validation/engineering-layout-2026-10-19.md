# 工程目录整理验收

日期：2026-10-19。基于 `2870427` 整理，提交目标为主仓库 `main`。本机验证环境为 Windows、Node.js 24.18.0、Microsoft Edge / D3D11。

## 方案到实现与证据

| 方案条目 | 实现位置 | 验证证据 |
| --- | --- | --- |
| 按领域组织前端 | `src/scenes/`、`characters/`、`social/`、`discovery/`、`rendering/`、`ui/`、`platform/`、`audio/`、`review/`；保留主入口、Inbox 与 Mods | `npm run build`；结构检查确认 151 个前端模块的相对导入有效 |
| 收拢样式及启动脚本 | `src/styles/`、`src/startup.js`；更新根 HTML、Inbox/Workshop 按需样式、桌宠静态路由 | `npm run test:structure`：5 个页面、33 个 JS/CSS 资源；检查 Web 与桌宠支持入口及非运行配置路由 |
| 测试与工程工具分离 | 123 个原测试文件移至 `tests/`，fixture 随迁；工具保留在 `scripts/` | npm 测试命令、工具导入和回归执行器已同步；`npm run test:ci` 通过 |
| 可重建输出与本机数据隔离 | `.gitignore`；7 个 `dist/*.js` 从 Git 索引移除，磁盘文件保留；签名及本机演示稿忽略 | `git ls-files dist` 为空；`git check-ignore` 确认 bundle、项目私有配置与本机演示稿被忽略 |
| 首次启动及配置入口 | `package.json` 的构建前置命令、仓库元信息；`config/` 占位模板 | 独立目录的 `npm ci`、构建与 `test:ci` 通过；不依赖已有 bundle 或真实配置 |
| Android 资源路径同步 | `scripts/build-android-web.mjs` 的样式/启动资源清单 | `npm run android:web`、`npm run test:android` 通过；打包网页及资源共 311 个文件，约 266.8 MiB |
| 开源协作入口 | README、LICENSE、CONTRIBUTING、SECURITY、开发指南、结构说明、文档索引、Issue/PR 模板与 `.editorconfig` | 新入口文档本地链接和 npm 命令已核对；`git diff --check` 通过 |
| 持续集成 | `.github/workflows/ci.yml`，Ubuntu/Windows、Node.js 22 | 已配置 `npm ci → build → test:ci`；云端任务尚未运行 |

## 实际执行的验证

| 命令 | 结果与范围 |
| --- | --- |
| 独立目录 `npm ci --no-audit --no-fund` | 通过；首次安装设置 `ELECTRON_SKIP_BINARY_DOWNLOAD=1`，随后单独下载验证 Electron 36.9.5 安装 |
| `npm run build`、`npm run test:ci` | 本工作区和独立依赖目录均通过；基础状态、Inbox、Mods、Rodin 配置、静态服务、变换、放置缓存及资源加载 |
| `npm run test:performance` | 通过，包含构建缓存失效、输出篡改及缺失文件重建 |
| `npm run test:assets`、`npm run test:forest` | 通过；102 项运行资产以及地形与森林布局 |
| `npm run test:scenes` | 通过；三场景、返回切换、共享数据/画布、九栋群聊建筑与模型查看页 |
| `node tests/test-inbox-browser.mjs` | 通过；按需 bundle、来源/权限/草稿、三场景状态保持、移动布局及失败重试 |
| `npm run test:mods:browser` | 通过；模块事务与桌面/手机流程、显隐、持久化、回退，以及五轮完整三场景切换的资源稳定性 |
| `npm run android:web`、`npm run test:android` | 通过；资源清单、离线三场景、触控收件箱/工坊、返回/草稿、视口旋转及持久化；使用桌面浏览器模拟触控 |
| `npm run test:mail`、`npm run test:mail:agent` | 通过；模拟 IMAP/模型请求、存储与权限、IPC 和配置隔离，不连接真实邮箱或模型服务 |

浏览器交互使用独立的回环静态验证服务，未启动真实头像任务处理器。测试没有提交实际生图或 Rodin 生成请求。已查看工坊手机布局及 Android 打包网页森林截图，未发现此次目录调整导致的样式缺失。

本机原 Electron 文件曾阻止依赖目录替换。未关闭应用；通过独立安装补齐依赖及缺失运行文件，并确认现有 `electron.exe` 与下载版本哈希一致、Node 可以解析 Electron 运行路径。

## 修正的旧测试准备问题

- 构建缓存测试仍断言旧品牌输出且缺少 Workshop fixture；补齐当前构建入口及预期输出。
- 工坊旧测试在没有建筑放置记录时断言设施可见，得到 `[false, false]`。整理前代码已采用桌面手动放置。新增 `tests/fixtures/placed-facilities.mjs`，通过模块管理器建立持久化放置样例，再验证启停和切换；未改变产品放置逻辑。
- 部分浏览器测试默认覆盖已跟踪的文档图片；改为默认只写 `.test-results/`，显式 `--screenshots` 才更新文档截图。本次测试覆盖的原文档图片已恢复。

本机原始结果保存在 `.test-results/` 下的 `inbox/results.json`、`workshop/results.json`、`workshop/switch-stability.json`、`android/results.json` 和 `scenes/checks.json`。该目录可能同时保留以前运行的失败记录，文件存在本身不代表本次状态。

## 未验证与保留边界

- 没有实际执行 GitHub Actions、Linux 或 Node.js 22；CI 配置不能作为跨平台已通过的证据。
- 没有构建/发布 APK、运行 Android 原生测试或验收实体手机/VR 头显。
- 没有执行每个历史场景、桌面窗口、骨骼或性能测量套件；上表仅列本次执行范围。
- 没有连接真实邮箱、执行真实模型探针、生成新资产或重新核验所有服务条款。
- Android 既有头像演示仍有独立原生 REST 实现，与统一 Node 客户端规范的差异已记录；未在目录整理中重写该链路。
- ISC 文本落实原 `package.json` 的代码许可声明；第三方素材、品牌及来源待确认项仍按 `docs/THIRD-PARTY-RESOURCES.md` 单独处理。
- 没有清理历史 Git 记录中的凭据或素材，未变更仓库公开设置或部署。提交与推送不构成额外的平台或功能验证。
