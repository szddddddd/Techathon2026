# 富士山 v2：先生成参考图，再重建模型

本次按用户要求重新生成一个富士山模型，已替换主场景 `assets/rodin-fuji/fuji/scene.glb`。原始版本完整保留在 `assets/rodin-fuji/fuji-v1/`。

1. 通过项目已配置的 OpenAI 兼容图像编辑接口调用 `gpt-image-2`，使用当前小镇截图作为风格参考，生成独立富士山图片。使用 imagegen 技能的原装 `image_gen.py edit` CLI；参数为 1536×1024、high。
2. 图像与提示词保存在 `output/imagegen/fuji-v2-reference.png`、`fuji-v2-prompt.txt`，接口不读取或修改 Codex 的模型提供商配置。
3. 以该图为唯一图像参考，通过已授权的 Hyper3D MCP 调用一次 Rodin：`Gen-2.5-Medium / Raw / 30,000 面 / GLB`。
4. 任务号 `294064b2-ccd0-4085-aa2d-b1162df9155d`。源模型 8,987,612 字节，纹理优化后的场景模型 2,324,596 字节，保留全部源几何。

已检查正面、背面和侧面：可见火山口、自然雪线、侵蚀沟壑与不规则山脚，无明显缺失面或分离构件。背面由 Rodin 推断，沟壑比参考正面简化。放回小镇后按原山体的 36×22×16.5 范围适配，浏览器加载无错误，其他 14 项资产加载正常。

场景检查截图在 `validation/fuji-mountain-v2/`。`browser.json` 保存当前实际采用的任务号、资源状态与渲染信息。此次仅验证新山体及场景加载，没有重复运行与模型替换无关的整套社交测试。

恢复或查询本次任务：`node scripts/regenerate-fuji-mountain.mjs`。脚本复用已保存的任务号，完成状态不会重复提交生成。
