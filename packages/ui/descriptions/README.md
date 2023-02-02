# Descriptions 描述列表

描述成组只读字段

## 何时使用

常见于详情信息展示

```
const Descriptions = require('@hi-ui/descriptions');

// TODO: DEMONSTRATE API
```

### Descriptions

| 参数           | 说明                                            | 类型   | 可选值                        | 默认值     |
| -------------- | ----------------------------------------------- | ------ | ----------------------------- | ---------- |
| data           | 通过 JSON 的方式配置 `<Descriptions.Item />`       | `IDataItem[]` |     -        |    -   |
| appearance     | 表格样式或者非表格样式                          | string | `table` \| `unset`            | false      |
| column         | 一行的 DescriptionItems 数量                    | number | -                             | 3          |
| placement      | 布局方式                                        | string | `horizontal` \| `vertical`    | horizontal |
| labelPlacement | label 对齐方式，只在 appearance 为'table'下生效 | string | `left` \| `center` \| `right` | left       |

### Descriptions.Item

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---- | ---- | ---- | ------ | ------ |
| label | 内容标题 | ReactNode | - | - |
| labelWidth | label宽度 | number | - | - |
| span | 列的数量 | number | - | 1 |
| colSpan | 包含列的数量 | number | - | 1 |
| labelPlacement | label 对齐方式 | `left` \| `right` \| undefined | - | 1 |

### IDataItem
参数继承自 `Descriptions.Item`，另外增加 `value` 字段，替代 `children`的值。
具体可参考示例

#### Extra Props
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---- | ---- | ---- | ------ | ------ |
| value | 内容标题对应的值 | ReactNode \| ReactText | - | - |
