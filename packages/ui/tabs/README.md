# `@hi-ui/tabs`

> TODO: description

## Usage

```
const Tabs = require('@hi-ui/tabs');

// TODO: DEMONSTRATE API
```

## Props

### Tabs

| 参数            | 说明                                                                                        | 类型             | 可选值                                               | 默认值       |
| --------------- | ------------------------------------------------------------------------------------------- | ---------------- | ---------------------------------------------------- | ------------ |
| type            | 标签类型                      | string           | 'desc' \| 'card' \| 'button' \|  'default' | 'default'       |
| placement       | 水平或竖直展示标签                               | string           | 'vertical' \| 'horizontal'                           | 'horizontal' |
| defaultActiveId | 设置默认激活的标签                   | React.ReactText | -                                                    | 第一个选项卡 |
| activeId        | 设置激活的标签，设置此值后变为受控模式             | React.ReactText | -                                                    | -            |
| draggable       | 是否支持拖拽         | boolean          | true \| false                                        | false        |
| editable       | 是否可编辑         | boolean          | true \| false                                        | false        |

### Tabs.Pane

| 参数      | 说明                                         | 类型                | 可选值        | 默认值 |
| --------- | -------------------------------------------- | ------------------- | ------------- | ------ |
| tabTitle  | 选项卡头显示文字                             |  ReactNode | -             | -      |
| tabDesc   | 选项卡头描述文字，仅对 type='desc'时生效     |  ReactNode | -             | -      |
| tabId     | 每个标签的唯一标识                           | string \| number    | -             | -      |
| disabled  | 标签是否禁用                                 | boolean             | true \| false | false  |

## Events

| 名称           | 说明                                                        | 类型                                 | 参数                                                | 返回值                         |
| -------------- | ----------------------------------------------------------- | ------------------------------------ | --------------------------------------------------- | ------------------------------ |
| onTabClick     | 点击标签页时触发，回调值为点击点击标签的 id                | (tabId, event) => void              | tabKey: 点击的标签 id, event: MouseEvent      |
| onChange     | 点击标签页变更时触发，回调值为点击点击标签的 id                | (tabId, event) => void              | tabKey: 点击的标签 id, event: MouseEvent      | -                              |
| onDragStart(未实现完全)    | 节点开始拖拽时触发                                          | (e: React.DragEvent,{dragNode: TabNode}) => void          | dragNode: 拖拽节点                                  |
| onDragOver(未实现完全)    | 节点开始拖拽时触发                                          | (e: React.DragEvent,{dragNode: TabNode}) => void          | dragNode: 拖拽节点                                  |
| onDragEnd (未实现完全) | 节点开始拖拽时触发                                          | (e: React.DragEvent,{dragNode: TabNode}) => void          | dragNode: 拖拽节点                                  | -                              |-                              |
| onDrop         | 节点拖拽时触发                                              | (e: React.DragEvent,{dragNode, dropNode, direction, }) => void          | dragNode: 拖拽节点                                  | -                              |
| onAdd          | 节点增加时触发                                              | () => void                           | -                                                   | -                              |
| onDelete       | 点击删除节点按钮时触发                                            | (deletedNode: TabNode,index) => void | deletedNode: 删除的节点, index: 删除的节点索引 | -                              |

## CHANGELOG
*** 拖拽事件全面向原生看齐 ***
| 参数         | 变更类型                        | 变更内容                                                                       | 解决的问题                   |
| ------------ | ------------------------------- | ------------------------------------------------------------------------------ | ---------------------------- |

|  closeable   | deprecated                          | 仅用editable就够了，是否有有的可关闭有的不可关闭的场景？           |优化易用性           |
|  onBeforeDelete   | deprecated                          | 废弃onDelete前置逻辑，直接在 onDelete 处理 | 优化易用性           |
|  onDropEnd   | deprecated                          | 废弃onDelete前置逻辑，直接在 onDelete 处理 | 优化易用性           |
|  canScroll   | deprecated                          | 现在不需要canScroll，会自动计算是否可滚动 | 优化易用性           |
|  max  | deprecated                          | 现在不再内置收起效果，该字段没有存在意义 | 优化易用性           |
|  animation  | deprecated                          | 动画效果为内置 | 优化易用性，删减无意义的配置项           |
| onDragStart        | update                          |   入参调整       |            |
| onDragOver        | feature                          |   新增钩子       |            |
| onDragEnd        | feature                          |   新增钩子       |            |
| onDrop        | update                         |   入参调整       |            |
| type        | update                          | 选项移除 'editable'类型，'line'类型改为'default', 默认type由'card'类型改为'default' | editable 拆为配置项更合理，根据通用场景，'default‘模式用的更多，故更改默认类型          |
| editable        | feature                          | 选项移除type 的 'editable'类型，迁移为一个配置项 | editable 拆为配置项更合理，解决editable 和 type的组合问题         |

