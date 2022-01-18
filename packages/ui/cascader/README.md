# Cascader 级联选择

一种接收数据的容器，为用户提供选择一部分数据的能力

## 何时使用

需要从大量的离散型数据中选择一部分时使用

备选项数量 5 个以上时

不需要将全部备选项都展示给用户时

## 使用示例

<!-- Inject Stories -->

## Props

| 参数              | 说明                                                                                                                       | 类型                                                      | 可选值             | 默认值                                                  |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ------------------ | ------------------------------------------------------- |
| disabled          | 是否禁止使用                                                                                                               | boolean                                                   | true \| false      | false                                                   |
| placeholder       | 输入框占位                                                                                                                 | string                                                    | -                  | '请选择'                                                |
| searchPlaceholder | 搜索输入框占位                                                                                                             | string                                                    | -                  | '搜索'                                                  |
| emptyContent      | 设置选项为空时展示的内容                                                                                                   | ReactNode                                                 | -                  | '无匹配数据'                                            |
| loadingContent    | 设置加载中时展示的内容                                                                                                     | ReactNode                                                 | -                  | '数据加载中...'                                         |
| overlayClassName  | 下拉根元素的类名称                                                                                                         | string                                                    | -                  | -                                                       |
| searchable        | 是否可搜索                                                                                                                 | boolean                                                   | true \| false      | false                                                   |
| clearable         | 是否可清空                                                                                                                 | boolean                                                   | true \| false      | true                                                    |
| overlay           | 自定义控制弹出层 popper 行为                                                                                               | PopperOverlayProps                                        | -                  | -                                                       |
| fieldNames        | 设置 data 中 label, value, children 对应的 key                                                                             | object                                                    | -                  | { label: 'label', value: 'value', children: 'children'} |
| data              | 设置选择项数据源                                                                                                           | CascaderDataItem[]                                        | -                  | -                                                       |
| value             | 设置当前选中值                                                                                                             | ReactText[]                                               | -                  | []                                                      |
| defaultValue      | 设置当前选中值默认值                                                                                                       | ReactText[]                                               | -                  | []                                                      |
| displayRender     | 自定义选择后展示的内容                                                                                                     | (value: string[]) => string                               | -                  | -                                                       |
| expandTrigger     | 次级菜单的展开方式，可选 'click' 和 'hover'                                                                                | string                                                    | 'click' \| 'hover' | 'click'                                                 |
| filterOption      | 第一个参数为输入的关键字，第二个为数据项，返回值为 true 时将出现在结果项。仅在 searchable 为 true 时有效                   | (keyword: string, item: DataItem) => boolean              | -                  | -                                                       |
| changeOnSelect    | 是否启用选择即改变功能                                                                                                     | boolean                                                   | true \| false      | false                                                   |
| flatted           | 将选项拍平展示，不支持 `onLoadChildren` 异步加载交互                                                                       | true \| false                                             | false              |
| upMatch           | 开启全量搜索，默认只对开启对可选的选项进行搜索，不向上查找路径                                                             | true \| false                                             | false              |
| render            | 自定义渲染节点的 title 内容径                                                                                              | (item: CascaderItemEventData) => React.ReactNode          | -                  |
| filterOption      | 自定义搜索过滤器，仅在 searchable 为 true 时有效。第一个参数为输入的关键字，第二个为数据项，返回值为 true 时将出现在结果项 | (keyword: string, item: CascaderItemEventData) => boolean | -                  |
| appearance        | 设置展现形式                                                                                                               | 'line' \| 'unset' \| 'filled'                             | 'line'             |

## Events

| 名称               | 说明               | 类型                                                                       | 参数               | 返回值 |
| ------------------ | ------------------ | -------------------------------------------------------------------------- | ------------------ | ------ |
| onChange           | 选择后的回调       | (values: ReactText[]) => void                                              | values: 选中项集合 | -      |
| onActiveItemChange | 选中项改变时的回调 | (values: string[]) => void                                                 | values: 选中项集合 | -      |
| onOpen             | 下拉菜单打开时回调 | () => void                                                                 | -                  | -      |
| onClose            | 下拉菜单关闭时回调 | () => void                                                                 | -                  | -      |
| onLoadChildren     | 异步请求更新数据   | (item: CascaderItemEventData) => Promise\<CascaderItem[] \| void\> \| void | -                  | -      |

## Type

### CascaderDataItem

| 参数     | 说明             | 类型      | 可选值        | 默认值 |
| -------- | ---------------- | --------- | ------------- | ------ |
| id       | 下拉选择项唯一值 | ReactText | -             | -      |
| title    | 下拉选择项标题   | string    | -             | -      |
| disabled | 是否禁用         | boolean   | true \| false | false  |

### CascaderItemEventData

| 参数     | 说明                             | 类型     | 可选值        | 默认值 |
| -------- | -------------------------------- | -------- | ------------- | ------ |
| id       | 选择项值                         | string   | -             | -      |
| title    | 选择项                           | string   | -             | -      |
| disabled | 是否禁用                         | boolean  | true \| false | false  |
| depth    | 选项的层级，根节点层级为 0       | number   | -             | -      |
| raw      | 原始数据，包括约定模型之外的数据 | object   | -             | -      |
| parent   | 选项的父级节点数据               | object   | -             | -      |
| children | 选项的孩子节点列表数据           | object[] | -             | -      |
| selected | 节点是否被选中                   | boolean  | true \| false | -      |
| loading  | 节点是否在异步加载子项数据中     | boolean  | true \| false | -      |

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

| 参数               | 变更类型                        | 变更内容                                                                                                        | 解决的问题                                                                           |
| ------------------ | ------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| propName           | feature \| deprecated \| update | 变更了什么                                                                                                      | 之前是什么样子，解决什么问题                                                         |
| ----               | ----                            | ----                                                                                                            | ----                                                                                 |
| value              | update                          | 类型 string[] => string[] \| number[]                                                                           | 对于表单控件 id 值的控制，均使用 React.ReactText（即 string 和 number 都支持）       |
| defaultValue       | update                          | 类型 string[] => string[] \| number[]                                                                           | 对于表单控件 id 值的控制，均使用 React.ReactText（即 string 和 number 都支持）       |
| id                 | update                          | 类型 string => string \| number                                                                                 | 对于表单控件 id 值的控制，均使用 React.ReactText（即 string 和 number 都支持）       |
| bordered           | deprecated                      | 字段 `bordered` => `appearance`                                                                                 | 对于 Picker 类型的组件，统一使用 appearance 设置外形（线\面\无边框）值               |
| content            | deprecated                      | 字段 `content` => `title`                                                                                       | 对于 DataItem 模型数据，统一使用 title                                               |
| searchPlaceholder  | feature                         | -                                                                                                               | Picker 类型组件统一支持                                                              |
| loadingContent     | feature                         | -                                                                                                               | Picker 类型组件统一支持，适配新 UI                                                   |
| overlay            | feature                         | -                                                                                                               | Picker 类型组件统一支持，聚合管理。比如： placement，之前有的加了有的没加            |
| onLoadChildren     | feature                         | -                                                                                                               | 树形数据懒加载统一方案，并强化返回值 Promise 功能，保持一致，替代 onActiveItemChange |
| onActiveItemChange | deprecated                      | -                                                                                                               | 使用 onLoadChildren 替代                                                             |
| render             | feature                         | (item: CascaderItemEventData) => React.ReactNode                                                                | 统一支持自定义渲染每一项                                                             |
| filterOption       | feature                         | (keyword: string, item: CascaderItemEventData) => boolean                                                       | 统一支持自定义过滤                                                                   |
| appearance         | feature                         | 'line' \| 'unset' \| 'filled'                                                                                   | 统一支持：线性\面性\无边框                                                           |
| displayRender      | feature                         | (value: string[]) => string -> (item: CascaderItemEventData, items: CascaderItemEventData[]) => React.ReactNode | 支持自定义节点渲染                                                                   |
