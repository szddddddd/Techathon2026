# WeRoam 第三方资源与授权说明

[项目首页](../README.md) / [文档索引](README.md)

**项目版本：** v0.1 beta<br>
**清点日期：** 2026-10-18<br>
**源码许可与工程结构记录更新：** 2026-10-19<br>
**适用范围：** 当前仓库代码、运行资产以及 `weroam-slides/output/WeRoam-v27.pptx` 演示稿

本文记录仓库中可以核实的依赖、服务和素材来源，并标出需要另行取得凭证的部分。它不是律师出具的法律意见，也不构成对未核实资源的许可保证。第三方服务条款会更新；正式发布时应重新核验并保存适用于实际账号和使用计划的条款、发票或授权证明。

## 1. 软件依赖

版本以根目录 `package-lock.json` 与 `package.json` 为准。许可证类型按已安装包元数据核对；传递依赖还应以安装包内各自的 `LICENSE` 和完整依赖清单为准。

| 依赖 | 用途 | 声明许可证 | 位置／核验方式 |
| --- | --- | --- | --- |
| Three.js 0.180.0 | WebGL 三维场景与 glTF 加载 | MIT | `package.json`；[Three.js LICENSE](https://github.com/mrdoob/three.js/blob/dev/LICENSE) |
| three-mesh-bvh 0.9.16 | 三维网格空间查询与加速 | MIT | `package.json`；[项目 LICENSE](https://github.com/gkjohnson/three-mesh-bvh/blob/master/LICENSE) |
| ImapFlow 2.5.2 | Electron 端 IMAP 客户端 | MIT | `package.json`；[ImapFlow](https://github.com/postalsys/imapflow) |
| iconv-lite 0.7.3 | 邮件字符集解码 | MIT | `package.json`；[项目 LICENSE](https://github.com/pillarjs/iconv-lite/blob/master/LICENSE) |
| html-to-text 10.0.1 | 邮件 HTML 转纯文本 | MIT | `package.json`；[项目 LICENSE](https://github.com/html-to-text/node-html-to-text/blob/master/LICENSE) |
| Electron 36.9.5 | Windows 桌面容器 | MIT | `devDependencies`；[Electron 官方说明](https://www.electronjs.org/docs/latest/why-electron)；Electron 发布包另含 Chromium、Node.js 等组件的许可材料 |
| esbuild 0.25.10 | 前端构建与 bundle | MIT | `devDependencies`；锁文件和包内许可证 |
| Playwright 1.64.1 | 浏览器自动化验收 | Apache-2.0 | `devDependencies`；开发／测试依赖，不是主应用功能 |
| fake-indexeddb 6.2.5 | IndexedDB 逻辑测试 | Apache-2.0 | `devDependencies`；仅测试使用 |
| pngjs 5.0.0、qrcode 1.5.4 | 测试图像处理、二维码生成 | MIT | `devDependencies`；锁文件和包内许可证 |
| AndroidX WebKit 1.14.0 | Android 本地 WebView 资源映射 | Apache-2.0 | `android/app/build.gradle`；[AndroidX WebKit](https://developer.android.com/jetpack/androidx/releases/webkit) |
| Android Gradle Plugin 8.13.2、Gradle 8.13 | Android 构建工具 | Apache-2.0 | `android/build.gradle`、Gradle Wrapper；工具链许可证与应用素材许可证分开 |

根目录 [`LICENSE`](../LICENSE) 已提供与 `package.json` 匹配的 ISC 文本，适用于项目原创代码。第三方依赖与模型、图片、音视频、文章、品牌标识仍保留各自权利；根许可证不自动授予未取得的素材权利。随包第三方 notices 仍需按实际分发内容收集。

## 2. 生成服务与外部平台

| 服务／平台 | 仓库中的用途 | 当前授权／实现状态 | 发布注意事项 |
| --- | --- | --- | --- |
| OpenAI 图像生成／编辑 | 生成 Rodin 输入参考图、好友形象及部分场景部件参考；相关配置与流程在 `server/image-config.mjs`、`server/avatar-pipeline.mjs` 和 `assets/ideal-city/lowpoly/` 有记录 | 使用 OpenAI 图像服务；具体 API 账号、购买计划与每项输入图的授权凭证不在仓库中 | OpenAI 条款说明在适用法律允许范围内，用户与 OpenAI 之间用户保留输入权利并拥有输出；用户仍须有权提交输入。生成输出不自动证明不侵权或具备人物肖像许可。[Terms of Use](https://openai.com/policies/terms-of-use/) · [API/服务条款](https://openai.com/policies/service-terms/) |
| Hyper3D Rodin REST | 场景物体、部分环境资产和好友模型生成；私有 REST 客户端在 `server/rodin-rest-client.mjs`，资产旁的 manifest 保存部分任务 ID、提示词和参数 | 仓库可识别 58 个带 Rodin provider 记录的 manifest；完整账号订阅等级、订单与逐资产许可票据没有纳入仓库，不能据此证明商业发布权 | Hyper3D 条款对 3D 输出规定受条款、适用法律和第三方权利约束；服务一般条款还说明私用／商用导出取决于订阅计划。发布前须核对生成时账号计划和适用 API 条款。[Terms](https://hyper3d.ai/legal/terms) · [API 数据保留政策](https://docs.hyper3d.ai/en/legal/data-retention-policy) |
| QQ 邮箱、网易 163 邮箱 | Electron 桌面端只读 IMAP 收件 | QQ 连接此前由用户在本地确认成功；163 集成已实现但用户选择暂不进行真实连接。不是 QQ 社交消息 API | 用户授权码可能具有平台授予的更宽权限；本项目当前不发送、不改写远端状态。账号使用须遵守对应邮箱协议和平台条款。 |
| 上海科技大学 GenAI API（`deepseek-pro`） | 桌面邮箱 Agent 对话、摘要、分类、待办和候选回复 | 用户提供本地 Bearer 凭据，已用“只回复 OK”验证认证与响应；密钥只存在 Git 忽略的本地配置，不随前端分发。真实邮件需用户选择与独立授权 | API 可调用不等于取得模型权重许可、学校背书或公开服务转售权。服务的数据保留、训练使用及公开分发条件尚未核验，不作无保留／无训练承诺；不得公开凭据。技术边界见 [MAIL-AGENT.md](MAIL-AGENT.md)。 |
| 微信、QQ 社交、抖音、小红书等 | 作为好友来源标识、产品方向、用户手动收录或演示内容 | 没有完整私人消息接口连接；演示稿中的平台汇入图属于产品方向表达，不是已获平台授权的证明 | 各平台名称和标识由对应权利人所有。不得将原型描述成已获平台正式 API 资质或背书。 |

Hyper3D 官方资料说明，Rodin API 输入与输出在其活动系统保留七天，到期删除，且 API 输出不用于训练；政策也注明依法保留、安全审计及备份等例外。此为供应商对 API 数据的政策描述，不代表 WeRoam 已取得独立数据处理协议。

## 3. 图片、模型、音视频和品牌素材

| 资源类别 | 已知来源与仓库位置 | 授权状态与处理建议 |
| --- | --- | --- |
| 森林、富士及环境 3D 模型 | `assets/rodin*`；部分模型有 `manifest.json` 记录 Hyper3D Rodin 任务、提示词及输出哈希 | 生成来源可追溯程度不一；模型生成不等同于已确认商业许可。按单项 manifest 对照 Rodin 账户、计划及输入参考图授权留档。无 manifest 的旧模型补齐来源 |
| 理想城场景 | `assets/ideal-city/source.blend` 与 `scene.glb`；项目记录称源文件由用户提供，场景为 Blender 原生几何且无外部贴图依赖 | 源文件提供者身份、可对外展示／分发范围的书面许可未随仓库保存。公开演示、转授权或商用前取得确认 |
| 四个初始好友模型与肖像 | `assets/rodin-friends/`；模型来自 Rodin，肖像用于本地示例 | 资产记录说明示例不是实际好友照片；具体原始头像由谁提供、输入是否含真实人物以及对应肖像授权没有完整入库。含可识别真人时，应取得适用的肖像和输入使用同意 |
| StartHub 联育文章及封面图 | `src/discovery/starthub-content.js`、`assets/discovery/starthub-yc-2026.png`；代码注释记录文字为用户提供，封面图由用户提供 | 未记录原始文章链接、作者、发布日期或转载授权；文章提及 YC 不代表 YC 官方发布或背书。对外传播前补充原文出处、作者署名及转载／改编许可 |
| 示例视频与缩略图 | `assets/discovery/video-1` 至 `video-6` 的 `.webm`／`.jpg` | 当前源码和资产说明没有找到逐文件作者、原始 URL 或许可证明。公开分发前应追溯来源并取得许可；无法确认时替换为自制或明确授权素材 |
| 场景音乐 | `assets/audio/forest-mixtape.mp3`、`spring-strings.mp3` | 当前源码未记录作曲者、来源、采样或音乐许可。需补齐作品和录音两个层面的权利凭证；不能仅因文件在仓库中就视为可公开分发 |
| Hyper3D 宣传视频／封面 | `assets/discovery/hyper3d-agent-ready.mp4`、同名 `.jpg`，内容与 Hyper3D 品牌有关 | 仓库内未找到随资产保存的许可或媒体包授权。若用于发布版，按 Hyper3D 品牌／媒体使用规范核实并保留来源 |
| 社交软件图标 | `weroam-slides/assets/app-icons/` 和 `assets/inbox-icons/`；slides 构建脚本记录 Iconify ID，主要来自 `thesvg-color`，抖音使用 `logos:tiktok-icon` | Iconify 明确说明各图标集分别许可；theSVG 源项目声明代码采用 MIT，但品牌图标仍为各商标权利人的知识产权。保留 Iconify/theSVG 来源记录，按图标集元数据核实具体图标，并遵守各品牌识别规范；MIT 不等于商标授权。[Iconify license](https://iconify.design/) · [theSVG 来源说明](https://github.com/GLINCKER/thesvg) |
| Hyper3D、Blender、OpenAI 等软件标志 | 演示稿 `weroam-slides/assets/`，包含服务图标和第三方品牌标志 | 部分由官方 favicon 或 Iconify 分发文件取得；图标服务的开源许可与商标权分开。仅用于准确指认服务，不暗示合作或背书 |
| UI 图标、场景 SVG、代码绘制几何 | `src/`、`assets/social/`、`src/mods/catalog.js` 等 | 仓库中自行编写的简易线性图标、程序几何和界面实现由项目代码产生；逐项仍需区分引用图形与自绘图形。场景程序代码使用的 npm 依赖按上表分别保留许可 |
| 字体 | 没有发现随项目打包的 `.ttf`、`.otf`、`.woff` 字体文件 | 页面使用系统字体回退，不额外分发字体文件；最终字体由运行设备提供并受系统字体许可约束 |

Iconify 是图标检索／分发框架，不统一拥有图标集授权。其官方许可页面特别说明：Iconify 项目本身的许可证不适用于图标，必须查看具体 icon set。theSVG README 进一步说明品牌标识仍归相应商标权利人。所用 `thesvg-color` 文件的元数据和下载版本应与归档副本一同保留，不应只依赖当前在线页面。

## 4. 仓库记录情况

- 根目录已补齐匹配 `package.json` 的 ISC `LICENSE`，并明确第三方软件和素材不自动纳入该授权；逐项素材凭证和分发 notices 仍需补齐。
- `assets/README.md` 说明了主要场景资产类别、Rodin 来源和示例媒体的性质；理想城与理想城低模目录另有来源说明。
- 截至清点日，`assets/` 下有 78 个 manifest 文件，其中 58 个 manifest 明确写有 Rodin provider。manifest 并不覆盖每个媒体文件、每张参考图或每个生成结果的完整权利凭证。
- `weroam-slides/assets/app-icons/README.md` 列出演示稿中使用的平台图标；slides 生成脚本还保存部分 Iconify collection/name 和下载 URL。品牌图标使用权仍需按商标规范检查。
- StartHub 文章注释明确写明文字由用户提供、没有收到出版日期或原文 URL；来源与授权证据不足以断言已获转载许可。
- 两段背景音乐和六组示例视频在源码中未见逐项出处或授权记录，是目前公开发布前优先补证的资源。

## 5. 发布前建议

1. 保留根 ISC `LICENSE` 与第三方权利边界；为 Electron、npm、AndroidX 和其他实际随包依赖生成并附带 notices。
2. 建立逐文件资源清单，至少包含文件路径、作者／提供者、原始 URL、获取日期、许可证、允许用途、署名要求和许可凭证存放位置；对生成资产再记录参考图来源、服务计划、任务 ID 和输出哈希。
3. 补齐理想城 Blender 源文件、StartHub 文章及封面、Hyper3D 宣传视频、所有背景音乐和演示视频的权利证明；不能确认的文件先从公开发布包移除或替换。
4. 在归档时保存 OpenAI 与 Hyper3D 的账户计划、适用条款版本和付款／授权凭证；不要把 API 密钥写入清单、截图或版本库。
5. 发布演示稿和产品页面时，在图标附近或第三方声明页说明品牌归属与非背书关系，并按相关品牌官方规范使用标识。

## 6. 主要依据

- [OpenAI Terms of Use](https://openai.com/policies/terms-of-use/) 与 [OpenAI Service Terms](https://openai.com/policies/service-terms/)
- [Hyper3D Terms of Service](https://hyper3d.ai/legal/terms) 与 [Rodin API Data Retention Policy](https://docs.hyper3d.ai/en/legal/data-retention-policy)
- [Iconify License](https://iconify.design/) 与 [theSVG source and trademark notice](https://github.com/GLINCKER/thesvg)
- [Three.js LICENSE](https://github.com/mrdoob/three.js/blob/dev/LICENSE)、[three-mesh-bvh LICENSE](https://github.com/gkjohnson/three-mesh-bvh/blob/master/LICENSE)、[ImapFlow](https://github.com/postalsys/imapflow)
- [AndroidX WebKit release documentation](https://developer.android.com/jetpack/androidx/releases/webkit)
