# 构建、加载与渲染性能验证

2026-10-16（Asia/Shanghai）。基线为 `origin/main` 的 `814ed55`，包含滨河小镇、小车、近期会话和岛底瀑布更新。优化已并入 `main`，后续开发统一在 `main` 进行。

## 实测结果

| 指标 | 优化前 | 优化后 | 结果 |
| --- | ---: | ---: | --- |
| 无修改时再次构建，中位数 | 213.5 ms | 77.9 ms | 减少 63.5% |
| 强制全量构建，中位数 | 213.5 ms | 214.7 ms | 基本持平 |
| 冷浏览器上下文首屏就绪，中位数 | 4.64 s | 3.72 s | 减少 19.8% |
| 同一上下文重复导航首屏就绪，中位数 | 4.25 s | 3.24 s | 减少 23.6% |
| 冷加载资源传输量，中位数 | 110.47 MiB | 38.73 MiB | 减少 64.9% |
| 重复导航资源传输量，中位数 | 110.47 MiB | 11.76 MiB | 减少 89.4% |
| 空场景群建筑模型请求 | 9 | 0 | 有群消息并实际进入场景时才加载 |
| 每帧绘制调用，中位数 | 314 | 314 | 一致 |
| 每帧三角面，中位数 | 697,694 | 697,694 | 一致 |
| 帧间隔中位数 | 16.7 ms | 16.7 ms | 均约 60 FPS |

帧回调开销的跨运行中位数：冷加载后为 3.5 → 3.4 ms，重复导航后为 3.0 → 2.8 ms。这是浏览器主线程回调时间，包含向 GPU 提交命令，不是 GPU 执行时间。差异小且存在运行波动，本次不据此宣称渲染显著加速。后台渲染暂停已通过实际渲染帧计数验证。

环境：本机 Windows、Node.js v24.18.0、Playwright 1.64.1、已安装的 Microsoft Edge，headless D3D11，1440×1000、deviceScaleFactor=1。网络与 CPU 未限速，服务位于本机。冷加载指新建浏览器上下文，包含操作系统与服务进程已热的情况；重复导航使用同一上下文。每版三个冷上下文、各一次重复导航；每次就绪后暂停演示，等待 1.5 秒，再采集 120 帧。构建对比交替执行旧版全量、新版强制全量与新版复用，共三轮。

测量场景为零好友、零群聊的首次使用状态。已有九类群建筑时仍需加载实际使用的模型，不能把空场景节省量外推为所有使用场景的节省量。资源体积来自 Resource Timing 的 `transferSize` 合计；不是独立网络抓包。原始样本、条件和源码 SHA-256 见 [comparison.json](./validation/performance-20261016/comparison.json)、[加载前](./validation/performance-20261016/before.json)、[加载后](./validation/performance-20261016/after.json) 和 [构建对比](./validation/performance-20261016/build.json)。

## 实现与验证对应

| 方案条目 | 实现位置 | 验证证据 |
| --- | --- | --- |
| 无修改复用构建，正确失效 | `scripts/build.mjs`：保留三个入口并行构建，校验源码、导入依赖、锁文件、工具版本及输出 SHA-256；输出一致时不重写；支持 `--force` | `scripts/test-build-cache.mjs` 覆盖保留时间戳的源码编辑、新导入、依赖锁、缺失/被改写输出、损坏缓存、强制构建与页面版本；`build.json` |
| 按需加载模型 | `src/group-scene.js`：只为实际在场的类型请求 GLB，同类型共用一次请求，先显示原生建筑、就绪后替换；失败保留原生建筑 | [browser.json](./validation/performance-20261016/browser.json)：空场景零请求、双群共享请求、加载期间聊天、替换后槽位保持、改类型、失败回退；[群聊完整回归](./validation/performance-20261016/groups-browser.json) |
| 减少不使用的资源与串行等待 | `src/main.js`、`src/rodin-props.js`：道具和山谷并行加载，主场景仅取实际摆放及山谷/河流共用类型；模型检查工具保留完整目录 | 冷加载请求清单；浏览器断言不加载未使用的 cart/barrel/outcrop；相同绘制调用和三角面 |
| 文本压缩与浏览器缓存复用 | `server/static-files.mjs`、`scripts/serve.mjs`：Brotli/Gzip、ETag、Last-Modified、304、Vary、24 MiB 压缩数据上限及并发请求合并 | `scripts/test-static-files.mjs` 覆盖编码协商、压缩内容、HEAD、Range/If-Range、同尺寸更新、条件请求优先级及受限路由；头像 API 原路由保持在静态处理之前 |
| 复用碰撞计算 | `src/social-characters.js`、`src/discovery-scene.js`、`src/main.js`：场景内 WeakMap 复用相同物体的精确碰撞三角形；检查网格、变换、顶点/索引版本及交互排除 | `scripts/test-placement-cache.mjs`；小镇 515 个实际步行采样、671 个场景路径采样、81 个建筑模板/地块组合；[拖放回归](./validation/performance-20261016/drag.json) |
| 避免每帧无效工作 | `src/static-transforms.js`、`src/main.js`：静态对象保留变换矩阵，角色、建筑、拖放标记、河流、唱片机、蝴蝶和火焰保持动态；普通模式关闭保留帧缓冲，录制模式继续启用；隐藏页面暂停渲染 | `scripts/test-static-transforms.mjs` 覆盖动态后代和迟到对象；`browser.json` 验证暂停/恢复、漫游与真实录制输出；[界面回归](./validation/performance-20261016/ui.json) |

## 回归与画面检查

接入 `814ed55` 后通过：

- `npm test`
- `npm run test:performance`
- `node scripts/test-group-chat.mjs`
- `node scripts/test-group-scene.mjs`
- `node scripts/test-town-walking.mjs`
- `node scripts/test-river.mjs`
- `npm run test:performance:browser`
- `node scripts/test-group-browser.mjs`
- `node scripts/test-character-drag.mjs`
- `node scripts/test-ui-interactions.mjs`

拖放与界面测试的初始化改为创建已读的近期会话，以符合最新主分支的入场规则；不再以“只添加并置顶好友”作为场景已有角色的前提。群建筑失败断言等待异步按需加载完成。

已查看优化前后全景，以及群聊、手机群聊和手机拖放截图。几何、材质、场景位置、像素比与阴影分辨率保留。所有本轮浏览器报告均无 `pageerror`。本轮证据独立放在 `validation/performance-20261016/`；旧验收目录被测试改写的输出已恢复，原始本轮记录另存本地 `.test-results/`。

![优化前](./validation/performance-20261016/before.jpg)

![优化后](./validation/performance-20261016/after.jpg)

## 复现

```powershell
npm ci --ignore-scripts --no-audit --no-fund
npm run build
npm run build                # 未变化时复用
npm run build -- --force     # 强制重建，并校验/修复输出
npm run test:performance
npm test

# 基准脚本会启动并关闭自己的测试服务；端口须空闲。
$env:FOREST_WEB_PORT='48921'
npm run benchmark:performance -- local

# 浏览器功能回归：先在单独终端启动服务。
$env:FOREST_WEB_PORT='48922'
npm start
# 另一个终端：
$env:FOREST_TEST_URL='http://localhost:48922'
$env:FOREST_TEST_OUTPUT='.test-results/performance-current'
npm run test:performance:browser
node scripts/test-group-browser.mjs
node scripts/test-character-drag.mjs
node scripts/test-ui-interactions.mjs

# 交替比较全量和复用构建，参数是独立的旧版检出目录：
node scripts/benchmark-build.mjs <baseline-checkout>
```

本次没有启动 Electron 原生桌宠或注册 Windows 协议，没有调用付费生成服务；这些不列为本次端到端验收。未在真实手机或低端 GPU 上测量。大量群模型同时进入时的峰值内存与交互帧耗仍可后续单独剖析。
