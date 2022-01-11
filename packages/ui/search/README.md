# Search 搜索

可以通过关键字从海量数据条目中检索到匹配数据，较大提升数据检索能力

## 何时使用

- 全栈信息检索
- 表格数据、信息列表

## 使用示例

<!-- Inject Stories -->

## Props

| 参数             | 说明               | 类型                | 可选值        | 默认值 |
| ---------------- | ------------------ | ------------------- | ------------- | ------ |
| prepend          | 输入框前置内容     | string \| ReactNode | -             | -      |
| disabled         | 是否禁用           | boolean             | true \| false | false  |
| loading          | 加载中             | boolean             | true \| false | false  |
| placeholder      | 输入框占位符       | string \| ReactNode | -             | -      |
| data             | 搜索结果的数据     | `Array<DataItem>`   | -             | -      |
| append           | 搜索按钮           | ReactNode           | -             | -      |
| overlayClassName | 下拉根元素的类名称 | string              | -             | -      |

## Events

| 名称     | 说明                                                   | 类型                                        | 参数                                                    | 返回值 |
| -------- | ------------------------------------------------------ | ------------------------------------------- | ------------------------------------------------------- | ------ |
| onChange | 值改变时的回调                                         | (event: HTMLInputEvent) => void             | event: input 事件对象                                   | -      |
| onSearch | 当点击搜索按钮时候、输入框内点击回车或者点击下拉选项时 | (inputVal: string, item ?:DataItem) => void | inputVal: 输入的搜索关键字 <br/> item: 选中的搜索关键项 | -      |
| onBlur   | 下拉框失焦时                                           | () => void                                  | -                                                       | -      |

## DataItem

| 参数     | 说明                                               | 类型          | 可选值 | 默认值 |
| -------- | -------------------------------------------------- | ------------- | ------ | ------ |
| id       | 主键                                               | ReactText     | -      | -      |
| title    | 显示的内容；如果存在 children;就是这个类别的 title | ReactNode     | -      | -      |
| children | 分组内容                                           | `Array<Item>` | -      | -      |

## Item

| 参数  | 说明              | 类型                | 可选值 | 默认值 |
| ----- | ----------------- | ------------------- | ------ | ------ |
| id    | 主键              | string \| number    | -      | -      |
| title | 类别的 title 内容 | string \| ReactNode | -      | -      |

## CHANGELOG

| 参数         | 变更类型                        | 变更内容                                                                           | 解决的问题                   |
| ------------ | ------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------- |
| propName     | feature \| deprecated \| update | 变更了什么                                                                         | 之前是什么样子，解决什么问题 |
| ----         | ----                            | ----                                                                               | ----                         |
| defaultValue | feature                         | -                                                                                  | 功能强化                     |
| value        | feature                         | -                                                                                  | 功能强化                     |
| onChange     | update                          | 定义：(event: HTMLInputEvent) => void -> (inputVal: ReactText) => void             | -                            |
| onSearch     | update                          | 定义：(inputVal: string, item ?:DataItem) => void -> (inputVal: ReactText) => void | -                            |
| prepend      | deprecated                      | -                                                                                  | -                            |
