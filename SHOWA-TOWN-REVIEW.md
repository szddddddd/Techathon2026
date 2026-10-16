# 富士樱町：紧凑昭和街区与轻风落樱

本轮复用现有建筑、富士山、两种樱花和列车资产，未提交新的 Rodin 或生图任务。

## 完成内容

- 九个群聊地块保持原编号，按北侧四栋、南侧三栋、站前后街两栋重新布置。三个常设小店填入生活街和站前，神社与聚会庭院连入后巷。
- 沥青主街与浅石入口形成连续路网，补充路缘、排水沟盖和停车凹位。道口、列车路径与车站位置保持。
- 24 棵樱花按铁路 7、站前 6、巷口 5、后巷神社 6 重新组织，使用两种树冠、不同高度、朝向和轻微材质色差。
- 空中落瓣上限桌面 160、窄屏 80；地面 1,200 片积瓣沿树下与路缘分布。两批实例化几何使用现有动画循环。
- 聚会树改为稳定 ID；人物聚会与镜头均使用新庭院坐标。旧人物位置失效时，优先在附近寻找安全位置。
- 修复密集街区中人物消息气泡遮挡公共入口的问题：富士场景按完整标签尺寸避让公众号、视频号、唱片机和车站图标。

## 设计条目 → 实现位置 → 验证证据

| 条目 | 实现位置 | 证据 |
|---|---|---|
| 错落建筑、道路、入口、停车、设施与树木共用布局 | `src/fuji-layout.js`、`src/fuji-streets.js` | `validation/showa-town/fuji-plan.jpg`、`fuji-overview.jpg`、`fuji-street.jpg` |
| 连续沥青铺装、石铺支巷、排水与树冠材质 | `src/fuji-scene.js` | 桌面及街巷近景；全部 17 个既有模型加载成功 |
| 实际模型占地与通行 | `scripts/test-showa-assets.mjs`、`scripts/test-showa-layout.mjs` | `assets.json`、`geometry.json`：323 个道路采样通过，九人聚会位置可用，列车仍停靠 8 秒 |
| 落瓣、地面积瓣、屋顶承接 | `src/sakura-petals.js` | `petals.json`：屋顶上方树冠的专项用例；`showa-town-petals.webm` |
| 减少动态效果、后台暂停、场景释放 | `src/sakura-petals.js`、`src/scene-world.js` | `petals.json`、`browser.json`：时钟冻结、实例批次与连续切换检查 |
| 新庭院聚会、建筑聊天及公共入口 | `src/social-characters.js`、`src/valley-social.js` | `browser.json`：九位好友在新庭院聚会并返回，建筑打开正确群聊，三个公共入口可点击 |
| 消息气泡与公共入口避让 | `src/social-ui.js`、公共设施投影接口、`scene-theme.css` | 浏览器实际点击回归通过，无强制点击绕过遮挡 |
| 草稿、附件、阅读与场景切换 | 现有场景生命周期 | `browser.json`：五次切换、同一 UI/store/canvas、消息未读与草稿附件保留、资源无持续增长 |
| 手机模拟 | 391×844 Edge 视口 | `fuji-mobile.jpg`、`capture-mobile.json`；动态落瓣容量降至 80 |

## 测试和性能

通过 `npm run build`、`test-showa-layout.mjs`、`test-showa-assets.mjs`、`test-showa-petals.mjs`、`test-showa-browser.mjs` 与 `git diff --check`。本轮只运行受影响的场景、布局、落瓣和交互检查。

同设备 Edge，1440×1000、九位好友与九栋建筑、同镜头、每组 180 帧：落瓣关闭平均 16.681ms，开启平均 16.680ms，两组 P95 均约 16.8ms。当前采样没有显示帧间隔退化；结果受显示刷新率限制，不代表真实手机或其他 GPU 的性能。

## 实现边界

花瓣使用准备阶段计算的保守屋顶包围范围，进入屋檐范围的落瓣会提前消退，不模拟沿屋顶滑落或真实风场。没有每帧射线检测、独立 RAF 或持续布局测量。

手机为浏览器模拟，未做实体手机测试。已有森林场景、聊天规则和资产来源保持；截图与录像位于 `validation/showa-town/`。

最终手机命中检查：九个群名入口均为 44px 高，9/9 可直接命中；顶部群名区域已纳入好友气泡避让。73.16 秒录像已抽查 15、25、40、55 秒画面，包含轻风落瓣、列车穿街和停站。
