# Tree 树形控件

具备展示多层级数据结构特征的组件

## 何时使用

多层级数据结构

需要明确的展示层级结构

对多层级结构节点进行操作

## 使用示例

<!-- Inject Stories -->

## Props

| 参数               | 说明                                                                    | 类型                                                                          | 可选值                          | 默认值    |
| ------------------ | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------- | --------- |
| data               | 展示数据                                                                | DataItem []                                                                   | -                               | -         |
| checkable          | 节点前添加 Checkbox 复选框（暂不支持与 draggable 和 editable 同时使用） | boolean                                                                       | true \| false                   | false     |
| editable           | 节点右键可编辑（添加同级节点、添加子节点、编辑节点、删除节点）          | boolean                                                                       | true \| false                   | false     |
| draggable          | 节点可拖拽                                                              | boolean                                                                       | true \| false                   | false     |
| searchable         | 节点可搜索                                                              | boolean                                                                       | true \| false                   | false     |
| selectable         | 节点是否可选中                                                          | boolean                                                                       | true \| false                   | true      |
| onLoadChildren     | 点击异步加载子项                                                        | (treeNode: TreeNode) => LoadChildren                                          | -                               | -         |
| defaultExpandAll   | 是否默认展开所有树节点                                                  | boolean                                                                       | true \| false                   | false     |
| defaultSelectedId  | 默认选中的节点                                                          | string                                                                        | -                               | -         |
| selectedId         | 选中的节点                                                              | string                                                                        | -                               | -         |
| defaultCheckedIds  | 默认选中的复选框的节点                                                  | string[]                                                                      | -                               | -         |
| checkedIds         | 选中的复选框的节点                                                      | string[]                                                                      | -                               | -         |
| defaultExpandedIds | 默认展开的节点                                                          | string[]                                                                      | -                               | -         |
| expandedIds        | 展开的节点                                                              | string[]                                                                      | -                               | -         |
| openIcon           | 表示展开的图标                                                          | string                                                                        | Icon 图标名称                   | -         |
| closeIcon          | 表示闭合的图标                                                          | string                                                                        | Icon 图标名称                   | -         |
| apperance          | 树形控件的展现形态                                                      | string                                                                        | 'default' \| 'line' \| 'folder' | 'default' |
| contextMenu        | 自定义右键菜单,参考 _示例_ 及 _页面底部自定义右键菜单使用说明_          | ContextMenuOption[] \| (item: DataItem, level: number) => ContextMenuOption[] |                                 | []        |

## Events

| 名称           | 说明                                                        | 类型                                                                                | 参数                                                                                                                                         | 返回值                                                    |
| -------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| onExpand       | 节点被点击(展开/收起)时触发                                 | (expandedNode: TreeNode, expanded: boolean, expandIds: string[] ) => void           | expandedNode: 点击的树节点 <br/>expanded: 点击的节点展开状态<br/> expandIds: 当前展开的树节点 ID 集合                                        | -                                                         |
| onCheck        | 点击节点多选框触发                                          | (checked: boolean, checkedIds: string[], checkedNode: TreeNode) => void             | checked: 点击节点是否被勾选<br/>checkedIds: 选中/半选节点数据；`{checkedIds: array, semiCheckedIds: array}` <br/>checkedNode: 操作的节点对象 | -                                                         |
| onSelect       | 点击节点时触发                                              | (selectedNode: TreeNode) => void                                                    | selectedNode: 选中的树节点                                                                                                                   | -                                                         |
| onDragStart    | 节点开始拖拽时触发                                          | (dragNode: TreeNode) => void                                                        | dragNode: 拖拽的节点对象                                                                                                                     | -                                                         |
| onDrop         | 节点放开时触发                                              | (dragNode: TreeNode, dropNode: TreeNode, data: DataStatus, level: Level) => boolean | dragNode: 拖拽的节点对象 <br/>dropNode: 目标节点对象<br/>data:当前结构数据 `DataStatus` <br/>level:当前级别数据                              | -                                                         |
| onDropEnd      | 节点拖拽成功时触发                                          | (dragNode: TreeNode, dropNode: TreeNode) => void                                    | dragNode: 拖拽的节点对象 <br/>dropNode: 目标节点对象                                                                                         | -                                                         |
| onBeforeDelete | 节点删除前触发,返回 false 则节点删除失败，不会触发 onDelete | (deletedNode: TreeNode, data: DataStatus, level: number) => boolean                 | deletedNode: 要删除的节点对象 <br/> data:当前结构数据 `DataStatus` <br/>level:当前级别数据                                                   | boolean: 返回 false 将阻止删除                            |
| onDelete       | 节点删除后触发                                              | (deletedNode: TreeNode, data: TreeNode[]) => void                                   | deletedNode: 删除的节点对象 <br/> data: 删除后的节点数据集合                                                                                 | -                                                         |
| onBeforeSave   | 节点保存新增、编辑状态时触发                                | (savedNode: TreeNode, data: DataStatus, level: number) => boolean                   | savedNode: 要保存的数据对象 <br/> data:当前结构数据 `DataStatus` <br/>level:当前级别数据                                                     | boolean: 返回 false 则保存新增、编辑失败，不会触发 onSave |
| onSave         | 节点保存新增、编辑状态后触发                                | (savedNode: TreeNode, data: TreeNode[]) => void                                     | savedNode: 保存的数据对象 <br/> data: 保存后的节点数据集合                                                                                   | -                                                         |

## Type

### LoadChildren

| 参数              | 说明                                                       | 类型                             | 可选值          | 默认值 |
| ----------------- | ---------------------------------------------------------- | -------------------------------- | --------------- | ------ |
| method            | 异步请求的方法                                             | string                           | 'get' \| 'post' | 'get'  |
| url               | 异步请求的 url                                             | string                           | -               | -      |
| headers           | 异步请求的请求头                                           | TreeNode                         | -               | -      |
| data              | post 请求时的请求体                                        | object                           | -               | -      |
| params            | 异步请求时的 url 参数                                      | object                           | -               | -      |
| transformResponse | 对异步请求结果进行加工处理的函数，返回结果用于生成子节点项 | (response: object) => TreeNode[] | -               | -      |

### TreeNode

| 参数       | 说明           | 类型                | 可选值        | 默认值 |
| ---------- | -------------- | ------------------- | ------------- | ------ |
| id         | 树节点唯一 id  | string              | -             | -      |
| title      | 树节点标题     | string \| ReactNode | -             | -      |
| disabled   | 是否禁用节点   | boolean             | true \| false | false  |
| children   | 该节点的子节点 | TreeNode[]          | -             | -      |
| isLeaf     | 是否为叶子节点 | boolean             | true \| false | -      |
| selectable | 节点是否可选中 | boolean             | true \| false | true   |

### Level

| 参数   | 说明               | 类型   | 可选值 | 默认值 |
| ------ | ------------------ | ------ | ------ | ------ |
| before | 拖拽前在树中的层级 | number | -      | -      |
| after  | 拖拽后在树中的层级 | number | -      | -      |

### DataStatus

| 参数   | 说明                   | 类型       | 可选值 | 默认值 |
| ------ | ---------------------- | ---------- | ------ | ------ |
| before | 更新前整个树的数据结构 | []TreeNode | -      | -      |
| after  | 更新后整个树的数据结构 | []TreeNode | -      | -      |

### ContextMenuOption

| 参数    | 说明               | 类型                                      | 可选值                                                                                                                  | 默认值 |
| ------- | ------------------ | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------ |
| type    | 菜单执行的功能     | string                                    | editNode: 编辑当前节点 <br/> addChildNode: 添加子节点 <br/> addSiblingNode: 添加同级节点 <br/> deleteNode: 删除当前节点 | -      |
| title   | 菜单标题           | string \| ReactNode                       | -                                                                                                                       | -      |
| onClick | 点击菜单项时的回调 | ( item: DataItem, node: TreeNode) => void | -                                                                                                                       | -      |

> **自定义右键菜单使用说明**
>
> contextMenu 参数：
>
> - type: editNode / addChildNode / addSiblingNode / deleteNode
> - title: 自定义 Title / 行为默认 Title
> - onClick: (item: 当前节点数据, node: 当前节点) => {
>
>   _如需调用组件提供的 新增同级节点 / 新增子节点 / 编辑当前节点/ 删除当前节点_
>
>   _需调用 node.addSiblingNode/ addChildNode/ editNode / deleteNode_
>
>   }

## CHANGELOG

| 参数               | 变更类型                        | 变更内容                                                                                                                                                                                                                      | 解决的问题                                                                                      |
| ------------------ | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| propName           | feature \| deprecated \| update | 变更了什么                                                                                                                                                                                                                    | 之前是什么样子，解决什么问题                                                                    |
| ----               | ----                            | ----                                                                                                                                                                                                                          | ----                                                                                            |
| onExpand           | update                          | 定义 (expandedNode: TreeNode, expanded: boolean, expandIds: string[] ) => void -> (expandedIds: React.ReactText[], node: TreeNodeEventData, expanded: boolean) => void                                                        | 参数变更，统一第一个参数为 id 数据                                                              |
| onLoadChildren     | update                          | 定义 (treeNode: TreeNode) => LoadChildren -> (node: TreeNodeEventData) => void \| Promise\<TreeNodeData[] \| void\>                                                                                                           | 参数统一支持状态注入                                                                            |
| onDragStart        | update                          | 定义 (dragNode: TreeNode) => void -> (dragNode: TreeNodeEventData) => void                                                                                                                                                    | 参数统一支持状态注入                                                                            |
| onDragEnd          | feature                         | -                                                                                                                                                                                                                             | 拖拽结束时触发                                                                                  |
| onDragLeave        | feature                         | -                                                                                                                                                                                                                             | 节点 drag leaver 时调用                                                                         |
| onDragOver         | feature                         | -                                                                                                                                                                                                                             | 节点 drag over 时调用                                                                           |
| onDrop             | update                          | 定义 (dragNode: TreeNode, dropNode: TreeNode, data: DataStatus, level: Level) => boolean -> (dragNode: TreeNodeEventData, dropNode: TreeNodeEventData, dataStatus: DataStatus, level: Level) => boolean \| Promise\<boolean\> | 1. 参数统一支持状态注入; 2. 支持 Promise 返回                                                   |
| onDropEnd          | update                          | 定义 (dragNode: TreeNode, dropNode: TreeNode) => void -> (dragNode: TreeNodeEventData, dropNode: TreeNodeEventData) => void                                                                                                   | 参数统一支持状态注入                                                                            |
| onSelect           | update                          | 定义 (selectedNode: TreeNode) => void -> (selectedId: React.ReactText \| null, selectedNode: TreeNodeEventData \| null) => void                                                                                               | 1. 参数变更，统一第一个参数为 id 数据，2. 支持反选                                              |
| onCheck            | update                          | 定义 (checked: boolean, checkedIds: string[], checkedNode: TreeNode) => void -> (checkedIds: React.ReactText[], node: TreeNodeEventData, checked: boolean, semiCheckedIds: React.ReactText[]) => void                         | 参数变更，统一第一个参数为 id 数据；2. 参数结构设计和其它 onCheck 一致；3. 参数统一支持状态注入 |
| checkedIds         | update                          | 类型 string => string \| number                                                                                                                                                                                               | 对于 id 值的控制，均使用 React.ReactText（即 string 和 number 都支持）                          |
| defaultCheckedIds  | update                          | 类型 string => string \| number                                                                                                                                                                                               | 对于 id 值的控制，均使用 React.ReactText（即 string 和 number 都支持）                          |
| selectedId         | update                          | 类型 string => string \| number                                                                                                                                                                                               | 对于 id 值的控制，均使用 React.ReactText（即 string 和 number 都支持）                          |
| defaultSelectedId  | update                          | 类型 string => string \| number                                                                                                                                                                                               | 对于 id 值的控制，均使用 React.ReactText（即 string 和 number 都支持）                          |
| expandedIds        | update                          | 类型 string => string \| number                                                                                                                                                                                               | 对于 id 值的控制，均使用 React.ReactText（即 string 和 number 都支持）                          |
| defaultExpandedIds | update                          | 类型 string => string \| number                                                                                                                                                                                               | 对于 id 值的控制，均使用 React.ReactText（即 string 和 number 都支持）                          |
| virtual            | feature                         | -                                                                                                                                                                                                                             | 支持虚拟列表                                                                                    |
| height             | feature                         | -                                                                                                                                                                                                                             | 支持虚拟列表                                                                                    |
| itemHeight         | feature                         | -                                                                                                                                                                                                                             | 支持虚拟列表                                                                                    |
| showLine           | feature                         | -                                                                                                                                                                                                                             | 交互更新，连接线开关控制                                                                        |
| expandedIcon       | update                          | 字段： openIcon -> expandIcon，类型：string-> React.ReactNode                                                                                                                                                                 | 关键词命名                                                                                      |
| collapsedIcon      | update                          | 字段： closeIcon -> collapsedIcon，类型：string-> React.ReactNode                                                                                                                                                             | 语义化命名                                                                                      |
| leafIcon           | feature                         | -                                                                                                                                                                                                                             | 叶子节点 icon                                                                                   |
| titleRender        | feature                         | -                                                                                                                                                                                                                             | 统一支持自定义渲染每一项                                                                        |
| onContextMenu      | feature                         | -                                                                                                                                                                                                                             | 节点编辑操作交互更新，废弃右键                                                                  |
| contextMenu        | deprecated                      | -                                                                                                                                                                                                                             | 节点编辑操作交互更新，废弃右键                                                                  |
| menuOptions        | feature                         | 类型和 contextMenu 一致                                                                                                                                                                                                       | 节点编辑操作交互更新，废弃右键                                                                  |
| onBeforeSave       | update                          | 定义 (savedNode: TreeNode, data: DataStatus, level: number) => boolean -> (savedNode: FlattedTreeNodeData, data: TreeDataStatus, level: number) => boolean \|Promise<boolean>                                                 | 1. 参数统一支持状态注入 2. 支持返回 Promise                                                     |
| onSave             | update                          | 定义 (savedNode: TreeNode, data: TreeNode\[\]) => void -> (savedNode: FlattedTreeNodeData, data: TreeNodeData\[\]) => void                                                                                                    | 1. 参数统一支持状态注入 2. 支持返回 Promise                                                     |
| onBeforeDelete     | update                          | 定义 (savedNode: TreeNode, data: DataStatus, level: number) => boolean -> (savedNode: FlattedTreeNodeData, data: TreeDataStatus, level: number) => boolean \|Promise<boolean>                                                 | 1. 参数统一支持状态注入 2. 支持返回 Promise                                                     |
| onDelete           | update                          | 定义 (savedNode: TreeNode, data: TreeNode\[\]) => void -> (savedNode: FlattedTreeNodeData, data: TreeNodeData\[\]) => void                                                                                                    | 1. 参数统一支持状态注入 2. 支持返回 Promise                                                     |
| editPlaceholder    | feature                         | -                                                                                                                                                                                                                             | 强化支持编辑输入框自定义 placeholder                                                            |
| onSearch           | feature                         | -                                                                                                                                                                                                                             | 强化支持搜索框 change 时回调                                                                    |

> 编辑功能使用方式变更 EditableTree = useTreeAction(Tree)
> 搜索功能使用方式变更 SearchableTree = useTreeSearch(Tree)
