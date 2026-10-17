# 暮樱粉浮空岛资产来源

所有本轮 Rodin 调用均先由 imagegen CLI 通过项目内已授权的 OpenAI 兼容接口生成独立物体图像，再上传对应图片给 Hyper3D MCP。未使用无图的文字生成替代此流程，未修改客户端全局配置。概念图属于辅助设计，实际游戏截图独立保存。

| 资产 | Rodin 任务 | 采用状态 |
|---|---|---|
| sakura-yoshino-v3 | `c83d0d3e-9bc4-4c47-89a4-080fa3377504` | 已采用：正、侧、背面与场景检查通过 |
| sakura-weeping-v3r1 | `9da4df06-63d0-4bb7-b219-6453a50f5dee` | 已采用：正、侧、背面与场景检查通过 |
| sakura-weeping-v3 | `d440429b-f56a-4ee3-b64c-04269a143b12` | 未采用：花冠缺失，保留失败证据 |

三次生成均为 Gen-2.5-Medium / Raw / 30,000 面 / GLB：两次首轮，一次枝垂樱修订。各目录保留 `reference.png`、`prompt.txt`、`source.glb`、`scene.glb`、`manifest.json` 和三视图。只压缩场景版纹理，不改变原始几何。

图像与提示词位于 `output/imagegen/dusk-sakura/`：

- `concept-overall.png` 与 `concept-overall-prompt.txt`：整体概念。
- `concept-street.png` 与 `concept-street-prompt.txt`：街巷概念。
- `sakura-yoshino-v3.png` 与同名 `-prompt.txt`：舒展型参考。
- `sakura-weeping-v3.png` 与同名 `-prompt.txt`：枝垂樱首轮参考。
- `sakura-weeping-v3r1.png` 与同名 `-prompt.txt`：枝垂樱修订参考。

后续生成同样遵循 imagegen 独立物体图 → 检查图像 → Rodin 的顺序；修订先修订图像。任务结果不明时查询已有任务，不重复提交。原始服务响应与签名下载地址仅保存在被 Git 忽略的 `records/dusk-sakura/`。
