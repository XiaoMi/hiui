# Input 输入框

用来接收文本型内容的组件

## 何时使用

用户需要通过键盘输入内容时

常见于表单，作为表单的组件类型之一

## 使用示例

<!-- Inject Stories -->

## Input Props

| 参数             | 说明                                              | 类型                             | 可选值                                                                 | 默认值  |
| ---------------- | ------------------------------------------------- | -------------------------------- | ---------------------------------------------------------------------- | ------- |
| value            | 设置输入框的值                                    | string                           | -                                                                      | -       |
| defaultValue     | 设置输入框的默认值                                | string                           | -                                                                      | -       |
| type             | 设置输入框类型                                    | string                           | 'text' \| 'textarea' \| 'id' \| 'tel' \| 'card' \| 'amount' \| 'email' | 'text'  |
| prepend          | 输入框前置外部内容                                | ReactNode                        | -                                                                      | -       |
| append           | 输入框后置外部内容                                | ReactNode                        | -                                                                      | -       |
| disabled         | 是否禁用                                          | boolean                          | true \| false                                                          | false   |
| clearable        | 是否可清空                                        | boolean                          | true \| false                                                          | false   |
| placeholder      | 输入框占位符                                      | string                           | -                                                                      | -       |
| readOnly         | 开启输入框只读                                    | boolean                          | true \| false                                                          | false   |
| autoFocus        | 开启输入框自动聚焦                                | boolean                          | true \| false                                                          | false   |
| maxLength        | 输入最大长度                                      | number                           | -                                                                      | -       |
| prefix           | 输入框内置内容                                    | ReactNode                        | -                                                                      | -       |
| suffix           | 输入框后置内容                                    | ReactNode                        | -                                                                      | -       |
| trimValueOnBlur  | 开启失焦时触发对值的 trim，将触发 onChange 给用户 | boolean                          | true \| false                                                          | false   |
| clearableTrigger | 清除按钮展示的触发形态                            | string                           | 'always'                                                               | 'hover' | 'hover' |
| appearance       | 设置展现形式                                      | 'outline' \| 'unset' \| 'filled' | 'outline'                                                              |
| size             | 设置尺寸                                          | string                           | 'sm' \| 'md' \| 'lg'                                                   | 'md'    |

## Input Events

| 名称     | 说明           | 类型                                                    | 参数                  |
| -------- | -------------- | ------------------------------------------------------- | --------------------- |
| onChange | 值改变时的回调 | (event: React.ChangeEvent<HTMLTextAreaElement>) => void | event: input 事件对象 |

## TextArea Props

| 参数            | 说明                                              | 类型                             | 可选值               | 默认值 |
| --------------- | ------------------------------------------------- | -------------------------------- | -------------------- | ------ |
| value           | 设置输入框的值                                    | string                           | -                    | -      |
| defaultValue    | 设置输入框的默认值                                | string                           | -                    | -      |
| appearance      | 设置展现形式                                      | 'outline' \| 'unset' \| 'filled' | 'outline'            |
| size            | 设置尺寸                                          | string                           | 'sm' \| 'md' \| 'lg' | 'md'   |
| disabled        | 是否禁用                                          | boolean                          | true \| false        | false  |
| placeholder     | 输入框占位符                                      | string                           | -                    | -      |
| readOnly        | 开启输入框只读                                    | boolean                          | true \| false        | false  |
| autoFocus       | 开启输入框自动聚焦                                | boolean                          | true \| false        | false  |
| maxLength       | 输入最大长度                                      | number                           | -                    | -      |
| trimValueOnBlur | 开启失焦时触发对值的 trim，将触发 onChange 给用户 | boolean                          | true \| false        | false  |
| rows            | 设置文本域行数，超出触发滚动                      | number                           | -                    | -      |

## TextArea Events

| 名称     | 说明           | 类型                                                    | 参数                     |
| -------- | -------------- | ------------------------------------------------------- | ------------------------ |
| onChange | 值改变时的回调 | (event: React.ChangeEvent<HTMLTextAreaElement>) => void | event: textarea 事件对象 |

## CHANGELOG

| 参数             | 变更类型                        | 变更内容                          | 解决的问题                                                             |
| ---------------- | ------------------------------- | --------------------------------- | ---------------------------------------------------------------------- |
| propName         | feature \| deprecated \| update | 变更了什么                        | 之前是什么样子，解决什么问题                                           |
| ----             | ----                            | ----                              | ----                                                                   |
| bordered         | deprecated                      | 字段 `bordered` => `appearance`   | 对于 Picker 类型的组件，统一使用 appearance 设置外形（线\面\无边框）值 |
| appearance       | feature                         | -                                 | 统一支持适配 UI：线性\面性\无边框                                      |
| prepend          | update                          | 字段：prepend -> prepend + prefix | 强化支持 Input 内置外置元素组合                                        |
| append           | update                          | 字段 -> append + suffix           | 强化支持 Input 内置外置元素组合                                        |
| prefix           | feature                         | 字段：prepend -> prepend + prefix | 强化支持 Input 内置元素                                                |
| suffix           | feature                         | 字段 -> append + suffix           | 强化支持 Input 内置元素                                                |
| readOnly         | feature                         | -                                 | 强化支持 Input 功能                                                    |
| autoFocus        | feature                         | -                                 | 强化支持 Input 功能                                                    |
| maxLength        | feature                         | -                                 | 强化支持 Input 功能                                                    |
| trimValueOnBlur  | feature                         | -                                 | 强化支持 Input 功能                                                    |
| clearableTrigger | feature                         | -                                 | 强化支持 Input 清空内容功能                                            |
| size             | feature                         | -                                 | UI 适配不同 Size                                                       |
| TextArea         | feature                         | 组件拆分                          | 1. 拆解 api 功能及类型，职责分明 2. 减少用户使用困惑；                 |
