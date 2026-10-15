# 场景内容图标与 Hyper3D 订阅

| 需求 | 实现位置 | 验证证据 |
| --- | --- | --- |
| 公众号、视频号在场景中显示图标 | `src/discovery-scene-icons.js`、`src/discovery-scene.js`、`discovery-social.css`：图标跟随对应设施，显示当前内容标题；44px 以上点击区、边缘避让、键盘操作、返回焦点 | `validation/hyper3d/scene-icons.jpg`、`mobile-icons.jpg`、`results.json` |
| 点击后沿用场景转场 | `src/discovery-boards.js` 现有镜头与窗口时间线；图标复用原入口 | 图标浏览器检查；`validation/hyper3d/regression/one-click-browser.json`，9 项通过 |
| 公众号只展示 Hyper3D | `src/discovery-catalog.js` 的 `JOURNAL_ACCOUNTS` / `JOURNAL_ARTICLES`；`src/discovery-ui.js` 默认订阅页 | 仅一个公众号、三张 Hyper3D 内容卡；`subscriptions.jpg`、`mobile-subscriptions.jpg` |
| 当前订阅切换为仅 Hyper3D | `src/social-store.js`：首次切换时写入 `accountFeedVersion:1` 与 `accountFollows:['hyper3d']`，之后保留正常关注操作 | 旧订阅迁移测试与持久化测试；当前浏览器界面已显示 Hyper3D 已订阅 |
| 场景实体中的预览同步内容 | `src/discovery-previews.js`：公众号报刊页的首篇及其他标题使用 Hyper3D 内容 | 检查预览 `contentId` 与图标标题；场景转场回归 |
| 清楚区分图文与视频 | `discovery-ui.js` 内容卡的图文 / 视频类型标记；场景图标分别使用报刊和播放图形 | 列表与视频截图 |
| 旧收藏、分享保持可用 | 原有 9 篇本地文章保留稳定 ID，通过旧收藏、历史或分享仍可打开；从当前公众号推荐流收起 | 迁移检查保留 `article:article-1` 收藏；原有文章、视频和分享数据测试 |
| 团团保持置顶 | 沿用现有 `pinnedFriends` 保存值，没有修改好友关系或聊天记录 | 当前浏览器显示“团团 置顶好友”；迁移检查确认置顶值保留 |

## 内容来源

本次展示三篇中文资料摘要，依据 2026-10-15 查阅的 Hyper3D 官方资料整理，每篇保留官方原文链接，页面标明“官方资料摘编”。封面由项目 SVG 制作。没有冒充官方微信公众号的原文，也没有接入微信账号或实时抓取服务。

- [Rodin：从创意到三维资产](https://docs.hyper3d.ai/en/get-started/features)
- [把 Rodin 带进 Blender 创作流程](https://docs.hyper3d.ai/en/addons/blender-addon)
- [Hyper3D 与你的 3D 工具连接](https://docs.hyper3d.ai/en/addons)

摘要与来源保存在 `src/hyper3d-content.js`，封面在 `assets/discovery/hyper3d-*.svg`。资料摘编日期没有伪装成官方文章发布日期。

## 检查

`npm test` 和 `npm run build` 通过；`scripts/test-discovery-scene-icons.mjs` 的 5 组检查通过，涵盖图标可访问性、点击、键盘、焦点返回、Hyper3D 列表、旧订阅迁移、置顶与收藏保留以及 391px 手机尺寸。

受影响的 `test-discovery-browser.mjs` 和 `test-discovery-boards.mjs` 通过，覆盖阅读字号、点赞、收藏、评论、聊天 / 朋友圈分享、视频实际播放、进度、暂停、迟到的网络请求、重试、快速切换、返回和手机旋转。浏览器错误列表均为空。

截图来自 Windows Edge；手机为窗口与触摸目标尺寸检查，真实手机没有实测。相关检查数据和截图均在 `validation/hyper3d/`。
