# 手机性能优化与验收

[项目首页](../README.md) / [文档索引](README.md)

本次保留原始模型、贴图、分辨率、抗锯齿、阴影、可视内容和骨骼动作。没有引入低模、距离隐藏或通过减少好友数量获得性能结果。浏览器和 APK 共享优化后的场景代码。

## 实现位置

| 改动 | 实现 | 保持的行为 |
| --- | --- | --- |
| 精确碰撞数据压紧并建立空间索引 | `src/rendering/placement-triangles.js`、`src/characters/social-characters.js` | Float64 世界三角面、人体高度裁剪、脚下支撑与建筑内部检查 |
| 静态模型射线加速 | `src/rendering/static-raycast.js`、`src/scenes/ideal/ideal-scene.js`、`src/social/group-scene.js` | 只对静态普通网格启用间接 BVH；保持原三角索引，骨骼模型使用原路径 |
| 重复物件合并为 GPU 实例 | `src/rendering/static-instances.js`、`src/scenes/shared/scene-world.js` | 原几何、材质、矩阵和阴影；保留原对象进行拾取；动态与透明物件排除 |
| 合并时保留索引缓冲 | `src/rendering/indexed-geometry.js`、三个场景构建器 | 不再把已有索引网格展开为每面重复顶点 |
| 首帧准备与纹理上传分段 | `src/rendering/gpu-prepare.js`、`src/main.js` | 并行着色器编译、原纹理上传，在准备期间让出界面线程 |
| 切换后释放非当前场景 GPU 资源 | `src/scenes/shared/scene-assets.js`、`src/main.js` | CPU 模板可复用；再次进入时重新上传；成功切换后才释放 |
| 减少动作和标签重复工作 | `src/characters/character-actions.js`、`src/social/social-ui.js`、`src/social/group-scene.js` | 复用关节目标和蒙皮采样；只写变化的标签属性；静态遮挡结果复用 |
| 手机停止桌宠空轮询 | `src/main.js`、`src/characters/web-pet.js` | Android 不启动 Windows 桌宠发布/轮询，桌面行为保留 |

射线实现使用 [three-mesh-bvh](https://github.com/gkjohnson/three-mesh-bvh)，锁定在项目依赖中；不修改全局 `Mesh.prototype`。

## 重现

```powershell
npm run build
npm run android:web
npm run test:mobile:performance
npm run test:mobile:rendering
npm run benchmark:mobile -- after
# 同一测试脚本可选用保存的旧 bundle
node scripts/benchmark-mobile.mjs before .test-results/mobile-performance/baseline-world.js
node tests/test-mobile-rendering.mjs .test-results/mobile-performance/baseline-world.js
```

结果在 `.test-results/mobile-performance/`，包含 JSON、CPU profile 和截图。基线 bundle/APK 是本机保存的优化前产物，不进入 Git。重现历史对照需保留这些基线。

浏览器条件：本机 Edge / D3D11，393×852 CSS 视口、DPR 2（实际画布 648×1405）、固定随机种子 123456 和白天时刻、八名角色、每场景预热后采样 120 帧。CPU 时间是动画帧回调的主线程耗时，不是 GPU 耗时，也不能换算为实体手机 FPS。JS 堆为 `usedJSHeapSize` 快照，受 GC 影响，不是进程总内存或显存；加载时间受系统缓存影响。

## 验证证据

2026-10-18 两次优化前与两次最终版运行结果如下。每格为两轮各自统计量的算术平均；P95 列不是把两轮样本合并后重新计算的分位数。原始记录为 `before/`、`before-repeat/`、`after-final/`、`after-repeat/`，汇总 `comparison.json`。

| 场景 | 首帧就绪 ms（前→后） | CPU 中位 ms（前→后） | CPU P95 ms（前→后） | JS 堆 MiB（前→后） | 绘制调用（前→后） |
| --- | --- | --- | --- | --- | --- |
| 森林 | 6379 → 4995 | 4.95 → 4.70 | 14.60 → 6.25 | 512 → 189 | 346 → 303 |
| 富士 | 4998 → 3780 | 4.30 → 4.35 | 6.85 → 4.85 | 180 → 104 | 300 → 290 |
| 理想城 | 2491 → 2048 | 3.05 → 2.45 | 41.45 → 2.95 | 226 → 90 | 105 → 105 |

富士 CPU 中位数没有明显改善，主要收益是堆占用、加载及尾部耗时；不宣称所有场景的每项指标都提升。两轮样本量有限，启动缓存和 GC 会产生波动。

- `rendering/report.json`：三个场景同相机的前后画布尺寸、渲染三角面数量一致；RGB 最大差异超过 24 的像素比例均小于 0.0001%。截图人工检查保留了场景和角色。
- 同一页连续切换五整轮，始终只有一个活动世界、四名好友；回复草稿保留，纹理/几何数量逐轮完全稳定。森林 96/224、富士 91/267、理想城 35/87（当前测试数据下的纹理/几何数量，不是所有内容的固定上限）。
- 模拟必要 GLB 加载失败：旧世界保留，解除失败后可正常重试。
- 独立碰撞参考算法对照 1800 次随机高度裁剪查询；静态射线对照包含全部命中和三角面编号；实例验证原矩阵、材质、阴影、拾取及动态对象隔离。
- 四个物种 × 八种状态的接地与拾取检查通过；720 步支撑脚测试最大滑移分别为身高的 2.33%、1.79%、2.80%、2.41%，均小于既有 3% 门槛。
- 现有存储、Inbox 权限/跨平台联系人、构建缓存、资产加载、森林布局、三场景、Android 触屏、拖放、群聊完整流程和昼夜浏览器回归通过。群聊脚本更新了旧悬浮栏进入步骤、已删除的图片夹具，以及当前“已读群聊保留建筑”的断言；没有为旧测试改动产品行为。

已有 `test-placement-clearance.mjs` 中的旧布局断言在优化前同样失败（community-bench 支撑及 cottage 内部点位）；不以改动场景或放宽碰撞语义修饰结果。精确算法对照、布局、缓存失效和动作测试另外验证本次改动。

Android 原生测试可用 `adb shell am instrument -w -e benchmark true app.weroam.mobile.test/app.weroam.mobile.SmokeInstrumentation` 运行三场景采样，输出应用外部测试目录的 `android-performance.json`。模拟器结果与桌面触屏浏览器结果分别保存，不混为实体手机验收。

Android 15 / API 35 模拟器安装并覆盖更新到 `1.3.1-demo.2` 后，三场景原生采样及返回/草稿测试通过，未出现未捕获 JS 异常。WebView 124 没有并行着色器扩展，原始着色器预热回退路径可正常运行。`native-before.json` 与 `native-after.json` 记录四名真实内置好友的运行采样：CPU P95 分别为森林 20.5→8.8 ms、富士 13.3→9.9 ms、理想城 29.6→4.8 ms。好友漫游位置及驱动缓存没有强制相同，因此这些原生单轮结果是运行观察；严格固定条件的对照采用上面的浏览器结果。两版模拟器的中位帧间隔均约 16.7 ms，不把 CPU 改善解释为已实测手机帧率提升。

## 设备边界

原始三场景离线资产约 320 MiB，没有靠压缩贴图或删减内容减少包体。低端 GPU 仍可能受像素、阴影和原始高面数资产限制。当前已验证的浏览器/模拟器证据不能保证所有手机恒定 60 FPS；实体手机的帧率、长时间温升、系统回收和厂商 WebView 兼容性需要安装后实测。


## 2026-10-18：重复加载与资源生命周期优化

本轮以 `3ee7929` 为修改前版本，保持 v0.1 beta、原始几何、贴图、分辨率、抗锯齿、阴影及全部可视内容。没有发布或推送 Git，也没有替换 `downloads/` 中的安装包。

### 本轮实现

- `src/scenes/shared/scene-assets.js` / `src/ui/mailbox.js` / `src/scenes/shared/scene-world.js`：邮箱模板按场景缓存正在进行及已完成的加载，失败后可重试；预加载与其他场景资源并行。每个活动邮箱独立克隆节点、共享几何与贴图，切换后保留模板，闲置 GPU 资源仍走原有释放策略。
- `sceneResources()` 现在收集场景灯光的 Shadow 对象，退出场景时释放其 render target，覆盖富士列车头灯。共享资源不会随某一实例退出而失效。
- `src/discovery/discovery-player.js`：普通网页改为直接媒体 URL，由媒体栈缓冲及拖动读取，省去完整文件 fetch→Blob→ObjectURL 中转。重复打开同一视频复用单个播放器与播放位置，取消的加载会正常结束等待；仍支持错误重试。APK 保留单个 Blob 的离线兼容路径，换片与退出时撤销旧 URL。
- Web 服务器补齐 MP4 MIME。Android 模拟器 WebView 124 的离线 HTTPS URL 路径实测出现播放和拖动失败，因此没有交付该实验的原生 Range 处理器；APK 沿用兼容路径。普通手机浏览器经真实 HTTP 服务的媒体 Range 测试通过。
- `src/scenes/shared/day-night-environment.js` / `main.js`：固定时间且相机未动时跳过相同环境计算，自动昼夜和移动相机仍逐帧更新；相机裁剪参数未变化时不再重建阴影投影矩阵。场景切换和失败回退显式使缓存失效。
- `main.js` / `social-ui.js` / `record-player.js` / `mailbox.js`：相同视口不重复设置画布尺寸；相同标签样式不重复写入；不可见的设施入口不做投影和 DOM 写入；好友资料映射只在社交状态变化时重建。
- `discovery-ui.js`：视频控件沿用已有媒体事件刷新，不在场景每帧扫描控件。
- `mobile-platform.js` / `web-pet.js` / `main.js`：Android APK、Android 浏览器和 iOS 不启动 Windows 桌宠 HTTP 轮询及 250ms 同步计时器；Windows 原生桥接及桌面浏览器行为保留。

### 本轮验证与证据

同一台电脑 Edge / D3D11，393×852 CSS 像素、DPR 2、实际画布 648×1405，固定随机种子、白天、八名角色，预热后采样 120 帧。修改前后分别在 `.test-results/mobile-performance/before-mobile-reuse/` 和 `after-mobile-reuse/`。这些是桌面触屏模拟，不能作为实体手机 FPS 结论。

| 场景 | CPU 中位数，前→后 ms | CPU P95，前→后 ms | 帧间隔中位数，前→后 ms |
|---|---:|---:|---:|
| 森林 | 5.2 → 5.2 | 7.3 → 5.9 | 16.7 → 16.7 |
| 富士 | 4.6 → 4.8 | 5.4 → 5.6 | 16.7 → 16.7 |
| 理想城 | 2.8 → 2.8 | 3.3 → 3.5 | 16.7 → 16.7 |

单轮数据没有显示稳定的整体帧耗时改善；原始 JS heap 快照也受 GC 时机影响，不据此声称总内存下降百分比。本轮可确认的收益是消除重复邮箱下载和解析、网页视频完整文件的应用层中转、重复表现更新以及场景阴影目标的遗漏释放；不宣称 APK 的视频 Blob 内存也已去除。

- `test-mobile-resource-lifecycle.mjs`：并发加载合并、失败重试、实例变换隔离、共享几何保护、真实 Shadow render target 的 dispose 事件，以及固定时间缓存和相机/时间/场景失效。
- `test-mobile-rendering.mjs`：修改前后固定视角三场景的 RGB 差异大于 24 的像素比例均为 0%，画布与三角面数量一致。五完整轮切换始终一个活动世界、四名好友，回复草稿保留；每个场景邮箱只发起一次请求。各轮纹理/几何数量一致：森林 99/223、富士 94/268、理想城 38/88。必要 GLB 失败回退和重试通过。
- `test-mobile-media.mjs`：直接媒体请求及 Range、单视频多次打开不重载、拖动、关闭重开恢复、快速换片、加载失败重试；Android UA 页面不访问桌宠端口。证据 `.test-results/mobile-media-streaming.json` 及同名 PNG。
- 社交存储/内容/桌宠状态、角色加载与在场策略、已有碰撞/静态实例/射线性能校验、昼夜、Android 离线触屏回归通过。离线包 291 项、327.7 MiB，模型与贴图原字节保留。
- Web 构建和 Android release / AndroidTest 构建通过；APK 仅用于本地验证，未覆盖下载发布文件。Android 模拟器内从实际视频界面点击播放、暂停和拖动至 70% 均通过，当前单 Blob 兼容路径的证据为 `.test-results/mobile-performance/native-media-compatible.txt`；失败的直接离线 URL 试验记录另存，没有当成通过结果。

复现命令：`npm run build`、`npm run android:web`、`npm run test:mobile:performance`、`npm run test:mobile:media`、`npm run test:mobile:rendering`。原生离线播放与进度拖动的复现命令：`adb shell am instrument -w -e media true app.weroam.mobile.test/app.weroam.mobile.SmokeInstrumentation`。
