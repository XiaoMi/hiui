# 项目上下文落地验证

## 结论

基于当前仓库可见脚本与一次隔离环境实测，可以确认：

- `lcm init --registry ...` 会在目标项目创建通用 `.local-context/` 根目录，并写入 registry 相关配置
- `lcm registry add ...` 会注册远端 registry，但不会把 `hiui-design` 项目上下文直接 materialize 到目标项目
- `lcm link --for cursor --yes` 在目标项目内尚不存在可链接 context 时，不会额外生成 `.local-context/hiui-design/`

因此，`setup-for-designers.mjs` 当前链路中的 `lcm` 逻辑只能视为“项目级 local-context 初始化 + registry/link 辅助”，不能把它等同于“整套 `.local-context/hiui-design/` 已同步到目标项目”。

## 证据

当前仓库里的 `setup-for-designers.mjs` 只显式调用了三类 `lcm` 命令：

- `lcm init --registry <configured-open-registry>`
- `lcm registry add <configured-open-skill-registry>`
- `lcm link --for cursor --yes`

并且脚本在 `lcm` 不可用或初始化失败时，会退回“仅依赖已复制到项目内的 hiui-design 继续接入”，而不是尝试额外下载或同步 skill 目录。

对应实现见：

- `scripts/setup-for-designers.mjs`
- `docs/onboarding/one-click.md`

## 设计含义

后续任何“生成前自动 ensure 项目已接入”的能力，都必须显式解决“如何把 `.local-context/hiui-design/` materialize 到目标项目”这个问题，不能默认假设 `lcm init` / `registry add` / `link` 已经完成了这一步。

换句话说，后续实现里需要明确二选一：

1. 外部分发链路负责把 `.local-context/hiui-design/` 同步到项目
2. `hiui-design` 在仓库内提供本地 fallback sync

在这两条路径没有被明确实现之前，不能把 `lcm` 初始化成功当作“项目已接入”的证据。
