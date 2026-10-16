街道小汽车

- src/town-cars.js：两辆低多边形小汽车，奶油黄、浅蓝绿，静态合批，无新增动画循环。
- src/community-layout.js：房屋之间的两处街道停车位置、车辆占地和人物避让。
- src/town-landscape.js：停车位与道路合并铺装，汽车纳入静态街景。
- npm run build 通过；test-group-scene 通过（671 个道路采样、81 个模板放置检查）。
- test-town-walking 通过（515 个实际场景道路采样，0 失败）；隔离浏览器截图 pageerror 为 0。
- town.jpg 为街区全景，yellow-car.jpg / blue-car.jpg 为两辆车近景。
