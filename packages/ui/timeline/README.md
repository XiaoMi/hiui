# `@hi-ui/timeline`

> TODO: description

## Usage

```
const Timeline = require('@hi-ui/timeline');

// TODO: DEMONSTRATE API
```
## Props

| 参数 | 说明       | 类型                      | 可选值                          | 默认值    |
| ---- | ---------- | ------------------------- | ------------------------------- | --------- |
| type | 时间轴类型 | string                    | 'default' \| 'right' \| 'cross' | 'default' |
| data | 时间轴数据 | TimelineGroupItem[] \| TimelineItem[] | -                               | -         |

## Type

### TimelineGroupItem

| 参数       | 说明       | 类型                | 可选值 | 默认值 |
| ---------- | ---------- | ------------------- | ------ | ------ |
| groupTitle | 分组标题   | string \| ReactNode | -      | -      |
| children   | 标题下集合 | TimelineItem[]          | -      | -      |

### TimelineItem

| 参数      | 说明           | 类型                | 可选值 | 默认值 |
| --------- | -------------- | ------------------- | ------ | ------ |
| title     | 标题           | string \| ReactNode | -      | -      |
| content   | 内容信息       | string \| ReactNode | -      | -      |
| timestamp | 时间点         | string              | -      | -      |
| extraTime | 额外展示时间点 | string              | -      | -      |
| icon      | 自定义图标     | ReactNode | -      | -      |
| children   | 子节点集合 | TimelineItem[]          | -      | -      |

## CHANGELOG

| 参数         | 变更类型                        | 变更内容                                                                       | 解决的问题                   |
| ------------ | ------------------------------- | ------------------------------------------------------------------------------ | ---------------------------- |
| icon        | update                          | icon 不再支持 string 模式 | Timeline 组件与 Icon 组件真正解耦          |
