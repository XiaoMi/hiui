# Descriptions 描述列表

描述成组只读字段

## 何时使用

常见于详情信息展示

```
const Descriptions = require('@hi-ui/descriptions');

// TODO: DEMONSTRATE API
```

### Descriptions

| 参数       | 说明                         | 类型   | 可选值                     | 默认值     |
| ---------- | ---------------------------- | ------ | -------------------------- | ---------- |
| appearance | 表格样式或者非表格样式       | string | `table` \| `unset`         | false      |
| column     | 一行的 DescriptionItems 数量 | number | -                          | 3          |
| placement  | 布局方式                     | string | `horizontal` \| `vertical` | horizontal |

### Descriptions.Item

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---- | ---- | ---- | ------ | ------ |


| label | 内容描述 | ReactNode | - | - |
| span | 列的数量 | number | - | 1 |
