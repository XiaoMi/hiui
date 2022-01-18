# DatePicker 日期选择器

用于接收日期和时间类型的容器。

## 何时使用

需要将某一个日期或时间录入到系统中时

需要将某一个时间段或任一个时间周期录入到系统中时

## 使用示例

<!-- Inject Stories -->

## Props

| 参数                | 说明                                      | 类型                                                                       | 可选值                                                                                                                                                                             | 默认值         |
| ----------------- | --------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| type              | 选择器类型                                   | string                                                                   | date 普通日期 <br/> daterange 日期范围<br/> year 年份<br/> month 月份<br/> week 周<br/> weekrange 周范围 <br/> timeperiod 时间段（1.5 新增）<br/> yearrange 年范围(2.13 新增) <br/> monthrange 月范围(2.13 新增) | date        |
| defaultValue      | 默认显示的日期                                 | Date \| string \| number\| DateRange \| undefined \| null                | -                                                                                                                                                                               | null        |
| value             | 日期                                      | Date \| string \| number\| DateRange \| undefined \| null                | -                                                                                                                                                                               | null        |
| width             | 输入框宽度                                   | number                                                                   | -                                                                                                                                                                               | auto        |
| minDate           | 最小日期                                    | Date                                                                     | null                                                                                                                                                                            | null        |
| maxDate           | 最大日期                                    | Date                                                                     | null                                                                                                                                                                            | null        |
| disabled          | 是否禁用输入框                                 | boolean                                                                  | true \| false                                                                                                                                                                   | false       |
| bordered          | 是否有边框                                   | boolean                                                                  | true \| false                                                                                                                                                                   | true        |
| inputReadOnly     | 设置输入框为只读                                | boolean                                                                  | true \| false                                                                                                                                                                   | false       |
| disabledDate      | 不可选择的日期(返回true为不可选)                     | (currentDate: Date) => boolean                                           | -                                                                                                                                                                               | () => false |
| min               | 最小日期                                    | Date                                                                     | null                                                                                                                                                                            | null        |
| max               | 最大日期                                    | Date                                                                     | null                                                                                                                                                                            | null        |
| clearable         | 是否可以清空                                  | boolean                                                                  | true \| false                                                                                                                                                                   | true        |
| showTime          | 是否在日期选择器中显示时间选择器，在使用时请注意 format 的设置     | boolean                                                                  | true \| false                                                                                                                                                                   | false       |
| timeInterval      | 时间段的间隔，以分钟为单位                           | number                                                                   | 1 ~ 1440 分钟                                                                                                                                                                     | 240         |
| format            | 展示的日期格式，配置参考 moment.js                  | string                                                                   | -                                                                                                                                                                               | -           |
| shortcuts         | 快捷面板                                    | string[]    \| {        title: string,range: (Date \| number)[]}[]       | 近一周, 近一月, 近三月, 近一年                                                                                                                                                              | null        |
| weekOffset        | 周起始，默认周日做为第一列(3.3.0版本后，优化为根据中英文自动设置周起始) | number                                                                   | 0 \| 1                                                                                                                                                                          | 0           |
| placeholder       | 自定义占位符（数组用于范围日期）                        | string \| string[]                                                       | -                                                                                                                                                                               | -           |
| altCalendar       | 自定义日期中历法展示信息                            | CalendarItem                                                             | -                                                                                                                                                                               | 农历 & 假日     |
| altCalendarPreset | 预置历法信息（支持中国农历和印度节假日）                    | string                                                                   | 'zh-CN' \| 'id-ID'                                                                                                                                                              | 'zh-CN'     |
| dateMarkRender    | 自定义日期的右上角标记                             | (currentDate: Date, today: Date) => React.ReactNode                      | -                                                                                                                                                                               | -           |
| dateMarkPreset    | 预置日期的右上角标记（休 \| 班）                      | string                                                                   | 'zh-CN'                                                                                                                                                                         | 'zh-CN'     |
| overlayClassName  | 下拉根元素的类名称 (3.0 新增)                      | string                                                                   | -                                                                                                                                                                               | -           |
| disabledHours     | 禁止选择的小时，仅在 showTime 开启时生效               | (() => number[]) \| number[]                                             | -                                                                                                                                                                               | -           |
| disabledMinutes   | 禁止选择的分钟，仅在 showTime 开启时生效               | ((selectedHour: number) => number[]) \| number[]                         | -                                                                                                                                                                               | -           |
| disabledSeconds   | 禁止选择的秒数，仅在 showTime 开启时生效               | ((selectedHour: number, selectedMinute: number) => number[]) \| number[] | -                                                                                                                                                                               | -           |

## CHANGELOG

| 参数           | 变更类型   | 变更内容             | 解决的问题                         |
| ------------ | ------ | ---------------- | ----------------------------- |
| disabledDate | update | 函数增加 view 参数     | 解决无法得知当前正在使用哪个视图，该如何确定禁用数据的问题 |
| weekOffset   | update | 变更其功能含义，只负责周计算方式 | 解决现在周计算方式与语言绑定的问题             |
