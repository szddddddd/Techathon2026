# 富士樱町斜穿铁路：实施与验证

2026-10-16。保留既有富士山、樱花和森林场景，将铁路改为左后山脚至右前隧道的单线缓弯。九个共享群聊地块位于铁路两侧，三个建筑组分别面向支巷；公共设施使用富士场景自身的锚点。

## 设计条目 → 实现位置 → 证据

| 设计条目 | 实现位置 | 验证证据 |
|---|---|---|
| 对角线铁路、三个错落街区、北侧长站台 | `src/fuji-railway.js`、`src/fuji-layout.js`、`src/fuji-scene.js` | `validation/railway-town/fuji-plan.jpg`、`fuji-overview.jpg`、`fuji-street.jpg` |
| 先生图，再 Rodin，14 个独立模板 | `scripts/railway-asset-catalog.mjs`、`scripts/generate-railway-assets.mjs` | `output/imagegen/railway-town/overall.png`、14 张参考图及提示词；`assets/rodin-fuji/railway-catalog.json`、各目录原始/优化 GLB 与三面检查图 |
| 车厢按弧长跟随、实际轮组与连杆、8 秒停车、隧道隐藏复位 | `src/fuji-train.js` | `geometry.json`：7,000 次 10ms 采样，8 秒停站、一次隐藏复位、车厢间距最大误差约 0.00072 单位；`railway-through-town.webm` |
| 自动道口：预警、清空、落杆、尾车通过后开放 | `src/fuji-crossing.js`、`src/social-characters.js` | `geometry.json`：有人时保持预警、列车等待、拒绝新进入、允许离开、尾车清空后开放；减少动态效果时开放 |
| 实际模型占地与站台长度 | `scripts/test-railway-assets.mjs` | `assets.json`：17 个实际模型（本轮 14 + 既有山与树）；350 个步行采样通过，九种建筑在九个槽位均不侵入轨道，整列车容纳于站台 |
| 人物拖放拒绝铁路、建筑点击打开正确群聊、公共设施与聚会 | `scripts/test-railway-browser.mjs` | `browser.json`：九个人物与九栋建筑；建筑画布点击与高亮、三个公共入口、九人聚会及返回 |
| 原有场景切换、草稿附件和阅读上下文 | 现有场景生命周期与统一聊天 UI | `browser.json`：五次切换、同一 store/UI/canvas、草稿/附件/滚动/未读保留、资源不累积 |
| 手机视角、44px 标签和顶部切换条 | 现有紧凑标签布局 | `fuji-mobile.jpg`、`capture-mobile.json`、`browser.json`，391×844 浏览器模拟 |

## 实施中的校准

- 山脚三栋建筑向后调整约 0.5–0.6 单位，给道路及人物半径留足空间；东侧一栋向后调整 0.6 单位。山体和浮空岛范围未扩大。
- 机车与客车原始模型长轴为 +Z，加载时旋转到运行方向 +X；车身抬高以接入独立轮组。
- 停车点由草案约 `(17.3,5.5)` 校准为约 `(16.4,5.2)`，让机车前端和尾车都在 12 单位站台内。
- 原发现设施选址只搜索森林西岸；富士场景改为先检查指定锚点，再检查邻近位置。报刊铺位于站前公共区域，避免出现在道口。
- 铁道采用重复 Rodin 模块，连续钢轨覆盖接缝；道路与道口、轨道碰撞共用曲线距离查询。没有新增独立动画循环或持续射线检测。

## 验证与性能边界

已运行 `npm run build`、`npm test`、`node scripts/test-fuji-scene.mjs`、`node scripts/test-railway-assets.mjs` 和 `node scripts/test-railway-browser.mjs`。首轮浏览器测试遇到原森林随机人物安放造成仅八人入场的夹具超时；测试使用固定随机种子后按九人同屏重新通过，失败记录保留在本地忽略目录规则下。

同设备 Edge、1440×1000、同镜头、九人九栋、减少动态效果、180 帧：本轮富士场景平均 16.68ms、P95 16.8ms，319 次绘制、约 188.6 万三角面。上一轮富士记录约 140.9 万三角面、266 次绘制；新增轨道模块使三角面和绘制增加，当前采样未出现帧间隔退化。该结果受显示刷新率限制，不代表移动 GPU 余量或真实手机性能。

生成图是风格指导，实际场景以共享布局和碰撞定义为准。背面结构由 Rodin 推断；这是运行时场景资产，不承诺骨骼级列车机构或建筑工程精度。手机仅浏览器模拟，未进行实体手机实测。本轮不涉及远程提交。

最终录像 `validation/railway-town/railway-through-town.webm` 长 72.8 秒，已抽查 15、25、40、55 秒画面；时间线记录到落杆、抬杆、开放和 8 个停站采样点。手机 9/9 个群名标签均通过 44px 与实际命中检查。生图提示词全集为 `output/imagegen/railway-town/image-prompts.json`。
