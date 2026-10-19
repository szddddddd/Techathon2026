# 开发指南

所有命令从仓库根目录执行，除非明确另有说明。主仓库为 [szddddddd/Techathon2026](https://github.com/szddddddd/Techathon2026)，贡献约定见 [CONTRIBUTING](../CONTRIBUTING.md)。

## 环境与首次启动

- Node.js 22+ 与 npm；依赖版本由 `package-lock.json` 锁定。
- 支持 WebGL 2 的现代浏览器。Windows 是当前桌宠和 PowerShell 启动/打包脚本的主要平台。
- Android 构建另需 JDK、SDK 与 Gradle；WebXR 实机连接另需 ADB，分别参见 [Android](ANDROID.md) 和 [PICO / Quest](PICO-VR.md)。

```powershell
npm ci
npm run build
npm start
```

打开终端列出的本地地址，默认 [localhost:8080](http://localhost:8080/)。`npm start` 通过 `prestart` 检查构建，再启动本地 HTTP 服务及头像 API。`dist/` 是被忽略的可重建输出。未配置服务密钥仍可体验已有场景和本地消息；不要为基本启动提交真实头像或发起付费调用。

当前没有自动监听构建。修改 JavaScript 后重新运行 `npm run build`，再刷新；修改 HTML/CSS 后刷新，修改 Electron 主进程或 preload 后重启桌面端。构建基于输入与输出指纹复用缓存，需要强制重建时运行 `npm run build -- --force`。

Windows 双击 `启动 WeRoam.cmd` 或运行 `npm run launch` 会准备依赖、构建并启动网页。脚本可能写入本机 `.forest-runtime.json` 并准备桌宠协议；该状态不应提交。

## 运行入口

| 命令 | 用途 |
| --- | --- |
| `npm start` | 回环地址上的 Web 与本地头像服务 |
| `npm run dev` | 构建并启动本地服务；不自动监听修改 |
| `npm run start:lan` | 提供局域网静态演示；服务开放范围与生成 API 隔离见脚本输出 |
| `npm run desktop` | Electron 主窗口与桌宠功能；先安装依赖并构建 |
| `npm run mail:connect` | 桌面 QQ 邮箱连接窗口 |
| `npm run mail:connect -- --mail-provider=netease` | 桌面 163 邮箱连接窗口 |
| `npm run android:web` | 准备 Android 本地网页与资源 |
| `npm run android:build` | Android 签名演示 APK；工具链见专题 |
| `npm run android:download` | 局域网 APK 下载页 |
| `npm run pico:connect` | 已授权头显的 ADB reverse 与 WebXR 入口 |

根目录 `index.html` 是主世界，`pet.html` 是桌宠，`asset-review.html` / `rig-review.html` 是资产与骨骼查看页，`data-transfer.html` 是数据传递页面。保持这些 URL 稳定；源码与样式位置见[项目结构](PROJECT-STRUCTURE.md)。

## 测试与基准

`tests/` 保存验证脚本，`scripts/` 保存构建、运行和诊断工具。统一从 `package.json` 的 npm 命令调用。

| 范围 | 常用命令 |
| --- | --- |
| 基础状态 | `npm test` |
| 目录与页面引用 | `npm run test:structure`，检查页面 CSS/JS 与按需样式的静态路由 |
| CI 逻辑集合 | `npm run test:ci`，执行选定的无真实凭据检查 |
| Inbox / Mod | `npm run test:inbox`、`npm run test:mods` |
| 浏览器交互 | `npm run test:inbox:browser`、`npm run test:mods:browser`、`npm run test:interactions` |
| 场景与资产 | `npm run test:scenes`、`npm run test:assets`、`npm run test:forest`、`npm run test:ideal` |
| 头像与 Rodin 约束 | `npm run test:rodin`、`npm run test:avatar` |
| 邮箱与 Agent | `npm run test:mail`、`npm run test:mail:agent` |
| 桌面桥接 | `npm run test:desktop-bridge`、`npm run test:pet` |
| 骨骼与动作 | `npm run test:rigs`、`npm run test:actions` |
| 性能与静态服务 | `npm run test:performance`、`npm run test:performance:browser` |
| 移动资源与渲染 | `npm run test:mobile:performance`、`npm run test:mobile:rendering`、`npm run test:mobile:media` |
| Android / WebXR | `npm run test:android`、`npm run test:webxr` |
| 选定回归集合 | `npm run test:regression`，不代表执行所有专题测试 |
| 性能测量 | `npm run benchmark:performance`、`npm run benchmark:scenes`、`npm run benchmark:mobile` |

浏览器检查使用 Playwright。多数现有交互套件固定 `channel: 'msedge'`，并使用 D3D11 启动参数，需要 Windows 上已安装的 Microsoft Edge；当前 Windows 开发机已安装 Edge，可直接运行：

```powershell
npm run build
npm run test:inbox:browser
```

`npx playwright install chromium` 仅安装 Playwright 的 Chromium，不会改变脚本指定的 Edge 通道或 D3D11 参数。其他平台或浏览器环境须先核对对应脚本的启动选项；不要把下载 Chromium 当作现有交互套件的通用环境配置。

有的脚本自行启动服务，另一些依赖当前本地应用；以脚本和专题说明为准。结果、截图和临时记录写入被忽略的 `.test-results/`。只运行与改动相关的测试，并在 PR 中保留实际命令、结果和限制。某些浏览器套件可能需要较长时间，不能用单元检查代替交互验收。

常规头像与邮箱 Agent 回归使用模拟供应商或合成数据。`npm run agent:probe` 是可选的**真实校内服务请求**，不是离线测试；不要为工程整理或普通构建自动运行。真实模型质量、邮箱账号连接、手机流畅度与头显舒适度均需独立验收。

## 可选服务与私有配置

基础场景启动不需要以下文件。只在需要相应功能时由本机使用者准备，真实密钥不得进入前端 bundle、截图、普通日志或 Git。头像服务可从 [`config/`](../config/README.md) 复制占位模板到私有目录，再在本机填写，模板本身不由运行时读取。

| 功能 | 配置入口 | 说明 |
| --- | --- | --- |
| 参考图生成 | `.forest-avatar-data/image-config.json` | 服务端读取 `baseURL`、`apiKey`、`model`、`size`；使用 HTTPS；格式见[头像流程](AVATAR-PIPELINE.md) |
| Rodin | `.forest-avatar-data/hyper3d-config.json` | `baseURL` 为 `https://api.hyper3d.com/api/v2`，只从本文件读取 `apiKey` |
| 桌面邮箱 Agent | `.weroam-private/agent-config.cjs` | 从 `desktop/agent-config.example.cjs` 复制；固定校内模型服务 |
| 真实邮箱 | Electron 独立连接窗口 | 输入 IMAP 授权码，不写入项目源码；[只读接入说明](MAIL-INTEGRATION.md) |

所有项目 Rodin 生成、状态和结果查询通过 `server/rodin-rest-client.mjs`，不使用 MCP OAuth、客户端全局配置或其他环境密钥。缺失配置应明确报错。每次新生成物体先用 imagegen 生成独立参考图，再提交 Rodin；已有任务结果不明时先查询原任务，不直接重提付费请求。私有目录中的订阅凭据、参考输入与任务记录同样不应公开。

Android 现有头像演示有独立原生实现和手机配置，尚未统一走 Node REST 客户端。维护与新增请求必须遵守项目约束，具体差异见 [Android 头像演示](ANDROID-AVATAR-DEMO.md)。不要将开发者密钥写入 APK。

## 调试常见问题

- **页面缺少 `dist/*.js`：** 先运行 `npm run build`；新克隆不包含构建产物。
- **端口被占用：** 关闭重复服务，或使用 Windows 启动器选择可用端口；实际地址以输出为准，桌面与浏览器应连接同一实例。
- **Electron 文件缺失：** 确认安装依赖时没有跳过安装脚本，按终端提示恢复 Electron 运行时下载。
- **Playwright 找不到浏览器：** 先核对测试脚本的 `channel` 和启动参数；多数交互套件需要 Windows Microsoft Edge 与 D3D11，安装 Chromium 不能替代其 Edge 依赖。
- **生成服务缺配置：** 基础浏览不受影响；由本机使用者在对应私有文件中配置，不通过修改源码或使用其他账户密钥绕过。
- **手机/头显与浏览器表现不同：** 记录设备、系统、WebView/浏览器版本及具体场景；模拟测试不能证明实机性能。

涉及真实消息或凭据的错误，先脱敏再报告；泄露处理与私密报告渠道见 [SECURITY](../SECURITY.md)。
