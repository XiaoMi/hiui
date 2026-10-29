# Script Index

## 面向使用者

- `setup-for-designers.mjs`
  最高层入口。适合设计师在“项目本地 `.local-context/hiui-design/` 已完整存在”后做首次接入或重复同步时使用。若当前项目还是 `missing-context`（缺少项目本地 hiui-design 上下文，这里表示项目里还没有完整能力包），先从 skill 包根目录执行 `scripts/ensure-in-current-project.mjs --target <project-root>`，不要直接硬跑项目内 `setup-for-designers.mjs`。脚本本身现在会先跑 `typical-page:preflight`（页面任务开门检查，这里用于判断是否允许开始生成页面），命中老 React 宿主时先补 `react-dom/client` / `react/jsx-runtime` 兼容分支；命中老 `Webpack Module Federation` 宿主时，还会继续按受管顺序补 `HiUI5 replacement bridge`（HiUI5 替换桥，这里用于把新典型页运行时链路隔离到兼容实现）、`shared contract`（共享依赖合同，这里用于避免新旧运行时被错误合并成同一个单例）并重跑 `dependency-isolation-check.mjs`（依赖隔离检查，这里用于确认补完后的依赖版本不会再串线）。项目接入不再自动拉起 skill 包内 `preview-runtime/`（预览运行目录，这里指官方示例页服务）；如需查看官方示例，改为手动从 skill 包根目录执行 `node scripts/start-preview-runtime.mjs`。
- `package-clean-distribution.mjs`
  干净分发打包入口。按 `distribution-manifest.json`（分发清单，指正式允许进入分享包的公开边界）和 `skill.manifest.json`（安装合同，指这个 skill 最少必须带上的路径集合）收集文件，默认输出 `outputs/distribution/*.tar.gz`（压缩包文件），并自动排除 `.git/`、`outputs/`、`preview-runtime/node_modules/`、`examples/host-integration/node_modules/`、`preview-runtime/dist/`、`.hiui-design-cache/`、`.local-context/`、`docs/business-lines/`、`examples/business-lines/`、`scripts/tests/`、`scripts/local-quality-gate.mjs`、`scripts/ci-quality-gate.mjs`、`scripts/package-clean-distribution.mjs`、`scripts/verify-distribution-package.mjs`、`scripts/sync-manifest-docs.mjs`、`scripts/sync-shell-package-snapshot.mjs`、`scripts/check-i18n-template-boundary.mjs`、`scripts/verify-light-flow-regressions.mjs`、`.DS_Store` 与 `*.log` 这类本机痕迹、维护测试或非公开扩展。
- `verify-distribution-package.mjs`
  分发包验收入口。直接对 `zip`（压缩包）、`tar.gz`（压缩归档文件）或已经解压的目录做检查：确认关键入口文件还在、维护脚本已被剔除、`page-types.manifest.json`（页型清单文件，这里定义模板和规则引用）与 `public-cli-contracts.json`（公共命令合同文件，这里定义脚本公开入口）里的路径引用都能落到真实文件、关键脚本还能通过 `node --check`（Node 语法检查命令，这里用于确认脚本至少没有语法损坏），并可选执行 `start-preview-runtime.mjs --install-only`（只安装预览依赖，不启动服务）做轻量预览能力 smoke。
- `apply-in-current-project.mjs`
  在目标项目根目录执行的标准入口。`rules-only` 下会同时补齐共享运行时样式和项目级公共外壳基线，例如在 app entry 引入本地 `hiui-design-host.generated.css`；若宿主画像明确命中 `Camora regex proxy`，并且本地存在可识别的 Rspack/Webpack devServer 配置，还会自动补一层 no-cache response headers，降低 `remoteEntry.js` 与 chunk 命中不同缓存代的概率。
- `ensure-in-current-project.mjs`
  轻量 ensure 入口。只检查项目内 `.local-context/hiui-design/` 与 apply-state 是否就绪；缺 context 时先同步项目上下文，缺 apply-state 或 mode 非法时再调用 `apply-in-current-project.mjs`。默认不跑 doctor，但会把 `.local-context/hiui-design/outputs/PROJECT_PAGE_TASK_STATUS.json` 重置为 `ensure-only`，并要求后续先跑 `typical-page:preflight`，适合作为页面生成前的幂等前置。`ensure-only` 只说明 hiui-design 物料已同步，不等于“接入完成”或“可以开始生成页面”。若目标项目已经 ready，但你需要把最新 skill 包内容重新刷新到项目本地 `.local-context/hiui-design/`，可以从 skill 包根目录执行 `scripts/ensure-in-current-project.mjs --target <project-root> --force-context-sync`。
- `typical-page-preflight.mjs`
  普通业务页生成前的页面任务重验入口。读取 `integrationReadiness` 与页面生成放行结果，决定当前项目是否可以开始 hiui-design 页面生成；通过时把页面任务门禁写成 `ready-to-generate`，此时才对外代表“接入完成，可开始生成页面”；阻断时保留 `ensure-only` 并返回下一步兼容治理动作。正式宿主判定现在采用 contract-first：优先读取 `src/**/hiui-managed-host.contract.json`，缺失时才回退到旧源码启发式探测，contract 已存在但无效时会明确阻断。React 19 项目还会额外检查受管 runtime patch 基线是否仍然接在 `package.json` / `postinstall` / `.local-context` 上；若已安装的 `react-resize-detector` / `rc-resize-observer` 热点文件仍是未补丁版本，preflight 也会直接阻断，而不是把这类问题留到 doctor 才发现。
- `prepare-generation-baseline.mjs`
  页面生成前的项目级基线准备入口。只服务于“让当前项目稳定进入 hiui-design 页面生成”，不会代替具体页面生成，也不会执行页级 `managed-mf-host-contract-autofix.mjs`。它会先跑 `typical-page:preflight`，对命中的 `legacy React compat`（老 React 兼容）、`HiUI5 replacement bridge`（HiUI5 替换桥）和 `legacy MF shared contract`（老 Module Federation 共享合同）按受控顺序自动修补，并在老 `Webpack/Rspack Module Federation` 宿主上补做 `dependency-isolation-check.mjs`（依赖隔离检查，这里用于确认桥接后的运行时版本不会串线）；全部完成后再次回到 `typical-page:preflight` 复核页面任务门禁。它只处理项目级生成基线，不处理依赖具体 `page-type / dest / title` 的页级宿主物化。
- `managed-mf-host-contract-autofix.mjs`
  第二阶段最小宿主 contract 物化入口。只面向 `rules-only + existing-system + Module Federation direct expose` 且当前页型明确命中 `preWriteAction=materialize-managed-mf-host-contract` 的项目；它会受控物化 `src/business-shell/app-frame.tsx`、`src/business-shell/app-frame-core.tsx`、`src/business-shell/host-reset.css`、`src/business-shell/hiui-managed-host.contract.json` 与页面旁的受管 `mf-entry.*`，但绝不会覆盖冲突的项目自定义文件。成功后会把页面任务门禁重置回 `ensure-only`，要求重新跑 `typical-page:preflight` 刷新 contract 证据。
- `legacy-react-compat-autofix.mjs`
  老 React 运行时兼容自动修复脚本。面向高风险 React 16/17 宿主，自动补 `react-dom/client` 兼容 alias 与官方 shim；React 16 还会补 `react/jsx-runtime`、`react/jsx-dev-runtime`。当前支持“恰好一个”受管 `Vite`、`Rspack` 或 `Webpack` 配置文件；若项目是标准 `Rspack base + dev + prod` 多配置结构，也会优先落到唯一共享的 `build/rspack.base.conf.*`。修复后会把页面任务门禁重置回 `ensure-only`，要求重新跑 `typical-page:preflight`。
- `legacy-hiui5-bridge-autofix.mjs`
  老 `Webpack/Rspack` 宿主 `HiUI5 replacement bridge` 自动修复脚本。面向 `existing-system` 的高风险旧宿主，在“恰好一个”对象字面量 `CommonJS` 构建配置可安全改写时，自动接入受管 `hiui5-peer-replacement-bridge.cjs` 与 scoped replacement plugins；若项目是标准 `Rspack base + dev + prod` 多配置结构，也会优先落到唯一共享的 `build/rspack.base.conf.*`。无法安全改写时会返回阻断原因和下一步动作，而不是假装成功。
- `legacy-mf-shared-contract-autofix.mjs`
  老 `Module Federation` 共享合同自动修复脚本。当前项目仍声明旧 `@hi-ui/hiui`，同时又启用了 scoped HiUI5 bridge 时，它会把 `hiui5` 改挂到 `@hi-ui/hiui` share key，并把 `hiui5` / `@hi-ui/hiui` 都切回非单例，避免新旧运行时被错误合并成同一个共享实例。
- `typical-page-doctor.mjs`
  接入完成后的重验收脚本。现在会额外比对当前 `.local-context/hiui-design/.context.jsonc` 版本与最近一次 `typical-page:apply` 记录的版本；若不一致，仅给出 warning，并提示重新 apply。对 React 19 项目，doctor 还会检查受管 runtime patch 接线是否仍在，以及 `node_modules` 里的 `react-resize-detector` / `rc-resize-observer` 热点文件是否已经落到 patched 状态。doctor 主要用于首次接入验收、运行时异常排查和正式交付验收；普通页面生成默认不依赖 doctor 放行，doctor 也不会单独把 `ensure-only` 翻成 `ready-to-generate`。
- `assert-page-task-ready.mjs`
  页面任务硬门禁检查。统一读取 `integrationReadiness`、`PROJECT_PAGE_TASK_STATUS.json` 和 freshness 快照，返回当前是否允许开始 hiui-design 页面任务；未放行时只给出 ensure 或 preflight 的下一步命令。只有它判定为可生成时，才应对外把项目视为“接入完成”。当项目使用受管最小宿主 contract 时，freshness 会同时跟踪 contract 文件及其绑定的 `app-frame.*`、`app-frame-core.*`、`host-reset.css`、publish entry 证据，而不是只盯单个壳文件。
- `generation-brief.mjs`
  生成前输入包脚本。按页型读取 `page-types.manifest.json`、项目画像、官方母版和规则文档，输出单页 brief；它适用于复杂页面、批量生成、可审计交付或用户要求脚本化的场景。标准典型页不得绕过这套 manifest + 官方母版契约直写页面骨架；AI 只允许生成业务槽位输入，不允许替代官方母版链路。`non-typical-page` family 同样不得直写 page frame；AI 只允许形成 `nonTypicalDecisionPackage`，最终仍需进入 family generator。若页面任务门禁未放行，它不会继续暴露完整页面 brief，而是返回一个 blocked brief，只给出阻断原因与 ensure / preflight 的下一步命令。页面生成链默认 `localizationMode=none`：不传 `--localization-mode` 时，不接项目本地国际化桥；只有用户明确要求页面接国际化时，才显式传 `--localization-mode local-bridge`，而 `inherit-host` 只用于目标项目已经证明存在宿主 i18n runtime 的场景。`invalid-output-target` 阻断现在会额外说明 `defaultBusinessPageDir` 是按哪条证据推出来的；若旧项目存在多个 legacy 入口候选，还会附带 `navigationMountContract` 示例，方便显式锁定真实挂靠点。`full-page-detail` 可额外通过 `--detail-sections-json <json-or-path>` 传入结构化 section 配置。
  当页面任务门已经放行后，brief 层只允许读取 `PROJECT_HOST_CONTRACT.json` 里的项目级宿主事实；若这份 contract 缺失或缺少 `formalNavigation`，会直接 fail closed，不再偷偷回退到源码重扫。
- `plan-page-task.mjs`
  轻量规划入口。项目接入未 ready，或页面任务门禁还不是 `ready-to-generate` 时，现在支持真正的“最小 gate 探测”：只传 `--target` 和可选 `--mode`，脚本会返回只读计划、阻断原因和下一步 `ensure` / `preflight` 命令，不再因为缺少 `--page-type` / `--page-family` 直接报错。只有当项目已经 ready 且页面门已放行时，planner 才继续进入页型、模板、导航挂靠和正式验收规划。
- `generate-page.mjs`
  标准典型页官方单入口，也是外层 workflow 唯一受支持的正式写页入口。对外把 `generation-brief -> generate-page-from-brief -> typical-page-slot-gate` 收成一条受管执行链：先冻结本次生成输入并落一个可复用 `GENERATION_BRIEF.json`，再正式写页面，最后默认执行 `slot gate`（槽位门禁，这里指写盘后的轻量结构校验）保证模板边界没有被越界修改。默认 `validation-profile=light`（轻量档，这里指只跑写后槽位门禁，不追加工程验收）；只有显式传 `--validation-profile acceptance`（验收档，这里指在轻量档通过后，再补一层最小工程检查）时，才会追加 `project check`（项目检查，这里指 `tsc --noEmit` 或隔离输出目录的 `vite build` 这类工程有效性验证）。它不替代原来的分段脚本：需要审计或排查时，仍可单独运行 `generation-brief.mjs`、`plan-page-task.mjs`、`generate-page-from-brief.mjs`。当前这个单入口只覆盖标准典型 `page-type`；`non-typical-page` 继续走专用的 `execute-non-typical-page-task.mjs` 闭环。
- `execute-non-typical-page-task.mjs`
  非典型页面 validated v1 scope 的最小闭环公共入口。当前只支持 `pageFamily=non-typical-page`，默认执行 `plan-page-task -> generate-page-from-brief -> non-typical-page-sanity`；若命中 legacy React + Module Federation 且当前页面通过 direct expose 交付，还会强制追加 `integration-preflight`，并在 runtime 仍是 pending 时继续触发 `verify-remote-runtime-source` 后再收口。若 planner 未 ready、family generator 未开放、执行契约漂移、light sanity 失败，或 legacy MF formal acceptance 未完成，脚本都会返回稳定 JSON 并 fail closed，适合作为上层 workflow 的受控执行入口，而不是让上层自行拼接命令链。
- `generate-page-from-brief.mjs`
  标准典型页的受管底层生成器，供 `generate-page.mjs` 和审计/分段调试链路内部复用。按 brief 从最近官方母版复制页面和本地 mock 依赖到目标目录，默认不覆盖已有文件，不自动猜测路由、菜单或微前端暴露；若 brief 已判定旧项目缺少可证明的业务导航入口，会直接 fail closed。标准典型页不得跳过 `generation-brief.mjs` / `plan-page-task.mjs` 后手工复制 `examples/host-integration/src/pages/*`，也不得让 AI 直接按猜测的 `src/pages/*` 或其他未证实目录自行改写业务页面。若项目尚未 ready，可自动补一次轻量 ensure；但 ensure 后只要页面任务门禁仍未被 `typical-page:preflight` 放行为 `ready-to-generate`，脚本必须继续停止，不得开始写页面。页面生成默认沿用 `localizationMode=none`：不传 `--localization-mode` 时，页面和正式宿主壳都走无本地翻译桥接的 fallback；只有用户明确要求接国际化时，才显式传 `local-bridge` 或 `inherit-host`。真实写文件前它仍会内部复核 `dependency-isolation-check` 作为工程安全兜底，但这一步不负责开关 `PROJECT_PAGE_TASK_STATUS.json`，也不要求团队把依赖隔离包装成独立的项目开门步骤。对 `rules-only + existing-system + Module Federation direct expose`，生成器现在会默认在页面目录旁物化受管 publish entry，并把人工接入说明精确收口成“把 `ModuleFederationPlugin.exposes` 改指向 publish entry”；这个 publish entry 只负责引入本地运行时样式并转发页面模块，不默认下沉 `hiui-design-host.generated.css`。`full-page-detail` 在提供 `--detail-sections-json <json-or-path>` 时，会在受管模板内替换 detail section 配置并生成与之匹配的示例 mock 数据。
  每次生成完成后，除了保留带时间戳的 `PAGE_GENERATION_REPORT.<pageType>.<timestamp>.<pid>.{md,json}` 历史报告，还会额外刷新固定最新入口 `PAGE_GENERATION_REPORT.latest.{md,json}`；后续自动化与验收脚本应优先读取这组固定最新文件，而不是对历史 Markdown 做通配扫描。
  对 `rules-only + existing-system + Module Federation direct expose`，生成器不再自己重扫导航事实，而是只消费 brief 里的 `hostExecutionAdapter.kind = mf-direct-expose-legacy`：`pageSource.defaultBusinessPageDir / targetBusinessPath` 用于页面源码落点，`publishEntry.configPath / managedPublishEntryPath` 用于发布入口落点，两者明确分离。
  `typical-page:preflight` 产出的 `PAGE_TYPE_CAPABILITY_REPORT.json` / `AI_GENERATION_READY_CONTEXT.json` / `PROJECT_STATE_SUMMARY.json` 也会显式写出 `formalHostEvidenceSource`、`managedHostContractStatus`、`managedHostContractPath` 等字段，方便区分“受管 contract 已放行”“仍在源码兜底”还是“contract 本身无效”。其中 `AI_GENERATION_READY_CONTEXT.json` 现在还会编译 `pageTypeManifestSnapshot`、`pageTypes[].generationContract`、`pageTypes[].requiredDocs`、`projectHostContext`，以及 `managedLocalRuntime` / `managedLocalRuntimeMaterialized` / `managedLocalRuntimeBlockedBy` 这组本地运行时物化状态，让下游 `generation-brief` 优先复用单一快照，而不是每次再回去拼 `page-types.manifest.json` 和槽位边界文档。
  运行时落到目标项目时不再是“盲拷贝”，而是先按 `checker-friendly distribution`（检查器友好分发，这里指为了兼容目标项目的 `eslint-prebuild-checker`，把受管运行时里的默认导入、声明文件扩展名等做项目侧分发转换）重写高风险导入形式。结果 JSON 与 `hiui-pagegen.meta.json` 现在会额外写出 `businessSlotSemanticReadiness`（业务语义就绪状态，这里用于说明当前业务槽位输入是否足够具体）、`artifactSummary`（产物摘要，这里用于统计这次生成会落哪些类型的文件）、`artifactWritePlan`（产物写入计划，这里用于标明哪些文件能写、哪些文件会因语义不足被拦住）、`projectCheckSelection`（项目检查选择，这里用于建议下一步该跑 `auto` 还是 `typecheck-only` 工程检查）和 `readinessSummary`（就绪摘要，这里把生成、工程、运行时三段 readiness 分开表达）。注意：`projectCheckSelection` 目前只负责“给出下一步检查建议”，不会在这个脚本里自动执行 project check。
  页面生成完成后会返回一个主链接：对 `Camora / 代理项目`，只要 `testBaseUrl + ExposeName` 可构造，就优先按 `testBaseUrl + ?path=@common/<ExposeName>` 返回测试环境直达链接；若只提供了 `testBaseUrl` 或 `ExposeName` 其中一项，则直接 fail closed。存在正式 `routePath` 时，可额外补充业务页面链接，但它不是 Camora 场景下的主链接；本地业务链接必须从目标项目 `README.md` 的固定行 `- localOrigin: http://...` 推导；若无法证明正式业务链接，就返回 blocked reason，不再回退成 preview 链接或本地 localhost 猜测。
  仅在 `remoteDebugContract.mode === camora-regex-proxy` 时，生成器还会自动执行一次 Camora 闭环判断：写盘后立即核对本地 live `remoteEntry.js`，并把结果收口成 `ready`、`written-but-runtime-not-ready` 或 `blocked-by-code-registration`。这一步只影响 Camora 宿主，不外溢到普通项目；同时不会自动重启 dev server、修改代理规则或强刷浏览器。`apply` / `bootstrap` 在能识别 devServer 配置时会先自动补 no-cache response headers，作为受管 anti-stale baseline；Camora 命中时，返回结果会额外包含 `primaryPageLinkRuntimeReadiness`、`primaryPageLinkCaveat` 与 `camoraRuntimeClosure`，用来明确说明“当前链接能不能直接验收”。
- `validate-non-typical-real-project.mjs`
  非典型页面发布前的真实项目验证入口。读取固定 validation scenarios，在真实 target project 中验证 `non-typical-page` 的正样本写页、边界样本 stop 和负样本回退；验证结果会写入 `.local-context/hiui-design/outputs/NON_TYPICAL_REAL_PROJECT_VALIDATION_REPORT.{json,md}`。默认 project check 走非破坏式 `auto` 策略：优先跑本地 `tsc --noEmit`，当前 launcher Node 满足项目 Node policy 时再追加隔离输出目录的 `vite build`；也可用 `--project-check-profile typecheck-only|none` 或 `--project-check-command "<cmd>"` 覆盖。它不翻转 `generatorReady`，只为 readiness 决策提供真实项目事实。
- `validate-typical-real-project.mjs`
  典型页面发布前的真实项目验证入口。读取固定 validation scenarios，在真实 target project 中验证这次全局优化后的关键场景：`gate-stale-but-recoverable`（输入漂移后门禁统一回落）、`same-module-subview-auto-patchable` / `same-module-subview-manual-patch`（父子页流转自动补丁与人工补丁建议）、`managed-runtime-second-page-no-identical-rewrite`（第二次生成跳过相同运行时文件）、`semantic-placeholder-degraded-report`（业务语义占位时自动降级报告），并把结果同时写入两组产物：固定最新入口 `.local-context/hiui-design/outputs/TYPICAL_PAGE_REAL_PROJECT_VALIDATION_REPORT.{json,md}`，以及按本次运行时间生成、不会被覆盖的快照文件 `TYPICAL_PAGE_REAL_PROJECT_VALIDATION_REPORT.<timestamp>.<pid>.{json,md}`。它默认沿用 `generate-page-from-brief.mjs` 的真实受管链路，因此能直接验证 `artifactWritePlan`、`businessSlotSemanticReadiness`、`parentFlowPatchStatus` 和 `projectCheckSelection` 在真实工程里的表现；若所有场景都没有真正写入业务页，就不会额外跑 project check。
- `evaluate-non-typical-generator-readiness.mjs`
  非典型页面 `generatorReady` 发布收口评估入口。读取 `page-family-workflows.manifest.json`、`non-typical-page-contract.json`、目标项目的 `PAGE_TYPE_CAPABILITY_REPORT.json`、`AI_GENERATION_READY_CONTEXT.json` 与 `NON_TYPICAL_REAL_PROJECT_VALIDATION_REPORT.json`，输出 `.local-context/hiui-design/outputs/NON_TYPICAL_GENERATOR_READINESS_EVALUATION.{json,md}`。它只给出 `evidenceStatus` 与 `releaseRecommendation`，不会自动翻转 manifest；若 capability 输出还是旧快照，会明确提示先 `ensure --force-context-sync` 再 `typical-page-preflight`。
- `typical-page-slot-gate.mjs`
  源码级轻量结构门禁。按页型读取 manifest，检查 slot boundary、region ownership、layout chain 和常驻说明 UI；不打开浏览器，不替代 doctor，不自动改文件。支持 `--page-type <id> --page <index.tsx> [--style <index.module.scss>] [--line <line-id>] [--json]`。
- `integration-preflight.mjs`
  入口接入前置检查脚本。完成 `navigationMountAction` 后、修改额外正式入口前，检查目标页面目录、Module Federation `exposes`、`window.addPage` / `openNewPage` 路径、业务入口文件是否能够被静态证明；输出 `pass`、`pass-with-runtime-pending` 或 `blocked`。其中 `codeRegistered` 只判断代码注册，`runtimeVerification` 只判断 live runtime source 验证；旧字段 `runtimeSourceVerified` 仍保留为派生结果。若 brief 已判定旧项目缺少可证明的业务导航入口，会直接返回 blocked，不再继续猜测挂靠点。
- `page-relation-safe-fix.mjs`
  页面关系安全修复入口。只处理一种明确矛盾：页面已经有足够证据证明自己是 `same-module-subview`（模块内子页面，这里指从列表或父页进入的子页面），但目录里还残留了 `mf-entry.*`（独立发布入口文件）或 `managedMfPublishEntry`（受管独立发布入口元数据）这类独立发布痕迹。它会先读取 `hiui-pagegen.meta.json`（页面生成元数据文件，这里记录这次页面生成的事实），只在入口文件看起来确实是 hiui-design 自己生成的前提下，才会删掉残留入口并把元数据回写为子页面；如果发现入口文件疑似项目手写，它会直接阻断，不会自动删除。
- `verify-remote-runtime-source.mjs`
  remote runtime source 独立验证入口。只在 `remoteDebugContract` 已被显式证据启用时使用：`Camora` 正向线索、明确 proxy 规则、`README.md` 固定行 `- localOrigin: http://...`，或 README 中可解析的本地 `remoteEntry.js` URL；`remoteEntry.js` 文件名本身不再单独触发。脚本会读取宿主画像、拉取本地 `remoteEntry.js`、检查 expose 是否存在，并把结果写到 `.local-context/hiui-design/outputs/REMOTE_RUNTIME_SOURCE_STATUS.json`。状态文件现在保留事实级 `observation`：`remote-entry-unreachable`、`remote-entry-reachable-but-expose-missing`、`remote-entry-reachable-and-expose-found`。它只记录 runtime 事实，不单独下“旧 bundle”结论；`stale-local-bundle-suspected` 只允许在 Camora 闭环汇总层、且仅当代码接线已被证明成立时出现。
- `dependency-isolation-check.mjs`
  只读工程安全检查脚本。优先检查 `managed-local-runtime-dependencies.json`（本地运行时依赖合同文件，这里用于定义 `src/components/hiui-design-runtime` 需要声明的依赖）、`package.json` 声明、lockfile、已安装版本、peer 依赖和构建层 HiUI5 peer replacement bridge；同时保留对 `vendor` 中嵌入来源快照的追溯校验，但它们不再是目标项目依赖事实源。不安装依赖、不改 lockfile，也不负责打开页面任务门禁。普通项目不需要把它塞到 `ensure` / `preflight` 前手工跑成默认第一步；真实写页时，生成器会在需要时自行收口。
  旧项目依赖隔离与来源追溯检查脚本。检查受管本地运行时依赖合同、`package.json` 声明、lockfile、已安装版本、peer 依赖和构建层 HiUI5 peer replacement bridge，并额外确认 vendor 快照与 tarball 仍能证明当前本地运行时物料的上游来源；不安装依赖、不改 lockfile。
- `verify-managed-runtime-closure.mjs`
  受管运行时源物料闭合检查脚本。面向维护者，在发布或同步运行时前检查 `examples/host-integration/src/components/hiui-design-runtime` 是否仍满足最小闭合条件：相对导入目标存在、全局辅助类型 `AnyObject / UnknownObject`（泛型辅助类型，这里用于声明列表和详情数据结构）由运行时自己闭合提供、声明文件不再直接依赖 `*.module.scss`、`page-owned-mount-support`（页面附带兼容文件，这里用于处理共享页头和挂载区高度）没有重新引入 `AddEventListenerOptions`（浏览器事件监听参数类型）这类检查器高风险全局类型。它校验的是“项目分发前的源闭合”；真正落到目标项目时，`bootstrap-target-project.mjs` 与 `generate-page-from-brief.mjs` 还会继续执行一次项目侧 `checker-friendly distribution` 分发转换。
- `init-i18n.mjs`
  国际化基线初始化器。只在显式调用，或 bootstrap 链路明确传入 `--init-i18n` 时生效；用于给目标项目补 `src/translation/*`、本地 `messages.ts`、可复跑的 `scripts/init-i18n.mjs` 包装器，以及 `package.json` 里的 `i18n:sync`。生成的 bridge 兼容 React 16 / ES5。
- `apply-runtime-patches.mjs`
  受管运行时补丁脚本。用于在目标项目安装后统一落已核实的运行时修复点；当前包含 React 19 兼容告警修复与 `@hi-ui/query-filter` gap 转发修复。React 19 覆盖面同时包含 `@hi-ui/*` 与兼容 `hiui5-*` alias 安装路径。对 React 19 宿主，以及命中高风险 legacy existing-system 画像的 React 16/17/18 宿主，`bootstrap-target-project.mjs` 会自动把它注册到 `typical-page:runtime-patch` 并追加进目标项目 `postinstall`；其他 React 16/17/18 宿主默认不会自动接这条脚本链路。
- `apply-react19-runtime-patches.mjs`
  兼容别名入口。保留给历史脚本或外部项目继续调用，内部已委托到受管 runtime patch 层；不要继续把新的运行时修复语义堆进这个 React 19 专项名字里。
- `init-usage-identity.mjs`
  使用统计身份初始化脚本。hiui-design 开源版默认关闭统计，这个脚本仅在显式开启统计后才有意义。
- `report-agent-prompt-usage.mjs`
  AI 直连使用统计脚本。hiui-design 开源版默认关闭统计；保留这个脚本主要是为了兼容旧调用链。
- `flush-pending-usage.mjs`
  手动补传 `.hiui-design-cache/pending-usage.jsonl` 队列。仅在显式开启统计后才会有实际作用。
- `usage-upload-worker.mjs`
  埋点后台补传 worker。hiui-design 开源版默认不会启动它。

当前团队版不内置业务线 overlay；若后续本地补充 overlay，带 `--line <line-id>` 的入口会按现有解析逻辑加载。

## 面向维护者

- `project-host-contract-shadow-audit.mjs`
  只读 `shadow audit`（影子审计，这里指重新扫描一次项目事实，再和已冻结的 `PROJECT_HOST_CONTRACT.json` 做对账，但不真正写回）的维护脚本。适合在重构收尾、怀疑 contract 漂移，或审计“为什么 preflight 和 downstream 结论不同”时使用。若结果是 `mismatch`，下一步应该重新跑 `typical-page:preflight` 刷新合同，而不是把源码重扫重新塞回主链。
- `benchmark-contract-first-scan.mjs`
  轻量扫描基准脚本。对同一个目标项目依次跑 `typical-page-preflight.mjs` 与 downstream `generation-brief.mjs -> plan-page-task.mjs -> generate-page-from-brief.mjs --dry-run`，并通过可选 `trace`（跟踪记数，这里指只在环境变量打开时记录关键扫描函数命中次数）输出分相耗时和计数。当前“重复扫描”口径只统计 `detectFormalNavigation`、`inspectAppEntryMountPlan`、`evaluateProjectGenerationReadiness` 三类导航重扫；`detectHostProfile` 会单独列成辅助观察项，不混进主结论。
- `open-page-generation-session.mjs`
  页面生成会话开启脚本。给一次真实页面生成建立 `sessionId`（会话编号，这里用于把上层工作流时间和下层三段生成脚本时间串成同一次生成），适合在真正接到用户请求时最先调用。若上层流程已经知道标题、路由、目标目录等页级信息，也可以一并传入，后续 brief / plan / generator 会继续补全摘要。
- `record-page-generation-session-stage.mjs`
  页面生成会话阶段记录脚本。给同一个 `sessionId` 追加上层工作流阶段，例如 `upstream-first-code-ready`（上层首次拿到可用页面代码）、`upstream-repair-round-complete`（一轮修正完成）和 `upstream-done`（整次上层流程完成）。它本身不跑页面生成，只负责把真实总耗时拆账所需的关键时间点写进会话轨迹。
- `report-page-generation-session-trace.mjs`
  页面生成会话轨迹报告脚本。读取目标项目 `.hiui-design-cache/telemetry/page-generation-sessions/*/PAGE_GEN_SESSION_TRACE.json`（页面生成会话轨迹文件，这里记录同一次生成的阶段时间），默认输出最近一次会话的阶段耗时与串联耗时，可用 `--session-id` 指定会话。若上层流程已经用 `open-page-generation-session.mjs` 与 `record-page-generation-session-stage.mjs` 记录了 `upstream-first-code-ready`、`upstream-repair-round-complete`、`upstream-done`，报告会同时给出“上层总耗时 + 本地工程链路耗时”；若没有这些上层记录，它仍只覆盖 hiui-design 本地工程链路，不代表整次页面生成总耗时。

## 面向 host-integration

- `start-preview-runtime.mjs`
  在 skill 包内 `preview-runtime/` 下启动本地预览宿主，直接消费 `examples/host-integration/src/*` 作为示例事实源；用于“不把 preview 资产接入项目，但仍要本地打开官方示例”的场景。脚本会自动确保 `examples/host-integration/node_modules -> ../../preview-runtime/node_modules` 这条依赖桥存在，避免把示例事实源再复制一份依赖安装。
- `bootstrap-target-project.mjs`
  低层 bootstrap 执行器，负责依赖、脚本注册、宿主基线接线与 guidance 生成；不再支持把 preview 示例物化进目标项目。

## 输出约定

- `rules-only` 模式的脚本输出写到 `../outputs/`
- skill 包内 preview runtime 的运行目录是 `../preview-runtime/`
- skill 包内 preview runtime 会把 `examples/host-integration/node_modules` 维护成指向 `../preview-runtime/node_modules` 的依赖桥；若该目录已经是独立安装目录，则保留并给出 warning
- 默认 apply 下，`host-integration` 的 guidance、snippet 和 bootstrap summary 写到目标项目 `.local-context/hiui-design/outputs/host-integration-guidance/`
- 以后任何场景都不再支持把 preview 示例物化进项目；查看官方示例时，统一从 skill 包根目录运行 `node scripts/start-preview-runtime.mjs`
- 目标项目仍然会在 `.local-context/hiui-design/examples/host-integration/**` 下保留官方母版、宿主 source、shim 与 bridge 事实源；这些项目本地文件不代表项目支持 preview route、preview host 或 gallery
- 只有 `host-integration` 的全新项目在首次生成真实业务页且尚无业务导航时，才允许进入“补首个正式导航”的执行语义；旧项目不自动补导航
- `init-i18n.mjs` 只在显式调用时，才会在目标项目写入 `src/translation/*`、`messages.ts`、`scripts/init-i18n.mjs` 与 `i18n:sync`；默认只补缺失文件与缺失 key，传 `--force` 才刷新 wrapper / bridge 模板
- `generation-brief.mjs --output <file>` 写入目标项目内指定文件；不传 `--output` 时只输出到 stdout
- `generate-page.mjs --brief-output <file>` 可把它内部冻结的 ready brief 显式写到指定文件；不传时默认落到当前页面生成会话目录下的 `GENERATION_BRIEF.json`
- `generation-brief.mjs` / `plan-page-task.mjs` / `generate-page-from-brief.mjs` / `generate-page.mjs` 的 `--localization-mode` 默认都是 `none`；只有用户明确要求页面接国际化时，才显式改成 `local-bridge` 或 `inherit-host`
- `execute-non-typical-page-task.mjs --dest <relative-dir> --title <title>` 在 validated v1 scope 内返回稳定的 `plan -> generate -> light sanity` 执行结果；若命中 legacy MF direct expose publish path，还会继续跑 `integration-preflight`，并在 runtime pending 时自动补 `verify-remote-runtime-source`；若未 ready，会返回 blocked JSON 和下一步命令，而不是由调用方自行拼装 planner / generator / sanity
- `generate-page.mjs --dest <relative-dir> --title <title>` 默认走 `brief -> generate -> slot gate`，等价于 `--validation-profile light`；`--dry-run` 保持只读，因此只会生成 brief 与写页计划，不会跑写后轻校验
- `generate-page.mjs --validation-profile acceptance` 会在 `slot gate` 通过后追加 `project check`；`--project-check-profile auto|typecheck-only|none` 用来控制这层最小工程检查的强度，`--project-check-command "<cmd>"` 则用于用显式命令覆盖默认选择
- `generate-page-from-brief.mjs --dest <relative-dir>` 只写目标业务目录；默认不覆盖，只有显式 `--force` 才覆盖已有文件
- 对 `rules-only + existing-system + Module Federation direct expose`，`generate-page-from-brief.mjs` 还会在 `hiui-pagegen.meta.json` 里同时写入 `managedMfPublishEntry` 与 `mfPublishEntryPath` / `mfPublishEntryManaged` / `mfPublishEntryShellStyles` / `mfExposeTargetPath` / `mfExposeUsesManagedPublishEntry`，用于追踪真实发布单元是否已按新合同落地
- 同一场景下，`generate-page-from-brief.mjs` 还会在结果 JSON 与 `hiui-pagegen.meta.json` 里写入 `hostExecutionAdapter`，用于追踪“源码目录”和“发布入口目录”是否已经按 `mf-direct-expose-legacy` 合同拆开；未命中这条旧式直出链路时，`hostExecutionAdapter` 可以为空，不属于公共阻断项
- `generate-page-from-brief.mjs --expose-name <Name> --test-base-url <url>` 可为 `Camora / 代理项目` 生成当前页面测试环境直达链接；若未传 `--test-base-url`，会尝试读取目标项目 `README.md` 中的 `- testBaseUrl: ...`；若缺少 `ExposeName` 或 `testBaseUrl` 任一项，则返回 blocked reason，不再静默降级到其他链接类型
- `README.md` 中支持可选固定行：`- localOrigin: http://...`、`- testBaseUrl: https://...`，用于跨项目复用时稳定生成页面链接
- `integration-preflight.mjs --dest <relative-dir> --expose-name <Name> --entry-file <relative-file>` 只检查入口接入证据；代码注册通过但 live runtime source 还没验证时输出 `status: pass-with-runtime-pending`，显式验证失败或入口证据不足时输出 `status: blocked`
  对模块内子页面，额外支持 `--related-page-path <relative-file>`：这时不会再强制检查独立 `Module Federation expose`（微前端独立暴露入口，这里用于独立发布页）或 `window.addPage`，而是改查父页面文件是否存在、目标目录是否仍在同一模块目录下，并把 runtime source verification（运行时来源校验，这里用于确认远端入口是否已被宿主真实加载）标记为 `not-applicable`。
  若当前还没手填 `--related-page-path`，也可以透传 `--telemetry-prompt` 或 `--telemetry-prompt-file`：脚本会先复用与 `generation-brief.mjs` / `plan-page-task.mjs` 相同的父页面自动识别逻辑，再重建 preflight brief。
- `page-relation-safe-fix.mjs --dest <relative-dir> [--related-page-path <relative-file>] [--related-page-source <source>] [--dry-run]`
  当某个页面已经明确应该是模块内子页面，但历史生成产物里的页面关系事实还没回灌到 `hiui-pagegen.meta.json`，或还残留 `mf-entry.*` / `managedMfPublishEntry.required=true` 这类旧痕迹时，先用这个入口做一次安全修复，再重新跑 `integration-preflight.mjs` 复验。脚本会先重算当前页面的真实发布交付路径：若当前宿主仍要求受管 `mf-entry`，它只回灌元数据、不删除入口；只有确认该入口已经不再需要时，才会清理 hiui-design 自己生成的受管入口文件。它不会自动删除项目自定义入口。
- `verify-remote-runtime-source.mjs --expose-name <Name>` 会写入 `REMOTE_RUNTIME_SOURCE_STATUS.json`；自动推导不稳时允许显式传 `--remote-entry-url <url>`；`observation` 会同步写入事实级 runtime 观察结果
- `generate-page-from-brief.mjs` 在 Camora 宿主上会额外返回 `primaryPageLinkRuntimeReadiness`、`primaryPageLinkCaveat` 和 `camoraRuntimeClosure`；如果当前本地 remote 仍不可验收，测试环境链接仍可返回，但必须配合这些字段一起理解
- 高风险 legacy MF 宿主的 split-alias 只对 `resolvedHostGenerationContract.visualRewritePlan` 与 `hookRewritePlan` 声明的白名单符号生效；`visualSplitAliasMap` 继续只作为 bridge / dependency-isolation 事实源，不代表生成器已支持全量改写
- `dependency-isolation-check.mjs --json` 输出 `outputs/DEPENDENCY_ISOLATION_REPORT.json`；失败时先修受管本地运行时依赖合同、依赖声明、lockfile、可选嵌入来源快照或构建层 peer replacement bridge

## 职责边界

- `page-types.manifest.json`：页型事实源和机器可读生成契约源
- `examples/host-integration/src/pages/*`：官方母版源
- `examples/host-integration/src/app-frame-core.tsx` 与相关 layout/shim/bridge 文件：正式宿主与兼容治理的 source assets，不是项目内 preview 应用入口
- `generation-brief.mjs`：生成前输入包出口
- `generate-page.mjs`：标准典型页官方单入口，负责收口 brief、正式写页、默认轻量 slot gate，以及按需追加的 acceptance project check
- `execute-non-typical-page-task.mjs`：非典型页面 validated v1 scope 的最小闭环执行入口；负责收口 planner、family generator 与 light sanity
- `generate-page-from-brief.mjs`：轻量复制和业务槽位起步工具，并对旧项目缺少导航证据的场景 fail closed；在 `rules-only` 的旧 MF direct-expose 项目中，它还负责物化受管 publish entry，并把 expose 改指向 publish entry 作为默认人工接入说明
- `PROJECT_HOST_CONTRACT.json`：唯一受支持的项目级宿主事实快照；由 `typical-page:preflight` 产出，供 brief / generator 复用，不允许在后续阶段被临时源码重扫替代
- `integration-preflight.mjs`：路由、菜单、MF expose、业务入口按钮的轻量接入前置门禁；在 remote debug 宿主上区分 `pass-with-runtime-pending` 与真正 `blocked`，不负责猜测旧项目的导航挂靠点
- `PROJECT_PAGE_TASK_STATUS.json`：页面任务门禁状态快照；其中 `pageTaskReadiness=ready-to-generate` 才表示页面门禁已经打开，`generationGate`（页面生成门禁解释，这里用于明确是谁打开了门、doctor 是否只是记录体检结果）会把“`typical-page:preflight` 已开门”和“doctor 仅作验收记录，还是重新把门关回去”分开写清楚。当前还会固定输出 `gateStatusReason`（门禁原因）、`staleInputs`（哪些输入变了）、`nextRequiredAction`（下一步必须做什么）、`canAutoRecover`（单入口是否允许自动补救）与 `contractSnapshotId`（当前引用的是哪份宿主合同快照）。
  当 freshness 检测到 `package.json`、锁文件、入口、构建配置或 `PROJECT_HOST_CONTRACT.json` 这类关键输入已经漂移时，统一门禁检查现在会把状态文件回写成 `ensure-only`，确保状态文件、planner 和 brief 读到的是同一套阻断语义，而不是一边显示已放行、一边又要求重新 preflight。
- `verify-remote-runtime-source.mjs`：Camora / proxy / localOrigin 场景的 live `remoteEntry.js` source 验证入口
- `dependency-isolation-check.mjs`：旧项目或高风险依赖链的只读工程一致性检查；不负责打开 `PROJECT_PAGE_TASK_STATUS.json`
- `init-i18n.mjs`：目标项目国际化基线初始化与 locale 文件同步入口
- `typical-page-doctor.mjs`：依赖、样式、导入、旧 token、路由和页型关键壳层的轻量兜底
- 浏览器截图、全量 DOM diff、全量 smoke gallery：只作为首次接入、宿主壳变更、样式版本升级、多页型失真或用户明确要求时的重验收，不是每次页面生成默认主路径

## Usage Stats

- `hiui-design` 默认关闭使用统计
- 现有 `telemetry` 参数名和相关脚本仅作兼容保留；默认关闭统计时不会触发上传
- 若要显式恢复统计，先设置 `HIUI_DESIGN_ENABLE_USAGE_STATS=1`；旧的 `HIUI_DESIGN_OPEN_ENABLE_USAGE_STATS=1` 仍可继续使用，再按原有参数链路透传信息
- 本地缓存位于目标项目根目录 `.hiui-design-cache/`
- 详细字段、补传行为与关闭条件见 `../PRIVACY.md`

## Deprecated source-template scripts

Historical source-template generator and linter entries have been removed from the maintained entry list. The current public onboarding surface supports only `auto`, `rules-only`, and `host-integration`.
