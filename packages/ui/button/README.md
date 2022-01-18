# Button 按钮

引导用户去触发操作的区域

## 何时使用

用户需要执行有具体含义的动作、命令

连接页面之间、页面和弹窗、页面和浮层面板的跳转

## 使用示例

<!-- Inject Stories -->

## Props

| 参数         | 说明                              | 类型      | 可选值                                                                 | 默认值       |
| ---------- | ------------------------------- | ------- | ------------------------------------------------------------------- | --------- |
| type       | 设置按钮类型                          | string  | 'primary' \| 'line' \| 'success' \| 'danger' \| 'default'           | 'default' |
| appearance | 设置按钮外观                          | string  | 'link' \| 'button'                                                  | 'button'  |
| disabled   | 设置按钮是否禁用                        | boolean | true \| false                                                       | false     |
| size       | 设置按钮尺寸                          | string  | 'large' \| 'default' \| 'small'                                     | 'default' |
| icon       | 设置按钮图标                          | string  | 详见 [`<Icon/>`](https://infra.mioffice.cn/hiui/zh-CN/docs/icon) 组件 ︎ | -         |
| href       | 设置按钮链接，设置后将用 a 标签渲染按钮           | string  | ︎                                                                   | -         |
| target     | 同 a 标签的 target 属性，仅在设置 href 后有效 | string  | ︎'_self' \| '_blank' \| '_parent' \| '_top'                         | -         |
| loading    | 是否显示 loading                    | boolean | ︎-                                                                  | false     |

## Events

| 名称      | 说明       | 类型                          | 参数            | 返回值 |
| ------- | -------- | --------------------------- | ------------- | --- |
| onClick | 点击按钮时的回调 | (event: MouseEvent) => void | event: 鼠标事件对象 | -   |

## CHANGELOG

| 参数         | 变更类型    | 变更内容                       | 解决的问题 |
| ---------- | ------- | -------------------------- | ----- |
| type       | update  | 删除'line'，新增'secondary'     |       |
| size       | update  | 新增'x-large'                |       |
| appearance | update  | 删除'button'，新增'flat'、'line' |       |
| shape      | feature |                            |       |
