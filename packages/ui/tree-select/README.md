# TreeSelect 树形多项选择器

一种接收树形数据结构的选择器，为用户提供复杂数据展示的能力

## 何时使用

- 选择部门的组织结构、部门等
- 选择商品目录等

## 使用示例

<!-- Inject Stories -->

## Props

| 参数               | 说明                                                             | 类型                                                 | 可选值                                                                                                     | 默认值                                                                |
| ------------------ | ---------------------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| data               | 展示数据                                                         | DataItem []                                          | -                                                                                                          | -                                                                     |
| fieldNames         | 设置 data 中 id, title, disabled, children 对应的 key (3.0 新增) | object                                               | -                                                                                                          | { title: 'title', id: 'id',disabled:'disabled', children: 'children'} |
| showCheckedMode    | 数据回显模式                                                     | string                                               | ALL: 所有被选中节点，不区分父子节点 <br/>PARENT: 当所有子节点被选中时将只保留父节点<br/>CHILD:仅显示子节点 | ALL                                                                   |
| disabled           | 是否禁用                                                         | boolean                                              | true \| false                                                                                              | false                                                                 |
| defaultExpandAll   | 是否默认展开所有树节点                                           | boolean                                              | true \| false                                                                                              | false                                                                 |
| expandedIds        | 展开的节点（受控）                                               | ReactText[]                                          | -                                                                                                          | -                                                                     |
| defaultExpandedIds | 默认展开的节点（非受控）                                         | ReactText[]                                          | -                                                                                                          | -                                                                     |
| defaultValue       | 默认选中项 （非受控）                                            | ReactText                                            | -                                                                                                          | -                                                                     |
| value              | 默认选中项 （受控）                                              | ReactText                                            | -                                                                                                          | -                                                                     |
| displayRender      | 自定义渲染 Input 中展示内容                                      | (valueItem: checkedNode) => ReactNode                | -                                                                                                          | -                                                                     |
| placeholder        | 输入框占位                                                       | string                                               | -                                                                                                          | 请选择                                                                |
| searchPlaceholder  | 搜索输入框占位                                                   | string                                               | -                                                                                                          | 搜索                                                                  |
| loadingContent     | 加载中文字提示                                                   | string                                               | -                                                                                                          | 数据加载中...                                                         |
| searchMode         | 节点搜索模式                                                     | string                                               | 'highlight' \| 'filter'                                                                                    | -                                                                     |
| dataSource         | 异步加载数据                                                     | (key: string) => DataSource \| DataSource \| Promise | -                                                                                                          | -                                                                     |
| emptyContent       | 没有选项时的提示                                                 | ReactNode                                            | -                                                                                                          | 无内容                                                                |
| optionWidth        | 自定义下拉选项宽度                                               | number                                               | -                                                                                                          |                                                                       |
| overlayClassName   | 下拉根元素的类名称                                               | string                                               | -                                                                                                          | -                                                                     |
| popper             | 自定义控制弹出层 popper 行为                                     | Omit<PopperProps, 'visible' \| 'attachEl'>           | -                                                                                                          | -                                                                     |

## Events

| 名称     | 说明       | 类型                                                                                                      | 参数                                                                                                                             | 返回值 |
| -------- | ---------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------ |
| onChange | 选中时触发 | (checkedIds: ReactText[], checkedNodes: DataItem[], targetNode: DataItem, shouldChecked: boolean) => void | checkedIds: 选中项 ID 集合 <br/> checkedNodes: 选中项数据项集合 <br/> targetNode: 当前操作节点 <br/> shouldChecked: 是否要被选中 | -      |

### DataItem

| 参数     | 说明            | 类型             | 可选值 | 默认值 |
| -------- | --------------- | ---------------- | ------ | ------ |
| title    | 下拉选项标题    | string           | -      | -      |
| id       | 下拉选项唯一 id | string \| number | -      | -      |
| disabled | 是否禁用        | boolean          | -      | false  |
| children | 子级数据        | DataItem[]       | -      | -      |

### DataSource

| 参数              | 说明                               | 类型                             | 可选值                                             | 默认值        |
| ----------------- | ---------------------------------- | -------------------------------- | -------------------------------------------------- | ------------- |
| url               | 请求的 url                         | string                           | -                                                  | -             |
| type              | 请求方法                           | string                           | get \| post                                        | get           |
| data              | post 请求时请求体参数              | object                           | -                                                  | -             |
| params            | url 查询参数                       | object                           | -                                                  | -             |
| headers           | 请求头                             | object                           | -                                                  | -             |
| mode              | 请求模式                           | string                           | 'same-origin' \| 'cors' \| 'no-cors' \| 'navigate' | 'same-origin' |
| transformResponse | 成功时的回调，用于对数据进行预处理 | (response: object) => DataItem[] | -                                                  | -             |

## CHANGELOG

> 从原 TreeSelect 组件抽离单选模式出来，作为为单独单选的 TreeSelect 组件。

| 参数               | 变更类型                        | 变更内容                                                                                                                                                                                           | 解决的问题                                                                                               |
| ------------------ | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| propName           | feature \| deprecated \| update | 变更了什么                                                                                                                                                                                         | 之前是什么样子，解决什么问题                                                                             |
| ----               | ----                            | ----                                                                                                                                                                                               | ----                                                                                                     |
| value              | update                          | 类型 DataItem[] \| string[] \| string -> <string \| number>                                                                                                                                        | 对于表单控件 id 值的控制，均使用 React.ReactText（即 string 和 number 都支持）                           |
| defaultValue       | update                          | 类型 DataItem[] \| string[] \| string -> <string \| number>                                                                                                                                        | 对于表单控件 id 值的控制，均使用 React.ReactText（即 string 和 number 都支持）                           |
| id                 | update                          | 类型 string -> string \| number                                                                                                                                                                    | 对于表单控件 id 值的控制，均使用 React.ReactText（即 string 和 number 都支持）                           |
| bordered           | deprecated                      | 字段 `bordered` -> `appearance`                                                                                                                                                                    | 对于 Picker 类型的组件，统一使用 appearance 设置外形（线\面\无边框）值                                   |
| searchPlaceholder  | feature                         | -                                                                                                                                                                                                  | Picker 类型组件统一支持                                                                                  |
| loadingContent     | feature                         | -                                                                                                                                                                                                  | Picker 类型组件统一支持，适配新 UI                                                                       |
| popper             | feature                         | -                                                                                                                                                                                                  | Picker 类型组件统一支持，聚合管理。比如： placement，之前有的加了有的没加                                |
| titleRender        | feature                         | -                                                                                                                                                                                                  | 统一支持自定义渲染每一项                                                                                 |
| virtual            | feature                         | -                                                                                                                                                                                                  | 支持虚拟列表                                                                                             |
| height             | feature                         | -                                                                                                                                                                                                  | 支持虚拟列表                                                                                             |
| itemHeight         | feature                         | -                                                                                                                                                                                                  | 支持虚拟列表                                                                                             |
| type               | deprecated                      | -                                                                                                                                                                                                  | 拆分单选多选组件单独维护                                                                                 |
| autoload           | deprecated                      | -                                                                                                                                                                                                  | 页面级首次渲染执行数据加载操作，取消内置                                                                 |
| mode               | deprecated                      | -                                                                                                                                                                                                  | 面包屑模式可以使用 checkCascade 组件替代，交互形式更为优雅。                                             |
| appearance         | feature                         | -                                                                                                                                                                                                  | 统一支持：线性\面性\无边框                                                                               |
| valueRender        | update                          | valueRender(items: DataItem[]) -> displayRender(item: DataItem)                                                                                                                                    | 统一字段命名及其含义                                                                                     |
| expandedIds        | update                          | 字段：expandIds -> expandedIds                                                                                                                                                                     | 统一字段命名及其含义                                                                                     |
| defaultExpandedIds | update                          | defaultExpandIds -> defaultExpandedIds                                                                                                                                                             | 统一字段命名及其含义                                                                                     |
| onChange           | update                          | 类型：`(checkedIds \| checkedId, checkedNodes \| checkedNode, currentNode) => void` -> `(checkedIds: ReactText[], checkedNodes: DataItem[], targetNode: DataItem, shouldChecked: boolean) => void` | 1. 移除数组结构，方便用户获取；2. 暴露 shouldSelected 执行相应拦截之类的操作; 3. 点击清空时触发 onChange |
