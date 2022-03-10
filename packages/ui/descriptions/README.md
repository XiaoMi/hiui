# Descriptions 描述列表

描述成组只读字段

## 何时使用

常见于详情信息展示

```
const Descriptions = require('@hi-ui/descriptions');

// TODO: DEMONSTRATE API
```

### Descriptions

| 参数         | 说明                         | 类型          | 可选值                     | 默认值     |
| ------------ | ---------------------------- | ------------- | -------------------------- | ---------- |
| bordered     | 是否带边框                   | boolean       | true \| false              | false      |
| column       | 一行的 DescriptionItems 数量 | number        | -                          | 3          |
| layout       | 布局方式                     | string        | `horizontal` \| `vertical` | horizontal |
| labelStyle   | 自定义 label 样式            | CSSProperties | -                          | -          |
| contentStyle | 自定义内容样式               | CSSProperties | -                          | -          |

### Descriptions.Item

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---- | ---- | ---- | ------ | ------ |


| label | 内容描述 | ReactNode | - | - |
| span | 列的数量 | number | - | 1 |
| labelStyle | 自定义 label 样式 | CSSProperties | - | - |
| contentStyle | 自定义内容样式 | CSSProperties | - | - |
