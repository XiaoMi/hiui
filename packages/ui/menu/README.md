# `@hi-ui/menu`

> TODO: description

## Usage

```
const Menu = require('@hi-ui/menu');

// TODO: DEMONSTRATE API
```

## Props

| 参数             | 说明                                                   | 类型       | 可选值                     | 默认值     |
| ---------------- | ------------------------------------------------------ | ---------- | -------------------------- | ---------- |
| data             | 菜单项数据源                                           | MenuItemProps[] | -                          | -          |
| defaultActiveId         | 默认激活的菜单项 id                                        | React.ReactText    | -                          | -          |
| activeId         | 激活的菜单项 id                                        | React.ReactText    | -                          | -          |
| placement        | 设置菜单水平或垂直展示                                 | string     | 'horizontal' \| 'vertical' | 'vertical' |
| collapsed(没做)        | 是否收起子菜单，菜单垂直展示时有效                     | boolean    | true \| false              | false      |
| showCollapse     | 是否显示收缩开关，菜单垂直展示时有效                   | boolean    | true \| false              | false       |
| showAllSubMenus  | 是否以胖菜单的形式展开所有子菜单（仅在水平菜单时有效） | boolean    | true \| false              | false      |
| accordion(没做)        | 手风琴模式，菜单水平展示时有效                         | boolean    | true \| false              | true       |
| overlayClassName（没做） | 下拉根元素的类名称                                     | string     | -                          | -          |
| expandedType | 垂直菜单展开的方式                                     | string     | 'default' | 'pop'                          | 'default'          |
| defaultExpandedIds | 默认展开的菜单项（仅在垂直菜单下有效）                                     | React.ReactText[]     | -                         | -         |
| expandedIds（没做） | 展开的菜单项（仅在垂直菜单下有效）                                     | React.ReactText[]     | -                         | -         |

## Events

| 名称           | 说明                 | 类型                                                                 | 参数                                                    | 返回值 |
| -------------- | -------------------- | -------------------------------------------------------------------- | ------------------------------------------------------- | ------ |
| onClick        | 点击菜单选项时的回调 | (activeId: React.ReactText) => void | activeId: 激活的 id  | -      |
| onClickSubMenu | 点击父菜单项时的回调 | (subMenuId) => void       | subMenuId: 当前点击子菜单的id    | -      |
| onCollapse     | 点击收缩开关时的回调 | (collapsed: boolean) => void                                         | collapsed: 打开状态                                     | -      |

## Type

### MenuItemProps

| 参数     | 说明                                             | 类型                | 可选值        | 默认值 |
| -------- | ------------------------------------------------ | ------------------- | ------------- | ------ |
| content  | 菜单项标题                                       | ReactNode | -             | -      |
| icon     | 菜单项 icon | ReactNode | -             | -      |
| id       | 菜单项唯一标识                                   | React.ReactText    | -             | -      |
| disabled | 菜单项是否禁止点击                               | boolean             | true \| false | false  |
| children | 子菜单项配置                                     | MenuItemProps[]          | -             | -      |

## CHANGELOG

| 参数         | 变更类型                        | 变更内容                                                                       | 解决的问题                   |
| ------------ | ------------------------------- | ------------------------------------------------------------------------------ | ---------------------------- |
| expandedType     | feature | 垂直菜单展开的方式                                                                     | 原来只能向下展开，现在可以弹窗呼出 |
| defaultActiveId     | feature | 默认激活的菜单项 id                                                                    | 原来只支持受控，现在支持非受控模式 |
| defaultExpandedIds     | feature | 默认展开的菜单项（仅在垂直菜单下有效）                                                                    | 支持默认展开项 |
| expandedIds     | feature | 展开的菜单项（仅在垂直菜单下有效）                                                                    | 支持受控展开项 |
| ----         | ----                            | ----                                                                           | ----                         |
| onClick        | update                          | 移除第二个参数prevActiveId | 这个感觉没有意义           |
| onClickSubMenu        | update                          | 将入参由索引变更为subMenuId | 之前的入参感觉比较奇怪，意义不大           |
| icon        | update                          | icon 不再支持 string 模式 | Menu 组件与 Icon 组件真正结偶          |
