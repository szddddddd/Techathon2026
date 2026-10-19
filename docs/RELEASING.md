# 构建与发布安装包

[项目首页](../README.md) / [文档索引](README.md) / [用户安装指南](INSTALL.md)

Windows 安装器使用固定版本的 electron-builder / NSIS；Android APK 使用仓库 Gradle 工程与本机签名。两者共享 `package.json` 版本与 Git Release 标签，安装包和私密签名均不提交到源码仓库。

## 准备与构建

在 Windows 安装 Node.js 22+，Android 工具要求见 [Android 构建指南](ANDROID.md)。更新版本时同步修改 `package.json`、锁文件、Android `versionName` 和递增的 `versionCode`，并准备 `docs/releases/v<version>.md`。

```powershell
npm ci
npm run desktop:build
npm run android:build
```

桌面产物位于 `output/releases/WeRoam-<version>-windows-x64-setup.exe`，Android 产物位于 `downloads/WeRoam-<version>-android.apk`。桌面安装为当前用户、创建快捷方式、默认保留卸载后的用户数据。Windows 代码签名未配置，不应将 Android 签名描述为 Windows 认证。

桌面打包仅收录运行源码、bundle、生产依赖与运行资产扩展名；不包含本机私有目录、签名、缓存、测试结果、演示文稿或 `.blend` 源文件。打包配置位于 `config/electron-builder.cjs`。开发端仍从仓库的私有目录读配置；已安装桌面端使用自己的应用数据目录，规则见[安装指南](INSTALL.md)。

Android 必须保留 `.android-signing/weroam-demo.p12` 和 `signing.properties`，新版本沿用相同签名才能覆盖安装。不要上传这两个文件，也不要重新生成身份来绕过缺失的签名。APK 构建完成后脚本自动运行 `apksigner verify`。

## 发布

检查本次改动与打包内容、提交并推送 `main` 后，生成与干净源码提交对应的清单：

```powershell
npm run release:checksums
python scripts/publish-release.py
```

清单将 APK 复制到 `output/releases/`，计算两个安装包的 SHA-256，并记录当前源码提交。上传脚本默认创建草稿，上传安装器、APK、`SHA256SUMS.txt` 和 `release-manifest.json`，逐个比较 GitHub 返回的大小和摘要。

明确发布使用：

```powershell
python scripts/publish-release.py --publish
```

脚本使用当前 GitHub 的 `GH_TOKEN` / `GITHUB_TOKEN` 或 Git 凭据助手；凭据只在内存中使用，不打印或写入文件。已有公开版本不会被覆盖；草稿只复用哈希一致的已上传文件。全部必需文件上传完成后才公开 Release。带连字符的版本号发布为预发布，因此下载入口使用明确版本链接，不依赖 `/releases/latest`。

若网络无法上传单个大文件，可运行 `python scripts/publish-release.py --stage-parts`。脚本把每个包以 16 MiB 分段上传到草稿，再手动触发 `assemble-release.yml`（输入相同版本标签、从 `main` 运行）。Actions 校验源码提交、分段与整包哈希，在 GitHub 中上传完整安装包，确认两个包无误后删除临时分段；最后再运行 `--publish`。该流程仅使用仓库的临时 GitHub Token，不需要上传 Android 签名密钥。

本机脚本生成的草稿与本次用户明确要求发布的版本，可按已授权范围公开。后续发布仍须遵循当次用户指令。
