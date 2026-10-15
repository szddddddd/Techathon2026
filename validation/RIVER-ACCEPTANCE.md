# v1.2.0 森林溪谷

## 需求 → 实现 → 验证证据

| 需求 | 实现 | 证据 |
| --- | --- | --- |
| 清澈、有深浅的水体 | 连续雕刻河床、160 颗实例化卵石、5313 顶点水面、标准灯光与阴影材质、浅水透明和深水着色 | `river-before.jpg` / `river-after.jpg` 同机位对照，`river-shallows.jpg` |
| 自然岸线与现有资产 | 错落岸石、湿润水线、苔藓帽、少量蕨草；复用 10 个现有 Rodin 苔石实例 | `river-geometry.json`，实际 GLB 包围盒验证仍在原河道内且低于草地 |
| 水流、落差与瀑布 | 顺流短纹、岩石周围白沫、桥后 0.3 单位落差、5 束弯曲瀑布、底部消散水雾 | `river-motion.webm`、`river-waterfall.jpg` |
| 桥和岸体兼容 | 原 `riverCenter` / `riverHalfWidth` 数值保持，草地仍为 y=2.22，桥下水位为 0.22 | `river-bridge-audit.json`：双向通道通畅、两岸桥面连续；`discovery-placement.json`：设施与四人／八人站位有效 |
| 无明显水面裂缝 | 水面、河床和水帘共用剖面，前端波幅收敛为 0，水帘首排顶点与水面相接 | `river-geometry.json`，近景目视检查 |
| 减少动态与回退 | 减少动态时冻结波浪、漂沫和水雾；没有 GLB 时使用同色程序石头 | 几何测试与浏览器减少动态测试通过 |
| 拖放和现有功能 | 保留人物存储、陆地碰撞和设施布局 | `character-drag.json`、`launch.json`，`npm test` 通过 |
| 帧率和手机 | 桌面 1440×1000、DPR 1、四位好友，8 秒采样平均 60.07 FPS；P95 帧间隔 16.8ms；391×844 无横向溢出 | `river-browser.json`、`river-mobile.jpg` |

## 实施说明

河流对象统一由 `src/river.js` 管理，`update(time, dt)` 更新动画，`dispose()` 清理自有资源；`sample`、`level`、`bounds` 供检查使用。GLB 几何和材质继续共享，不由河流销毁。河流对象标记为 `riverOwned`，避免静态合批破坏动画或清理。

几何检查验证采样点和实际石头包围盒，不构成所有三角形组合的穷举证明。帧率是当前开发机 Edge/D3D11、DPR 1 的实测，不代表所有设备。水体使用着色与透明混合，没有实时折射和镜面反射。现有六条视频号短片仍为此前录制内容。
