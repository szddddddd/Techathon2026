# 群聊建筑：按未读绑定

已在森林、富士樱町统一启用。九栋建筑始终保留；群身份、标签、未读与轮廓独立于建筑外观。

| 要求 | 实现位置 | 验证证据 |
| --- | --- | --- |
| 未读排队、同轮固定位置、已读关闭后 800ms 等待和 220ms 淡出、再来信反转 | `src/group-presence.js` | `data.json`、`browser.json` |
| 置顶优先、九群上限、最新非置顶绑定让位、旧数据迁移与分场景位置保存 | `src/group-store.js`、`src/social-store.js` | `data.json`、`browser.json` |
| 九栋建筑保留，无绑定时没有名称及会话点击目标，按类型替换外观 | `src/group-scene.js` | 六张桌面截图、浏览器真实建筑可见性与点击检查 |
| 候场消息板只显示等待中的未读群，空闲打开通用群列表 | `src/group-message-board.js`、`src/group-ui.js` | `browser.json`；全部已读时消息板 latestId=null |
| 图片、表情、分享、群资料、草稿和历史阅读位置 | 现有群聊窗口与资料界面 | `full-flow/browser.json` |

## 已运行

- `npm run build`
- `npm test`
- `node scripts/test-group-chat.mjs`
- `node scripts/test-group-scene.mjs`
- `node scripts/test-group-bindings-browser.mjs`
- `node scripts/test-group-browser.mjs`

单元检查覆盖：未读 FIFO、同时间 ID 排序的实现、读完聊天保持、关闭释放、淡出反转、候场群阅读不召出、置顶腾位、忽略旧常驻记录、九群上限原子拒绝、取消置顶、退出、刷新与旧数据迁移。未读列表和排序仅在业务状态更新时重新计算。

浏览器检查：两个场景分别验证全部已读、两群未读、置顶已读常驻、刷新恢复；跨场景空群置顶与位置恢复、391px 目标尺寸、无绑定建筑不打开群聊、退出后保留建筑。主流程验证图片和分享发送、草稿附件隔离、@所有人、历史浏览时新消息继续未读、移动端返回及模型失败回退。

## 截图

- [森林：全部已读](forest-all-read.png) / [未读绑定](forest-unread.png) / [置顶常驻](forest-pinned.png)
- [富士：全部已读](fuji-all-read.png) / [未读绑定](fuji-unread.png) / [置顶常驻](fuji-pinned.png)
- [手机模拟：置顶空群](fuji-pinned-mobile.png)

验证环境为 Windows Edge 桌面和手机尺寸模拟；未进行真实手机实测。本轮未重新验证与群绑定无关的模型资产生成质量。
