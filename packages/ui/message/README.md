# Message 消息

轻量级的页面操作反馈提示

## 何时使用

由用户在界面交互过程中发生的全局性操作提示

即时反馈当前操作的结果

## 使用示例

<!-- Inject Stories -->

## Methods

`Message.open({ type, title, duration })`

| 参数       | 说明                  | 类型       | 可选值                                         | 默认值    |
| -------- | ------------------- | -------- | ------------------------------------------- | ------ |
| type     | 通知框类型               | string   | 'info' \| 'success' \| 'error' \| 'warning' | 'info' |
| title    | 通知框标题               | string   | -                                           | -      |
| duration | 自动关闭时间，单位为毫秒        | number   | -                                           | 3000   |
| onClick  | 点击 message 时触发的回调函数 | function | -                                           | -      |
| onClose  | 关闭时触发的回调函数          | function | -                                           | -      |

## CHANGELOG

| 参数               | 变更类型    | 变更内容                 | 解决的问题 |
| ---------------- | ------- | -------------------- | ----- |
| id               | feature |                      |       |
| timeout          | feature |                      |       |
| autoClose        | feature |                      |       |
| message.close    | feature |                      |       |
| message.closeAll | feature |                      |       |
| title            | update  | 改变类型至React.ReactNode |       |
