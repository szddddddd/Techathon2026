# 好友骨骼与状态动作

入口：运行 `npm start` 后打开 `/rig-review.html`。主应用三个场景自动使用同一套骨骼动作系统，原有状态、寻路、聊天和拖放入口不变。

## 实现位置

| 方案条目 | 实现 |
| --- | --- |
| 四种原始模型的关节、活动范围 | `src/characters/character-rig-profile.js`，按身高归一化，+Z 为正面；当前绑定版本 3 |
| 可重复生成的四权重蒙皮 | `src/characters/character-rig-weights.js`、`scripts/generate-character-rigs.mjs`、`assets/character-rigs/*/rig.json` 与 `weights.bin` |
| SkinnedMesh 与独立骨骼实例 | `src/characters/character-rig.js`，使用 SkeletonUtils.clone；共享几何/纹理，骨骼和道具独立 |
| 自定义模型 | Worker 中双足检查、局部轮廓定位和权重计算；适配可识别的已有骨骼/权重；不通过检查则静态显示 |
| 八状态、待机与步态 | `src/characters/character-actions.js`，骨骼四元数混合、腿部双关节 IK、按实际距离推进步态、骨盆调节与支撑边界 |
| 道具 | 绑定手骨的原生几何记事本、翻页及杯子；行走时收起 |
| 场景/标签/拾取 | `src/characters/social-characters.js`，先更新姿态再投影；姿态见证顶点用于日常边界，完整蒙皮采样用于检查 |
| 绑定诊断 | `src/ui/avatar-friend-ui.js`；失败形象显示“骨骼待校正”，不阻断聊天与拖放 |
| 校正工具 | `rig-review.html`、`src/review/rig-review.js`；关节坐标、逐顶点权重覆盖、导入导出、缓存保存、跨页原位刷新 |
| 验证 | `tests/test-*-rig*.mjs`、`tests/test-skeletal-cycles.mjs`、动作/拖放/场景已有回归 |

原 GLB、顶点数量、UV、材质贴图均保留。运行时仅增加 skinIndex/skinWeight 与骨骼；没有调用生成服务。内置角色分别使用 27、27、26、26 个关节。原场景饱和度、梯田改动与理想城无会客厅行为保留；两种桌宠均不使用该控制器。

## 校正与缓存

1. 在检查页选择内置角色，或导入本地、自包含的 GLB。
2. 显示骨骼，暂停播放，选择关节并修改归一化坐标，点击“应用关节并重绑”。坐标以模型身高为 1，地面为 y=0。
3. 在权重框输入覆盖条目，例如 `[{"mesh":0,"vertex":15,"joints":["hips","thighL"],"weights":[0.3,0.7]}]`。每个顶点最多四个关节，权重自动归一化。
4. 预览全部状态、正面和侧面，查看接地点与关节限位，再导出配置。导出的配置含模型 SHA-256，导入时检查模型匹配。
5. 保存到本机缓存会通过 BroadcastChannel 通知同源主应用；按哈希匹配的实例原位替换骨骼，不更改好友、聊天或坐标。

IndexedDB 数据库 `forest-character-rigs` / `rigs` 为可删除缓存，与业务存储分开。派生资源键包含绑定版本、模型内容 SHA-256、配置 SHA-256；人工校正按模型哈希保存，并检查版本。开发者可在浏览器存储工具删除该数据库，重载后自动重建。修改算法后需递增 `RIG_VERSION` 并重新生成预绑定文件。

自动绑定以正立、+Z 朝前、可辨认的双足 A/T 形轮廓为支持范围。现有骨骼适配要求骨盆、躯干、颈头、双臂和双腿可映射到语义关节；不可识别形象不强行绑定。任意用户模型的拓扑和肢体结构不能仅靠本次测试保证，须在检查页校正后采用。

## 复现命令

```powershell
npm run rigs:generate
npm run build
npm run test:rigs
npm run test:actions
npm run test:drag
npm run test:scenes
npm run test:performance
node tests/test-ideal-layout.mjs
```

`npm run record:rigs` 录制实时完整动作，`node scripts/export-rig-clips.mjs` 按 24fps 固定步长导出每个角色/状态 12 秒短视频（前 8 秒正面、后 4 秒侧面）。后者使用 Playwright 安装目录中的 FFmpeg，或显式设置 `FFMPEG_PATH`。不依赖网络模型或服务。

九角色对比：`node scripts/benchmark-character-actions.mjs before` / `after`。本次旧 bundle 保存在 `.test-results/skeletal-actions/before-world.js`；它是改动前的实际构建，测试脚本仅在浏览器响应中注入控制器引用。使用相同设备、浏览器、理想城、1440×1000 相机、九名角色的相同初始位置和状态，预热后各测三次。before 文件为本机验收基线，不是仓库运行依赖。

## 验收证据与范围

本次完整验证对象为四个项目原有 GLB；自定义流程使用代码创建的 A 形双足、T 形双足、已带兼容蒙皮的测试形象及非双足球体。没有本地真实用户自定义模型样本，因此不宣称其全部外观已验收。

证据在 `.test-results/skeletal-actions/`：

- `cycles.json`：四角色 × 八状态及待机、行走；完整周期采样、精确蒙皮穿地检查。
- `foot-contact.json`：直线支撑阶段脚部滑移，四角色最大值为身高的 2.33%、1.79%、2.80%、2.41%，均低于 3%。曲线、坡地由场景导航/拖放回归覆盖，未声称对任意地形做全域数值证明。
- `custom-fixtures.json`、`custom-integration.json`：Worker、已有骨骼、失败静态、独立实例、版本拒绝、缓存复用、校正与跨页原位应用。
- `scene-regression.json`：三场景、状态过期、快速状态切换、聊天覆盖、减少动态效果、五轮切换后的资源稳定性。
- `performance-before.json` / `performance-after.json`：九角色性能原始记录；最终数字见 `VALIDATION.json`。
- `*-front.jpg` / `*-side.jpg`、`clips/*.webm`：各状态正侧面与短视频；`gallery.html` 为本地证据索引。
- 既有交互证据：`.test-results/presence/actions/results.json`、`.test-results/presence/action-interactions.json`、`.test-results/character-drag.json`。

边界采用每网格约 488–504 个见证顶点，而非每帧扫描整个人物。独立精确检查实际蒙皮顶点来验证边界误差。模型缓存跨场景复用；离场角色不更新动作；校正替换会释放旧骨骼、道具、独占材质和被替换的模板资源。

最终九角色数据：帧间隔中位数 16.7ms、P95 33.3ms，前后相同；主帧回调中位数 2.8 → 3.0ms（+7.1%），P95 42.2 → 44.0ms（+4.3%），均在 10% 上限内。CDP 全部任务平均每帧 5.21 → 5.64ms（+8.4%）。这些是本机 Edge/D3D11 的三次测量中位数，原始样本汇总保留于报告，不外推到所有设备。
