# 仓库清理记录 · 2026-10-19

[当前文档](../README.md) / [历史档案](README.md)

## 清理范围

- 移除已经停用的霓虹云港专用源码、桌宠、加载器、样式与旧测试；仍被森林和富士使用的 `night-window-masks.js` 移到 `src/scenes/shared/`。
- 移除两个旧场景模型目录，共 54 个模型及 manifest 文件、83.06 MiB。当前三场景、好友、工坊建筑和可编辑 Blender 源文件继续保留。
- 移除重复启动器 `启动WeRoam.cmd`，统一使用 `启动 WeRoam.cmd`；桌宠启动器继续保留。
- 移除旧 Android 开发者密钥导出工具；不改变现有原生头像流程。
- 移除重复资料合辑 `Resources.md` 与四份生成 PDF；Markdown 继续作为文档源，PDF 仅导出到 `output/pdf/`。
- 阶段计划与验收材料集中到 `docs/archive/`，修正文档链接；报告脚本只写本机输出，不自动覆盖归档证据。
- 更新首页状态徽章、文档任务导航、专题返回链接，以及 GitHub 简介和标签。
- 场景切换控件的既有测试断言改为当前 `ideal` 场景；保留拒绝旧 `cyber` URL / 状态的兼容性检查。

被删除材料仍可从清理前的 Git 提交 `f9b751e` 恢复。本次未重写历史，因此当前文件与打包资源减少不等于完整 Git 克隆体积同比减少。

## 实际检查与构建

| 项目 | 结果 |
| --- | --- |
| 网页构建 | `npm run build` 成功，生产依赖图包含 136 个源码模块，不再导入旧 cyber 目录 |
| Android Web 资源构建 | `npm run android:web` 成功；257 个文件、198.1 MiB；上一轮为 311 个文件、266.8 MiB |
| Android 纹理解码预算 | 所有打包资产在 mipmap 前估算为 209 MiB；上一轮为 290 MiB；该值不是设备实际峰值内存 |
| 文档与模块引用 | 核对 Markdown 相对链接、当前入口依赖与 npm 命令路径 |
| 上一轮远程 CI | 提交 `f9b751e` 的 [GitHub Actions](https://github.com/szddddddd/Techathon2026/actions/runs/39223122344) 已通过 |

本轮未在本机重新运行自动化测试、构建 APK 或验收实体设备。新提交的远程检查结果以 [CI 页面](https://github.com/szddddddd/Techathon2026/actions/workflows/ci.yml) 为准。没有连接真实邮箱或发起付费生成请求。

## 后续：根目录与首页

根目录受 Git 管理的文件从 18 个减至 9 个：五个 HTML 源文件移到 `src/pages/`，两个 Windows 启动器移到 `scripts/windows/`，贡献与安全说明移到 `.github/`。现有页面 URL 通过静态服务映射到新位置；Electron 的文件入口及邮箱可信页面路径同步迁移，Android 构建使用包内相对基址。

README 保留演示视频、快速开始和文档入口，其余内容折叠展示；保存用户提供的 B 站 iframe，同时提供可点击预览图和直接观看链接。GitHub Markdown API 的实际渲染保留五个 `details` 与视频链接，过滤 iframe。

网页构建和 Android Web 资源构建成功，171 处文档相对链接均能定位到文件。此轮未在本机运行自动化测试或验收实体设备。
