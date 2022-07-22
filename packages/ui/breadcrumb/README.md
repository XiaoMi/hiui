# `@hi-ui/breadcrumb`

> TODO: description

## Usage

```
const Breadcrumb = require('@hi-ui/breadcrumb');

// TODO: DEMONSTRATE API
```

## Props

| 参数            | 说明                     | 类型     | 可选值                            | 默认值    |
| --------------- | ------------------------ | -------- | --------------------------------- | --------- |
| data  | 面包屑数据           | string   | BreadcrumbItemProp []                                | -       |
| separator  | 自定义分隔符           | string   | -                                | '/'       |

## Events

| 名称             | 说明                       | 类型                                                      | 参数                                                                        | 返回值 |
| ---------------- | -------------------------- | --------------------------------------------------------- | --------------------------------------------------------------------------- | ------ |
| onClick          | 点击回调函数             | (e: React.MouseEvent, item: BreadcrumbItemProps, index: number) => void     |  | -      |

## BreadcrumbItemProp

| 参数            | 说明                     | 类型     | 可选值                            | 默认值    |
| --------------- | ------------------------ | -------- | --------------------------------- | --------- |
|title  | 面包屑的内容           | ReactNode   | -                              | -        |
| href  | 设置按钮链接，设置后将用 a 标签渲染按钮           | string   | -                                 | 1         |
| target         | 同 a 标签的 target 属性，仅在设置 href 后有效                 | string   | ︎'_self' | '_blank' | '_parent' | '_top'                                | -         |
| icon             | 自定义图标           | ReactNode   | -                                 | 2         |



## CHANGELOG

| 参数         | 变更类型                        | 变更内容                                                                       | 解决的问题                   |
| ------------ | ------------------------------- | ------------------------------------------------------------------------------ | ---------------------------- |
| BreacrumbItem.path        | deprecate                          | 不需要，暴露整个 item |            |
| onClick        | update                          | 参数变化，能力增强 |            |
