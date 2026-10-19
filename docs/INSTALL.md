# 安装 WeRoam

[项目首页](../README.md) / [文档索引](README.md)

直接下载安装包，无需克隆仓库、Node.js、JDK 或电脑运行服务。

| 平台 | 安装包 | 系统要求 |
| --- | --- | --- |
| Windows 桌面版 | [下载 EXE](https://github.com/szddddddd/Techathon2026/releases/download/v0.1.0-beta.1/WeRoam-0.1.0-beta.1-windows-x64-setup.exe) | Windows 10 / 11，64 位 x64，支持 WebGL 2 的显卡 |
| Android 手机版 | [下载 APK](https://github.com/szddddddd/Techathon2026/releases/download/v0.1.0-beta.1/WeRoam-0.1.0-beta.1-android.apk) | Android 8.0+，支持 WebGL 2 的系统 WebView |

[版本说明与全部下载文件](https://github.com/szddddddd/Techathon2026/releases/tag/v0.1.0-beta.1) · [SHA-256 校验](https://github.com/szddddddd/Techathon2026/releases/download/v0.1.0-beta.1/SHA256SUMS.txt)

## Windows

1. 下载 `WeRoam-0.1.0-beta.1-windows-x64-setup.exe`，双击安装。
2. 安装器为当前用户安装，创建桌面和开始菜单快捷方式，完成后启动 WeRoam。
3. 关闭主窗口会收进托盘；彻底退出请在托盘菜单选择“退出”。桌宠也从托盘管理。

安装器包含 Electron、网页和场景资源，不需要额外的 Node.js 或终端。当前 EXE 没有 Windows 发布者代码签名，Windows 可能提示“未知发布者”或 SmartScreen；请先核对下载来源与 SHA-256，再按系统提示决定是否运行。Android APK 的应用签名与 Windows 发布者签名是不同机制。

应用数据保存在 `%APPDATA%\WeRoam`。更新使用同一应用身份；卸载器默认保留本机数据，手动清理前请先备份。该版本没有后台自动更新功能，升级请从 Release 下载新安装器。

基础场景与本地消息无需服务密钥。可选头像服务的私有目录为 `%APPDATA%\WeRoam\.forest-avatar-data\`，配置文件名仍为 `image-config.json` 和 `hyper3d-config.json`；格式见[配置模板](../config/README.md)。Rodin 始终通过项目 REST 客户端读取该目录配置，不回退全局凭据。邮箱 Agent 的配置为 `%APPDATA%\WeRoam\.weroam-private\agent-config.cjs`，参考[Agent 说明](MAIL-AGENT.md)。安装包不预置生成服务或邮箱凭据。

## Android

1. 用手机打开上方 APK 下载链接，下载后点击安装包。
2. 若系统询问，允许本次下载来源安装应用，再确认安装。系统确认不能由应用跳过。
3. 从手机桌面打开 WeRoam，场景与本地消息演示可离线使用。

此 APK 使用既有 WeRoam Android 签名，`versionCode` 为 `1030106`。相同包名、相同签名且版本号允许时可覆盖安装，保留本机数据；签名不同的旧安装不能直接覆盖，卸载会删除数据，请先备份。手机与 Windows 数据各自独立。头像生成需要联网并在手机设置中填写自己的服务配置，安装包不携带开发者密钥。详见 [Android 指南](ANDROID.md)。

## 校验下载

在 Release 同时下载 `SHA256SUMS.txt`。Windows PowerShell 中执行：

```powershell
Get-FileHash .\WeRoam-0.1.0-beta.1-windows-x64-setup.exe -Algorithm SHA256
Get-FileHash .\WeRoam-0.1.0-beta.1-android.apk -Algorithm SHA256
```

将结果与清单对应行比较；手机可使用支持 SHA-256 的本地文件工具。`release-manifest.json` 另外记录构建版本、源码提交、文件字节数与校验值。

这是 beta 预发布，包含三个场景、好友与本地消息、收件箱演示、创意工坊以及各平台能力。尚未完成本次安装包的实体设备验收；既有模拟/浏览器结果不代表所有显卡、手机或系统版本兼容。
