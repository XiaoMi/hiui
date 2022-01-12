# `@hi-ui/card`

> TODO: description

## Usage

```
const Card = require('@hi-ui/card');

// TODO: DEMONSTRATE API
```
## Props

| 参数      | 说明                       | 类型                | 可选值                          | 默认值    |
| --------- | -------------------------- | ------------------- | ------------------------------- | --------- |
| title     | 设置卡片标题               | ReactNode | -                               | -         |
| size      | 设置卡片大小               | string              | 'small' \| 'default' \| 'large' | - |
| bordered      | 是否显示边框               | boolean              | true \| false | true |
| type      | 设置卡片类型               | string              | 'simple' \| 'default'           | 'default' |
| hoverable | 鼠标移入卡片时是否显示阴影 | boolean             | true \| false                   | false     |
| extra     | 卡片右上角的扩展              | ReactNode           | -                               | -         |
| coverUrl  | 卡片的封面图片链接         | string              | -                               | -         |
| cover  | 卡片的封面        | ReactNode              | -                               | -         |
| className   | 卡片的自定义类名             | string  | -                               | -         |
| style   | 卡片的自定义样式             | 	CSSProperties  | -                               | -         |
| showHeaderDivider   | 是否展示卡片头部的分割线（仅在默认类型有效）             | 	boolean    | true \| false                               | false         |

## CHANGELOG

| 参数         | 变更类型                        | 变更内容                                                                       | 解决的问题                   |
| ------------ | ------------------------------- | ------------------------------------------------------------------------------ | ---------------------------- |
| type        | deprecated                          | 移除type字段 | 不再区分是否为simple模式           |
| content        | deprecated                          | 移除content字段 | 统一children作为内容渲染           |
| loading        | feature                          | 增加加载状态 | 作为容器型组件，需要提供加载状态           |
| cover        | feature                          |  卡片封面支持ReactNode | 卡片封面支持ReactNode           |
