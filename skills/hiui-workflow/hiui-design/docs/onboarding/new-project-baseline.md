# 新项目基线预检

## 目的

新项目接入 `hiui-design` 前，先把脚手架、Node、依赖解析和严格工程规则固定下来。不要先生成页面再靠 TypeScript、ESLint 或 audit 报错反推环境问题。

## 必跑入口

在目标项目根目录执行：

```bash
node ".local-context/hiui-design/scripts/preflight-new-project.mjs" --json
```

若接入前还要创建 Vite 项目，必须把候选脚手架版本传给预检：

```bash
node ".local-context/hiui-design/scripts/preflight-new-project.mjs" --create-vite-version 4.4.1 --json
```

`create-vite` 版本不存在时必须先停止脚手架创建，不要继续复用错误版本号。

## Node 与 Sass 基线

- `Node >=16` 是当前 host-integration 样式编译链的最低本地基线，因为 `sass-embedded@1.97.2` 要求 `Node >=16`。
- `sass` 必须使用 `host-integration-dependencies.json` 中的精确版本；不要写 `^1.77.8` 或 `~1.77.8`。
- `sass@1.102.0` 要求 `Node >=20.19.0`。Node 16 项目如果允许 semver 漂移，会被 npm 解析到不兼容版本。
- 若团队决定统一升级到 Node 20.19+，必须先更新依赖快照、doctor 期望和 smoke/build 回归结果，不能只改目标项目。

## TypeScript / ESLint 基线

- 若 `tsconfig.json` 或 `tsconfig.app.json` 启用了 `compilerOptions.strict=true`，同步到 `src/typical-page-reuse` 的资产必须 strict-safe，或明确从宿主编译范围隔离。
- `@ts-nocheck` 只能用于临时排障，不能作为正式接入方案；doctor 会把同步资产中的 `@ts-nocheck` 判为硬失败。
- 若 ESLint 禁止 `@ts-nocheck`，不要通过关闭 lint 或删除规则绕过；应修类型、拆文件或隔离 gallery 编译范围。

## Fast Refresh 基线

- Vite React 项目如果启用 `react-refresh/only-export-components`，页面组件文件应只导出 React 组件。
- 路由配置、mock 数据、表格列、筛选 schema、请求 helper、常量对象应拆到相邻 `*.mock.ts`、`*.schema.ts`、`*.config.ts` 或 `*.utils.ts` 文件。
- route config 文件可以导出路由创建函数；它不是页面组件文件，不应用页面组件的 Fast Refresh 约束强行改写。

## 接入状态口径

`bootstrap-target-project.mjs` 只负责资产同步、package patch 和可选依赖安装；`setup-for-designers.mjs` 才负责完整接入门禁，包括 preflight、apply、doctor、build 和 lint 解释。

安装超时不是资产同步失败。看到 `dependenciesInstalled: timed-out` 时，先在目标项目手动执行包管理器安装，再用 `--no-install` 续跑接入门禁。
