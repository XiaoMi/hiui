# Alert 警告提示

作用于页面的内容区域的提示，非触发类信息

## 何时使用

警示，内容提示，说明，要求，规则等阅读类信息

显示在页面局部的提示性文案

## 使用示例

<!-- Inject Stories -->

## Props

| 参数      | 说明                     | 类型           | 可选值                                          | 默认值    |
| --------- | ------------------------ | -------------- | ----------------------------------------------- | --------- |
| type      | 警告提示类型             | string         | 'primary' \| 'warning' \| 'success' \| 'danger' | 'primary' |
| title     | 警告提示标题             | string         | -                                               | -         |
| content   | 警告提示内容             | string         | -                                               | -         |
| closeable | 是否可关闭               | boolean        | true \| false                                   | false     |
| duration  | 自动关闭时间，单位为毫秒 | number \| null | -                                               | null      |

## Events

| 名称    | 说明                 | 类型       | 参数 | 返回值 |
| ------- | -------------------- | ---------- | ---- | ------ |
| onClose | 关闭事件触发时的回调 | () => void | -    | -      |

## CHANGELOG

| 参数      | 变更类型 | 变更内容 | 解决的问题 |
| --------- | -------- | -------- | ---------- |
| closeIcon | feature  |          |            |
| showIcon  | feature  |          |            |
