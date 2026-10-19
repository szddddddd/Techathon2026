# 性能优化验证（2026-10-17）

本次保留所有场景资源、九栋可视建筑、贴图、几何、抗锯齿、像素比上限、2048 阴影和原有昼夜效果。没有调用生成服务或更改模型资源。

## 改动

| 开销 | 实现 | 验证 |
| --- | --- | --- |
| 三个入口重复解析公共依赖 | `scripts/build.mjs` 一次构建三个独立 IIFE，仍校验源码、依赖和产物内容哈希 | 构建缓存回归；同源码下新旧构建方式三个产物逐字节一致 |
| 大模型流式传输的文件读取回调 | `server/static-files.mjs` 使用有界 256 KiB 缓冲 | 完整文件、跨块 Range、HEAD、压缩、缓存与内容一致性测试 |
| 唱片机阻塞其他模型请求 | `src/scenes/shared/scene-assets.js` 并行加载场景与唱片机，富士 GLB 与清单并行请求；独立缓存场景资源供唱片机失败重试复用 | 完整模型集、共享缓存、清单失败、树木回退、双向失败和重试不增加下载/资源测试 |
| 静态矩阵仍被顶层 Scene 强制刷新 | `src/main.js` 固定顶层单位变换，保留动态子节点正常更新 | 静态乘法计数为零；动态角色、晚加入对象、强制刷新和重新挂载仍正确 |
| 恒定昼夜重复计算颜色及天空键 | `src/scenes/shared/day-night-environment.js` 复用转换后的颜色与恒定调色板，天空按版本更新 | 昼夜边界、切换场景、原始天空像素和光照数值一致性 |
| 星空矩阵在渲染前重复更新 | `src/scenes/shared/day-night-effects.js` 由渲染器统一计算动态矩阵 | 星空跟随相机、改变宽高比、冻结静态场景后的更新 |

## 本机测量

Windows，Node v24.18.0，esbuild 0.25.10。构建与传输各 7 组，交替运行新旧方式；使用中位数。文件系统缓存已热，数据不能代表其他设备或网络。

| 项目 | 原方式 | 优化后 | 耗时变化 |
| --- | ---: | ---: | ---: |
| 编译（已有 esbuild 服务，不写产物） | 95.11 ms | 92.90 ms | -2.3% |
| 完整强制构建（独立 Node 进程，含哈希、缓存和 HTML 处理） | 216.72 ms | 211.63 ms | -2.4% |
| 10 次 12.3 MB 模型传输（本机 HTTP，接收端校验 SHA-256） | 280.45 ms | 225.86 ms | -19.5% |

上述数据分别测量构建组织方式和缓冲大小的影响；不能直接当作整页加载或整体 FPS 的变化。原始脚本和数据位于本机忽略目录 `.test-results/performance/benchmark-build-static.mjs` 与 `build-static-microbenchmark.json`。

另用原有 `benchmark:performance` 对森林进行 3 个独立浏览器上下文的冷/热加载复测，1440×1000、正常动画、各采样 120 帧：热加载中位数 3262 → 3114 ms（约 -4.5%）；冷加载 3535 → 3550 ms，基本持平。冷/热帧 CPU 中位数分别约 3.3 → 3.2 ms、2.4 → 2.4 ms，帧间隔 P95 均约 16.8 ms；没有证据支持显著整体渲染提速。每次均保留 337 次绘制和 1,101,244 个三角面，无页面错误。样本量有限，首个冷加载存在明显波动。完整记录为 `before-optimization-20261017.json`、`after-optimization-20261017.json` 和 `end-to-end-comparison.json`。

## 画面与内容检查

基线为修改前保存的 `dist/world.js`（提交 `53f34254cb9d10368de8d95e7f91c9d2117b3e74`）。同一 Edge/D3D11、固定随机种子、减少动画、桌面 1440×1000、移动视口 391×844，比较三个场景的白天、黄昏、夜晚与移动夜景，共 12 对截图。

- 富士与理想城 8 对截图逐像素一致。
- 森林桌面每张仅 2–4 个像素有最多 1/255 的通道差异；移动夜景 42 个像素有最多 2/255 的差异。
- 每个场景/时间的绘制调用数与三角面数保持一致；九栋建筑保留。
- 实际检查了截图，未见内容或画质损失；该检查覆盖这些视角，不等于遍历所有可能相机位置。

截图与数值记录位于 `.test-results/performance/scenes-before`、`scenes-after`、`visual-comparison.json`。浏览器帧间隔大多约 16.7 ms，受刷新率上限、首次着色器编译及后台负载影响，不能据此宣称整体 FPS 提升。

## 复现

```powershell
npm run build
npm test
npm run test:performance
npm run test:forest
node tests/test-day-night.mjs
node tests/test-project-assets.mjs
npm start
# 在另一终端运行浏览器检查
node tests/test-current-scenes.mjs
npm run test:performance:browser
npm run test:day-night
npm run benchmark:scenes -- sample
```

可将修改前的独立浏览器产物保存在本地，再运行 `npm run benchmark:scenes -- before <bundle-path>`；它使用相同服务器与资源，只替换浏览器入口脚本。按顺序执行浏览器基准，避免多个浏览器同时争用 GPU。基准与截图均输出到 `.test-results/performance/`。
