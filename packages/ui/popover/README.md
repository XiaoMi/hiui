# `@hi-ui/popover`

> TODO: description

## Usage

```
const Popover = require('@hi-ui/popover');

// TODO: DEMONSTRATE API
```

## Props

| 参数      | 说明                                               | 类型                | 可选值                                 | 默认值  |
| --------- | -------------------------------------------------- | ------------------- | -------------------------------------- | ------- |
| title     | 气泡卡片标题                                       | string              | -                                      | -       |
| content   | 气泡卡片内容                                       | string \| ReactNode | -                                      | -       |
| trigger   | 气泡卡片触发方式                                   | string   \| string []            | 'click' \| 'focus' \| 'hover'\|'contextmenu          | 'click' |
| visible   | 控制气泡卡片的显示和隐藏（需要组件完全受控时使用） | boolean             | true \| false                          | -       |
string                                                              | -                                            | -                      |
| popper     | popper配置项                                       | PopperPortalProps              | -                                      | -       |

## Events

| 名称             | 说明                       | 类型                                                      | 参数                                                                        | 返回值 |
| ---------------- | -------------------------- | --------------------------------------------------------- | --------------------------------------------------------------------------- | ------ |
| onOpen           |打开时回调            | (() => void)                                 | - | -      |
| onClose         | 关闭时回调           | (() => void) | - | -      |

## CHANGELOG

| 参数         | 变更类型                        | 变更内容                                                                       | 解决的问题                   |
| ------------ | ------------------------------- | ------------------------------------------------------------------------------ | ---------------------------- |
| overlayClassName        | deprecated                          | 移除overlayClassName 字段 | 使用className即可           |
| placement        | deprecated                          |  气泡卡片显示的位置 | 全部迁移至popper配置项，这个认为有争议，popper只是开发的概念，这个用户很难理解           |
| onOpen        | feature                          | 打开时回调 | 增加钩子函数           |
| onClose        | feature                          | 	关闭时回调 | 增加钩子函数           |

