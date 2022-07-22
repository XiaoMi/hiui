# `@hi-ui/tooltip`

> TODO: description

## Usage

```
const Tooltip = require('@hi-ui/tooltip');

// TODO: DEMONSTRATE API
```


## Props

| 参数      | 说明                                                | 类型    | 可选值                                 | 默认值 |
| --------- | --------------------------------------------------- | ------- | -------------------------------------- | ------ |
| title     | 提示文字内容                                        | string  | 字符串                                 | --     |
| visible   | 控制 tooltip 的显示和隐藏（需要组件完全受控时使用） | boolean | true \| false                          | -      |
| popper     | popper配置项                                       | PopperPortalProps              | -                                      | -       |
| arrow     | 是否显示箭头                                       | boolean              |  true \| false                                     | true       |
| portal     | 传送门props                                       | PortalProps              | -                                     | -       |
| preload     | 开启预加载渲染，用于性能优化，优先级小于 unmountOnClose                                       | boolean              | -           | false       |
| unmountOnClose     | 开启关闭时销毁，用于性能优化，优先级大于 preload                                       | boolean              | -           | true       |
| innerRef     | 内部引用                                      | RefObject<{ close: () => void; }>              | -           | -       |
| disabled     | 是否开启禁用                                      | boolean              | -           | -       |

## Events

| 名称             | 说明                       | 类型                                                      | 参数                                                                        | 返回值 |
| ---------------- | -------------------------- | --------------------------------------------------------- | --------------------------------------------------------------------------- | ------ |
| onOpen           |打开时回调            | (() => void)                                 | - | -      |
| onClose         | 关闭时回调           | (() => void) | - | -      |
| onExited         | ？           | (() => void) | - | -      |


## Methods

`Tooltip.open(target, { title, placement, key })`

| 参数      | 说明                                  | 类型        | 可选值                                 | 默认值 |
| --------- | ------------------------------------- | ----------- | -------------------------------------- | ------ |
| target    | 要显示 `tooptip` 的元素               | HTMLElement | -                                      | -      |
| title     | 提示文字内容                          | string      | -                                      | -      |
| popper     | popper配置项                                       | PopperPortalProps              | -                                      | -       |
| key       | 标识 `tooltip` 的唯一 key，仅用于关闭 | string      | -                                      | -      |

`Tooltip.close(key)`

| 参数 | 说明                                  | 类型   | 可选值 | 默认值 |
| ---- | ------------------------------------- | ------ | ------ | ------ |
| key  | 标识 `tooltip` 的唯一 key，仅用于关闭 | string | -      | -      |


## CHANGELOG

| 参数         | 变更类型                        | 变更内容                                                                       | 解决的问题                   |
| ------------ | ------------------------------- | ------------------------------------------------------------------------------ | ---------------------------- |
| overlayClassName        | deprecated                          | 移除overlayClassName 字段 | 使用className即可           |
| placement        | deprecated                          | 	气泡卡片显示的位置 | 全部迁移至popper配置项，这个认为有争议，popper只是开发的概念，这个用户很难理解           |
| onOpen        | feature                          | 打开时回调 | 增加钩子函数           |
| onClose        | feature                          | 	关闭时回调 | 增加钩子函数           |
| onExited        | feature                          | 	？ | ？           |
| arrow        | feature                          | 是否显示箭头 | 建议使用showArrow实现api统一           |
| innerRef        | feature                          | 内部引用 | 待讨论           |
| disabled        | feature                          | 是否禁用 | 待讨论           |
| portal        | feature                          | 传送门props | 待讨论           |
| unmountOnClose        | feature                          | 开启关闭时销毁，用于性能优化，优先级大于 preload | 待讨论           |
| preload        | feature                          | 开启预加载渲染，用于性能优化，优先级小于 unmountOnClose | 待讨论           |
