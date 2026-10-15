# 森林交互重构验收

本次保留三维森林与暖白、绿色的视觉气质，完成主应用的 macOS 理念交互重构。源码与 `dist/world.js` 已同步构建。独立桌宠窗口、三维模型和 IndexedDB 数据结构保持原有实现。

## 要求 → 实现 → 证据

| 要求 | 实现位置与行为 | 验证证据 |
| --- | --- | --- |
| Dock 待机收起 | `src/ui-interactions.js`：首次 3 秒、之后 2.5 秒；主面板、悬停和焦点期间保持展开；未读仅亮点 | `validation/interaction/results.json`、`edge-results.json`；桌面待机与 Dock 截图 |
| 鼠标、键盘、触摸唤出 | 至少 44px 唤出区域；四个统一 SVG 图标、选中状态、悬停与按压反馈 | 同上，包含真实浏览器触摸输入及 320px 宽度检查 |
| 人物状态从来源展开 | `src/social-ui.js`：独立状态浮卡、屏幕边界避让、手机底部布局；镜头拖动时收起 | `desktop-status.jpg`、`mobile-status.jpg`、`mobile-long-status.jpg` |
| 连续打开与反向关闭 | `src/ui-interactions.js`：320ms 展开、220ms 收起、来源矩形 FLIP、内容延后出现、可取消动画与四态生命周期 | 快速开关测试；`motion-performance.json` 记录连续 6 次打开关闭后没有运行中的动画 |
| 单个主工作区与子层 | 好友、聊天、朋友圈、发现和我互斥；发布、编辑资料、分享和图片采用独立子层；Esc 每次关闭一层 | `results.json`、`edge-results.json`；`desktop-compose.jpg` |
| 草稿和位置保留 | 聊天草稿沿用原存储；资料、发布照片及文字、分享内容保留本次会话草稿；普通发现与场景发现分别保存会话 | 新增测试及 `regressions/discovery-browser.json`、`regressions/one-click-browser.json` |
| 全部主界面统一材质 | `ui-theme.css` 集中管理玻璃、圆角、边框、阴影、标题栏、控件和状态；删除旧文件中重复 Dock 规则 | 桌面聊天、朋友圈、发现与手机截图已实际检查 |
| 场景交互兼容 | 广场浮层接入共享生命周期；发现设施保留原镜头与框架转场；桌宠入口继续原桥接 | `regressions/valley-browser.json`、`regressions/character-drag.json`、`regressions/one-click-browser.json`；桌宠桥接测试通过 |
| 无障碍与窄屏 | 焦点恢复、来源展开状态、减少动态效果、VisualViewport 高度响应、模糊不支持时的实色样式 | 900×700、391×844、391×480、320×640 及旋转测试；减少动态效果测试 |
| 长内容与失败处理 | 状态卡滚动、固定关闭栏、照片失败占位；状态来源消失后关闭并回到可用入口 | `edge-results.json`，缺图与长文截图 |

## 验证结果

以下检查均通过：

- `npm run build`、`npm test`、`git diff --check`。
- `node scripts/test-ui-interactions.mjs`：11 组交互检查，无页面脚本错误。
- `node scripts/test-ui-edge-cases.mjs`：7 组触摸、表单提交、长内容、来源消失、草稿和窄屏检查，无页面脚本错误。
- `npm run test:anchors`：人物标签逐帧跟随、稳定避让、状态与聊天点击语义。
- `npm run test:browser`：文章、关注收藏、评论分享、视频实际播放与进度、失败重试、刷新与手机布局。
- `npm run test:boards`：设施转场、镜头恢复、草稿、延迟媒体加载、快速切换和旋转。
- `npm run test:drag`、`node scripts/test-valley-browser.mjs`：真实人物拖动、触摸、保存回退、聚会、山坡与八角色容量。
- `npm run test:desktop-bridge`：桌宠入口、未读同步和好友返回；不启动或改写用户原有桌宠会话。

测试使用独立浏览器上下文与测试数据。浏览器回归采用 Windows Edge/D3D11；`PLAYWRIGHT_MODULE` 可覆盖新增测试的 Playwright 模块位置。

## 性能证据

同一台机器、1440×1000、四位好友、暂停自动故事、无视频录制：

| 场景 | 重构前帧间隔中位数 / P95 | 重构后帧间隔中位数 / P95 |
| --- | --- | --- |
| 静置采样，各 175 帧 | 16.7 / 16.8 ms | 16.7 / 16.8 ms |
| 连续六次状态展开收起 | 16.7 / 16.8 ms | 16.7 / 16.8 ms |

连续操作对比直接使用 Git 基线 `7f23cfbbb3e3976bd159478f6e0b0860fab88b7e` 的 HTML、CSS 和构建文件，与当前实现串行测量，共分别采集 928、894 帧。两者结束后的运行中动画数均为 0。该结果支持本机本场景未观察到明显帧耗退化，不代表所有设备均能达到 60fps。

数据见 `before-performance.json`、`after-performance.json` 与 `motion-performance.json`。复测：`node scripts/compare-ui-motion.mjs`；此脚本默认以当时的 Git HEAD 为旧实现，提交后 HEAD 的含义会改变。

## 交付与边界

[打开截图与录像页面](validation/interaction/index.html)。`interaction-tour.webm` 包含 Dock、状态、照片、发布子层、主面板切换、聊天和手机布局；原始录像与已排查的失败截图保留在同目录中，最终通过结果以 `results.json`、`edge-results.json` 和 `regressions/` 为准。

已实际查看桌面、手机、窄屏、长状态和缩短视口的截图。未在真实 iPhone/iPad、Safari 或低性能设备验证；软键盘以缩短视口与 VisualViewport 实现检查，尚无真实手机软键盘录屏。无背景模糊支持时已提供实色样式，但本机浏览器支持模糊，未做旧浏览器实测。独立桌宠原生窗口不是本次重构范围，本次验证的是主应用入口与桥接。
