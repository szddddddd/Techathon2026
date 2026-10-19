# 历史档案

[项目首页](../../README.md) / [当前文档](../README.md) / 历史档案

这里保留阶段设计和可追溯的验证证据。历史计划可能已完成或被后续方案替代，验证数据只适用于记录时的代码、设备与测试范围。当前安装、配置和功能行为以[开发指南](../DEVELOPMENT.md)、专题指南和源码为准。

| 材料 | 用途 |
| --- | --- |
| [骨骼系统计划](character-rig-plan.md) | 角色系统的阶段设计 |
| [移动性能计划](plans/mobile-performance.md) | 移动端性能优化的历史工作项 |
| [工程目录整理计划](plans/engineering-layout.md) | 首轮源码、样式与测试迁移范围 |
| [工程目录整理验收](validation/engineering-layout-2026-10-19.md) | 首轮整理的实际验证与未覆盖项 |
| [邮箱 Agent 验证](mail-agent-validation.md) | 模拟供应商与真实服务的验收边界 |
| [骨骼验证数据](character-rig-validation.json) | 角色动作、接触与场景检查的阶段数据 |
| [工坊启停](validation/workshop.json) / [场景切换](validation/workshop-switch-stability.json) | 既有资源计数与稳定性记录 |
| [仓库清理记录](repository-cleanup-2026-10-19.md) | 旧场景、重复材料与导航的清理范围 |

已停用的霓虹云港源码、模型、专用测试以及旧资料合辑 `Resources.md` 可从 Git 提交 `f9b751e` 恢复。其模型不再进入当前 Android Web 资源包。原始 Blender 场景与当前运行素材继续保存在 `assets/`。

新增验证默认写入 `.test-results/` 或 `output/`。仅在有必要长期引用时，人工选择不含私密数据的报告归档；报告生成脚本不自动覆盖这里的历史证据。
