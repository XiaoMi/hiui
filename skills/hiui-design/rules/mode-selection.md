# 接入模式判定

这份文件只负责 3 件事：

1. 判断项目画像
2. 选择 `host-integration`、`rules-only` 或 `legacy-host-compatible`
3. 明确后续应该扩展读取哪些文档

## 默认判定

- `greenfield` + `react-vite` / `react-vite-router`
  默认走 `host-integration`。
- `existing-system` + `react-vite-custom-layout` / `react-router-custom`
  默认走 `rules-only`。
- `umi` / `next` / 微前端
  默认走 `rules-only`，不要自动覆盖正式宿主。

## 旧宿主桥接接入模式

若命中下面任一特征，切到 `legacy-host-compatible`：

`legacy-host-compatible` 的人类解释统一为“旧宿主桥接接入模式”。这里的 `compatible` 只表示宿主边界与运行时契约可以被桥接和证明，不表示任意旧宿主天然兼容，也不表示只要能挂载就已经进入受管生成 / 交付状态。

- `react` 或 `react-dom` 主运行时 `< 18`
- `ahooks` 主运行时 `< 3`
- 保留旧版 `@hi-ui/hiui`，只通过 `hiui5` 等 alias 局部接入 HiUI 5
- Module Federation remote 把旧版 `react` / `react-dom` 作为 singleton 共享

进入该模式后：

- 继续复用典型页页型和结构节奏
- 不默认把标准 `@hiui-design/typical-page-shells` 作为 legacy 宿主主树的直接运行时依赖前提；是否可直接接入，仍取决于宿主是否已证明可承载该运行时契约
- 改为以 standard certified page component + `legacy-runtime-adapter` proof 作为普通典型页主链路；旧宿主只提供全局导航、左侧菜单、业务路由入口和干净内容挂载点
- 项目接入 / capabilities 阶段必须自动读取项目结构来判断内容区是否独立；当存在清晰业务页根目录（`src/views` / `src/pages` / `src/routes`）和 Module Federation remote `exposes` 时，`CleanContentMount`（clean content mount）可由结构证据自动通过，并记录为 `clean-content-mount:project-structure`
- 项目接入 / capabilities 阶段也必须自动扫描 runtime bridge 能力；request、response、message、dictionary / i18n、permission、user、route-navigation、theme 等结果进入 `legacyHostFamily.inferredFacts.runtimeBridge`，并明确 `passedCapabilities` / `missingCapabilities`
- `portal-root` 默认视为浮层运行时的常规能力，不作为接入期 runtime bridge 的硬必需项；只有宿主显式自定义 popup container、或存在 overflow / z-index 裁切风险时，才要求额外补 `PortalBoundary` 事实
- 若用户需求清晰命中普通典型页型且没有特殊要求，优先使用 standard certified page component + `runtimeAdapterProof`，并只替换业务槽位；只有组件不可用、结构升级或宿主约束特殊时，才进入同页型宿主 archetype / 兼容示例 / scaffold fallback，不要重新手工推演 primitive 页面
- 必须通过 `runtimeAdapterProof` 门禁确认 runtime bridge、style boundary、portal boundary 与 `legacy-runtime-adapter` 能力；`CleanContentMount` 优先消费自动结构识别结果，只有结构证据不足时才补宿主边界事实。proof 缺失、blocked 或职责越界时不能把页面组件作为主生成资产
- 额外读取 `docs/generation/legacy-host-compatibility.md`
- 需要核对页面组件策略时读取 `docs/generation/page-level-components.md` 与 `docs/generation/component-certification.md`
- 若当前仓库是 `asp-fwt-common-front`，再额外读取 `docs/business-lines/after-sales/asp-fwt-common-front.md`
- 只放宽运行时与接入方式；**不放宽**页型专章里的 mandatory components、required regions 与 ownership 要求
- 不要把“桥接旧宿主”误解成“可以退回旧搜索壳 / 旧表格页 / 旧抽屉页”

`host-compatible` 是业务口语别名；脚本与 contract 中的机器字段统一归一化为 `legacy-host-compatible`。

### 旧宿主下的隔离标准壳例外

若目标项目整体仍命中 `legacy-host-compatible`，但同时满足下面条件，可以把**单个页面的交付策略**提升为 `isolated-standard-shell`：

- 标准壳页面运行在独立子应用 / 独立构建产物中
- 独立子应用自己安装 `react@18`、`react-dom@18`、`ahooks@3` 与 `@hiui-design/typical-page-shells`
- 承担 legacy 主树职责的当前 remote 不直接导入 `@hiui-design/typical-page-shells`；若需直接导入，应落到独立子应用或独立运行时边界
- legacy 宿主只负责打开独立页面 URL、iframe 或新标签页，不承载标准壳运行时

命中该例外时：

- **项目模式仍然是** `legacy-host-compatible`
- **页面实现策略**可以写成 `isolated-standard-shell`
- 页面可以直接从示例页起步并照搬标准壳组件实现
- 额外读取 `docs/generation/isolated-standard-shell.md`

补充说明：

- 若业务明确要求“保留旧宿主左侧导航，只切右侧内容区”，则不要把 `isolated-standard-shell` 当成正式交付结果
- 对 `asp-fwt-common-front` 这类旧宿主，isolated shell 仅用于 baseline / smoke / screenshot 验证

## 模式边界

- 不要因为同步出了 `src/typical-page-reuse`，就把项目误判成 `existing-system`
- 对已有系统，`host-integration` 只作为 smoke / gallery 联调基线，不直接覆盖正式宿主
- `rules-only` 不接入示例 gallery / 示例路由，但不禁用页面级组件；普通典型页仍应优先使用 `supportedModes` 包含 `rules-only` 的认证页面级组件
- 没有完整 `.local-context/hiui-design/` 目录时，先停止生成，先复制完整 skill 目录

## 模式化输出要求

- 通用输出始终包含：执行链路（fast-slot / standard-typical / strict-structure，可叠加 formal-acceptance）、当前模式、模式来源（project-lock / bootstrap-summary / explicit / fallback detection）、页型判断、已读取的 rules/docs、脚本入口与关键结果
- 执行链路必须先于命令清单输出；链路由页面类型和改动边界决定，不由“快速 / 正式”等提示词直接决定；正式验收只作为叠加层
- 编码前的固定起手顺序与字段清单，统一看 `../docs/generation/ai-kickoff-template.md`
- 若 kickoff 中要求的关键事实仍是猜测、占位或写不出来，就先停下补事实，不要开始写页面
- `required regions`、ownership 映射与其它 contract 字段，统一看 `contract-regions.md`
- 对表格类页型，还必须显式输出 `QueryFilter` / `FilterDrawer` / `Table.resizable` / `Table.setting` 的可用性结论
- 若命中隔离标准壳例外，再额外输出 `page delivery strategy`
- `host-integration`
  输出宿主接入方式、同步资产落点、doctor 结果和遗留宿主风险
- `rules-only`
  输出 `pageComponent` 选择结果、唯一 `example path`、唯一 `host archetype path`、业务槽位替换范围；若 `generationStrategy=page-component`，说明示例只作为认证 / 结构证据和 fallback 起点；非快速路径或修改 ownership 时再展开 `example -> host` 区域映射和 ownership 映射；contract 细则看 `contract-regions.md`
- `legacy-host-compatible`
  输出 `pageComponent` 选择结果、`runtimeAdapterProof` 状态、所复用的 `legacy-runtime-adapter`、当前是否仍处于 legacy 主树直连标准壳之外的边界说明、业务槽位替换范围、桥接限制和待人工确认项；若计划进入 fallback / 漂移治理，再补 `host archetype`、`Semantic Lock`、`Translation Map`、`Isomorphism Check` 与 `driftExceptions`（若有）

## 退出后的诊断格式

触发退出时，至少输出：

- 当前模式和失败步骤
- 已读取的 rules / docs 文件
- 已确认或未确认的 mandatory components
- 失败信号、冲突详情或缺失基座
- 需要人类决策的最小问题集合

## 下一步

- 模式确定后，继续读 `page-type-map.md`
- 模式确定后，立刻回到 `../docs/generation/ai-kickoff-template.md` 对照固定起手块；不要跳过起手块直接编码
- 需要执行接入动作时，调用 `scripts/setup-for-designers.mjs` 或 `scripts/apply-in-current-project.mjs`
- 需要在旧宿主里准备隔离标准壳子应用时，调用 `scripts/setup-isolated-standard-shell.mjs`
- 需要宿主接入说明时，按需读 `docs/onboarding/install-and-host.md`、`docs/onboarding/host-profiles.md`、`docs/onboarding/integration-modes.md`
