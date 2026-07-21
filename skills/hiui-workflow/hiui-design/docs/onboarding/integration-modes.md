# 接入模式

## 目的

本文件只负责说明 `hiui-design` 的三种接入模式，以及各自的边界。

发生冲突时：

1. 脚本实际行为
2. 本文件
3. `one-click.md` / `install-and-host.md` / `SKILL.md` 中的摘要描述

## 默认模式：`rules-only`

适用：

- 旧项目已经有自己的目录结构、布局结构、路由结构
- 只希望把典型页规则带进项目
- 页面生成时直接落在目标项目自己的 feature / page 目录里

行为：

- 保留 `.local-context/hiui-design/`
- 注册 `typical-page:*` 脚本
- 补 `@hiui-design/typical-page-shells` 依赖基线
- 默认同步一份 reference-only 典型页到 `.local-context/hiui-design/reference/host-integration/src/`
- 默认不把模版页面、route gallery、宿主桥接文件同步到目标项目 `src/`
- 默认不自动 patch 路由
- 默认不自动 patch Vite alias
- `project integration ready` 只表示项目接入、依赖与宿主前提已就绪；某个典型页是否能命中标准 `page-component`，由 planner 在页面阶段按资产事实单独判断

生成方式：

- 先读 `generation-principles.md`
- 再读 `page-type-map.md`
- 再读 `rules-only-component-matrix.md`
- 再读 `figma-page-rules.md`
- 再读命中的 `figma-pages/*.md`
- 最后在目标项目既有目录结构中生成真实业务页

额外要求：

- `rules-only` 不能只判页型，不判组件落点
- 进入真实业务页生成前，先用 `rules-only-component-matrix.md` 明确页头、筛选区、表格区、分页区、底栏分别落到哪一类 HiUI 5 组件语义或宿主基座
- 如果目标项目后续被提升为 `legacy-host-compatible`（旧宿主桥接接入模式），则不再按本节 `rules-only` 口径执行；改把该矩阵与 `legacy-host-compatibility.md` 一起读，写清楚当前页映射到宿主哪个页面基座

参考示例：

- 优先把 `.local-context/hiui-design/reference/host-integration/src/pages/*` 当作本地参考模板
- 若 reference 目录不存在，再回退到 `examples/host-integration/src/pages/*`
- 不把这些模板页挂进目标项目正式路由

## 显式模式：`host-integration`

适用：

- 需要一组可直接打开的典型页示例
- 需要基线联调页 / smoke gallery
- 需要宿主桥接示例帮助开发者接线

行为：

- 同步 `examples/host-integration/` 到目标项目
- 仅对 `greenfield` 项目自动 patch 路由
- 可选自动 patch Vite alias
- 可对接 `typical-page:doctor` 和 `SMOKE_REPORT.md` 做示例页基线联调
- 若目标项目被识别为 `existing-system`，即使显式使用 `host-integration`，也只同步 smoke/gallery 资产与桥接示例，不自动并入正式路由树
- `project integration ready` 只表示 host assets / 依赖 / 路由接线已完成；普通典型页是否可直接走 `page-component + slot-fill`，仍由 planner 的资产解析结果决定

使用方式：

- `setup-for-designers.mjs --mode host-integration`
- `apply-in-current-project.mjs --mode host-integration`
- `bootstrap-target-project.mjs --mode host-integration`
- 或脚本别名：`typical-page:apply:host-assets`

## 显式模式：`legacy-host-compatible`（旧宿主桥接接入模式）

适用：

- 目标项目主运行时仍是 React 16/17 或等价旧宿主
- 目标项目以 `hiui5` alias / 本地封装的方式局部接入 HiUI 5
- Module Federation / 老后台宿主主树默认不预设可直接承载标准 `@hiui-design/typical-page-shells` 运行时

行为：

- 继续保留 `.local-context/hiui-design/` 与 reference-only 示例页
- 不自动补标准 `@hiui-design/typical-page-shells` 依赖线，不把标准壳运行时当作 legacy 主树的默认接入前提
- 不同步 route gallery / 宿主桥接文件到目标项目 `src/`
- 生成时继续使用页型、结构节奏、contract 与 doctor 约束；普通典型页主链路仍优先 `pageComponent + runtimeAdapterProof`，而 legacy 主树里的具体运行时承载默认回到宿主自己的布局/容器/`hiui5` alias / 本地组件。若已隔离出独立现代运行时入口，则改走 `isolated-standard-shell`
- 该模式下 `project integration ready` 的定义本身就必须覆盖 project-certified carrier / runtime bridge 与 required legacy carrier batch ready；这是 legacy 独有的接入完成态，不向 `rules-only` / `host-integration` 扩散
- 因此，一旦 `legacy-host-compatible` 接入完成，普通典型页默认就应支持沿 `page-component + runtime bridge + slot fill` 主链，以替换业务槽位的方式生成页面；若 required carriers 仍缺失，应解释为接入 / bootstrap 未完成，而不是“已接入后再补 rollout”

使用方式：

- `setup-for-designers.mjs --mode legacy-host-compatible`
- `apply-in-current-project.mjs --mode legacy-host-compatible`
- `bootstrap-target-project.mjs --mode legacy-host-compatible`
- 或脚本别名：`typical-page:apply:legacy`

## 选择原则

- 若脚本运行在 `--mode auto`，会先判断目标项目画像
- 若目标项目被判定为 **新项目 / 轻骨架 React + Vite**，默认选 `host-integration`
- 若目标项目已有稳定结构，默认选 `rules-only`
- 若目标项目被判定为 **旧宿主不兼容运行时**，自动提升为 `legacy-host-compatible`
- 若目标项目被判定为 **已有系统 / 旧框架 / 微前端 / Umi / Next**，默认选 `rules-only`
- 只有在“需要示例页和宿主桥接联调”的时候才选 `host-integration`
- 不要把 `host-integration` 当成默认安装方式
- 已有系统即使显式使用 `host-integration`，也只建议把它当作 smoke gallery / 联调页，不建议直接覆盖正式宿主

## 维护约定

- 修改默认接入行为时，先改脚本，再更新本文件
- 其他文档只保留摘要，不重复展开两种模式的完整定义
