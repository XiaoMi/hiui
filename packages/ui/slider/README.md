# Slider 滑块

通过简单拖拽的交互形式实现数值的设置

## 何时使用

设置多个参数且要求操作所即见即所得时

## 使用示例

<!-- Inject Stories -->

## Props

| 参数           | 说明                                                          | 类型               | 可选值                                          | 默认值    |
| -------------- | ------------------------------------------------------------- | ------------------ | ----------------------------------------------- | --------- |
| type           | 类型                                                          | string             | 'primary' \| 'danger' \| 'success' \| 'warning' | 'primary' |
| defaultValue   | 设置初始取值                                                  | number             | -                                               | 0         |
| value          | 设置当前取值                                                  | number             | -                                               | 0         |
| min            | 最小值                                                        | number             | -                                               | 0         |
| max            | 最大值                                                        | number             | -                                               | 100       |
| disabled       | 值为 true 时，滑块为禁用状态                                  | boolean            | true \| false                                   | false     |
| tipFormatter   | 自定义 Tooltip 中显示文案                                     | value => ReactNode | -                                               | -         |
| marks          | 刻度标记,key 的类型必须为 number 且取值在闭区间 [min, max] 内 | object             | -                                               | {}        |
| step           | 步长                                                          | number             | -                                               | 1         |
| vertical       | 值为 true 时，Slider 为垂直方向                               | boolean            | true \| false                                   | false     |
| showRangeLabel | 是否显示范围 label                                            | boolean            | true \| false                                   | false     |

## Events

| 名称     | 说明                         | 类型            | 参数              | 返回值 |
| -------- | ---------------------------- | --------------- | ----------------- | ------ |
| onChange | 当 Slider 的值发生改变时触发 | (value) => void | value: 变化后的值 | -      |

## CHANGELOG

| 参数      | 变更类型                        | 变更内容                    | 解决的问题                   |
| --------- | ------------------------------- | --------------------------- | ---------------------------- |
| propName  | feature \| deprecated \| update | 变更了什么                  | 之前是什么样子，解决什么问题 |
| ----      | ----                            | ----                        | ----                         |
| 组件名    | update                          | Rate -> Rating              | 命名专业化，符合英语理解认知 |
| color     | feature                         | 字段：type -> color         | 扩展自定义颜色能力           |
| placement | update                          | 字段：vertical -> placement | 统一使用类 placement 命名    |
