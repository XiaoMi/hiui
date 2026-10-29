# HiUI v5 最小速查

## 目标

这份速查只保留当前典型页最常用的 HiUI 组件与导入习惯，供 `hiui-design` 在没有额外 `hiui-v5` 文档上下文时仍能稳定生成页面。

## 导入约定

- 对当前 `hiui-design` 新生成业务页面，常用 HiUI5 组件统一优先从 `hiui5` 导入；不要把宿主里仍保留的旧 `@hi-ui/hiui` v3 根包误当成新页面默认来源。
- 图标统一从 `@hi-ui/icons` 导入。
- 不要默认拆成单组件包导入，例如 `@hi-ui/button`。
- 典型页壳组件统一只从 `local-managed-runtime` 及其受管子路径导入，最终落地到目标项目的 `src/components/hiui-design-runtime`。
- 目标项目补依赖时，以 `docs/onboarding/managed-local-runtime-dependencies.json`（本地运行时依赖合同文件，当前规定 `src/components/hiui-design-runtime` 需要哪些依赖）为准，不要回头去抄上游壳包快照。
- 不要从 `node_modules/.pnpm/...`、`../node_modules/...`、或 `docs/onboarding/managed-local-runtime-dependencies.json` 当前声明的来源包 `dist/*` 私有路径导入；若仍配置了来源追溯包，也只应按“来源包私有构建产物路径”理解，而不是把包名本身当成固定规则入口。

### 当前宿主覆盖

`asp-fwt-common-front` 同时保留旧 `@hi-ui/hiui` v3 和 `hiui5` v5 alias。对本项目中新生成的 `hiui-design` 业务页面：

- HiUI5 业务组件从 `hiui5` 导入。
- 典型页壳组件仍从 `local-managed-runtime` 逻辑源生成，并在落盘时改写到项目内 `src/components/hiui-design-runtime` 的受管相对路径。
- 图标仍从 `@hi-ui/icons` 导入。
- 不要为新页面新增旧 `@hi-ui/hiui` 或 `@hi-ui/*` 单组件视觉包导入；历史代码不在本规则中自动迁移。

## 典型页常用组件

- 页头与操作区：
  - `PageHeader`
  - `Button`
  - `Space`
  - `Message`

- 列表与筛选：
  - `Table`
  - `QueryFilter`（典型页优先从 `local-managed-runtime/pro-list-page` 使用；官方母版内部可依赖 `@hi-ui/query-filter`，生成页继承该适配层）
  - `Pagination`
  - `Search`
  - `Select`
  - `DatePicker`
  - `Tree`

- 抽屉与详情：
  - `Drawer`
  - `Descriptions`
  - `Tag`

- 表单：
  - `Form`
  - `Input`
  - `NumberInput`
  - `Textarea`
  - `Radio`
  - `Checkbox`
  - `Switch`

## 典型页里的稳定习惯

- 页头标题与菜单标题保持一致。
- 表格默认使用中号密度，不要随意改成更紧或更松。
- 列表页默认一个搜索框收口多关键词，不要并排堆很多输入框。
- 抽屉和全页编辑的表单标签默认都在控件上方。
- 详情字段多列时，长文本单独占满整行。

## 与本 skill 的关系

- 页型、默认 nodeId、硬约束：看 `figma-page-rules.md`
- 宿主接入与依赖：看 `install-and-host.md`
- 页面起点：项目画像主要提供接入风险与 adapter 提示；新项目 / 轻骨架若没有明确阻塞证据，应优先走 `host-integration`。模板事实源看 `generationContract.baseTemplatePath`，官方预览入口看 `globalPreviewRoute`
- 若页面已经开始用 `local-managed-runtime`，同时必须确保项目内 `src/components/hiui-design-runtime/styles.css` 已接入宿主基线，并补齐必要的 Vite alias，不要只复制组件调用

这份速查只解决“最小组件知识”，不替代具体页型规则。
