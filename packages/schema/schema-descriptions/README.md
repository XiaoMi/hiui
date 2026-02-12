# `@hi-ui/schema-descriptions`

> 基于 schema 的只读描述列表，接收扁平 `fields` 与 `dataSource`，渲染为单组 Descriptions。

## 分组场景

本组件**不支持** `groups`。若需要「多组 + 每组一个描述列表」，请使用 **SchemaGroup**：配置 `groupMap.descriptions`，用 **GroupDataProvider** 传入 `dataSource`，每组在 config 中传自己的 `fields`。
