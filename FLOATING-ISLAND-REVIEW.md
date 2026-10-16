# 岩石浮空岛与临河庭院

按最终反馈采用不规则岩石轮廓，取消圆滑等厚底座。外缘以连续的大轮廓组织岩石折面，苔草薄层下面是分层断崖、逐渐收拢的岩体和五块嵌入式悬垂岩根。下方地面降到 -25，岛底最低 -18，避免原地面遮住浮空体。山脉、溪流、桥、前景瀑布、营地和山腰观景台继续使用原位置。

九格庭院整体向河岸移动 3.4 个单位、向前移动 0.5 个单位，报刊亭与放映场同步移动。建筑最近边缘距河道约 3.22 个单位；保留独立沿河步道并接回桥边。九栋建筑仍位于 2.22 高度的平地上，数据、群身份和在场规则不变。

| 条目 | 实现 | 验证 |
| --- | --- | --- |
| 岩石外岸与共享边界 | `src/island-profile.js`、`src/world-surface.js` | `validation/floating-island/geometry.json`：64 个岸边支持采样 |
| 分层岩壁、向下收拢、悬垂岩根 | `src/floating-island.js`、`src/terrain.js` | 正面、背面、低视角实际截图；岩体合为一个网格，1,140 三角面，无额外逐帧动画 |
| 九格临河、平地与步道 | `src/community-layout.js`、`src/group-scene.js`、`src/discovery-scene.js` | 36 个建筑边角、85 个沿河通道与 414 个格间步道采样通过 |
| 手机构图、密集标签整理 | `src/main.js`、`src/group-scene.js` | 391×844 浏览器模拟截图；可缩放进入局部观察 |
| 交互与原设施回归 | 原群聊、河流、观景台、镜头模块 | 群聊完整流程、点击建筑、候场递补、河流高程、观景台支持、右键平移与发现设施返回均通过 |

构建通过。浏览器截图与镜头测试均无页面错误，九种 Rodin 建筑加载成功。右侧坡路最大坡度约 21.1°，地形网格与采样高度最大误差约 0.009。手机为模拟尺寸，未进行真实设备性能测量；没有新增 Rodin 生成调用，地形采用可编辑的程序网格。

- [岩石浮空岛低视角](validation/floating-island/after-rock.jpg)
- [默认桌面](validation/floating-island/after-desktop.jpg)
- [临河庭院](validation/floating-island/after-courtyard.jpg)
- [背面](validation/floating-island/after-rear.jpg)
- [手机模拟](validation/floating-island/after-mobile.jpg)
- [修改前同视角](validation/floating-island/before-island.jpg) / [修改后同视角](validation/floating-island/after-island.jpg)

复现：`npm run build`；`node scripts/test-floating-island.mjs`；`node scripts/test-group-scene.mjs`；启动本地服务后执行 `node scripts/capture-floating-island.mjs after`。其余本轮证据保存在 `validation/floating-island/`，包括 `valley-geometry.json`、`river-geometry.json`、`terrace-geometry.json`、`group-browser.json`、`pan-bounds.json`。
