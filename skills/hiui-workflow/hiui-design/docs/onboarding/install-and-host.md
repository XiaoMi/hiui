# 安装与宿主接入

## 运行时依赖

目标项目必须安装 hiui-design 同步进去的运行时依赖，并物化本地运行时目录：

- `src/components/hiui-design-runtime`（由接入脚本从 skill 内嵌来源快照或源码目录物化；新生成页面直接消费这一层）

本 skill 已内置依赖快照：

- [`managed-local-runtime-dependencies.json`](managed-local-runtime-dependencies.json)
- [`../../vendor/runtime-source-package.package.json`](../../vendor/runtime-source-package.package.json)
- [`shared-runtime-direct-dependencies.json`](shared-runtime-direct-dependencies.json)
- [`host-integration-dependencies.json`](host-integration-dependencies.json)

补依赖时不要再把 `runtime-source-package.package.json` 当成页壳依赖事实源。

- 页面壳层依赖以 `managed-local-runtime-dependencies.json` 的 `dependencies` 为准；它描述的是目标项目里 `src/components/hiui-design-runtime` 这层受管本地运行时需要声明的依赖
- `vendor/runtime-source-package.package.json` 只保留为来源追溯快照，用来证明当前本地运行时物料对应哪份上游包分发，不再作为目标项目补依赖的主合同
- app entry 直接导入的共享运行时依赖以 `shared-runtime-direct-dependencies.json` 为准；这层合同同时适用于 `rules-only` 和 `host-integration`
- 宿主示例层自己的直依赖与构建链前提以 `host-integration-dependencies.json` 为准
- `shared-runtime-direct-dependencies.json` 负责约束 `@hi-ui/patch-for-react` 这类“入口一旦 import 就必须声明并安装”的共享运行时直依赖；`host-integration-dependencies.json` 继续只描述宿主示例层和治理链路的额外直依赖
- 这两份快照应维护为“当前仓库已验证通过”的依赖合同：HiUI experimental 与 schema experimental 依赖继续保持明确版本，像 React 这类已明确验证过的宿主兼容窗口可以按合同保留区间，不要擅自把其他 experimental 依赖改成宽松漂移范围
- 对旧宿主里已经存在的 `hiui5-*` 隔离 alias，接入脚本会按“是否满足运行时合同”判断：缺失就补、明显不兼容就修、已经满足合同的兼容 alias 保留；这样可以避免把宿主里本来可用的等价 prerelease channel 强行改写回 skill 当前快照
- 这里的“兼容 alias”不是泛指任意 `>=5.x` / `5.x` / `^5.0.0` 这类宽泛 major 范围；当前只接受能锚定到已验证 experimental/canary floor 的表达式，例如 `npm:@hi-ui/table@>=5.0.0-experimental.4`。像 `>=5.x` 这种会漂到未验证 stable/prerelease 组合的写法，不视为满足运行时合同
- 对 `rules-only + legacy host`，默认策略是“保留宿主原有高风险根依赖，补齐隔离 alias 与受管 bridge”，而不是为了接一个新页面直接把 `@hi-ui/hiui`、`ahooks` 这类旧根依赖整体抬到 HiUI5 合同
- 对高风险 legacy Module Federation 宿主，生成器与 sanity 只认 `resolvedHostGenerationContract.visualRewritePlan` / `hookRewritePlan` 里声明的白名单改写集合；`visualSplitAliasMap` 继续只描述 bridge / dependency-isolation 事实，不代表所有 `hiui5-peer-contract` 符号都已被页面生成器支持
- `bootstrap-target-project.mjs` 会同时补齐共享运行时直依赖和 `examples/host-integration/src` 命中的宿主依赖，并要求上述快照里存在对应版本
- 对 React 19 宿主，`bootstrap-target-project.mjs` 会注册 `typical-page:runtime-patch`，并把 `node ".local-context/hiui-design/scripts/apply-runtime-patches.mjs"` 追加到目标项目 `postinstall`，用于在安装后自动落已核实的运行时修复点；当前包括 React 19 兼容告警修复与 `@hi-ui/query-filter` gap 转发修复。这一步属于 React 19 运行时基线，不需要业务页再做页面级绕过
- 对命中高风险 legacy existing-system 画像的 React 16/17/18 宿主，这组受管 runtime patch 脚本也会自动写入 `package.json` 与 `postinstall`，原因不是把它们升级成 React 19 语义，而是要让 `@hi-ui/query-filter` gap 转发补丁在首次安装后就落地，避免 `doctor` 首轮因为已知补丁缺失而失败
- 其他 React 16/17/18 宿主默认仍不会自动写入这组 runtime patch 脚本；其中 React 16/17 仍需保留 `@hi-ui/patch-for-react` 与 `react-dom/client` shim / alias，对 React 16 高风险宿主再额外补齐 `react/jsx-runtime` shim / alias 这类 legacy runtime 兼容基线
- React 19 兼容别名 `typical-page:react19-runtime-patch` 仍保留给历史项目或旧脚本继续调用；但新的运行时修复应继续收口到受管 runtime patch 层，而不是继续扩写 React 19 专项脚本
- React 19 项目在 `typical-page:preflight` 放行前，会额外检查 `package.json` 的 `typical-page:runtime-patch`、`postinstall -> apply-runtime-patches.mjs` 和项目本地 `.local-context/hiui-design/scripts/apply-runtime-patches.mjs` 是否同时存在；缺一项都视为运行时基线未完成，不允许开始页面生成。若 `node_modules` 里已经出现 `react-resize-detector` / `rc-resize-observer` 热点文件，preflight 还会继续抽查这些已安装文件是否已经被受管补丁改写，避免“脚本已接线但安装树仍是旧产物”的假放行
- React 19 项目的 `doctor` 不只检查脚本声明，还会抽查 `node_modules` 里的 `react-resize-detector` / `rc-resize-observer` 热点文件，覆盖 `@hi-ui/*` 与兼容 `hiui5-*` alias 两条路径，避免“脚本已接线但安装树仍是旧产物”的静默回退

这意味着类似 `@hi-ui/hooks` 这种“宿主示例临时多用了一个包，但补依赖脚本没有跟上”的问题，或者 `sass-embedded` 这种“示例页含有 SCSS 但目标项目没被补齐 Sass 编译器”的问题，应该在规则包维护阶段就被消灭，而不是等目标项目构建时再暴露。

若目标项目里已经装过一套旧视觉层依赖或旧演示页，请先清理它们，再接入典型页。

- 典型页目标依赖线是 HiUI 5 experimental + schema 4.x experimental
- `@hi-ui/schema-*`、`@hi-ui/use-ref-state`、`@hi-ui/use-subscription` 的 `4.x` 版本号属于当前 schema 生态，不等于“继续沿用旧视觉规则”
- 真正需要清理的是 `@hi-ui/card`、`@hi-ui/button`、`@hi-ui/form`、`@hi-ui/input`、`@hi-ui/page-header` 等旧视觉包的 `4.x` 线，以及项目里残留的 `hi-v4-*` 选择器
- 只检查 `managed-local-runtime-dependencies.json` 里的直接依赖还不够；`@hi-ui/schema-table` 会继续解析 `@hi-ui/table`，`@hi-ui/schema-fields` 会继续解析 `@hi-ui/input`、`@hi-ui/select`、`@hi-ui/date-picker` 等传递 peer。旧宿主接入时必须证明这些传递 peer 也被隔离到 HiUI5，否则会出现“页面 shell 是 HiUI5、筛选控件或表格仍是 HiUI4”的混合运行时。
- 对 legacy / Camora / Module Federation 宿主，Rspack / Webpack bridge 不能只做全局 alias，也不能只覆盖旧壳包包根；replacement 必须按 issuer scoped 生效，至少覆盖本地运行时目录、`@hi-ui/schema-*`、`@hi-ui/dumb-wrapper`、`@hi-ui/number-range` 这条新页面依赖图，否则运行时仍可能被旧 shared 单例污染。
- 宿主 shared contract 修复同样只针对 `existing-system + legacy Module Federation / Camora`：若项目仍声明旧 `@hi-ui/hiui`，同时又启用了 scoped HiUI5 bridge，就要显式审计 shared singleton，不要把这类兼容修复泛化到 greenfield 或非 MF 项目。
- `remoteDebugContract` / `remoteOnlyRuntime` 只会在 README 或宿主画像里出现显式本地调试证据时启用：正向 Camora 线索、可解析 proxy 规则、固定行 `- localOrigin: http://...`，或 README 中可解析的本地 `remoteEntry.js` URL；`remoteEntry.js` 文件名本身不再单独触发 remote runtime 调试合同
- 不要把 `dependency-isolation-check.mjs` 当成 ensure / preflight 前的默认第一步。正常项目先看 `typical-page:preflight` 是否把页面任务门禁放行；真正进入受管写页时，`generate-page-from-brief.mjs` 会把依赖隔离作为内部工程安全兜底。只有旧宿主、依赖变更、运行时 peer 报错、典型页 shell 无法解析，或用户明确要求工程验收时，才建议人工先跑 `node .local-context/hiui-design/scripts/dependency-isolation-check.mjs --target "$PWD"`；若失败，先修依赖链，再重试写页，而不是把它包装成额外的项目开门步骤。

## 来源追溯策略

- `.local-context/hiui-design/vendor/` 下的 `runtime-source-package` `tarball`（压缩包，当前用于保存来源包归档）与 `runtime-source-package.package.json`（包描述文件，当前用于保存来源包元信息）现在只承担“本地运行时来源追溯”职责：说明当前受管 `src/components/hiui-design-runtime` 物料是从哪份上游包分发快照导出的
- `bootstrap-target-project.mjs` 不再把目标项目的 `package.json` 写成来源包的 `file:` 或 `registry`（包源地址，当前用于声明软件包从哪里安装）依赖；目标项目应只声明受管本地运行时合同、共享运行时直依赖和宿主示例层直依赖
- 接入完成后的 doctor 会继续检查可选嵌入 `tgz`（压缩包）/ `snapshot`（快照文件，当前用来描述来源包元信息）与本地运行时来源是否一致，防止“skill 内物料已更新，但目标项目仍沿用过期来源假设”的静默漂移
- 对 React 19 宿主，doctor 还会把受管 runtime patch 接线和已安装热点文件一起纳入验收；页面白屏或控制台出现 `findDOMNode` / `element.ref` 告警时，先修这条基线，再看业务页

项目上下文落地的边界见：

- [`../architecture/project-context-materialization.md`](../architecture/project-context-materialization.md)

这意味着当前可见的 `lcm init` / `registry add` / `link` 逻辑不能单独视为“`.local-context/hiui-design/` 已进入目标项目”；接入流程仍必须显式满足项目内存在完整 context 目录这一前提。

## 接入模式决策

- `--mode auto` 会先复用已记录的 `appliedMode`
- `copy-template` 已退出当前对外接入模式；如需回看旧链路，只能通过 `git history` 查历史实现，不应再把它当成现行可选模式
- 若没有这些项目级证据，`--mode auto` 只判断一件事：目标项目是否需要项目本地兼容桥
- 不需要项目本地兼容桥时，自动走 `host-integration`
- 需要项目本地兼容桥时，自动走 `rules-only`
- `rules-only` 接入规则、依赖声明、官方母版起点和本地运行时基线，不会把 `examples/host-integration` 下的模版页面、路由 gallery、宿主桥接文件同步进目标项目
- `rules-only` 也会物化 app entry 已导入的共享运行时直依赖；例如入口保留 `import '@hi-ui/patch-for-react'` 时，目标项目 `package.json` 必须同步声明并安装这条依赖
- `rules-only` 接入还必须顺手补齐项目级公共外壳基线：在 app entry 引入本地受管 host baseline CSS，并在入口同级生成样式文件，例如 `hiui-design-host.generated.css`
- `rules-only` 在旧项目里只代表“项目已经具备生成页面的基础能力”；它不自动等同于“任意一张页面已经完成挂载入口绑定”。具体页面挂到哪个旧入口、哪个 expose、哪个注册表，仍要在页面生成阶段根据页级输入再确认
- 对 Camora / proxy 类宿主，`integration-preflight.mjs` 现在区分三种结果：`pass` 表示代码注册与 runtime source 都已通过，`pass-with-runtime-pending` 表示代码注册通过但 live `remoteEntry.js` 尚未验证，`blocked` 表示代码注册本身失败或 runtime source 已被明确验证失败
- 业务页生成仍然要走官方典型页模板复制；`rules-only` 只是把宿主 demo 排除在外，不是把模板生成能力排除在外
- 新业务页应直接落在目标项目原有目录结构中；`hiui-design` 只作为 `.local-context` 里的规则与参考资产存在
- 接入阶段只要受管宿主基线、样式资源、依赖线和桥接链路能安全成立，就尽量优先 `host-integration`
- 新项目 / 轻骨架若没有明确阻塞证据，应优先显式使用 `--mode host-integration`
- 已有系统、复杂宿主也先评估能否安全接入 `host-integration`；只有明确不需要 preview / smoke / doctor 基线，或无法证明受管宿主基线、样式资源、依赖线与桥接链路能安全成立时，才保留 `rules-only`
- 对外只有 `PROJECT_PAGE_TASK_STATUS.json` 被 `typical-page:preflight` 放行为 `ready-to-generate`，才叫“接入完成，可开始生成页面”；`ensure-only` 只说明物料已同步
- 当前受管本地运行时页壳默认不包含左侧导航；导航、菜单、路由注册和面包屑属于宿主项目能力
- `host-integration` 表示项目可承接受管宿主基线、官方 source assets 与 smoke/doctor 联调治理能力，不等于正式业务宿主
- 当前 `host-integration` 示例宿主除左栏导航语法外，还内置了语言切换、应用切换和 profile center；若复用 `examples/host-integration/src/app-frame-core.tsx` 或预览包装层 `examples/host-integration/src/app-frame.tsx`，应优先连同 `examples/host-integration/src/host-shell-localization.ts` 一起评估并适配。只有目标项目明确要求保留本地 locale bridge，或明确复用示例里的 demo translation runtime 时，才需要同步 `examples/host-integration/src/translation/`
- 正式业务导航壳的认证只认受管 host import：`local-managed-runtime/host`。preview wrapper 只能做预览宿主或结构参考，不能再当正式业务壳合同来源
- 如果新项目需要补首个正式业务导航入口，应直接接入业务页目录和正式路由树，而不是把 preview 导航并入正式业务导航
- 新项目的首个业务路由或菜单入口允许沿用 preview 导航样式，但 preview route tree 仍应保持隔离

## 国际化基线

- 当前接入脚本默认不会自动补齐 `src/translation/*`、`messages.ts`、项目内 `scripts/init-i18n.mjs` 包装器或 `package.json` 中的 `i18n:sync`
- 只有目标项目明确要求接入本地 locale bridge 时，才在接入命令中显式传 `--init-i18n`，或后续单独执行 `node ".local-context/hiui-design/scripts/init-i18n.mjs"`
- 页面生成链默认 `localizationMode=none`；只有用户明确要求页面接国际化时，才显式传 `--localization-mode local-bridge`，而 `inherit-host` 只用于目标项目已经证明存在宿主国际化 runtime 的场景
- 这套基线默认支持 `zh-CN`、`zh-TW`、`en-US`、`id-ID`、`th-TH`、`de-DE`、`ar-SA`
- `zh-TW` 默认回退到 `zh-CN`；非中文语种默认回退到 `en-US`
- 基线只负责建立 locale store、语言切换、RTL、formatter 与 fallback 规则，不负责替业务新增文案自动翻译
- 若目标项目后续接入自己的翻译平台，可在不改页面结构契约的前提下替换 runtime
- 若需要规则层的完整国际化约束，请继续阅读 [`../generation/i18n-baseline.md`](../generation/i18n-baseline.md)

两种模式的完整边界说明见：

- [`integration-modes.md`](integration-modes.md)
- [`navigation-layering.md`](navigation-layering.md)

## 宿主层必须具备

目标项目必须自己提供：

1. header 挂载点
2. footer 挂载点
3. 路由标题到 `PageHeader title` 的兜底逻辑
4. `TypicalPageHostProvider`
5. 左侧导航 / 顶部导航 / 菜单权限 / 路由菜单结构
6. header 槽必须允许 portal 进去的 `PageHeader` 根节点占满整行宽度；否则 `extra` 区不会贴右
7. 典型页内容区的高度链：宿主内容列 / 路由出口至少满足 `display: flex`、`flex-direction: column`、`flex: 1 1 0%`、`min-height: 0`
8. 表格页 / 数据统计页所在内容区默认收口 `overflow`，不要继续用普通文档流把典型页往下撑开
9. 根挂载点与首层公共外壳宽度链：`body` 不得保留居中 starter 布局，`#root` / `#app` / `#__next` 不得保留 `max-width`、`margin: 0 auto`、`padding` 或固定宽度这类盒化约束；对 `greenfield + host-integration`，首层公共 app shell（例如 `App` 返回的 `.app-shell` / `main` 包裹层）也不得继续把典型页限制在固定宽高盒子里，否则宿主壳只会铺满被限制的父容器，页面右侧会露出整块空白

推荐根样式基线：

```css
body {
  margin: 0;
  width: 100%;
  min-width: 320px;
  min-height: 100vh;
}

html,
#root,
#app,
#__next {
  width: 100%;
  min-height: 100vh;
}
```

这条基线属于项目公共外壳，不属于业务页面文件。典型页面文件缺少样式引入，通常暴露的不是“页面模板不完整”，而是目标项目 app entry 没有把公共外壳基线接起来。`rules-only` 应在接入阶段就把这件事补齐，而不是等生成首个页面后再由页面效果倒查。

对 `greenfield + host-integration`，`apply/bootstrap` 会优先自动归一化常见 starter 约束，包括 `body/#root` 盒化、`:root/html/body/#root` 上的默认排版污染（如 `font-size`、`line-height`、`letter-spacing`、`text-align: center`），以及首层 starter app shell 的固定宽高约束；对已有系统，不会默认删除原始公共壳样式，而是通过 `preflight` 把问题显式阻断出来。

若页面表现为“左侧导航和表格整体只占浏览器左半边，右侧从上到下空白”，普通生成流程先看 `typical-page:preflight` 产出的 `AI_GENERATION_READY_CONTEXT.publicViewport` / `publicViewportReady`；若表现为“宿主页头留出空白、页面自己的 header 又在白底内部”，先看 `AI_GENERATION_READY_CONTEXT.formalHostCompatibility` 与 brief 中的 `selectedHeaderStrategy` / `requiredHostAction`。这里的 `formalHostCompatibility` 现在主要是兼容提示和验收事实，只有受管最小宿主 contract 明确无效时才继续阻断项目开门；其余 shared header slot / 高度链问题应优先作为宿主修复 guidance 收口。只有首次接入验收、异常排查或正式发布验收时，再运行 `npm run typical-page:doctor` 查看 `root-viewport-style-contract`。这类问题优先修目标项目公共外壳或正式宿主合同，不要给单个表格、白卡或页面母版补局部宽度。

10. 宿主框架层默认保留主内容区右侧 `16px` 视口留白；浮动子菜单收起时，左侧导航与主体区域之间也保留 `16px` 间距；浮动子菜单展开时只去掉左侧留白，不要把右侧 `16px` 一并清掉

其中第 6 条只意味着给 `PageHeader` 根节点保留 `width: 100%`、`minWidth: 0` 这类铺满宽度的样式，不要在 `page-header-portal.tsx` 里额外把 `PageHeader` 根节点强行改成 `display: flex` / `alignItems: center`。`PageHeader` 自己的内部内容容器会负责把标题和 `extra` 操作区拉开；宿主层如果改写根布局，按钮反而会挤在标题后面。

其中第 7 条对全页编辑还要再向下延续到页面根和 `ProEditPage` 外层直系包裹层。也就是说，宿主内容列、路由出口、页面根、`ProEditPage` 之间不能突然切回普通块级文档流；若确实要加包层，也必须继续传递 `display: flex`、`flex-direction: column`、`flex: 1 1 0%`、`min-height: 0`，必要时 `overflow: hidden`。否则 `inlineEditFooter` 会失去可吸附的高度基准，退回“跟着内容走”的普通底部区域。

不要让页面直接耦合当前项目内部布局。

额外边界：

- skill 包内 preview runtime 和真实业务宿主必须视为两个层次；即使项目选择 `host-integration`，真实业务页也不应与示例路由树共用正式菜单树
- 目标项目不再保留 preview 入口。若仓库里仍有 `/__typical-preview`、`typicalPagePreviewRoutes`、`src/typical-page-preview/**` 或同类接线，应直接删除并改用 skill 包内 preview runtime
- 因此，这类“隔离路径”“隔离宿主”“独立 preview host”的讨论只对 skill 自己的包内 preview runtime 维护有效，不再属于目标项目接入合同

## 样式资源前提

- 目标项目构建链必须允许 `src/components/hiui-design-runtime` 下的 `css / scss` 资源正常生效
- 目标项目应用入口必须显式引入一次本地运行时样式 `src/components/hiui-design-runtime/styles.css`
- `rules-only` 项目还应在应用入口显式引入一次项目本地 host baseline CSS；若使用默认接入脚本，该文件会生成为入口同级的 `hiui-design-host.generated.css`
- 目标项目源码里如果已经开始使用本地运行时，必须继续保留 `src/components/hiui-design-runtime` 整个目录；不要依赖本地安装树里的私有物理路径
- 典型页相关代码应优先从本地运行时目录或其受管公开子路径导入，不要使用 `node_modules/.pnpm/...`、`../node_modules/...`、或 `docs/onboarding/managed-local-runtime-dependencies.json` 当前声明的来源包 `dist/*` 私有路径；若配置了可选来源快照，也只把它当“来源包私有构建路径”示例，不把来源包名本身当接入规则入口
- 若数据统计页的指标卡退化成普通文本、白底壳层消失、页头与内容贴在一起，优先排查样式资源是否被目标项目构建链忽略
- 本地运行时样式必须作为正式资源一起提交和构建；不要把这层运行时误当成“纯 JS 无样式包”
- 若表单内 `CheckSelect` 已选标签只剩关闭图标或计数，优先排查是否绕开了包内 `Form` 桥接；直接使用 `SchemaForm` 时，必须包 `TypicalPageFieldMapProvider`

推荐在 `src/main.tsx`、`src/main.ts`、`src/index.tsx` 或 `src/index.ts` 之一中加入：

```ts
import './components/hiui-design-runtime/styles.css'
```

若当前项目走 `rules-only`，同一入口还应有一条项目本地 host baseline 引入，例如：

```ts
import './hiui-design-host.generated.css'
```

若目标项目是 Vite，还需要确认 `vite.config.*` 中存在：

```ts
resolve: {
  alias: {
    '@hi-ui/schema-types': '/absolute/path/to/.local-context/hiui-design/examples/host-integration/src/shims/schema-types-empty.js',
    'react-dom/client': '/absolute/path/to/src/shims/react-dom-client.js',
    'react/jsx-runtime': '/absolute/path/to/src/shims/react-jsx-runtime.js',
    'react/jsx-dev-runtime': '/absolute/path/to/src/shims/react-jsx-runtime.js',
  },
}
```

原因：

- `@hi-ui/schema-types` 只有类型声明，缺少可供 Vite 预构建使用的 JS 运行时入口
- 可直接复用本 skill 自带 shim：`.local-context/hiui-design/examples/host-integration/src/shims/schema-types-empty.js`
- 对 React 16 高风险 legacy 宿主，可直接复用本 skill 自带 shim：`.local-context/hiui-design/examples/host-integration/src/shims/react-dom-client.js` 与 `.local-context/hiui-design/examples/host-integration/src/shims/react-jsx-runtime.js`
- 若当前项目已经完成 hiui-design 接入，且宿主命中“高风险 legacy React 16/17 + 可唯一落到单一配置或共享 `base` 配置 + 无冲突本地 shim”，可显式执行 `pnpm typical-page:legacy-react-compat` 或 `npm run typical-page:legacy-react-compat` 自动补齐 legacy compat alias 与官方 shim：React 16/17 会补 `react-dom/client`，React 16 还会额外补 `react/jsx-runtime`、`react/jsx-dev-runtime`；标准 `Rspack base + dev + prod` 三段式会优先改写唯一共享的 `build/rspack.base.conf.*`。执行后仍需重新运行 `typical-page:preflight`
- 若宿主还属于 `existing-system + legacy Webpack/Rspack`，并且需要显式补 `HiUI5 replacement bridge`，可执行 `pnpm typical-page:legacy-hiui5-bridge-autofix` 或 `npm run typical-page:legacy-hiui5-bridge-autofix`。它会在“恰好一个”对象字面量 `CommonJS` 构建配置可安全改写时自动接线；若项目是标准 `Rspack base + dev + prod` 结构，也会优先落到唯一共享的 `build/rspack.base.conf.*`。不能安全自动改时会返回阻断原因与后续动作。
- 若宿主属于 `existing-system + legacy Module Federation`，且项目仍声明旧 `@hi-ui/hiui`，同时又启用了 scoped HiUI5 bridge，可执行 `pnpm typical-page:legacy-mf-shared-contract-autofix` 或 `npm run typical-page:legacy-mf-shared-contract-autofix` 自动把 `hiui5` / `@hi-ui/hiui` 的共享合同切回多版本模式；执行后同样需要重新运行 `typical-page:preflight`。
- 当前对外模式都会尽量自动 patch 常见 Vite 配置；无法安全 patch 时会输出 `VITE_ALIAS_SNIPPET.md`
- 若目标项目安装树里仍出现已被受管 patch 覆盖的运行时问题，优先先执行 `npm run typical-page:runtime-patch`、`pnpm typical-page:runtime-patch` 或重新跑一次 install，让 skill 分发的运行时补丁先生效；历史项目也仍可继续使用 `typical-page:react19-runtime-patch` 兼容别名。不要在业务页里手写 DOM 包裹、页面级 CSS 绕过或替换受管组件来消音

## 接入后先验基线

- `rules-only` 模式下，不要求把示例页同步进目标项目
- `host-integration` 模式下，示例页只用于 preview / smoke / doctor；真实业务页仍应落在业务目录、业务路由和业务菜单中
- 生成首个业务页时，先按页型选择对应参考示例：
  - 表格类：`examples/host-integration/src/pages/basic-table.tsx` 或 `table-stat.tsx`
  - 抽屉类：`examples/host-integration/src/pages/drawer-form.tsx` 或 `drawer-detail.tsx`
  - 全页类：`examples/host-integration/src/pages/full-page-edit.tsx` 或 `full-page-detail.tsx`
- 参考示例只用于理解壳层和节奏，不应整包复制为 `src/typical-page-preview/*`
- 如果首个真实业务页出现白卡消失、页头贴边、双滚动、固定底栏失效、表格高度不收口，优先修宿主和样式资源，不要继续批量生成新页面
- 如果全页编辑底部操作区没有吸底，不要先去改单页 footer 样式；先检查 `inlineEditFooter` 是否仍在 `ProEditPage` 内、是否是 `formScrollBody` 的同级兄弟，以及宿主内容列 -> 路由出口 -> 页面根是否保持连续高度链

## 优先参考的资产

- `../examples/host-integration/src/components/layout/layout-content-context.tsx`
- `../examples/host-integration/src/components/layout/page-header-portal.tsx`
- `../examples/host-integration/src/components/layout/typical-page-host.tsx`
- `../examples/host-integration/src/app-frame-core.tsx`
- `../examples/host-integration/src/app-frame.tsx`（仅 preview wrapper）
- `../examples/host-integration/src/app-shell.tsx`
- `../examples/host-integration/src/routes/config.tsx`

显式 `navigationMountContract` 当前若提供 `menuRegistryPath`，它必须与 `routeRegistryPath` 指向同一份正式注册表；split menu/route registry 自动双写尚不在受管 contract 范围内。

## 脚本边界

`setup-for-designers.mjs` / `apply-in-current-project.mjs` / `bootstrap-target-project.mjs` 会：

- 默认注册规则能力脚本，并补本地运行时所需依赖与页面壳层依赖
- 默认只注册规则能力脚本与页面壳依赖，不自动补齐 `src/translation/*`、`messages.ts` 或 `i18n:sync`；只有显式传 `--init-i18n` 时才会补齐
- 默认自动补齐本地受管运行时基线中的 `src/components/hiui-design-runtime/styles.css`、React 19 或高风险 legacy 宿主所需的 runtime patch 接线，以及常见 Vite `@hi-ui/schema-types` alias；无法安全 patch 时输出手工片段
- `setup-for-designers.mjs` 现在还会在高风险旧宿主上走受管兼容车道：先补 legacy React runtime compat，再补 HiUI5 replacement bridge、legacy MF shared contract，并在放行前自动跑一次 `dependency-isolation-check.mjs` 复核依赖隔离；任何一步不能安全自动改，都会停在阻断态并返回显式人工动作
- 默认不改目标项目现有目录结构，不同步模版页面，不挂路由 gallery，不落宿主桥接文件
- `host-integration` 模式下会补最小宿主基线与 guidance，官方 preview 统一保留在 skill 包内 `preview-runtime/`；以后任何场景都不再支持把 preview 示例物化进目标项目
- `host-integration` 模式下可额外产出受管宿主基线接线片段和桥接说明；不会在目标项目落 preview host 或 gallery 入口
- 新项目若需要补首个正式业务导航入口，应作为正式业务路由接入处理，而不是直接把 preview 导航挂到顶层 `App.*`

不会：

- 替换目标项目已有布局实现
- 覆盖高度定制的路由结构
- 帮你决定页型

## 模板与项目边界

- `templates/i18n/src/translation/**` 只允许保留 skill 自带示例页所需的通用演示词条
- 若目标项目显式启用了本地 locale bridge，则同步后的 `src/translation/demo-overrides.ts` 才是业务词条兜底位
- 禁止把当前项目里的页面标题、mock 数据、队伍 / 商品 / 活动等业务词库反向写回 skill 模板
- 发布前应确认 i18n 模板没有混入当前项目专属业务词条

## 接入完成后的边界

- 默认不向目标项目写入宿主层示例文件
- 页面壳层来自 `src/components/hiui-design-runtime`
- 页面起点优先看页型规则和官方母版；preview 对照页只用于联调和结构参照，不作为正式业务页目录
- 统计页 / 表格页的高度链与样式资源要在首个真实业务页上验证，再继续做业务替换
- 组件拿不准时，再看 `hiui-v5-quick-reference.md`

## 历史兼容说明

已下线历史链路已不再属于当前对外模式集合。面对 legacy、Camora、Module Federation 或宿主接入条件暂时不清晰的项目，当前仍应优先在 `rules-only` / `host-integration` 范围内补齐宿主证据与运行时基线；若必须回溯旧链路，只能通过 git 历史恢复对应版本。

### 当前处理方式

1. 读取 `docs/generation/*` 规则和命中的 `figma-pages/*.md`。
2. 参考 `examples/host-integration/src/pages/*` 的结构和交互，不把 gallery 同步进业务源码。
3. 在目标项目自己的目录、组件库版本、路由、菜单和微前端暴露方式中实现页面。
4. 运行当前模式下的 `typical-page:doctor`、项目构建，并在真实宿主打开验收。

### 异常与回滚

- 目标目录已存在：先人工评估 diff，禁止自动覆盖。
- 页面打不开：先检查目标项目路由、菜单或 Module Federation `exposes`，不要恢复 source-template 生成器。
- 回滚顺序：删除新增页面目录；删除路由/菜单/exposes；再回滚本次业务实现改动。
