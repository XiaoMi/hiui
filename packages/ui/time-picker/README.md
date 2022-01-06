# TimePicker 时间选择器

## 使用示例

<!-- Inject Stories -->

## Props

| 参数              | 说明       | 类型                                                                     | 可选值                      | 默认值       |
| --------------- | -------- | ---------------------------------------------------------------------- | ------------------------ | --------- |
| type            | 选择器类型    | string                                                                 | 'default' \| 'timerange' | 'default' |
| value           | 显示的日期    | Date \| string \| number \| object \| -                                | -                        | -         |
| format          | 格式化时间    | string                                                                 | -                        | -         |
| inputReadOnly   | 设置输入框为只读 | boolean                                                                | true \| false            | false     |
| bordered        | 是否有边框    | boolean                                                                | true \| false            | true      |
| hourStep        | 小时选项间隔   | number                                                                 | -                        | 1         |
| minuteStep      | 分钟选项间隔   | number                                                                 | -                        | 1         |
| secondStep      | 秒选项间隔    | number                                                                 | -                        | 1         |
| disabled        | 是否禁用     | boolean                                                                | true \| false            | false     |
| placeholder     | 设置输入框占位  | string \| string[]                                                     | -                        | -         |
| disabledHours   | 禁止选择的小时  | () => number[] \| number[]                                             | -                        | -         |
| disabledMinutes | 禁止选择的分钟  | (selectedHour: number) => number[] \| number[]                         | -                        | -         |
| disabledSeconds | 禁止选择的秒数  | (selectedHour: number, selectedMinute: number) => number[] \| number[] | -                        | -         |

## Events

| 名称       | 说明     | 类型                                                               | 参数                                                                                                                                       | 返回值 |
| -------- | ------ | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | --- |
| onChange | 选择后的回调 | (date: Date \| DateRange, dateStr: string \| DateRange ) => void | date: 选中的日期(普通选择) \| 选中的日期范围{start: Date, end: Date}(范围选择) <br/> dateStr: 选中的日期字符串(普通选择) \| 选中的日期字符串对象{start: string, end: string}(范围选择) | -   |

## CHANGELOG

| 参数                                            | 变更类型    | 变更内容                               | 解决的问题               |
| --------------------------------------------- | ------- | ---------------------------------- | ------------------- |
| disabledHours、disabledMinutes、disabledSeconds | feature | 函数式方法集体最后添加参数 panel，代表当前计算的是开始还是结束 | 无法根据开始结束对特定panel做限制 |
| value                                         | update  | 类型变更为 string[]                     | 类型收敛                |
| defaultValue                                  | feature | 新增非受控态                             |                     |
| placeholder                                   | update  | 类型变更为 string[]                     | 类型收敛                |
| itemHeight                                    | feature | 新增选择器高                             |                     |
| fullDisplayItemNumber                         | feature | 完全展示Item的数目                        |                     |
| onChange                                      | update  | 参数类型变更为 string[]                   | 类型收敛                |
