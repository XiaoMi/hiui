# `@hi-ui/schema-group`

> 组容器：渲染 custom / tabs / grid，以及通过 groupMap 委托的 form、table、descriptions、edit-table 等。

## 行为说明

- **不渲染 type='simple' 的组**：顶层若配置了 `type: 'simple'`，该组会直接跳过（return null）。需要「简单字段列表」时，请用 groupMap 中提供对应能力的渲染器（如 `descriptions`），或改用其他组类型由 groupMap 渲染。
- **标题区 Actions**：若外层用 **GroupDataProvider** 包住并传入 `dataSource`，标题区 `title.actions` 会收到 `ctx.dataSource`，可用于导出等操作。

## Usage

```
const schemaGroup = require('@hi-ui/schema-group');

// TODO: DEMONSTRATE API
```
