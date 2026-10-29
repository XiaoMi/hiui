# Public Rules Surface

`hiui-page-workflow` 依赖的 `hiui-design` 规则面，当前通过以下稳定入口暴露：

- `docs/generation/**`：页型、母版、槽位边界、工作流和生成约束
- `docs/onboarding/**`：接入模式与宿主画像
- `manifests/**`：事实源覆盖层
- `scripts/plan-page-task.mjs`：将上面的规则收敛成可执行的 S1 机器计划

这个目录作为公开 contract 的锚点保留，避免 workflow 只能依赖内部实现路径。
