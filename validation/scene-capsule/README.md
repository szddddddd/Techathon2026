# 顶部场景分段胶囊交付记录

已实现固定双名称、可拖动的暖白玻璃胶囊。取消旧场景卡片窗口、展开计时器和全屏文字加载幕。

| 设计条目 | 实现位置 | 验证证据 |
| --- | --- | --- |
| 双名称、朦胧场景底纹、桌面 244×48 / 手机 220×48 | `src/scene-switcher.js`、`scene-switcher.css` | `desktop.png`、`mobile.png`、`capsule.png` |
| 6px 拖动阈值、中点选择、松开提交、取消与回弹 | `src/scene-switcher.js` Pointer Events | `component.json`；`drag-scene-switch.webm` |
| 点击、方向键、Home/End、单选语义、44px 目标 | `src/scene-switcher.js`、`scene-switcher.css` | `component.json`，含 CDP 触摸拖动 |
| 模态禁用、忙碌阻止重复、外部切换同步 | `src/scene-switcher.js`、`src/main.js` | `component.json`、`app-edge-cases.json` |
| 旧场景保留至准备完成、约 220ms 画布交接、胶囊内加载及失败重试 | `src/main.js`、`scene-theme.css` | `app-edge-cases.json`、`app-error.png` |
| 聊天、草稿、附件、未读与阅读位置保持，往返后无重复场景节点 | `src/main.js`，沿用既有数据与场景生命周期 | `regression/browser.json` |
| 减少动态效果、释放事件与控件 | `src/scene-switcher.js`、`scene-switcher.css` | `component.json` |

## 已运行

- `npm run build`；构建输出位于 `dist/`。
- `npm test`。
- `node scripts/test-scene-capsule.mjs`。
- `node scripts/test-scene-edge-cases.mjs`。
- `FUJI_VALIDATION_DIR=validation/scene-capsule/regression node scripts/test-showa-browser.mjs`。
- `node scripts/record-scene-capsule.mjs`。
- `git diff --check`。

上述数据与浏览器检查通过。录像记录三次真实拖动切换，1440×1000、19.76 秒，已解码抽帧检查，见 `video-check.json`、`video-frame.png`。截图为实际运行结果。

手机证据使用 Edge 浏览器 391×844 模拟与 CDP 触摸输入；真实手机与其他浏览器未实测。录制为实时运行，场景准备时间取决于本机与资产缓存。
