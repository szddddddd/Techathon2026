# 第一阶段本次验证

验证日期：2026-10-16（Asia/Shanghai）。版本：v1.1.0。

## 已完成

| 检查 | 结果 |
| --- | --- |
| `npm ci --ignore-scripts --no-audit --no-fund` | 依照锁文件安装成功；不运行 Electron 下载与安装脚本 |
| `npm run build` | 三个 JS 入口构建成功；构建结果与原阶段文件的 SHA-256 一致 |
| `npm test` | 社交存储、公共动态与发现目录/存储三个现有测试通过 |
| `node scripts/test-placement-clearance.mjs` | 路径放置、水体/建筑/营火阻挡、好友重叠、旧位置及散步查询检查通过 |
| 独立端口静态服务 | v1.1.0 页面、视频 Range 206、配置文件不可访问检查通过 |
| Edge 浏览器 | 三维场景加载、通过 UI 添加好友并发送消息、刷新后数据保留、发现目录九篇文章均通过 |
| 桌面与手机截图 | 已查看 1440×1000 聊天页与 391×844 发现页截图 |
| 浏览器异常 | 本次流程中没有 `pageerror`，也没有同源 HTTP 4xx/5xx 响应 |
| 来源一致性 | 原阶段 208 个文件完整；其中仅 README 为归档说明修改，其余 207 个文件与原 Git 树 SHA-256 一致 |

新证据统一保存在 [validation/stage1-20261016](./validation/stage1-20261016/)。原有 `validation/` 中的其他记录来自原项目历史，不作为本次重测结果。放置测试产生的记录已单独归档，原历史文件已恢复，以保留来源一致性。

## 复现

```powershell
npm ci --ignore-scripts --no-audit --no-fund
npm run build
npm test
node scripts/test-placement-clearance.mjs

# 浏览器 smoke 需要 Playwright 和本机 Microsoft Edge。
# 可额外安装工具，不将其写入第一阶段依赖锁文件：
npm install --no-save --package-lock=false --ignore-scripts playwright
node validation/stage1-20261016/smoke.mjs
```

本次浏览器 smoke 使用已安装的 Playwright，通过环境变量 `FOREST_PLAYWRIGHT_MODULE` 指定其模块文件 URL；脚本默认也支持普通 `playwright` 模块解析。测试自动启动 `127.0.0.1:48917` 服务，使用独立浏览器上下文，结束后关闭服务与浏览器，不修改日常浏览器资料。

## 未验证范围

本次没有启动 Electron 原生桌宠，没有注册系统协议，也没有运行会注册协议的一键启动回归。第一阶段保留的部分历史浏览器脚本使用开发机绝对路径，其可移植性未在本次修正。当前验证不等于所有历史功能已完整回归。

`git diff --cached --check` 检出原阶段四个生成 JS 文件中的 20 处行尾空白（`dist/*.js` 和 `assets/rodin-friends/review.js`）。这些字节与原 Git 树一致，本次没有改写生成文件以消除历史空白；新归档文档及 smoke 脚本的空白检查通过。

未调用付费模型或生图服务。第二、第三阶段的功能未纳入本次提交和验证。
