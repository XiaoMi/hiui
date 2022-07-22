# Filter 筛选

多个维度筛选

## 何时使用

对列表进行筛选场景

## 使用示例

<!-- Inject Stories -->

## Props

| 参数          | 说明           | 类型             | 可选值        | 默认值 |
| ------------- | -------------- | ---------------- | ------------- | ------ |
| label         | 筛选标题       | ReactText[]      | -             | -      |
| labelWidth    | 筛选标题宽度   | number           | -             | 80     |
| showUnderline | 是否显示下划线 | boolean          | true \| false | false  |
| data          | 筛选选项数据   | FilterDataItem[] | -             | -      |
| defaultValue  | 默认选中项的值 | ReactText[]      | -             | -      |
| value         | 被选中项的值   | ReactText[]      | -             | -      |

## Events

| 名称     | 说明             | 类型                          | 参数                     | 返回值 |
| -------- | ---------------- | ----------------------------- | ------------------------ | ------ |
| onChange | 选择时的回调函数 | (values: ReactText[]) => void | values: 选中项的 ID 集合 | -      |

## FilterDataItem

| 参数     | 说明             | 类型      | 可选值        | 默认值 |
| -------- | ---------------- | --------- | ------------- | ------ |
| content  | 选择项的展示内容 | ReactNode | -             | -      |
| id       | 选择项对应的值   | ReactText | -             | -      |
| disabled | 是否禁用         | boolean   | true \| false | false  |
| children | 是否禁用         | boolean   | true \| false | false  |

## CHANGELOG

| 参数         | 变更类型                        | 变更内容                                                                 | 解决的问题                   |
| ------------ | ------------------------------- | ------------------------------------------------------------------------ | ---------------------------- |
| propName     | feature \| deprecated \| update | 变更了什么                                                               | 之前是什么样子，解决什么问题 |
| ----         | ----                            | ----                                                                     | ----                         |
| value        | update                          | 对于表单控件 id 值的控制，均使用 ReactText（即 string 和 number 都支持） | 之前是 string 类型           |
| defaultValue | update                          | 对于表单控件 id 值的控制，均使用 ReactText（即 string 和 number 都支持） | 之前是 string 类型           |
| id           | update                          | 对于表单控件 id 值的控制，均使用 ReactText（即 string 和 number 都支持） | 之前是 string 类型           |
