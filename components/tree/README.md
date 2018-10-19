# 树形菜单 v1.0

## Tree props

| 参数    | 说明     | 类型     | 默认值     |
|------|-----|-----|-------|--------|
| defaultExpandAll | 默认展开所有树节点 | boolean | false |
| defaultCheckedAll | 默认选中所有checkbox | boolean | false |
| checkable | 节点前添加 Checkbox 复选框 | boolean | false |
| draggable | 设置节点可拖拽 | boolean | false |
| render | 自定义渲染方法, 参数为该节点数据 (包含子树) | func(data) |  |
| onCheckChange | 点击复选框触发 | func(...) | - |
| onNodeToggle | 节点被点击(展开/收起)时触发 | func({data,isExpanded}) | - |
| onDragStart | 开始拖拽时调用 | func(event) | - |
| onDragEnd | 结束拖拽时调用 | func(event) | - |
| onDragEnter | 拖曳元素进入目标元素的时候触发的事件 | func(event, dropPosition) | - |
| onDragOver | 拖拽元素在目标元素上移动的时候触发的事件 | func(event) | - |
| onDragLeave | 拖拽元素离开目标元素的时候触发的事件 | func(event) | - |
| onDrop | 被拖拽的元素在目标元素上同时鼠标放开触发的事件 | func(event) | - |
| disabled | 禁掉checkbox响应 | boolean | false |
| data | 展示数据 | array | [] |
| options | 配置选项 | object | - |


## data

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- |
| url | 如果传入url，则会被渲染为a标签，新窗口打开，默认渲染为span标签 | string | - |
| expand | 默认是否展开子菜单（优先级高于defaultExpandAll） | blooean | false |
| checked | 默认是否选中checkbox | blooean | false |

## options

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- |
| title | 指定节点标签为节点对象的某个属性值 | string | title |
| children | 指定子树为节点对象的某个属性值 | string | children |