# HiUI v5 最小速查

## 目标

这份速查只保留当前典型页最常用的 HiUI 组件与导入习惯，供 `hiui-design` 在没有额外 `hiui-v5` 文档上下文时仍能稳定生成页面。

## 导入约定

- 常用组件统一优先从 `@hi-ui/hiui` 导入。
- 图标统一从 `@hi-ui/icons` 导入。
- 不要默认拆成单组件包导入，例如 `@hi-ui/button`。
- 典型页壳组件统一只从 `@hiui-design/typical-page-shells` 及其公开子路径导入。
- 不要从 `node_modules/.pnpm/...`、`../node_modules/...`、`@hiui-design/typical-page-shells/dist/*` 这类私有安装路径导入。

## 典型页常用组件

这一节优先从 `manifests/hiui-v5-components.json` 的 `quickReference` 配置渲染，只保留当前典型页最常用的 HiUI 组件与必要导入备注，减少和完整图谱的双写。

- 生成脚本：`scripts/sync-hiui-v5-quick-reference.mjs`
- 组件 facts：`manifests/hiui-v5-components.json`
- 作用边界：只保留典型页最小兜底，不覆盖非典型页面路由判断

### 页头与操作区

- `PageHeader`
- `Button`
- `Space`
- `Message`

### 列表与筛选

- `Table`
- `QueryFilter`（典型页优先从 `@hiui-design/typical-page-shells/pro-list-page` 使用；底层来源 `@hi-ui/query-filter`）
- `Pagination`
- `Search`
- `DatePicker`
- `Select`
- `Tree`

### 抽屉与详情

- `Drawer`
- `Descriptions`
- `Tag`

### 表单

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

## 何时升级到完整组件图谱

出现下面任一情况时，不要继续只靠本页硬猜组件：

- 页面已进入非典型 / overlay 路径
- 所需组件不在本页列表中
- 需要在 `Descriptions / List / Timeline`、`Drawer / Modal / Popover`、`Select / TreeSelect / Cascader` 之间做语义区分
- 页面开始出现 `heroCard`、`infoStrip`、`customInfoBlock` 这类自定义容器冲动

对应做法：

- 先读 `generation/non-typical-component-routing.md`
- 再读 `generation/hiui-v5-component-map.md`

## 与本 skill 的关系

- 页型、默认 nodeId、硬约束：看 `figma-page-rules.md`
- 宿主接入与依赖：看 `install-and-host.md`
- 页面起点：看 `examples/host-integration/src/pages/*`
- 若页面已经开始用 `@hiui-design/typical-page-shells`，同时必须补 `styles.css` 和必要的 Vite alias，不要只复制组件调用

这份速查只解决“最小组件知识”，不替代完整组件图谱、具体页型规则或非典型页面组件路由。
