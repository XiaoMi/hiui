# Select 选择器

选择器是一种接收数据的容器，为用户提供选择一部分数据的能力。

## 何时使用

需要从大量的离散型数据中选择一部分时使用

备选项数量 5 个以上时

不需要将全部备选项都展示给用户时

## 使用示例

<!-- Inject Stories -->

## Props

| 参数              | 说明                                                                                                     | 类型                                                                        | 可选值                                       | 默认值                                                                |
| ----------------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | -------------------------------------------- | --------------------------------------------------------------------- |
| data              | 下拉框选项数据源                                                                                         | DataItem[] \| groupDataItem[]                                               | -                                            | -                                                                     |
| fieldNames        | 设置 data 中 id, title, disabled, children 对应的 key                                                    | object                                                                      | -                                            | { title: 'title', id: 'id',disabled:'disabled', children: 'children'} |
| dataSource        | 关键词搜索时，触发异步下拉框选项数据源                                                                   | DataSource (keyword: string) => (DataSource \| DataItem \| Promise \| void) | -                                            | -                                                                     |
| value             | 被选中项的值                                                                                             | ReactText                                                                   | -                                            | -                                                                     |
| defaultValue      | 默认被选中项的值                                                                                         | ReactText                                                                   | -                                            | -                                                                     |
| searchable        | 是否可以筛选                                                                                             | boolean                                                                     | true \| false                                | false                                                                 |
| filterOption      | 第一个参数为输入的关键字，第二个为数据项，返回值为 true 时将出现在结果项。仅在 searchable 为 true 时有效 | (keyword: string, item: DataItem) => boolean                                | (keyword: string, item: DataItem) => boolean | -                                                                     |
| clearable         | 是否可以清空                                                                                             | boolean                                                                     | true \| false                                | true                                                                  |
| disabled          | 是否禁用                                                                                                 | boolean                                                                     | true \| false                                | false                                                                 |
| placeholder       | 输入框占位                                                                                               | string                                                                      | -                                            | '请选择'                                                              |
| searchPlaceholder | 搜索输入框占位                                                                                           | string                                                                      | -                                            | '搜索'                                                                |
| emptyContent      | 设置选项为空时展示的内容                                                                                 | ReactNode                                                                   | -                                            | '无匹配数据'                                                          |
| loadingContent    | 设置加载中时展示的内容                                                                                   | ReactNode                                                                   | -                                            | '数据加载中...'                                                       |
| optionWidth       | 自定义下拉选项宽度                                                                                       | number                                                                      | -                                            |                                                                       |
| renderExtraFooter | 自定义下拉菜单底部渲染                                                                                   | () => ReactNode                                                             | -                                            | 无内容                                                                |
| overlayClassName  | 下拉根元素的类名称                                                                                       | string                                                                      | -                                            | -                                                                     |
| onOverlayScroll   | 下拉列表滚动时的回调                                                                                     | function                                                                    | -                                            | -                                                                     |
| popper            | 自定义控制弹出层 popper 行为                                                                             | Omit<PopperProps, 'visible' \| 'attachEl'>                                  | -                                            | -                                                                     |
| titleRender       | 自定义渲染节点的 title 内容径                                                                            | (item: CheckSelectEventData, keyword: string) => React.ReactNode            | -                                            |
| displayRender     | 自定义选择后展示的内容                                                                                   | (selectedItem: CheckSelectEventData) => string                              | -                                            | -                                                                     |

> 注意，如果发现下拉菜单跟随页面滚动，或者需要在其他弹层中触发 CheckSelect，请尝试使用 `popper={ container: triggerNode.parentElement }` 将下拉弹层渲染节点固定在触发器的父元素中。

## Events

| 名称     | 说明               | 类型                                                                           | 参数                                                   | 返回值 |
| -------- | ------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------ | ------ |
| onChange | 改变选项时触发函数 | (selectedId: ReactText, changedItem: DataItem, shouldChecked: boolean) => void | selectedId: 选中项的 id <br /> changedItem: 变更的选项 | -      |

## Type

### groupDataItem

| 参数       | 说明              | 类型             | 可选值 | 默认值 |
| ---------- | ----------------- | ---------------- | ------ | ------ |
| groupId    | 下拉选项组唯一 id | string \| number | -      | -      |
| groupTitle | 下拉选项组标题    | string           | -      | -      |
| children   | 分组的时候使用    | DataItem[]       | -      | -      |

### DataItem

| 参数     | 说明              | 类型      | 可选值        | 默认值 |
| -------- | ----------------- | --------- | ------------- | ------ |
| id       | 下拉选择项唯一 id | ReactText | -             | -      |
| title    | 下拉选择项标题    | string    | -             | -      |
| disabled | 是否禁用          | boolean   | true \| false | false  |

### CheckSelectEventData

| 参数     | 说明                             | 类型    | 可选值        | 默认值 |
| -------- | -------------------------------- | ------- | ------------- | ------ |
| id       | 选择项值                         | string  | -             | -      |
| title    | 选择项                           | string  | -             | -      |
| disabled | 是否禁用                         | boolean | true \| false | false  |
| raw      | 原始数据，包括约定模型之外的数据 | object  | -             | -      |
| selected | 节点是否被选中                   | boolean | true \| false | -      |
| focused  | 节点是否被聚焦                   | boolean | true \| false | -      |

### DataSource

> 继承 [Axios](https://www.kancloud.cn/yunye/axios/234845) 的 api

| 参数              | 说明                               | 类型                             | 可选值        | 默认值 |
| ----------------- | ---------------------------------- | -------------------------------- | ------------- | ------ |
| url               | 请求的 url                         | string                           | -             | -      |
| method            | 请求方法                           | string                           | get \| post   | get    |
| data              | post 请求时请求体参数              | object                           | -             | -      |
| params            | url 查询参数                       | object                           | -             | -      |
| headers           | 请求头                             | object                           | -             | -      |
| withCredentials   | 上传请求时是否携带 cookie          | boolean                          | true \| false | false  |
| transformResponse | 成功时的回调，用于对数据进行预处理 | (response: object) => DataItem[] | -             | -      |
| error             | 请求发生异常的回调方法             | (error: object) => void          | -             | -      |

## CHANGELOG

| 参数                | 变更类型                        | 变更内容                                                                                                                                        | 解决的问题                                                                     |
| ------------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| propName            | feature \| deprecated \| update | 变更了什么                                                                                                                                      | 之前是什么样子，解决什么问题                                                   |
| ----                | ----                            | ----                                                                                                                                            | ----                                                                           |
| value               | update                          | 类型 string[] -> string \| number                                                                                                               | 对于表单控件 id 值的控制，均使用 React.ReactText（即 string 和 number 都支持） |
| defaultValue        | update                          | 类型 string[] -> string \| number                                                                                                               | 对于表单控件 id 值的控制，均使用 React.ReactText（即 string 和 number 都支持） |
| id                  | update                          | 类型 string -> string \| number                                                                                                                 | 对于表单控件 id 值的控制，均使用 React.ReactText（即 string 和 number 都支持） |
| bordered            | deprecated                      | 字段 `bordered` -> `appearance`                                                                                                                 | 对于 Picker 类型的组件，统一使用 appearance 设置外形（线\面\无边框）值         |
| searchPlaceholder   | feature                         | -                                                                                                                                               | Picker 类型组件统一支持                                                        |
| loadingContent      | feature                         | -                                                                                                                                               | Picker 类型组件统一支持，适配新 UI                                             |
| popper              | feature                         | -                                                                                                                                               | Picker 类型组件统一支持，聚合管理。比如： placement，之前有的加了有的没加      |
| titleRender         | feature                         | 字段 render -> titleRender                                                                                                                      | 统一支持自定义渲染每一项                                                       |
| virtual             | feature                         | -                                                                                                                                               | 支持虚拟列表                                                                   |
| height              | feature                         | -                                                                                                                                               | 支持虚拟列表                                                                   |
| itemHeight          | feature                         | -                                                                                                                                               | 支持虚拟列表                                                                   |
| type                | deprecated                      | -                                                                                                                                               | 拆分单选多选组件单独维护                                                       |
| autoload            | deprecated                      | -                                                                                                                                               | 页面级首次渲染执行数据加载操作，取消内置                                       |
| onSearch            | deprecated                      | -                                                                                                                                               | 使用 dataSource 替代，功能重合                                                 |
| appearance          | feature                         | -                                                                                                                                               | 统一支持：线性\面性\无边框                                                     |
| displayRender       | feature                         | -                                                                                                                                               | 统一支持选择后内容自定义渲染                                                   |
| setOverlayContainer | deprecated                      | -                                                                                                                                               | 使用 popper.container 替代，功能重合                                           |
| onChange            | update                          | 类型：(selectedIds: string[], changedItem: DataItem, changedItems:DataItem[]) => void -> (selectedId: ReactText, changedItem: DataItem) => void | 1. 移除数组结构，方便用户获取；2. 暴露 shouldSelected 执行相应拦截之类的操作   |
