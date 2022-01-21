# Modal 模态框

模态对话框一般会中断当前任务流，在相对无信息干扰的环境下完成微型任务

## 何时使用

当前任务中需要中途填写信息或执行别的动作

常见于后台设置、新建编辑等场景

## 使用示例

<!-- Inject Stories -->

## Props

| 参数           | 说明                       | 类型                | 可选值               | 默认值    |
| -------------- | -------------------------- | ------------------- | -------------------- | --------- |
| title          | 模态框标题                 | string \| ReactNode | -                    | -         |
| visible        | 是否显示模态框             | boolean             | true \| false        | false     |
| closeable      | 是否展示右上角关闭按钮     | boolean             | true \| false        | true      |
| maskClosable   | 是否允许点击蒙层关闭模态框 | boolean             | true \| false        | true      |
| cancelText     | 取消按钮文案               | string              | -                    | '取消'    |
| confirmText    | 确认按钮文案               | string              | -                    | '确定'    |
| confrimLoading | 确认按钮 loading 状态      | boolean             | true \|false         | -         |
| size           | 模态框尺寸                 | string              | 'default' \| 'large' | 'default' |
| style          | 自定义模态框样式           | object              | -                    | -         |
| footer         | 自定义模态框底部           | ReactNode \| null   | -                    | -         |

## Events

| 名称      | 说明                 | 类型       | 参数 | 返回值 |
| --------- | -------------------- | ---------- | ---- | ------ |
| onConfirm | 确认事件触发时的回调 | () => void | -    | -      |
| onCancel  | 取消事件触发时的回调 | () => void | -    | -      |

## Methods

`Modal.confirm({onConfirm, onCancel, title, content, type, confirmText, cancelText})`

| 参数        | 说明                 | 类型       | 可选值                                                   | 默认值    |
| ----------- | -------------------- | ---------- | -------------------------------------------------------- | --------- |
| onConfirm   | 确认事件触发时的回调 | () => void | -                                                        | -         |
| onCancel    | 取消事件触发时的回调 | () => void | -                                                        | -         |
| title       | confirm 的标题       | string     | -                                                        | string    |
| content     | confirm 的内容       | string     | -                                                        | -         |
| type        | confirm 的类型       | string     | 'default' \| 'success' \| 'error' \| 'warning' \| 'info' | 'default' |
| cancelText  | 取消按钮文案         | string     | -                                                        | '取消'    |
| confirmText | 确认按钮文案         | string     | -                                                        | '确定'    |

## CHANGELOG

| 参数                | 变更类型   | 变更内容         | 解决的问题 |
| ------------------- | ---------- | ---------------- | ---------- |
| portalClassName     | feature    |                  |            |
| overlayClassName    | feature    |                  |            |
| size                | update     | 枚举值改变       |            |
| onOverlayClick      | update     |                  |            |
| closeIcon           | feature    |                  |            |
| timeout             | feature    |                  |            |
| disabledPortal      | feature    |                  |            |
| container           | feature    |                  |            |
| onExited            | feature    |                  |            |
| onClose             | feature    |                  |            |
| showHeaderDivider   | feature    |                  |            |
| showFooterDivider   | feature    |                  |            |
| preload             | feature    |                  |            |
| unmountOnClose      | feature    |                  |            |
| width               | feature    |                  |            |
| height              | feature    |                  |            |
| innerRef            | feature    |                  |            |
| maskClosable        | deprecated |                  |            |
| lockScroll          | feature    |                  |            |
| autoFocus           | feature    |                  |            |
| focusElementOnClose | update     | 修复单词拼写错误 |            |
| trapFocus           | feature    |                  |            |
| returnFocusOnClose  | feature    |                  |            |

### Modal.confirm

> 点击蒙层不允许关闭
