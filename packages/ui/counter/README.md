# Counter 数字加减器

## 使用示例

<!-- Inject Stories -->

## Props

| 参数          | 说明                   | 类型    | 可选值                       | 默认值    |
| ------------- | ---------------------- | ------- | ---------------------------- | --------- |
| value         | 设置当前值             | number  | -                            | -         |
| defaultValue  | 设置默认值             | number  | -                            | 0         |
| step          | 每次改变值的大小       | number  | -                            | -         |
| min           | 最小值                 | number  | -                            | -         |
| max           | 最大值                 | number  | -                            | -         |
| disabled      | 是否禁用               | boolean | true \| false                | false     |
| autoFocus     | 开启自动聚焦           | boolean | true \| false                | false     |
| focusOnStep   | 开启加减值时聚焦 input | boolean | true \| false                | false     |
| appearance    | 设置展现形式           | string  | 'outline' \| 'filled'        | 'outline' |
| size          | 设置尺寸               | string  | 'xs' \| 'sm' \| 'md' \| 'lg' | 'md'      |
| changeOnWheel | 开启滑轮改值           | boolean | true \| false                | false     |

## Events

| 名称     | 说明           | 类型                    | 参数              | 返回值 |
| -------- | -------------- | ----------------------- | ----------------- | ------ |
| onChange | 改变值时的回调 | (value: number) => void | value: 改变后的值 | -      |

## CHANGELOG

| 参数          | 变更类型                        | 变更内容                                                   | 解决的问题                                                                            |
| ------------- | ------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| propName      | feature \| deprecated \| update | 变更了什么                                                 | 之前是什么样子，解决什么问题                                                          |
| ----          | ----                            | ----                                                       | ----                                                                                  |
| onChange      | update                          | (value: number)=>void -> (evt: Event, value: number)=>void | 1. onChange 来源众多，触发事件并不一致；2. 之前暴露的也是假的事件对象，不符合前端认知 |
| autoFocus     | feature                         | 表单控件组件统一支持是否自动聚焦                           |
| focusOnStep   | feature                         | 强化功能，保持输入态聚焦                                   |
| appearance    | feature                         | UI 适配线面型                                              |
| size          | feature                         | UI 适配不同 Size                                           |
| changeOnWheel | feature                         | 强化功能，控制滑轮改值                                     |
