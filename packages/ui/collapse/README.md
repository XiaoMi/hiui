# `@hi-ui/collapse`

> TODO: description

## Usage

```
const Collapse = require('@hi-ui/collapse');

// TODO: DEMONSTRATE API
```
## Props

### Collapse

| 参数            | 说明                                           | 类型               | 可选值            | 默认值 |
| --------------- | ---------------------------------------------- | ------------------ | ----------------- | ------ |
| accordion       | 是否启用手风琴模式，手风琴模式下最多只展开一项 | boolean            | true \| false     | false  |
| defaultActiveId | 默认展开的面板                                 | string \| string[] | -                 | -      |
| activeId        | 指定展开的面板                                 | string \| string[] | -                 | -      |
| arrowPlacement  | 箭头所在位置                                   | string             | 'left' \| 'right' | 'right' |
| showArrow       | 是否显示展开箭头                               | boolean            | true \| false     | true   |

### Collapse.Panel

| 参数     | 说明         | 类型                | 可选值        | 默认值 |
| -------- | ------------ | ------------------- | ------------- | ------ |
| id       | 面板唯一标识 | string              | -             | -      |
| title    | 面板标题     | string \| ReactNode | -             | -      |
| disabled | 是否禁用面板 | boolean             | true \| false | false  |
| extra(未实现)    | 添加额外的元素 | ReactNode          |      -       |   -   |

## Events

| 名称     | 说明         | 类型                       | 参数                                                       | 返回值 |
| -------- | ------------ | -------------------------- | ---------------------------------------------------------- | ------ |
| onChange | 切换时的回调 | (indexs: string[]) => void | indexs: 当前展开的节点 ID 集合，如果 ID 不存在则为索引集合 | -      |
