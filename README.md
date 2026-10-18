<div align="center">

# WeRoam

**版本 v0.1 beta**

### 让每一次聊天，都有一处风景。

把微信带进三维世界，让熟悉的社交，多一份相伴的美好。

**一起聊天 · 一起漫游 · 一起看世界**

</div>

![WeRoam 三维世界：林间来信、富士樱町与理想城，均为产品实机画面](docs/images/weroam-worlds.jpg)

## Universal Inbox 产品 Demo

消息页现可统一查看原好友、群聊与外部示例，提供连接权限、待回复助手、来源引用、手动收录和逐次确认模拟发送。

启动项目后打开 [本地收件箱演示](http://localhost:8080/?scene=forest&inbox=1)，在“体验示例”中主动加载合成消息。网页版在本机模拟外部操作；受限社交来源只能收录、复制草稿和返回原应用。

桌面版支持 QQ／163 只读邮箱接入，以及需单独授权的“邮箱 Agent”：选取邮件后可对话、摘要、提取待办及生成本地回复草稿，不发送或修改远端邮件。QQ 此前连接成功，163 仍待真实账号验收；[Agent 使用说明](docs/MAIL-AGENT.md) · [验证记录](docs/MAIL-AGENT-VALIDATION.md)。

通讯录按软件记录好友和群聊；新增好友上传头像后沿用现有流程自动生成三维形象（使用生成服务额度）。四个初始角色也分别标记来源软件。

[架构、演示步骤与验证说明](docs/UNIVERSAL-INBOX.md) · `npm run test:inbox` · `npm run test:inbox:browser`

## 创意工坊与 Mod

底部创意工坊替代原“发现”。朋友圈、公众号、视频号默认已安装，便签和专注计时可一键安装使用；支持启用、停用、固定及卸载，内容保存在本机。公众号或视频号停用时，对应三维设施一起隐藏。

[本地工坊预览](http://localhost:8080/?scene=fuji&workshop=1) · [使用与验证说明](docs/WORKSHOP.md) · `npm run test:mods` · `npm run test:mods:browser`

## 安卓安装版

`npm run android:build` 生成可直接安装的 `downloads/WeRoam-v0.1-beta-android.apk`；`npm run android:download` 提供局域网扫码下载页。完整保留三场景资源，消息与草稿保存在手机；手机版暂不连接新头像的三维生成服务或 Windows 桌宠。

[安装、构建与验证范围](docs/ANDROID.md) · `npm run test:android`

[手机性能优化与测量说明](docs/MOBILE-PERFORMANCE.md) · `npm run test:mobile:performance`

## 好友就在身边，聊天就在风景里

| 遇见好友 | 走进群聊 | 分享日常 |
| :---: | :---: | :---: |
| 头像化为三维伙伴，点一下就能聊。 | 一栋建筑，一个群聊，一处相聚的地方。 | 看文章、听音乐、分享视频，让话题自然发生。 |

## 今天，想在哪里见？

| 林间来信 | 富士樱町 | 理想城 |
| :---: | :---: | :---: |
| ![森林、溪流与好友聚集的浮空岛](docs/images/forest.jpg) | ![富士山、樱花街区与观景列车](docs/images/fuji.jpg) | ![中央巨塔、城市群、双层公路与飞艇](docs/images/ideal.jpg) |
| 听溪水，坐一会儿。 | 追着落樱，搭一班列车。 | 穿过楼群，乘飞艇去看远方。 |

换一处风景，好友、群聊和未说完的话都还在。

## 从日光，到星光

![WeRoam 三个场景的实际夜景：森林月光、樱町灯火与理想城科技灯带](docs/images/weroam-nights.jpg)

**12 分钟，看世界走过一天。** 也可以把时间停在你喜欢的白天、黄昏或夜晚。

## 让陪伴，离你近一点

拖动伙伴，找个舒服的位置；召集好友，在树下相聚。离开场景，还有桌宠陪着你。

---

<div align="center">

**WeRoam · 我们一起，去有风景的地方。**

</div>

<details>
<summary>开始本地体验</summary>

Windows 安装 Node.js 22+，双击 **启动 WeRoam.cmd**；桌宠使用 **启动桌宠.cmd**。

或在项目目录运行：

```bash
npm install
npm run build
npm start
```

打开 [localhost:8080](http://localhost:8080/)。

</details>

<sub>当前为本地交互原型；微信账号与消息接入是产品方向。以上图片均为实际运行画面。</sub>
