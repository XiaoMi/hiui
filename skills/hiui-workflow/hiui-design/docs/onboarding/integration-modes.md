# 接入模式

## 目的

本文件只负责说明 `hiui-design` 的两种接入模式，以及各自的边界。

发生冲突时：

1. 脚本实际行为
2. 本文件
3. `one-click.md` / `install-and-host.md` / `SKILL.md` 中的摘要描述

## 模式一：`rules-only`

适用：

- 旧项目已经有自己的目录结构、布局结构、路由结构
- 希望在目标项目既有目录结构中接入典型页生成能力与本地运行时基线
- 页面生成时直接落在目标项目自己的 feature / page 目录里
- `host-integration` 那套更完整的宿主基线、source assets 与 bridge guidance 不需要或不适合整体接管

行为：

- 保留 `.local-context/hiui-design/`
- 注册 `typical-page:*` 脚本
- 补本地运行时共享基线
- 补 app entry 已导入的共享运行时直依赖合同，例如 `@hi-ui/patch-for-react` 这类入口一旦 import 就必须被声明到目标项目 `package.json`
- 接入时同时补齐项目级公共外壳基线：对 app entry 追加本地 host baseline CSS 引入，并在入口同级生成受管样式文件，例如 `hiui-design-host.generated.css`
- 默认不把模版页面、route gallery、宿主桥接示例文件同步到目标项目 `src/`
- 默认不自动 patch 路由
- 默认会补 `styles.css`、React 19 或高风险 legacy 宿主所需的 runtime patch 接线，以及能安全识别时的 Vite `@hi-ui/schema-types` alias；无法安全 patch 时输出手工片段
- 业务页仍然按官方典型页模板复制生成；`rules-only` 同样要接入典型页面壳对应的本地受管运行时，也就是目标项目里的 `src/components/hiui-design-runtime` 与其 `styles.css`。它保留官方母版起点与 shells 运行时，只是不补 `host-integration` 那套更完整的 source/bridge/guidance 基线
- 项目本地 `.local-context/hiui-design/examples/host-integration/**` 仍可存在，因为它承担官方母版、宿主 source、shim 与 bridge 事实源；这不等于目标项目支持项目内 preview gallery
- 若 `typical-page:preflight` 给出 `publicShell.status = blocked`，应视为接入尚未完成；若只是 `not-checked`，说明 baseline 证据仍需补齐，应优先修正，但不再自动等同于硬阻断
- 旧项目已经满足依赖、样式、路由和微前端暴露前提时，只执行轻量 sanity check；不要把浏览器截图、全量 DOM diff 或 smoke gallery 作为每次生成的默认必经步骤

生成方式：

- 先读 `design-system-first.md`
- 再读 `generation-principles.md`
- 再读 `page-type-map.md`
- 再读 `figma-page-rules.md`
- 再读命中的 `figma-pages/*.md`
- 最后在目标项目既有目录结构中生成真实业务页

参考示例：

- 只把 `examples/host-integration/src/pages/*` 当作 runtime 对照，不把它们整包复制为正式业务源码
- 不把这些模板页整包复制到目标项目
- 生成业务页前必须先按 `docs/generation/page-types.manifest.json` 的页型事实和 `generationContract` 形成生成 brief，再复制最近官方母版并只替换业务槽位

轻量兜底：

- 默认检查依赖声明、本地运行时 `styles.css` 引入、公开 import 路径、旧 `hi-v4-*` / `--hi-v4-*` 残留、页型关键壳层 token、目标项目路由或暴露入口
- 不默认检查截图像素、全量 DOM class diff、所有 smoke 页截图；这些只在首次接入、宿主壳改动、样式版本升级、多页型同时失真或用户明确要求时启用
- 若轻量兜底失败，只修失败项；不要因为单页问题重接整个宿主或批量重写业务页面
- 典型页面文件本身不承担公共外壳补丁；不要把 `html / body / #root` 选择器写回业务页或页面局部样式里

## 显式模式：`host-integration`

适用：

- 需要一组可直接打开的典型页 preview 示例
- 需要基线联调页 / smoke gallery
- 需要宿主桥接示例帮助开发者接线
- 已能证明目标项目可完整承接受管宿主基线、portal、高度链、样式和依赖基线

行为：

- 默认先补齐 `host-integration` 所需的最小宿主基线、guidance 与脚本入口；以后任何场景都不再支持把 `examples/host-integration/` 对应的 preview 示例物化到目标项目
- skill 侧同时提供 skill 包内 `preview-runtime/` 作为官方示例的本地承载层；官方预览统一留在这里
- `preview / smoke / doctor` 的官方示例统一从 skill 包内 preview runtime 打开，不再同步进目标项目
- 目标项目仍可在 `.local-context/hiui-design/examples/host-integration/**` 下持有官方母版、宿主 source、shim 与 bridge 物料；这些是生成与治理的 source assets，不是项目内可预览 route tree
- 复用与 `rules-only` 相同的本地受管运行时基线：也就是目标项目里的 `src/components/hiui-design-runtime`、对应依赖合同和 shared runtime direct dependency 合同；并额外接入 source assets、bridge guidance 与 smoke/doctor 所需治理资产
- 仍会尽量自动 patch 常见 Vite alias；无法安全 patch 时输出手工片段
- 可对接 `typical-page:doctor` 和 `SMOKE_REPORT.md` 做示例页基线联调
- 真实业务页继续走目标项目自己的业务目录、业务路由和业务菜单；不与 preview route tree 共用正式宿主
- 对所有项目，目标仓库都不再支持挂 preview route、preview host 或 project-local gallery；一旦出现 `/__typical-preview`、`typicalPagePreviewRoutes`、`src/typical-page-preview/**` 等接线，`doctor` 应视为旧流程残留并要求删除
- 因此，“项目里保留 `.local-context/hiui-design/examples/host-integration/**`” 与 “项目里存在可打开的 preview gallery” 是两回事：前者仍然合法，后者已经下线
- 对新项目，若首次生成真实业务页需要补首个正式业务导航入口，应直接把业务页接入正式路由树，而不是把 preview 导航直接转正
- `host-integration` 负责提供可打开的基线联调页，不代表业务页必须走重型浏览器验收主路径

使用方式：

- `setup-for-designers.mjs --mode host-integration`
- `apply-in-current-project.mjs --mode host-integration`
- `bootstrap-target-project.mjs --mode host-integration`

补充边界：

- 项目内 `setup-for-designers.mjs` / `apply-in-current-project.mjs` 只适用于目标项目已经具备完整 `.local-context/hiui-design/` 的场景
- 若当前还是 `missing-context`，先从 skill 包根目录执行 `scripts/ensure-in-current-project.mjs --target <project-root> --mode host-integration`，先把项目本地 context 补齐，再回到项目内入口

## 选择原则

- 接入阶段的总体原则是：能安全接入 `host-integration` 时就尽量接入 `host-integration`；`rules-only` 只作为无法安全成立或明确不需要 preview / smoke / doctor 基线时的降级
- 若脚本运行在 `--mode auto`，会先复用已记录的 `appliedMode`
- 若没有这些证据，脚本就只判断目标项目是否需要项目本地兼容桥：不需要时走 `host-integration`，需要时走 `rules-only`
- 目标项目画像主要提供风险提示和 adapter guidance，同时也用于判断“是否需要项目本地兼容桥”这一个模式选择条件
- 新项目 / 轻骨架若没有明确反证表明受管宿主基线、高度链、样式资源或依赖线接不通，应优先显式选择 `host-integration`
- 新项目 / 轻骨架把 `rules-only` 视为例外降级：只有明确不需要 preview / smoke / doctor 基线，或宿主接线无法安全成立时才选它
- 既有系统里的原生兼容载体会自动落到 `host-integration`；Next、Umi、微前端等需要项目本地兼容桥的载体会自动落到 `rules-only`
- 不要把 `host-integration` 当成“新项目默认生产宿主”
- 已有系统即使显式使用 `host-integration`，也只建议把它当作 smoke gallery / 联调页，不建议直接覆盖正式宿主
- 一旦项目级决策已经显式选择 `host-integration`，后续 `doctor` 应检查“隔离是否成立”，而不是在每次检查里把该项目重新打回 `rules-only`

## 维护约定

- 修改默认接入行为时，先改脚本，再更新本文件
- 其他文档只保留摘要，不重复展开两种模式的完整定义
