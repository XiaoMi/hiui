# Tag 标签

用来标记信息的属性，用以区分信息

## 何时使用

有新消息提示时

常见于图标、文本标题、按钮等位置

## 使用示例

<!-- Inject Stories -->

## Props

## Props

### Tag

| 参数         | 说明      | 类型            | 可选值                                             | 默认值       |
| ---------- | ------- | ------------- | ----------------------------------------------- | --------- |
| type       | 设置状态    | string        | 'primary' \| 'success' \| 'warning' \| 'danger' | 'primary' |
| appearance | 设置样式类型  | string        | 'default' \| 'line'                             | 'default' |
| shape      | 设置形状    | string        | 'round' \| 'square'                             | 'round'   |
| color      | 标签色     | string        | -                                               | -         |
| className  | 自定义样式类名 | string        | -                                               | -         |
| style      | 自定义样式   | CSSProperties | -                                               | -         |

### Tag.Group

| 参数       | 说明              | 类型        | 可选值           | 默认值   |
| -------- | --------------- | --------- | ------------- | ----- |
| data     | 展示数据            | TagNode[] | -             | -     |
| editable | 标签组是否可以修改、新增、删除 | boolean   | true \| false | false |

## Events

### Tag.Group

| 参数       | 说明      | 类型                                         | 参数                                                   | 返回值 |
| -------- | ------- | ------------------------------------------ | ---------------------------------------------------- | --- |
| onAdd    | 标签新增后触发 | (addNode:TagNode, index:number) => void    | addNode: 新增的 Tag 对象 TagNode<br/>index: 新增 Tag 的索引    | -   |
| onEdit   | 标签修改后触发 | (editNode:TagNode, index:number) => void   | editNode: 编辑的 Tag 对象 TagNode<br/>index: 编辑 Tag 的索引   | -   |
| onDelete | 标签删除后触发 | (deleteNode:TagNode, index:number) => void | deleteNode: 删除的 Tag 对象 TagNode<br/>index: 删除 Tag 的索引 | -   |

## CHANGELOG

| 参数                          | 变更类型       | 变更内容                                                                                       | 解决的问题          |
| --------------------------- | ---------- | ------------------------------------------------------------------------------------------ | -------------- |
| type                        | update     | 新增'default'，变更默认为'default'                                                                 |                |
| appearance                  | update     | 修改'line'为'solid'                                                                           | 设计样式变更         |
| shape                       | deprecated |                                                                                            | 不再有形态变化        |
| size                        | feature    | 新增标签尺寸                                                                                     |                |
| color                       | update     | 变更字段含义为：标签文字颜色                                                                             |                |
| background                  | feature    | 标签背景色                                                                                      |                |
| childrenToStringTransformer | feature    | 子代转换为 string 类型转换器                                                                         | 解决tag编辑时的初始值问题 |
| closeable                   | feature    | 是否展示可关闭按钮                                                                                  |                |
| editable                    | feature    | 是否可编辑（当使用此功能时，如果 children.toString 无法自动转换成预期的字符串，则请自行配置转换器 childrenToStringTransformer 属性） |                |
| autoEditable                | feature    | 是否一开始自动可编辑                                                                                 |                |
| onEdit                      | feature    | tag 修改操作                                                                                   |                |
| onDelete                    | feature    | tag 删除操作                                                                                   |                |
| maxWidth                    | feature    | 最大宽度，如超出，则截断末尾添加省略号，鼠标悬浮气泡展示（当使用此功能时，请保证children为纯文本类型）                                    |                |

### Tag.Group

| 参数       | 变更类型       | 变更内容                                                                             | 解决的问题            |
| -------- | ---------- | -------------------------------------------------------------------------------- | ---------------- |
| data     | update     | 类型变更为TagGroupNode[]                                                              | 增强data对于tag的自定义度 |
| maxWidth | feature    | 最大宽度（优先级低于 node 自行定义）                                                            | 提供统一设定方式         |
| shape    | deprecated |                                                                                  | 不再有形态变化          |
| onAdd    | update     | 变更类型为 (newStringValue: string) => void                                           |                  |
| onEdit   | update     | 变更类型为 (newStringValue: string, disposeNode: TagGroupNode, index: number) => void |                  |
