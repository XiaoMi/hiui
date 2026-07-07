# 安装与宿主接入

## 运行时依赖

标准典型页运行时只适用于下面两类模式：

- `host-integration`
- `rules-only`

这两类模式下，目标项目必须声明并最终安装：

- `@hiui-design/typical-page-shells`

这里的“运行时依赖已接入”只回答项目是否具备标准壳运行时前提，不直接等价于“每个典型页 page-component 都已经 ready”。后者属于 planner 消费的资产事实与页型支持事实。

`legacy-host-compatible` 默认不是标准壳运行时的自动接入：

- 默认不要自动补装 `@hiui-design/typical-page-shells`
- 默认不要自动引入 `@hiui-design/typical-page-shells/styles.css`
- 只有当你先隔离出一个独立的现代运行时入口 / 子应用 / remote，或已证明 legacy 主树可直接承载该运行时契约时，才允许重新启用标准壳依赖线

本 skill 已内置依赖快照：

- [`../../vendor/typical-page-shells-package.json`](../../vendor/typical-page-shells-package.json)
- [`host-integration-dependencies.json`](host-integration-dependencies.json)

补依赖时不要只看 `typical-page-shells` 的 `peerDependencies`。

- 页面壳层依赖以 `typical-page-shells-package.json` 的 `peerDependencies` 为准
- 宿主示例层自己的直依赖与构建链前提以 `host-integration-dependencies.json` 为准
- 这两份快照应维护为“当前仓库已验证通过”的具体版本，不要再用宽松 `>=` 范围把目标项目安装到更新的 experimental 漂移线上
- `bootstrap-target-project.mjs` 会基于 `examples/host-integration/src` 的真实导入自动补齐缺失依赖，并要求上述快照里存在对应版本

这意味着类似 `@hi-ui/hooks` 这种“宿主示例临时多用了一个包，但补依赖脚本没有跟上”的问题，或者 `sass-embedded` 这种“示例页含有 SCSS 但目标项目没被补齐 Sass 编译器”的问题，应该在规则包维护阶段就被消灭，而不是等目标项目构建时再暴露。

## 已知上游风险边界

当前标准壳运行时依赖线仍建立在 HiUI 5 experimental 与 schema 4.x experimental 之上，因此外部项目安装后可能在 `npm audit` 中看到一组集中告警。默认应按“上游依赖树风险”理解，而不是误判成业务页源码单独引入了 10 多个独立漏洞。

- `@hiui-design/typical-page-shells` 被标红时，通常是因为它依赖的 `@hi-ui/schema-*` 链路被级联放大，不代表壳包本身额外暴露了一条独立漏洞
- 当前最常见的一条是 `@hi-ui/schema-table-extensions` 传入的 `immer@8.x`
- 这类告警很多会表现为 `fixAvailable: false`，或者只能通过 semver-major 升级消除
- 在上游没有发布兼容新版本之前，不要为了“清空 audit”直接在目标项目里私自强升 schema / shell 依赖
- 若当前项目要面向正式生产环境上线，必须把这类告警纳入发布风险评估，并明确由谁承担升级验证成本

推荐处理方式：

- 把它记录为 `hiui-design` 标准运行时的已知上游风险，而不是归咎于当前业务页面实现
- 跟踪 HiUI / `@hiui-design/typical-page-shells` 的后续兼容版本，再统一升级验证
- 若业务宿主对 production audit 门槛极严，优先采用 `rules-only` 或 `legacy-host-compatible`，避免把标准壳运行时整包带入主业务树；其中 `legacy-host-compatible` 仍可在 planner 已证明的前提下复用 project-certified carrier / page-component，而不是一律退回 reference-only 翻译

不要这样做：

- 不要在未验证的情况下，用 `overrides` / `resolutions` 强行把 `immer` 或整条 `@hi-ui/schema-*` 依赖树抬到更高版本
- 不要因为 audit 条目数量多，就把它误当成 14 个彼此无关的问题分别处理
- 不要把上游 experimental 运行时告警包装成“业务项目自己引入了高危代码”

若目标项目里已经装过一套旧视觉层依赖或旧演示页，请先清理它们，再接入典型页。

- 典型页目标依赖线是 HiUI 5 experimental + schema 4.x experimental
- `@hi-ui/schema-*`、`@hi-ui/use-ref-state`、`@hi-ui/use-subscription` 的 `4.x` 版本号属于当前 schema 生态，不等于“继续沿用旧视觉规则”
- 真正需要清理的是 `@hi-ui/card`、`@hi-ui/button`、`@hi-ui/form`、`@hi-ui/input`、`@hi-ui/page-header` 等旧视觉包的 `4.x` 线，以及项目里残留的 `hi-v4-*` 选择器

## 旧宿主桥接接入模式的主树边界

- `hiui-design` 的标准典型页运行时不是“给旧宿主补一个 hiui5 alias 就能共存”的模式
- 如果目标项目把 `react / react-dom` 固定在 `<18`，把 `ahooks` 固定在 `<3`，同时又通过 `hiui5` 之类的别名包局部引入 HiUI 5 组件，这种做法只适合项目内的定制兼容页面，不等于已经具备标准典型页运行时
- 如果目标项目还是 Module Federation remote，并在构建层把 `react` / `react-dom` 作为旧版本 singleton 全局共享，那么 `@hiui-design/typical-page-shells` 依赖的 React 18 运行时前提会被直接破坏
- 这种宿主主树上不要继续默认安装或直接生成标准 `hiui-design` 典型页运行时；否则页面代码、样式、Schema、QueryFilter 和宿主桥接都会与 skill 规范分叉
- 正确做法只剩两类：
  - 给典型页单独隔离一个现代运行时入口 / 子应用 / remote，真实安装 `@hiui-design/typical-page-shells` 所需依赖
  - 或者继续使用本 skill 的 `legacy-host-compatible` 旧宿主桥接接入模式：主树不默认直挂标准壳运行时，但普通典型页仍优先遵循 planner 选中的 project-certified carrier / runtimeAdapterProof-backed page-component；只有这条链路不可用时，才回到宿主自己的运行时、页面基座和 `hiui5` alias
- 从当前版本开始，doctor 不只看 `package.json` 声明，还会检查 `node_modules` 的真实根运行时：
  - 若源码仍有 `@hi-ui/hiui/es*` 消费，但根 `@hi-ui/hiui` 已被解算到不再暴露 `./es` 的 5.x 包，直接判为硬失败
  - 若 legacy host 在声明上是 `react16/17`、`react-dom16/17`、旧版 `@hi-ui/hiui`，但安装结果把根位漂移到 React 18 或 HiUI 5，同样直接判为硬失败
- 这条规则的目的不是阻止你使用 `hiui5` alias，而是防止 alias 安装过程把宿主根运行时一并替换掉

进入 `legacy-host-compatible`（旧宿主桥接接入模式）后再补一条：

- 若宿主已存在 `PageTable` / `page-table-v5` / schema 化搜索页容器，列表页和统计页必须优先映射到该基座，不要回退成手写 `Search + Select + Table`
- 若宿主默认 `page-header` 标题是 `20px` 或自带额外底部外边距，生成页必须在页面局部把页头基线归一到 `18px` / `margin-bottom: 0`

补充说明：

- 上面这条“优先映射到该基座”只是兼容模式的默认建议，不高于页型专章
- 若当前仓库存在项目级 override，例如 `docs/business-lines/after-sales/asp-fwt-common-front.md`，则项目级 override 优先
- 尤其是 `table-stat` / `data-visualization` / `full-page-edit` / `full-page-detail` 这类强结构页型，应先确认宿主基座是否能完整承载其核心 region，再决定是否继续复用该基座

## 壳包来源策略

- 若 `.local-context/hiui-design/vendor/` 下存在随 skill 一起分发的 `typical-page-shells` tarball，`bootstrap-target-project.mjs` 会优先把 `package.json` 写成项目内相对 `file:` 依赖
- 这样可以避免目标项目被 npm 以目录 link 方式安装，也能绕过私服暂时不可用时的 404 / 权限问题
- `rules/runtime-delivery-policy.json` 是壳包交付策略唯一真相；当前 maintainer / team / project / open-source 默认链路都要求 vendored tgz，不允许静默回退到 registry
- 若当前链路要求 vendored tgz、但 skill 里缺失 tarball，bootstrap 会直接 fail closed，而不是继续写一个大概率安装失败的 registry 版本号
- 只有在显式启用“公开 registry 可安装”声明、且 `check-public-runtime-publish-readiness.mjs` 与 `verify-public-runtime-release.mjs` 都通过后，才允许把公开 npm 版本当成额外分发能力对外宣称
- 接入完成后的 doctor 会额外检查 vendored tgz 与 `node_modules/@hiui-design/typical-page-shells` 的实际 QueryFilter bridge 默认值，防止“源码已修复但外部项目仍装到旧快照”的静默回退

## 默认接入模式

- `auto` 现在会在三种显式模式之间选择：
  - `greenfield + react-vite / react-vite-router` 优先 `host-integration`
  - 现代已有系统优先 `rules-only`
  - 旧宿主不兼容运行时自动提升为 `legacy-host-compatible`
- `rules-only` 只安装规则能力、标准壳依赖声明和脚本，并会默认把一份 reference-only 典型页同步到 `.local-context/hiui-design/reference/host-integration/src/`
- `legacy-host-compatible` 只安装规则能力和脚本，并同步同一份 reference-only 典型页；不会自动把标准壳依赖、样式入口、宿主桥接或 route gallery 接进当前宿主主树
- `rules-only` / `legacy-host-compatible` 都不会把 `examples/host-integration` 下的模版页面、路由 gallery、宿主桥接文件同步进目标项目 `src/`
- 新业务页应直接落在目标项目原有目录结构中；`hiui-design` 只作为 `.local-context` 里的规则与参考资产存在
- 若当前项目后续要接管机器级全局同步，不要把“只完成了 rules-only / legacy-host-compatible 接入的项目本地 `.local-context/hiui-design`”自动视为可发布源；在执行 `manage-global-sync-launch-agent.mjs activate` 之前，必须先确认该目录已经通过 `apply-in-current-project.mjs` 拉平到当前全局版本，并且至少存在 `examples/host-integration/src/`、`examples/host-integration/src/`、`templates/i18n/`、`templates/project-images` 最小图片接线骨架、`agents/openai.yaml`、`SKILL.md`
- `rules-only` / `legacy-host-compatible` 下，不允许只靠 prose 规则自由发挥；生成前必须先用 `docs/generation/rules-only-component-matrix.md` 明确每个关键区域对应的组件语义或宿主基座；若命中 legacy，再继续读 `legacy-host-compatibility.md`
- 只有明确需要一套可打开的基线联调页、宿主桥接 demo 或 smoke gallery 时，才显式使用 `--mode host-integration` 或 `typical-page:apply:host-assets`
- 即使显式使用 `host-integration`，外部项目后续新生成的页面默认也仍然是业务页；除非用户明确要求“作为示例页面接入”或“接到 smoke/gallery/host-integration 示例壳”，否则不要把这些业务页自动挂进 `src/typical-page-reuse/routes/config.*` 或写进 `src/typical-page-reuse/pages/*`
- 当前典型页主包 `@hiui-design/typical-page-shells` 默认不包含左侧导航；导航、菜单、路由注册和面包屑属于宿主项目能力
- 如果新项目需要一套带最小导航的开箱即用壳，只能通过 `host-integration` 这类可选宿主层提供，而不是把导航并入 `@hiui-design/typical-page-shells`
- `host-integration` 默认附带一个位于侧边栏底部的头像入口，用于打开与 HiUI Layout 示例一致的用户卡片和语言子菜单，方便直接观察多语言适配变化
- 对 `greenfield + react-vite-router / react-vite` 这类新项目，`host-integration` 现在会优先尝试自动 patch 顶层 `App.*`、入口 `main.* / index.*` 与 Vite starter 的根容器样式：把同步出来的最小导航壳接到路由出口、补 `BrowserRouter`，并清掉默认 `#root` 窄容器 / 居中样式；如果任一步无法安全 patch，会输出对应 snippet，并在文件里写明跳过原因
- 通过 `setup-for-designers.mjs` 或 `apply-in-current-project.mjs` 成功落成可自动访问的 `host-integration` 示例路由后，脚本默认会优先复用当前已运行的本地 dev server；若未检测到可达服务，则尝试在后台启动 `scripts.dev` 并自动弹浏览器打开首个典型页面示例；如不需要该行为，可显式传 `--skip-open-browser`
- 新项目同步出的最小导航壳默认对齐当前仓库左侧导航风格，且所有典型页统一挂在一级菜单 `示例` 下
- 左侧一级菜单 icon 是信息架构语义，不是装饰占位；所有可见一级菜单必须按菜单域选择不同的 `@hi-ui/icons` 面型图标
- 默认 `示例` 节点保持 `AppStoreFilled`；`AppStoreFilled` 只用于 smoke/gallery 示例入口，不能复制给 `业务` / `项目` / `订单` / `工单` 等真实业务分组
- 常见业务一级菜单可按语义选 `BusinessCardFilled` -> `业务`、`FolderOpenFilled` -> `项目`，其他域也必须选匹配业务含义的 `Filled` 变体；除非路由 owner 明确记录同域复用原因，否则多个一级菜单不得复用同一个 icon
- `host-integration` 自带的 route gallery / smoke 页默认只用于联调和回归基线，不应长期作为正式业务首屏或默认首页
- 若项目保留 route gallery，必须使用路由级懒加载，不要把所有典型页和图表页通过静态 import 一次性打进主 chunk
- 数据可视化示例页会直接拉起 `@ant-design/charts` 图表栈；如果把示例 gallery 长期挂在正式路由树里，即使用户只访问基础表格，也可能连同图表运行时一起进入首包
- 对正式业务系统，推荐做法是：示例 gallery 只在联调环境保留，真实业务页落在原有业务路由中；若必须保留示例入口，也要把它从默认落地页移开，并持续观察 bundle 体积

## 一级菜单 icon 语义契约

- 导航、菜单、权限和路由归属宿主项目；因此一级菜单 icon 也必须由宿主路由 owner 按真实业务域负责，而不是由页面生成过程随手复制示例 icon
- 任何新业务页接入宿主菜单时，都必须先确认所属一级 route group；若新增一级组，必须同步补充语义 icon import 和 route icon
- `示例` 只代表典型页 gallery，所以可以使用 `AppStoreFilled`；真实业务域继续使用 `AppStoreFilled` 会让用户误以为业务页仍属于示例仓库
- 禁止把 `表格` / `图表` / `表单` / `详情` / `异常` 这类页型分类提升为应用一级菜单，也禁止用同一个占位 icon 掩盖菜单分层错误
- 交付前必须跑 `typical-page:doctor`，其中 `top-level-menu-icon-semantics` 会检查缺失 icon、线型 icon、非 `示例` 复用 `AppStoreFilled`、多个一级菜单复用同一 icon 等问题

## 路由树与菜单树同源原则

- `useRoutes()` 决定页面能否打开；`TypicalPageAppFrame routes` 决定左侧菜单层级。两者不能各自使用一棵不同层级的树。
- 保留同步典型页 gallery 时，必须先定义一个宿主级 `typicalPageGalleryRoute`，默认 `title: '示例'`、`path: 'examples'`、`icon: <AppStoreFilled />`、`children: typicalPageReuseRoutes`。
- 同一个 `typicalPageGalleryRoute` 必须同时进入 `appRoutes` 和 `TypicalPageAppFrame routes`，例如 `appRoutes = [redirectRoute, typicalPageGalleryRoute]`，`<TypicalPageAppFrame routes={[typicalPageGalleryRoute]}>`。
- 禁止 `<TypicalPageAppFrame routes={typicalPageReuseRoutes}>`。这会把 `表格` / `图表` / `表单` / `详情` / `异常` 从典型页分类错误提升为应用一级菜单。
- 默认首页跳转到包装后的首个示例路径，例如 `/examples/table/common/basic`。若必须兼容旧的 `/table/common/basic`，用 redirect alias 处理，不要为了短 URL 降级菜单树。

## 单一宿主拥有者原则

- 对 `greenfield + host-integration`，顶层应用壳只能有一个拥有者，默认就是同步出来的 `src/typical-page-reuse/app-frame.tsx`
- 顶层 `App.*` 应优先挂 `TypicalPageAppFrame`，让它统一拥有左侧导航、header / footer portal、路由标题兜底、主体背景和内容区高度链
- `ExampleAppShell` 只用于“没有真实宿主 header / footer 合同”的孤立 smoke 页面，或 `createTypicalPageReuseRoutes({ wrapInShell: true })` 这种单页包裹场景，不能再拿来当整个应用的根壳
- 不要在顶层 `App.*` 里再手写一套 `ExampleAppShell + HashRouter/BrowserRouter + NavLink + 自定义 sidebar` 的工作台；这会把导航、页头、白底主体和滚动高度链拆给两套宿主分别管理
- 一旦出现“双宿主”，常见症状就是：
  - 左侧导航风格与当前项目 `app-frame.tsx` 不一致
  - `PageHeader` 通过 portal 挂到了导航上方，而不是主体内容区 header 槽
  - 表格类页面的白底主体无法铺满到底部，只剩外层灰底兜底
  - 全页编辑的 `inlineEditFooter` 失去吸底基准，页面也会出现不可滚或双滚问题

三种模式的完整边界说明见：

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
9. 宿主框架层默认保留主内容区右侧 `16px` 视口留白；浮动子菜单收起时，左侧导航与主体区域之间也保留 `16px` 间距；浮动子菜单展开时只去掉左侧留白，不要把右侧 `16px` 一并清掉

其中第 6 条只意味着给 `PageHeader` 根节点保留 `width: 100%`、`minWidth: 0` 这类铺满宽度的样式，不要在 `page-header-portal.tsx` 里额外把 `PageHeader` 根节点强行改成 `display: flex` / `alignItems: center`。`PageHeader` 自己的内部内容容器会负责把标题和 `extra` 操作区拉开；宿主层如果改写根布局，按钮反而会挤在标题后面。

其中第 7 条对全页编辑还要再向下延续到页面根和 `ProEditPage` 外层直系包裹层。也就是说，宿主内容列、路由出口、页面根、`ProEditPage` 之间不能突然切回普通块级文档流；若确实要加包层，也必须继续传递 `display: flex`、`flex-direction: column`、`flex: 1 1 0%`、`min-height: 0`，必要时 `overflow: hidden`。否则 `inlineEditFooter` 会失去可吸附的高度基准，退回“跟着内容走”的普通底部区域。

不要让页面直接耦合当前项目内部布局。

## 样式资源前提

下面这组前提只适用于最终会直接导入 `@hiui-design/typical-page-shells` 的项目，也就是 `host-integration` 和现代 `rules-only`。

若当前项目已被 doctor / bootstrap 提升为 `legacy-host-compatible`：

- 不要补 `styles.css`
- 不要把这些标准壳样式前提继续强塞进旧宿主
- 先按 `legacy-host-compatibility.md` 走宿主自有布局 / 组件封装的实现路径

- 目标项目构建链必须允许 `node_modules` 内的 `css / scss` 资源随 `@hiui-design/typical-page-shells` 正常生效
- 目标项目应用入口必须显式引入一次 `@hiui-design/typical-page-shells/styles.css`
- `@hiui-design/typical-page-shells/styles.css` 现在会在典型页公共根容器上固定 `16px` 字号基线，用来隔离宿主把 `html` / `body` / 内容槽默认字号整体调大或调小后对典型页示例的继承性干扰；不要再在业务页根手写第二套全局字号兜底
- 目标项目源码里如果已经开始使用 `@hiui-design/typical-page-shells`，`package.json` 必须正式声明该依赖；不要依赖本地安装树里的私有物理路径
- 典型页相关代码只能从 `@hiui-design/typical-page-shells` 及其公开子路径导入，不要使用 `node_modules/.pnpm/...`、`../node_modules/...`、`@hiui-design/typical-page-shells/dist/*`
- 若数据统计页的指标卡退化成普通文本、白底壳层消失、页头与内容贴在一起，优先排查样式资源是否被目标项目构建链忽略
- `@hiui-design/typical-page-shells/package.json` 已把样式资源声明为 `sideEffects`；不要再把它当成“纯 JS 无样式包”
- 若表单内 `CheckSelect` 已选标签只剩关闭图标或计数，优先排查是否绕开了包内 `Form` 桥接；直接使用 `SchemaForm` 时，必须包 `TypicalPageFieldMapProvider`

推荐在 `src/main.tsx`、`src/main.ts`、`src/index.tsx` 或 `src/index.ts` 之一中加入：

```ts
import '@hiui-design/typical-page-shells/styles.css'
```

若目标项目是 Vite，还需要确认 `vite.config.*` 中存在：

```ts
resolve: {
  alias: {
    '@hi-ui/schema-types': '/absolute/path/to/.local-context/hiui-design/examples/host-integration/src/shims/schema-types-empty.js',
  },
}
```

原因：

- `@hi-ui/schema-types` 只有类型声明，缺少可供 Vite 预构建使用的 JS 运行时入口
- 可直接复用本 skill 自带 shim：`.local-context/hiui-design/examples/host-integration/src/shims/schema-types-empty.js`
- `rules-only` 模式不会自动 patch Vite；只有 `host-integration` 模式才会尝试自动 patch 常见 Vite 配置，无法安全 patch 时会输出 `VITE_ALIAS_SNIPPET.md`

## 接入后先验基线

- `rules-only` / `legacy-host-compatible` 模式下，都会默认把 reference-only 示例页同步到 `.local-context/hiui-design/reference/host-integration/src/`
- 生成首个业务页时，先按页型选择对应参考示例：
  - 表格类：`.local-context/hiui-design/reference/host-integration/src/pages/basic-table.tsx` 或 `table-stat.tsx`
  - 抽屉类：`.local-context/hiui-design/reference/host-integration/src/pages/drawer-form.tsx` 或 `drawer-detail.tsx`
  - 全页类：`.local-context/hiui-design/reference/host-integration/src/pages/full-page-edit.tsx` 或 `full-page-detail.tsx`
- 在替换业务字段前，先用 `docs/generation/rules-only-component-matrix.md` 锁定页壳、标题区、筛选区/表单区、主体区、分页/底栏的落点；若当前项目是 `legacy-host-compatible`，还要先看 `plan-page-task` 是否已经选中可直接复用的 page-component / carrier
- 参考示例只用于理解壳层和节奏，不应整包复制为 `src/typical-page-reuse/*`
- 如果首个真实业务页出现白卡消失、页头贴边、双滚动、固定底栏失效、表格高度不收口，优先修宿主和样式资源，不要继续批量生成新页面
- 如果全页编辑底部操作区没有吸底，不要先去改单页 footer 样式；先检查 `inlineEditFooter` 是否仍在 `ProEditPage` 内、是否是 `formScrollBody` 的同级兄弟，以及宿主内容列 -> 路由出口 -> 页面根是否保持连续高度链
- 当前接入脚本默认已经自动补齐多语言文案、locale-aware formatter 与 RTL 基线；若后续需要重同步 locale 文件或刷新 wrapper，再执行 `pnpm typical-page:i18n:init` 或 `npm run typical-page:i18n:init`。该脚本只补 `src/translation/*`、`messages.ts` 与 `i18n:sync`，不强制替换项目已有 i18n runtime
- 当前接入脚本默认也会自动补齐 `src/typical-page-reuse/assets/` 下的最小图片接线骨架与图片模块声明；若后续需要重建这套骨架，再执行 `pnpm typical-page:images:init` 或 `npm run typical-page:images:init`

## 优先参考的资产

- `../examples/host-integration/src/components/layout/layout-content-context.tsx`
- `../examples/host-integration/src/components/layout/page-header-portal.tsx`
- `../examples/host-integration/src/components/layout/typical-page-host.tsx`
- `../examples/host-integration/src/app-frame.tsx`
- `../examples/host-integration/src/app-shell.tsx`
- `../examples/host-integration/src/routes/config.tsx`

## 脚本边界

`setup-for-designers.mjs` / `apply-in-current-project.mjs` / `bootstrap-target-project.mjs` 会：

- 默认注册规则能力脚本
- 默认自动补齐 `src/translation/*`、`messages.ts` 与 `i18n:sync`，使外部项目接入后立即具备多语言国际化基线
- 默认自动补齐 `src/typical-page-reuse/assets/project-product-images.ts`、`product-catalog/README.md` 与图片模块声明，使外部项目接入后立即具备项目图片集接线入口
- `rules-only` / `host-integration` 下，会补标准 `@hiui-design/typical-page-shells` 依赖线
- `legacy-host-compatible` 下，不会自动补标准壳依赖，只保留显式 legacy 模式脚本和 reference-only 参考页；但这不等于禁止典型页组件，普通典型页仍应优先服从 planner 选中的 certified carrier / runtimeAdapterProof 路径
- 默认不改目标项目现有目录结构，不把模版页面挂到 `src/`，不挂路由 gallery，不落宿主桥接文件
- `rules-only` / `legacy-host-compatible` 下默认只同步 reference-only 典型页到 `.local-context/hiui-design/reference/host-integration/src/`
- `host-integration` 模式下才会同步 `examples/host-integration/` 到 `src/typical-page-reuse/`
- `host-integration` 模式下才会尝试自动挂接常见路由文件
- `host-integration` 模式下，若识别为 `greenfield + react-vite-router`，还会尝试自动把最小导航壳挂到顶层 `App.*`
- `host-integration` 模式下才会对常见 Vite 配置补 `@hi-ui/schema-types` alias；若无法安全 patch，输出手工片段
- 上述 `host-integration` 同步出来的是固定基线示例和 smoke/gallery 资产，不意味着后续生成的业务页会自动成为示例页；业务页默认仍应落在项目既有业务目录中

不会：

- 替换目标项目已有布局实现
- 覆盖高度定制的路由结构
- 帮你决定页型

## 接入完成后的边界

- `rules-only` / `legacy-host-compatible` 默认都不向目标项目 `src/` 写入宿主层示例文件，但会在 `.local-context` 下保留 reference-only 示例页
- 无论当前项目是否已启用 `host-integration`，后续新生成页面默认都按业务页处理；除非用户显式要求“作为示例页面接入”，否则不要把它们并入 `src/typical-page-reuse/**`、示例 route gallery 或官方示例资产
- 现代 `rules-only` 页面壳层可以来自 `@hiui-design/typical-page-shells`
- `legacy-host-compatible` 主树页面壳层默认不把标准壳运行时当作可随手直挂的前提；普通典型页优先走 planner 选中的 project-certified carrier / runtimeAdapterProof-backed page-component，未证明时再回到宿主自己的布局、页面基座和 `hiui5` / 本地组件封装；若已隔离出独立现代运行时入口，则按 `isolated-standard-shell` 处理
- 旧宿主保持原有导航区与路由结构不变；多语言开发能力继续通过 `src/translation/*`、formatter bridge 与 reference-only 示例页保留
- 页面起点优先来自 `.local-context/hiui-design/reference/host-integration/src/pages/*`
- reference 目录缺失时，再回退到 `examples/host-integration/src/pages/*`
- 统计页 / 表格页的高度链与样式资源要在首个真实业务页上验证，再继续做业务替换
- 组件拿不准时，再看 `hiui-v5-quick-reference.md`

## 当前项目的隔离标准壳接入方式

当目标项目整体仍是 legacy 宿主，但你又希望某个新页面**直接照搬示例页标准壳组件实现**时，推荐做法不是修改主 remote，而是新增独立子应用。

当前项目推荐约束：

- legacy 主仓继续保持 `react@16` / `react-dom@16` / singleton shared
- 标准壳页面单独放到 `subapps/typical-page-shell-runtime/`
- 子应用单独安装 `react@18`、`react-dom@18`、`ahooks@3` 与 vendored `@hiui-design/typical-page-shells`
- legacy 宿主通过 URL 跳转、新标签页或 iframe 打开子应用页面
- `src/` 主树禁止直接新增 `@hiui-design/typical-page-shells` 导入

当前项目可直接使用：

```bash
npm run typical-page:setup:isolated-shell
```

该命令会在仓库里脚手架出隔离子应用骨架，并写出当前项目说明：

- `subapps/typical-page-shell-runtime/`
- `.local-context/hiui-design/outputs/CURRENT_PROJECT_ISOLATED_STANDARD_SHELL.md`

后续若页面明确落在这个隔离子应用里，就允许按 `docs/generation/isolated-standard-shell.md` 直接参照示例页实现。
