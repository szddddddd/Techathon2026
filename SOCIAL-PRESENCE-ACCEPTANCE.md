# 好友列表、消息在场与状态动作验收

本次在原生 JavaScript、CSS、Three.js 架构上实现，保留森林、原角色与上一轮 Dock、浮层、焦点恢复和分享交互。构建产物为 `dist/world.js`；运行中的页面刷新后生效。

## 使用方式

好友入口默认打开消息列表，可切换通讯录。右键、触摸长按或行尾更多按钮可以置顶。没有置顶和未读时，好友全部收在列表中；这时森林没有好友人物是预期行为。列表中仍能访问每一位好友，直接打开聊天不会召出已收纳人物。

[截图、录像与交互式姿态图集](validation/presence/index.html) 可直接用浏览器打开。

## 设计条目 → 实现位置 → 验证证据

| 设计条目 | 实现位置 | 验证证据 |
| --- | --- | --- |
| 会话 / 通讯录、搜索、独立添加页、头像、摘要、时间、草稿 | `src/social-conversations.js`、`social-presence.css`、`src/social-ui.js` | `validation/presence/wechat-list.jpg`、`mobile-list.jpg`；场景机制浏览器检查 |
| 置顶持久化、优先排序、右键 / 长按 / 更多 / 键盘菜单 | `src/social-store.js` 的 `setFriendPinned`；`social-conversations.js` | `scripts/test-presence-policy.mjs`；`presence-results.json` 的菜单、排序与触摸检查 |
| 置顶或未读决定资格，聊天期间保留，关闭后等 1.2 秒再用 500ms 渐隐 | `src/social-presence.js`、`src/social-ui.js` 的 `prepareFrame` 与关闭生命周期 | 策略测试；`presence-results.json`，共 10 项通过；`message-presence.webm` |
| 650ms 入场、渐隐中恢复原人物和位置、同轮不重新选位 | `social-presence.js`、`src/social-characters.js` 的 `setPresence` | 策略时序测试；浏览器渐隐恢复检查 |
| 随机安全点、拖动仅本次、刷新重算、保留旧坐标数据 | `social-characters.js` 的入场选点、地形 / 占地检查；`src/main.js`；`src/character-drag.js` | `presence-results.json` 刷新检查；`action-interactions.json` 拖动检查；`regressions/valley-browser.json` |
| 列表打开收纳好友不召出，正在阅读的消息不触发短暂入场 | `social-ui.js`、`social-presence.js` | 场景机制检查与 `action-interactions.json` |
| 聚会遵守资格，新入场选择广场空位，保留 8 人容量 | `src/valley-social.js`、`social-characters.js` | `eligible-gathering.jpg`；`regressions/valley-browser.json`，含 8 人容量检查 |
| 红点四档 14–26px、99+、信封最多四层、一次来信强调 | `social-presence.js` 的 `unreadTier`；`social-ui.js`；`social-presence.css` | 策略测试；`unread-seven.jpg`、`unread-25.jpg`；消息突发测试 |
| 同一未读来源，头顶提示跟随坐卧姿态 | `social-store.js`、`social-ui.js`、`src/character-actions.js` 的姿态边界 | `actions/results.json` 的 anchor / bounds；32 张状态实拍；桌宠桥接回归 |
| 八种状态、进入 / 循环 / 退出、四角色形变配置 | `character-actions.js`；`src/companion-walk.js` | `actions/results.json` 的 32 个角色状态；四张角色对照图与 `state-actions.webm` |
| 拖动 > 聚会 > 聊天 > 状态 > 闲逛 | `social-characters.js` 的动作调度与安全占地；`character-actions.js` | `action-interactions.json`，4 项实际交互通过 |
| 坐卧接地、形变法线、姿态后点击与安全占地 | `character-actions.js` 的 GPU morph targets、法线与逐顶点支撑边界；`social-characters.js` 的休息点检查 | 32 种姿态的地面边界和射线命中检查；逐角色对照图人工检查 |
| 减少动态效果下保持静态姿态、停止跳跑摇摆和入场粒子 | `character-actions.js`、`social-characters.js`、`social-presence.css` | `actions/results.json` 的 reducedMotion 检查 |
| 收纳后停止动作更新，状态与消息不反复重建模型 | `social-characters.js` 的 actor cache、visible 分支与 activity 计数 | 浏览器检查隐藏后的 updates 不再增加；`performance.json` |
| 保留已完成的 Dock、浮层、发布分享与场景转场 | `src/ui-interactions.js`、`ui-theme.css` 及原有各模块 | `validation/interaction/`；本次相关好友、发现、标签、拖动、广场回归记录 |

## 验证与构建

- `npm run build`：通过，更新主应用构建；桌宠与角色审阅入口同时构建成功。
- `npm test`：现有数据、动态、发现及桌宠状态测试通过。
- `npm run test:presence`：策略 / 数据兼容测试与 10 项浏览器机制检查通过，浏览器错误列表为空。
- `npm run test:actions`：四角色 × 八状态共 32 种实拍及姿态检查通过；4 项拖动、聊天、直接已读、聚会动作优先级检查通过。
- 受影响的好友标签、拖动、发现阅读 / 播放 / 分享、广场聚会与桌宠桥接浏览器回归通过。广场回归含 12 项检查及 8 人聚会容量，结果见 `validation/presence/regressions/`。
- 截图与录像来自本地 Windows Edge。手机证据为窄屏与触摸模拟；没有声称在真实手机或 iOS Safari 上运行。

可复现命令：先 `npm start` 启动页面，再运行上述测试。浏览器测试使用仓库 `scripts/test-runtime.mjs`，可通过 `FOREST_TEST_URL` 指定服务；旧回归输出可通过 `FOREST_TEST_OUTPUT` 指定目录。动作截图和录像默认写入 `validation/presence/`。

## 同设备帧间隔对比

基线是本功能开始前的工作区 UI 快照，保存在 `validation/presence/baseline/`，包含上一轮交互重构。使用同一台机器、1440 × 1000、Edge D3D11、四位好友与暂停的故事时钟，串行运行，不录屏。负载为 6 秒稳定展示、100 条来信突发与八种状态切换。

| 负载 | 改造前中位数 / P95 | 改造后中位数 / P95 |
| --- | --- | --- |
| 稳定展示 | 16.7 / 16.8 ms | 16.7 / 16.8 ms |
| 消息突发与状态切换 | 16.7 / 16.8 ms | 16.7 / 16.8 ms |
| 所有好友收纳 | 未设置此基线 | 16.7 / 16.8 ms |

来源：`validation/presence/performance.json`，脚本 `scripts/compare-presence-performance.mjs`。这是受显示刷新率影响的帧间隔采样，不是 GPU 单帧耗时，也不能证明所有设备保持 60fps。新旧人物选位机制不同，因此人物具体位置不同；结果用于发现本机场景整体回退，不作为单独形变算法的因果性能结论。

## 明确限制与未验证项

- 坐卧和肢体动作是原有网格的风格化形变与姿态变换，未新增骨骼、真实关节或手指。原脸部纹理保持不变。静态图只能反映截图瞬间，节奏差异请结合录像查看。
- 自动检查涵盖姿态边界、射线点击、随机点资格和交互组合；未穷尽所有随机种子、所有树叶遮挡和任意数量好友的拥挤组合。不能将有限样本视为全地图无碰撞证明。
- 真实手机、软键盘在不同移动浏览器中的表现、Safari/WebGL 驱动差异及长时间耗电没有实测。独立桌宠窗口的动作系统按范围保持原状。
- 目录内保留了调试失败截图与原始录像；最终验收以此文列出的结果 JSON 和图集为准。

本次实现前同步并保留了远端桌宠未读通知与运行时修复；未改动消息存储结构，新增 `pinnedFriends` 对旧数据默认空数组。
