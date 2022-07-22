# Radio 单选

单选是用来在一组平铺选项中选择目标选项，每次只选一个

## 何时使用

需要快速完成多选一且备选项数量不多时

常见于后台设置、调研问卷等场景

## 使用示例

<!-- Inject Stories -->

## Props

### Radio.Group

| 参数         | 说明                                         | 类型             | 可选值                     | 默认值       |
| ------------ | -------------------------------------------- | ---------------- | -------------------------- | ------------ |
| data         | 选择项数据源                                 | DataItem[]       | -                          | -            |
| placement    | 设置水平或垂直展示                           | string           | 'vertical' \| 'horizontal' | 'horizontal' |
| value        | 选中项的值（受控）                           | string \| number | -                          | -            |
| defaultValue | 默认选中项的值                               | string \| number | -                          | -            |
| disabled     | 是否禁用                                     | boolean          | -                          | -            |
| type         | 单选按展示形状                               | string           | 'default' \| 'button'      | 'default'    |
| name         | `RadioGroup` 下透传给所有 Radio 的 name 属性 | string           | -                          | -            |

### Radio

| 参数           | 说明             | 类型    | 可选值        | 默认值 |
| -------------- | ---------------- | ------- | ------------- | ------ |
| value          | 单选对应的值     | string  | -             | -      |
| autoFocus      | 是否自动获取焦点 | boolean | true \| false | false  |
| disabled       | 是否禁用         | boolean | -             | -      |
| checked        | 是否选中         | boolean | true \| false | false  |
| defaultChecked | 是否默认选中     | boolean | true \| false | false  |
| readOnly       | 是否只读         | boolean | true \| false | false  |

## Events

### Radio

| 名称     | 说明         | 类型                                                   | 参数                  | 返回值 |
| -------- | ------------ | ------------------------------------------------------ | --------------------- | ------ |
| onChange | 变化时的回调 | (event: React.ChangeEvent\<HTMLInputElement\>) => void | event: input 事件对象 | -      |

### RadioGroup

| 名称     | 说明               | 类型                    | 参数             | 返回值 |
| -------- | ------------------ | ----------------------- | ---------------- | ------ |
| onChange | 选中项改变时的回调 | (value: string) => void | value: 选中项 ID | -      |

## Type

### DataItem

| 参数     | 说明             | 类型      | 可选值        | 默认值 |
| -------- | ---------------- | --------- | ------------- | ------ |
| id       | 选择项对应的值   | string    | -             | -      |
| content  | 选择项的展示内容 | ReactText | -             | -      |
| disabled | 是否禁用         | boolean   | true \| false | false  |

## CHANGELOG

| 参数     | 变更类型                        | 变更内容                  | 解决的问题                   |
| -------- | ------------------------------- | ------------------------- | ---------------------------- |
| propName | feature \| deprecated \| update | 变更了什么                | 之前是什么样子，解决什么问题 |
| ----     | ----                            | ----                      | ----                         |
| children | feature                         | RadioGroup 支持内嵌 Radio | 实现灵活的布局               |
| content  | feature                         | 类型：string -> ReactNode | 1. 强化类型支持              |
| readOnly | feature                         | -                         | 1. 强化 Radio 功能支持       |
