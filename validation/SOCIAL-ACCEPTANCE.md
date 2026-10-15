# 林间来信 · 首版验收

2026-10-15。本机 Windows + Codex 内置 Chromium，Three.js 本地网页。桌面和窄屏均实际操作，不能据此保证所有设备性能。

| 需求 | 实现 | 验证证据 |
|---|---|---|
| 四位动物好友 | social-store + Rodin GLB + social-characters | 四个真实资产正反面检查；social-assets-reviewed.jpg；生成2.0 credits |
| 搜索/添加/防重复 | 通讯录与 store.addFriend | 浏览器添加4位；ID搜索xiaomian；单元测试重复添加幂等 |
| 点击角色/气泡选中 | 三维拾取、光圈/轮廓、450ms镜头、气泡展开 | 浏览器直接点击兔子身体打开小眠会话；昵称/气泡均可打开 |
| 场景安全摆放 | 实际网格、头高范围、岸面支撑、通路与间距 | social-character-placement.json：4/8角色全部可放置，4个焦点视角各3条身体射线无遮挡 |
| 来信/未读/动画 | 预设演示、头顶气泡8秒、未读数、角色轻弹 | 浏览器添加后问候、文字与表情回复；未读按好友隔离单元测试 |
| 文字/Emoji/表情/图片 | 聊天输入、图片压缩、内置表情选择器 | 文字按钮及Enter发送；表情包发送/回复；上传background.jpg并发送；图片刷新仍显示 |
| 草稿与历史 | IndexedDB事务、延迟保存、每好友滚动位置 | 浏览器输入草稿关闭刷新后仍恢复；500条消息测试；跨好友读状态隔离 |
| 状态 | 8种心情、单个当前状态、24h过期、图片/正文 | social-status.jpg；浏览器发布个人照片状态；过期和清除由单元测试覆盖 |
| 朋友圈记忆球 | 按时间排序、图片/纯文字、详情 | social-meeting.jpg / social-moment.jpg；多条光球，展示签名 |
| 点赞/评论/他人互动 | 数据操作统一持久化，点赞动画 | 浏览器点赞2→3、取消3→2、再次点赞；评论成功；他人名字和评论可见 |
| 动态分享到聊天 | moment消息卡片 | 浏览器「聊聊这条」产生引用动态卡与预设回复 |
| 自己发布/个人资料 | 我面板、独立状态/朋友圈发布、个人光球 | 浏览器发布照片朋友圈并打开自己的光球；返回后好友动态归属正确 |
| 演示暂停/重播 | 前台倒计时、稳定事件ID、防重复 | 浏览器暂停/恢复；单元测试暂停、后台冻结、重播去重 |
| 移动布局 | 底部会客面板、聊天/记忆页签、上方角色 | 实际391×844 CSS窄屏无横向溢出；social-mobile.jpg |
| 性能 | 本地GLB、合批环境、历史分页80条、轻量效果 | 四角色桌面约60.0 FPS；窄屏520×1125约59.6 FPS；八角色1706×960约60.0 FPS。帧率为3秒窗口，非全设备承诺 |
| 既有场景 | 保持桥河和建筑尺寸 | layout-social.json严格检查通过；bridge-social.json passed=true |
| 错误与媒体 | 写入失败回滚、大小限制、草稿保留、异步文件版本 | 单元测试持久化失败、10MB限制、1600px压缩、Blob重开；浏览器最终无error日志 |

## 可重跑验证

```
npm run build
npm test
npm run audit:social
node scripts/audit-layout.mjs --out validation/layout-social.json --strict
node scripts/audit-bridge.mjs --out validation/bridge-social.json
```

测试依赖 fake-indexeddb 已列为 devDependency。`?stress=1` 只实例化8个角色并关闭演示调度，不写入八位测试好友；通过 viewport 的 data-stress-characters/data-fps 读取诊断。

## 边界与尚未实测项

- 是单浏览器本地原型，无真实微信接入、服务器、真人在线或AI回复。清除浏览器网站数据会清除个人内容。
- 新浏览器为空白好友列表；验收浏览器保留了四位好友和用于验证的少量消息、个人状态、朋友圈，便于立即体验。
- 示例朋友圈图片是用户参考图的局部裁剪，属于演示插画；真实照片上传已验证。
- 角色是Rodin生成的静态网格，呼吸/转向/轻弹为整体变换，没有骨骼动作。狐狸第二尾收拢、兔子和熊尾部缩短，原件与可重放修整脚本保留；局部背包尾根连接仍是生成模型质量，不声称手工精修级拓扑。
- 八角色完成实际渲染与站位检查，500条消息完成存储/隔离测试；尚未进行8角色叠加500条消息的长期浸泡测试。
- 减少动态偏好已实现CSS和相机/角色逻辑，本轮没有切换操作系统设置实测。中文输入法合成事件保护已实现，未自动化真实IME输入全过程。
- 图像失败、存储满、到期等边界以可控单元测试为主，不通过破坏真实浏览器数据模拟。

## 截图

- social-overview.jpg：四位朋友在溪谷。
- social-friends.jpg：带真实角色预览的通讯录。
- social-meeting.jpg：左聊天、中央角色、右记忆光球。
- social-moment.jpg：完整动态、点赞、评论。
- social-status.jpg：状态卡。
- social-mobile.jpg：窄屏记忆页。
- social-assets-reviewed.jpg：四模型正反面。
- social-stress.jpg：八角色性能场景。
