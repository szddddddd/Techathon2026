# PICO 浏览器 VR

当前接入采用 WebXR，不需要安装手机 APK，也不需要串流软件。先在 PICO 浏览器里选择森林、富士樱町或理想城，再点击「进入 VR」，允许浏览器使用 VR。

## USB 连接（本地开发）

1. 电脑运行 `npm start`，保持服务开启。
2. 在头盔中开启开发者模式和 USB 调试，USB 连接电脑，在头盔里确认调试授权。
3. 电脑运行 `npm run pico:connect`，脚本只选择已授权的 PICO 设备，通过 ADB reverse 将电脑服务映射到头盔 localhost，然后打开链接。多设备可执行 `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/connect-pico.ps1 -Serial 设备序列号`。
4. 在头盔的 **PICO 浏览器**打开 `http://localhost:8080/?vr=1`（端口以脚本输出为准），选择场景并点击「进入 VR」。USB 转发期间保留连接。

脚本不自动打开开发者模式、不修改防火墙、不把包含本地生成 API 的开发服务暴露到局域网。撤销转发的命令在脚本执行后输出。

Wi-Fi 使用需要另外提供头盔信任的 HTTPS 站点；普通 `http://电脑局域网IP:8080` 不属于安全来源，不能据此承诺 WebXR 可用。不要通过关闭浏览器安全检查替代 HTTPS。发布到外网前需单独处理身份验证与生成服务凭据；本次没有部署公网服务。

## 交互和范围

- 以三维沙盘方式观察完整场景，双眼立体、头部追踪；无自动移动或连续摇杆移动。
- 手柄扳机选择 VR 面板中的「缩小、放大、回正、退出 VR」，侧握键收起或重新放置面板。面板为真正的三维几何与 Canvas 纹理，不依赖 DOM Overlay。
- 系统退出 VR 同样恢复进入前的镜头、投影和 OrbitControls；退出后可以切换三个场景、使用消息、工坊等原有面板。聊天和 HTML 世界标签尚未迁移为 VR 空间界面，VR 中隐藏它们；这不是完整的 VR 社交客户端。
- 进入 VR 前需关闭聊天等面板、退出漫游/交通跟随并完成人物安放；沉浸期间禁止场景切换。
- 复用同一个 Three.js renderer、场景、角色和资产缓存。仅创建两个手柄射线与一个控制面板，退出时释放其几何、纹理、材质和监听；不减少原有场景内容、贴图或几何质量，不启用额外降低边缘分辨率的固定注视点渲染。
- 渲染统一由 `renderer.setAnimationLoop` 驱动，使用头盔会话的帧调度；不与原有 RAF 形成双重循环。VR 中暂停普通相机动画及 HTML 更新，昼夜和角色继续运行。

## 验证边界

`npm run test:webxr` 检查模拟 WebXR 会话的拒绝授权、启动失败、重复点击、头部姿态/缩放、系统退出、资源释放，以及普通浏览器下三个场景和移动视口的回归。模拟测试不代表 PICO 实机支持、双眼画面质量、控制器映射、帧率或舒适度已通过。

当前电脑未检测到 ADB 连接的 PICO，未完成实体头盔验收。还需记录具体型号、PICO OS / 浏览器版本，在实机验证进入/退出、跟踪丢失恢复、左右手柄、画面裁切、连续五轮进入退出及实际帧耗时。浏览器运行时若不支持 `immersive-vr` 或 `local-floor`，界面应给出错误并保持原场景可用。

2026-10-18 本地验证：构建、`test:webxr`、`test:camera`、`test:mobile:rendering`（八角色画面、五轮切换、缓存与草稿）、昼夜单元检查通过。结果见 `.test-results/webxr.json`，普通浏览器截图见 `.test-results/pico-browser-desktop.jpg` 与 `pico-browser-mobile.jpg`。昼夜浏览器完整回归仍在理想城的音乐入口点击项失败：邮箱标签拦截点击；使用 Git HEAD 的旧主入口、当前依赖构建对照也在相同位置复现，不能把整套昼夜浏览器回归标记通过。当前记录与旧主入口对照分别保留在 `.test-results/pico-daynight-current.json`、`pico-daynight-baseline.json`。

技术依据：[PICO Web API](https://developer.picoxr.com/document/web/web-api/)、[PICO：传统图形界面与 XR 的区别](https://developer.picoxr.com/document/web/introduce-cross-platform/)、[WebXR 规范](https://immersive-web.github.io/webxr/)、[Three.js WebXRManager](https://threejs.org/docs/pages/WebXRManager.html)。PICO 官方网站部分正文抓取会重定向，实际能力始终以头盔的 WebXR 能力检测及实机验证为准。
