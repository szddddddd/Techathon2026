# 理想城场景

采用用户提供的 `world/ideal_city_20261017/ideal_city.blend`。`source.blend` 是该最终可编辑模型的副本，模型由原生 Blender 几何构成，无外部贴图依赖；本次没有调用 Rodin 重新生成。

`scene.glb` 导出岛体、殖民舰、楼群、道路、机械、飞行器和环境云团，去除摄影棚背景板、相机和灯光。浏览器使用独立天空与照明。`manifest.json` 保存精确岛岸、九个群聊地块、对象边界和来源校验值，角色安放与场景显示共用该布局。

世界转换为 Blender X → X、Z → Y、-Y → Z，整体缩放 2 倍，地面高 2.22。外围六栋塔楼和三栋低层建筑保留原位置与外观并提供群聊入口。飞艇与悬浮交通在现有渲染循环更新，减少动态效果时保留原模型位置。

重新导出：

```powershell
& 'D:/Program Files/Blender Foundation/Blender 5.2/blender.exe' --background --python-exit-code 1 --python scripts/export-ideal-city.py -- --source assets/ideal-city/source.blend --out assets/ideal-city
npm run build
```

## 当前显示版本

网页优先使用 `lowpoly/scene.glb`：19 项按用户素材图切分、imagegen 整理后由 Rodin 生成的低模卡通资产。当前比例、来源与验证见 `lowpoly/README.md`。本目录原 GLB 继续作为加载失败回退和布局锚点来源。
