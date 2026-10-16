# 连贯山脉与山涧溪流 · 实现与验收

完成日期：2026-10-16（Asia/Shanghai）。后方两座独立山体已替换为一条完整山脉：左侧主高点、右侧较低山肩，中央山涧从内部泉潭下行，经三处短跌水接回原河道。房屋、桥、营地、广场和观景台保持原位置，右侧坡路仍可通行。

![桌面默认视角](validation/mountain-range/after-desktop.jpg)

[山涧近景](validation/mountain-range/after-gorge.jpg) · [手机默认视角](validation/mountain-range/after-mobile.jpg) · [侧面](validation/mountain-range/after-west.jpg) · [背面](validation/mountain-range/after-rear.jpg) · [水流录像](validation/mountain-range/mountain-flow.webm)

## 真实生成与采用

通过已经授权的 Hyper3D MCP OAuth 实际调用 Rodin **两次**，达到本轮最多一次修订的上限，没有第三次提交。均为 `Gen-2.5-Medium / Raw / 30,000 / GLB`，水面未烘焙进生成资产。

| 次数 | 任务编号 | 采用结果 |
| --- | --- | --- |
| 1 | `35484f46-06dc-4a9f-85cd-32abda763e22` | 未采用。构图参考过于平滑，泉潭后方形成贯穿山脊的缺口。原始与处理版、参考图、提示词、检查图保留在 `assets/rodin-mountain/attempt-1/`、`validation/mountain-range/attempt-1/`。 |
| 2 | `e3019c25-d7ca-4cd3-958a-6f6a1ac89442` | 采用。参考图增加宽岩层和后侧山脊，并补充背面参考。对实际结果进行局部河床拟合后进入场景。 |

[完整来源记录、提示词与 SHA-256](assets/rodin-mountain/manifest.json) · [程序参考正面](assets/rodin-mountain/reference/front.png) · [俯视](assets/rodin-mountain/reference/top.png) · [背面](assets/rodin-mountain/reference/rear.png)

- 原始返回文件：[source.glb](assets/rodin-mountain/source.glb)，30,000 三角面，6,723,368 字节；未覆盖原始生成结果。
- 场景使用文件：[scene.glb](assets/rodin-mountain/scene.glb)，36,529 三角面，12,318,364 字节。世界坐标已写入网格，运行时不再次归一化或缩放。
- 局部处理明确包括：河槽附近自适应细分、沟底下切以留出水体空间、泉潭后缘补高。最大沟底调整约 2.30 单位，最大后缘调整约 2.30；这是本地几何修整，不是原始 Rodin 直接输出即满足全部要求。
- 目标外形宽 36、深 14，中心 `(-1,-22)`，名义主高差 13.5、最高点约 14.9。处理后包围盒高度 13.716：河口水下底面略低于名义底面，峰高没有额外抬升。
- 已检查原始和处理版的正面、侧面、背面、俯视，以及实际场景默认、山涧和手机视角。采用风格为柔和块面、宽岩层和苔绿台阶；近看仍保留生成网格的简化块面。
- 返回结果没有提供实际扣费数值，不对 credits 作估计。OAuth 凭证、上传签名和私有结果链接仅保留在忽略的本机记录中，不进入源码或公开清单。

`scripts/generate-mountain-range.mjs` 按已保存任务查询、下载；提交状态不明时停止，不自动重复付费。结果已下载时校验现有源文件并退出；新克隆缺少私有记录时也复用公开清单中的任务编号。

## 设计条目 → 实现位置 → 验证证据

| 设计条目 | 实现位置 | 验证证据 |
| --- | --- | --- |
| 一个连贯山脉，左主峰、右低肩峰；停用旧两山及叠加山峰 | `src/mountain-profile.js`、`src/terrain.js`、`src/valley-assets.js` | [默认视角](validation/mountain-range/after-desktop.jpg)、[浏览器检查](validation/mountain-range/browser.json)：只有一个山脉节点，旧两款山体未发起加载请求 |
| 程序构图 → Rodin → 场景拟合，保存采用记录 | `scripts/prepare-mountain-reference.mjs`、`scripts/generate-mountain-range.mjs`、`scripts/prepare-mountain-model.mjs` | [资产清单](assets/rodin-mountain/manifest.json)、[局部处理统计](validation/mountain-range/model-preparation.json)、`raw-*.jpg` / `prepared-*.jpg` |
| 内部水源、三处短跌水、上窄下宽，接回现有水道 | `src/river-profile.js`、`src/river.js` | [几何检查](validation/mountain-range/geometry.json)、[近景](validation/mountain-range/after-gorge.jpg)、[录像](validation/mountain-range/mountain-flow.webm) |
| 山脚显示、植被贴地、碰撞和通路一致 | `src/world-surface.js`、`src/terrain.js`、`src/valley-landmarks.js` | [地形检查](validation/mountain-range/regression-evidence/valley-geometry.json)、[资产几何审计](validation/mountain-range/regression-evidence/rodin-valley/geometry.json) |
| 山体与河道不能安放人物，右坡路仍在 22° 以下 | 共享 `querySurface`、地表采样与现有人物安放机制 | [安放检查](validation/mountain-range/regression-evidence/placement-clearance.json)、[真实拖放](validation/mountain-range/regression-evidence/character-drag.json)、[坡路与平台回归](validation/mountain-range/regression-evidence/valley-browser.json) |
| 水体独立动画；减少动态效果冻结；不增加逐帧射线任务 | `src/river.js` 复用原循环与时间参数；新增上游泡沫合并为一次绘制；山体高度仅在查询时射线采样并缓存 | [回退与冻结检查](validation/mountain-range/browser.json)、[河流浏览器回归](validation/mountain-range/regression-evidence/river-browser.json) |
| 模型加载失败时保持同一轮廓、泉潭与河道 | `createMountainGeometry()`、`buildTerrain()` | [回退近景](validation/mountain-range/fallback-gorge.jpg)、[回退手机](validation/mountain-range/fallback-mobile.jpg)、强制中断 GLB 请求的浏览器测试 |
| 聊天关注、未读入场、聚会、发现设施、镜头拖动回归 | 现有 UI、在场控制器与共享山谷查询 | [在场回归](validation/mountain-range/regression-evidence/presence/presence-results.json)、[聚会回归](validation/mountain-range/regression-evidence/valley-browser.json)、[镜头检查](validation/mountain-range/regression-evidence/pan-bounds.json)、[发现图标检查](validation/mountain-range/regression-evidence/hyper3d/results.json) |

## 几何检查结果

- 泉潭水位 10.2，位于 `z=-25.5`；后方实测岩脊约 12.95，水源在山体内侧。
- 三段短跌水中心 `z=-22.8/-19.8/-16.5`，指定额外落差分别为 `1.0/1.2/0.8`；其余河段连续下行。
- 在 `z=-11.06` 连续接回原河道。桥下水位保持 0.22，前景下游保持 -0.08，前景瀑布位置不变。
- Rodin 与回退模型各检查 980 个河槽采样点。最接近水面的岩床仍低于基准水面约 0.125 / 0.076，覆盖现有最大 0.045 水波幅度。Rodin 河口处有 25 个采样由连续独立河床网格承托，测试明确检查这些水下交接点；其余山涧段要求山体河床存在。
- 右侧坡路实测最大坡度 21.1007°，有效连通图 131 个节点；渲染地面与查询高度误差最大约 0.00983。
- 山脚主水路旁桦树移至 `(7.2,-11.2)`，按地表采样安放；原房屋、桥、营地和广场位置未迁移。

以上为实际网格采样和视觉检查，不能解释为对所有连续曲面点的数学证明。

## 自动回归与构建

`npm run build` 成功，当前产物已写入 `dist/world.js`、`dist/review.js`（构建也校验生成 `dist/pet.js`）。本地服务刷新后可见，不需要调用生成接口才能打开场景。

[回归汇总](validation/mountain-range/regressions.json) 包含 16 个受影响测试，最终均通过；另有独立 `test-mountain-range.mjs` 几何检查通过。

首轮有 3 项失败，保留在 [首次回归记录](validation/mountain-range/initial-regressions.json) 和 `regression-logs/`。修正测试夹具后只复测失败项，没有删除业务断言：

1. 安放测试引用了旧树木资源路径；改为共享树木路径解析并注入地形采样。
2. 随机入场后，拖放测试会点击头顶 DOM 标签或手机视角中被遮挡的人物。固定随机种子，要求真实 Canvas 命中，手机测试先对准同一人物。有效/无效安放、重叠拒绝、Esc、单击聊天、刷新、触摸及落地后散步均通过。
3. 镜头测试的“记录原位”和“进入设施”分在两帧，仍有平移惯性导致差异。改为原子记录与触发；精确返回的 0.001 容差未放宽。

复现命令（浏览器测试先运行 `npm start`）：

```powershell
npm run build
npm run test:mountain
node scripts/test-mountain-regressions.mjs
```

构图与模型拟合脚本不会提交新生成任务：

```powershell
node scripts/prepare-mountain-reference.mjs
node scripts/prepare-mountain-model.mjs --process
```

## 同设备性能比较

Windows、本机 Edge 155、D3D11、1440×1000、相同默认镜头及随机种子、4 位在场人物。前后串行测量，流水和人物动画开启，30 帧预热后采集 300 帧。旧版本 bundle 的 SHA-256 与镜头坐标一同记录，旧 bundle 保存在本机 `.cache/mountain-before/`。

| 指标 | 修改前 | 修改后 |
| --- | ---: | ---: |
| rAF 帧间隔中位数 | 16.7ms | 16.7ms |
| P95 帧间隔 | 16.8ms | 16.8ms |
| 绘制调用 | 304 | 307 |
| 场景三角面 | 775,992 | 794,699 |
| 在场人物 | 4 | 4 |

[动画开启的完整记录](validation/mountain-range/performance-active.json)。绘制调用增加 3 次，三角面约增加 2.41%；未观察到本次采样条件下的帧间隔退化。减少动态效果模式的同机对照也保存于 `before-metrics.json` / `after-metrics.json`。

帧间隔受约 60Hz 同步限制，不是 GPU 执行时间，也不能代表低性能设备余量。未在真实手机、不同显卡、长时运行或网络限速环境实测；手机截图和触摸检查来自 Edge 391×844 模拟。未声称所有手机上达到相同帧率。

## 交付文件

- 源码：上述 `src/`、`scripts/` 与当前构建产物。
- 新山脉：[采用 GLB](assets/rodin-mountain/scene.glb)、[原始 GLB](assets/rodin-mountain/source.glb)、[资产记录](assets/rodin-mountain/manifest.json)。
- 图像与录像：[桌面](validation/mountain-range/after-desktop.jpg)、[手机](validation/mountain-range/after-mobile.jpg)、[山涧](validation/mountain-range/after-gorge.jpg)、[短录像](validation/mountain-range/mountain-flow.webm)。
- 证据集中在 `validation/mountain-range/`，历史验证目录保留原文件。先前好友流水线工作保留，本轮未提交或推送 Git。
