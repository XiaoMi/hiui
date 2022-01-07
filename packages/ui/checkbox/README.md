# Checkbox 复选

复选是用来在一组平铺选项中同时选择 1 个以上的选项

## 何时使用

需要快速完成多选一且备选项数量不多时

常见于后台设置、调研问卷、表单等场景

## 使用示例

<!-- Inject Stories -->

## Props

### Checkbox

| 参数           | 说明             | 类型    | 可选值        | 默认值 |
| -------------- | ---------------- | ------- | ------------- | ------ |
| autoFocus      | 是否自动获取焦点 | boolean | true \| false | false  |
| checked        | 是否选中         | boolean | true \| false | false  |
| defaultChecked | 是否默认选中     | boolean | true \| false | false  |
| disabled       | 是否禁用         | boolean | true \| false | false  |
| indeterminate  | 不全选的样式控制 | boolean | true \| false | false  |

### Checkbox.Group

| 参数         | 说明                                                         | 类型                               | 可选值                     | 默认值       |
| ------------ | ------------------------------------------------------------ | ---------------------------------- | -------------------------- | ------------ |
| placement    | 排列方式                                                     | string                             | 'horizontal' \| 'vertical' | 'horizontal' |
| data         | 指定可选项                                                   | ReactText[] \| DataItem[]          | -                          | []           |
| defaultValue | 默认选中的项                                                 | ReactText[]                        | -                          | []           |
| disabled     | 是否禁用                                                     | boolean                            | true \| false              | false        |
| name         | `CheckboxGroup` 下所有 `input[type="checkbox"]` 的 name 属性 | string                             | -                          | -            |
| onChange     | 变化时的回调                                                 | (checkedList: ReactText[]) => void | -                          | -            |
| value        | 指定选中的项                                                 | ReactText[]                        | -                          | -            |

## Events

### Checkbox

| 名称     | 说明         | 类型                                                   | 参数                  | 返回值 |
| -------- | ------------ | ------------------------------------------------------ | --------------------- | ------ |
| onChange | 变化时的回调 | (event: React.ChangeEvent\<HTMLInputElement\>) => void | event: input 事件对象 | -      |

### Checkbox.Group

| 名称     | 说明         | 类型                              | 参数                       | 返回值 |
| -------- | ------------ | --------------------------------- | -------------------------- | ------ |
| onChange | 变化时的回调 | (checkedIds: ReactText[]) => void | checkedIds: 选中项 ID 集合 | -      |

## Type

### DataItem

| 参数     | 说明            | 类型      |
| -------- | --------------- | --------- |
| id       | 选项唯一标识 id | ReactText |
| content  | 选项显示内容    | ReactNode |
| disabled | 是否禁用该选项  | boolean   |

## CHANGELOG

| 参数     | 变更类型                        | 变更内容                        | 解决的问题                                 |
| -------- | ------------------------------- | ------------------------------- | ------------------------------------------ |
| propName | feature \| deprecated \| update | 变更了什么                      | 之前是什么样子，解决什么问题               |
| ----     | ----                            | ----                            | ----                                       |
| children | feature                         | CheckboxGroup 支持内嵌 Checkbox | 实现灵活的布局                             |
| data     | deprecated                      | 只支持 DataItem[] 模型数据      | 1. 规范统一；2. ReactText[] 用法接受度不高 |
| content  | feature                         | 类型：string -> ReactNode       | 1. 强化类型支持                            |
