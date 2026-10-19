# WeRoam Android 演示版

[项目首页](../README.md) / [文档索引](README.md)

本版本将当前三维主应用打包为独立 APK，支持 Android 8.0（API 26）及以上、具备 WebGL 2 的设备。Android 构建保留模型几何，内嵌贴图限制为最长边 512 像素，降低贴图细节以控制解码和 GPU 内存；桌面资源不变。手机禁用 MSAA 和动态阴影，像素比上限为 1；切换场景保存草稿后重载页面，避免同时保留两套场景缓存。真实手机的帧率和厂商兼容性仍需实机验收。

## 安装

当前版本 `v0.1 beta`（versionCode `1030105`）包含手机性能优化和本地密钥配置入口。只有使用相同签名时才能覆盖安装并保留手机本地数据；缺少旧签名文件的新机器不能保证覆盖已有安装。[优化与验收说明](MOBILE-PERFORMANCE.md)。

执行 `npm run android:build` 后，安装包位于 `downloads/WeRoam-v0.1-beta-android.apk`，同目录提供 SHA-256 校验文件。

执行 `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/start-android-download.ps1` 自动选择当前活动网卡并在 8082 端口生成二维码；或运行 `npm run android:download` 并手动指定 `WEROAM_DOWNLOAD_URL`。用手机扫描下载页二维码或打开终端列出的局域网地址。电脑和手机需要处于可以互访的网络；校园网隔离、Windows 防火墙可能阻止访问，脚本不会改动防火墙。也可以通过 USB 将 APK 复制到手机。

下载后打开 APK，按 Android 系统提示允许当前来源安装，再点击安装。系统确认不能由应用跳过。此版本使用本机独立签名，不依赖应用商店。

## 已实现与边界

- 三场景、昼夜、触控旋转与双指缩放；现有消息、通讯录、群聊、设置与 Universal Inbox 演示。
- 本地 HTTPS 资产来源使用 AndroidX `WebViewAssetLoader`，不依赖桌面 `localhost:8080`，支持 IndexedDB、Worker、加密摘要与本地媒体。
- 返回键先关闭最上层弹窗；从外部消息阅读页返回消息列表，草稿保留；场景根页面再返回时确认退出。
- Android 系统选图器导入头像和截图，无需请求全盘存储权限。软键盘、状态栏和屏幕缺口由原生容器调整可用视口。
- 横竖屏切换保留 WebView；后台暂停 WebView 与计时器，前台恢复。渲染进程被系统释放时提供重新打开入口。
- 手机独立调用生图和 Rodin：在「我 → 设置 → 模型服务配置」填写图片服务 HTTPS Base URL、模型、尺寸、图片 API Key 和 Hyper3D Rodin API Key。密钥使用 Android Keystore AES-GCM 加密存储，保存不会发起付费请求，也不代表服务凭据已验证。发布包不携带开发者密钥。已有密钥留空可保留，更换图片服务地址须重新填入密钥。清除配置不删除好友，但会阻止后续生成请求。
- Universal Inbox 继续是本地合成/手动数据演示，不会读取微信、QQ、抖音、小红书或真实邮箱；Agent 为本地脚本。
- Windows 独立桌宠不在 Android 上启动或轮询。原文章/平台的链接通过明确点击交给系统浏览器，外部页面不进入带本地存储的主 WebView。
- 本机 APK 与电脑网页的数据独立，不自动同步；卸载会删除手机内的数据。

## 构建

原生工程在 `android/`，使用 AGP 8.13.2、Gradle 8.13、JDK 17+（本机为便携 JDK 21）、Android SDK 36、Build Tools 35.0.0。

桌面图标使用 Android 自适应图标：透明 WeRoam 图案与铺满边缘的浅色背景分层，去除原图外圈白色留白及旧式图标的额外缩放。`scripts/build-android-icons.mjs` 从原始品牌图可重复生成图标，APK 构建时自动执行；不修改网页品牌原图。

本机工具位于被忽略的 `.cache/android-tools/`。其他机器可通过 Android Studio 安装 JDK/SDK，并设置 `JAVA_HOME`、`ANDROID_HOME`；Gradle 可通过工程 wrapper 下载。首次安装 SDK 时需要阅读并接受 Google 的 SDK 许可。

```powershell
npm ci
npm run android:build
npm run android:download
```

`scripts/build-android-web.mjs` 只复制白名单内的 HTML/CSS/脚本、运行时模型与媒体。排除 Node 服务、桌面程序、用户数据、`.blend` 源文件和私有配置；同名旧资源会校正，白名单外的陈旧文件会移除。完整资产清单及哈希写入 `.cache/android-assets.json`。

首次构建生成 `.android-signing/weroam-demo.p12` 和 `signing.properties`，均被 Git 忽略。**请单独备份两个文件**；后续更新必须使用同一签名，并增加 `android/app/build.gradle` 中的 `versionCode`。签名不完整时脚本直接报错，不会自动替换身份。

## 验证

- `npm run test:android`：对实际打包的资源启动触屏浏览器，检查原始资产哈希、三场景、消息阅读/返回/草稿、头像本地保存、短视口、旋转、刷新持久化和无隐私外发。
- `npm run test:inbox:browser`：原网页的收件箱、权限、会话、跨软件通讯录和群聊回归。
- 原生测试 `android/app/src/androidTest/.../SmokeInstrumentation.java` 运行在安装好的正式构建 APK 中，检查安全来源、WebGL 启动、消息草稿、返回和三个场景。

本机已在 Android 15（API 35）模拟器安装签名 APK，验证三场景、消息草稿返回、系统选图器和头像本地保存。理想城在模拟器上加载较慢，尚未取得实体手机的帧率、温升及内存验收数据。浏览器端移动回归和既有消息/通讯录回归通过；截图与结果保存在 `.test-results/android/` 和 `.test-results/android-native/`。

```powershell
# 使用已配置的 JDK/SDK
cd android
.\gradlew.bat assembleReleaseAndroidTest
adb install -r app/build/outputs/apk/release/app-release.apk
adb install -r app/build/outputs/apk/androidTest/release/app-release-androidTest.apk
adb shell am instrument -w app.weroam.mobile.test/app.weroam.mobile.SmokeInstrumentation

# 可选交互验收：在系统选图器中点击 weroam-native-test 图片
adb shell am instrument -w -e quick true -e picker true app.weroam.mobile.test/app.weroam.mobile.SmokeInstrumentation
```

测试使用专用模拟器，不会访问真实平台或生成新模型。触屏浏览器测试不能替代原生测试；模拟器通过也不等于已验证每一台实体手机的流畅度。

## 技术依据

- [Android 官方：加载应用内内容](https://developer.android.com/develop/ui/views/layout/webapps/load-local-content)
- [Android 官方：AGP 8.13 的构建环境要求](https://developer.android.com/build/releases/agp-8-13-0-release-notes)
