# Dropdown 下拉菜单

用来将菜单收起在下拉面板中，使用中唤起面板，有效节省空间

## 何时使用

有二级以上的菜单且展示空间有限

当一组平级的动作要展示时，将其收入一个入口，可让页面信息更整洁

## 使用示例

<!-- Inject Stories -->

## Props

| 参数             | 说明                                    | 类型                | 可选值                              | 默认值  |
| ---------------- | --------------------------------------- | ------------------- | ----------------------------------- | ------- |
| data             | 下拉菜单数据项                          | DataItem []         | -                                   | -       |
| title            | 下拉菜单显示标题的内容                  | ReactNode           | -                                   | -       |
| type             | 下拉菜单按钮类型                        | string              | 'text' \| 'button' \| 'group'       | 'text'  |
| trigger          | 下拉菜单触发方式                        | string \| string [] | 'click' \| 'contextmenu' \| 'hover' | 'hover' |
| disabled         | 是否禁用下拉菜单                        | boolean             | true \| false                       | -       |
| width            | 菜单项宽度                              | number              | -                                   | 180     |
| overlayClassName | 下拉根元素的类名称                      | string              | -                                   | -       |
| overlay          | 自定义控制弹出层 popper 行为            | PopperOverlayProps  | -                                   | -       |
| triggerButton    | 自定义下拉菜单触发按钮，优先级大于 type | ReactElement        | -                                   | -       |

> 注意：自定义按钮需要支持 ref 获取元素 dom 引用 以及 trigger 对应的事件：
>
> hover: onMouseEnter \ onMouseLeave
> click: onClick
> contextmenu: onContextMenu

## Events

| 名称          | 说明                                          | 类型                        | 参数                | 返回值 |
| ------------- | --------------------------------------------- | --------------------------- | ------------------- | ------ |
| onClick       | 点击后的回调                                  | (id: ReactText) => void     | id: 点击的数据项 ID | -      |
| onButtonClick | 点击左侧按钮的回调，仅在 type 为 group 时有效 | (event: MouseEvent) => void | event: 鼠标事件对象 | -      |

## Type

### DataItem

| 参数     | 说明                                          | 类型      | 可选值                                         | 默认值 |
| -------- | --------------------------------------------- | --------- | ---------------------------------------------- | ------ |
| title    | 标题的内容，设置为 `'-'` 时是分割线           | ReactNode | -                                              | -      |
| id       | 唯一标识 id                                   | ReactText | -                                              | -      |
| disabled | 是否禁用                                      | boolean   | true \| false                                  | false  |
| href     | 点击跳转的路径                                | string    | -                                              | -      |
| target   | 同 a 标签的 target 属性，仅在设置 href 后有效 | string    | '\_self' \| '\_blank' \| '\_parent' \| '\_top' | -      |

## CHANGELOG

| 参数          | 变更类型                        | 变更内容                                                                 | 解决的问题                                                                                                 |
| ------------- | ------------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| propName      | feature \| deprecated \| update | 变更了什么                                                               | 之前是什么样子，解决什么问题                                                                               |
| ----          | ----                            | ----                                                                     | ----                                                                                                       |
| triggerButton | feature                         | -                                                                        | 功能强化                                                                                                   |
| popper        | feature                         | 字段 placement -> popper                                                 | Picker 类型组件统一支持，聚合管理。比如： placement arrow container disablePortal 等，之前有的加了有的没加 |
| id            | update                          | 对于表单控件 id 值的控制，均使用 ReactText（即 string 和 number 都支持） | 之前是 string 类型                                                                                         |
