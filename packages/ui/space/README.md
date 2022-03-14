# Space 间距

> 设置组件之间的间距，支持排列方式、对齐、间距数值、以及 childItem 中插入信息


## Usage

<!-- Inject Stories -->

## Props
| 参数           | 说明                         | 类型               | 可选值                | 默认值    |
| ------------- | ---------------------------- | ----------------- | -------------------- | -------- |
| align | 对齐方式 |  string | `start` \| `end` \| `center` \| `baseline` | `start` |
| direction | 间距大小 |  - | `row` \| `column`  | `row` |
| size | 间距方向 |  string | `Size` \| `Size[]`  | `small` |
| split | 设置拆分内容 |  - | `React.ReactNode`  | - |
| wrap | 是否自动换行，仅在 `row` 时有效 |  - | boolean  | `false` |


## Size
`small` | `normal` | `large` | number | number[]