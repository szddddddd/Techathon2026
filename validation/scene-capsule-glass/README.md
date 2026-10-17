# 玻璃滑动场景胶囊

顶部控件采用半透明磨砂轨道、内侧亮边、柔和阴影与玻璃滑块。滑块携带唯一的场景图标和名称，在桌面上有 64px、391px 手机模拟下有 52px 的实际滑动行程。松开时按中点吸附；未越过中点回到原场景。

- 实现：`src/scene-switcher.js`、`scene-switcher.css`。
- 构建及组件交互检查通过；检查滑块真实位置跟随、边界约束、双向滑动、取消、触摸、键盘和减少动态效果，见 `component.json`。
- 实际场景往返、加载失败恢复、加载期间两套悬浮入口隐藏均通过，见 `app-edge-cases.json`。
- `desktop.png`、`mobile.png`、`capsule.png`、`capsule-forest.png` 为实际运行截图。
- `drag-scene-switch.webm` 为三次真实场景滑动切换录像。

未进行真实手机实测。
