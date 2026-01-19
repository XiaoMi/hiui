import React from 'react'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { PopperOverlayProps } from '@hi-ui/popper'
import { TimePickerPanelType } from '@hi-ui/time-picker'
import { CalendarColInfo } from './hooks/useCalenderData'
import { Moment } from 'moment'

export type CalendarViewEnum = 'date' | 'year' | 'month' | 'quarter'

export interface DateRange {
  start: Date | string | number | undefined | null
  end: Date | string | number | undefined | null
}

export interface CalendarDataItem {
  /**
   * 日期
   */
  date: DatePickerValue
  /**
   * 描述内容
   */
  content: string
  /**
   * 是否高亮展示
   * @default false
   */
  highlighted?: boolean
}

export interface CalendarItemV3 {
  date: Date | string | number | null
  text: string
  /**
   * @default false
   */
  highlight?: boolean
}

/**
 * 组件内部使用，格式化之后的历法item
 */
export interface FormatCalendarItem {
  date: string
  text?: string | null | number
  /**
   * @default false
   */
  highlight?: boolean
  /**
   * 节点标记
   */
  nodeMark?: React.ReactNode
  /**
   * 节气名称
   */
  name?: string
  FullText?: string
}

/**
 * 组件内部使用，历法信息
 * key -> YYYY/MM/DD
 */
export interface CalendarAltCalendarPreset {
  [key: string]: FormatCalendarItem
}

/**
 * 组件内部使用，日历标签信息（休/班）
 * key -> YYYY/MM/DD
 */
export interface CalendarMarkPreset {
  [key: string]: React.ReactNode
}

export type DatePickerValueV3 = Date | string | number | DateRange | undefined | null

export type DatePickerValue = Date | string | number | null

export type DatePickerOnChangeDate = Date | Date[] | null
export type DatePickerOnChangeDateString = string | string[] | null

export type DatePickerOnChange = (
  date: Date | Date[] | undefined,
  dateStr: string | string[] | undefined
) => void
export type DatePickerOnChangeV3 = (date: Date | DateRange, dateStr: string | DateRange) => void

export type DatePickerTypeEnum =
  | 'date'
  | 'daterange'
  | 'year'
  | 'month'
  | 'week'
  | 'quarter'
  | 'weekrange'
  | 'timeperiod'
  | 'yearrange'
  | 'monthrange'
  | 'quarterrange'

export type DatePickerAltCalendarPresetEnum = 'zh-CN' | 'id-ID'

export type DateMarkRender = (currentDate: number, today: number) => React.ReactNode

export type DisabledDate = (
  currentDate: Date,
  view: CalendarViewEnum,
  panelIndex?: number
) => boolean

export interface DatePickerProps extends Omit<HiBaseHTMLProps<'div'>, 'placeholder'> {
  /**
   * 选择器类型
   */
  type?: DatePickerTypeEnum
  /**
   * 默认显示的日期
   */
  defaultValue?: DatePickerValue | DatePickerValue[]
  /**
   * 日期
   */
  value?: DatePickerValue | DatePickerValue[]
  /**
   * 最小日期
   */
  minDate?: Date
  /**
   * 最大日期
   */
  maxDate?: Date
  /**
   * UTC时间偏移量，单位为小时。例如：东八区传入8，西五区传入-5
   */
  utcOffset?: number
  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean
  /**
   * 设置输入框为只读
   * @default false
   */
  inputReadOnly?: boolean
  /**
   * 不可选择的日期(返回true为不可选)
   * @default () => false
   */
  disabledDate?: (currentDate: Date, view: CalendarViewEnum, panelIndex?: number) => boolean
  /**
   * 是否可以清空
   * @default true
   */
  clearable?: boolean
  /**
   * 是否在日期选择器中显示时间选择器，在使用时请注意 format 的设置
   * @default false
   */
  showTime?: boolean
  /**
   * 时间段的间隔，以分钟为单位
   * @default 240
   */
  timeInterval?: number
  /**
   * 展示的日期格式，配置参考 [moment.js](http://momentjs.cn/docs/#/displaying/format/)
   */
  format?: string | ((date: Moment) => string)
  /**
   * 快捷面板
   */
  shortcuts?:
    | string[]
    | {
        title: string
        range: (Date | number)[]
      }[]
  /**
   * @private
   */
  theme?: any
  /**
   * @private
   */
  locale?: string
  /**
   * 周起始，默认周日做为第一列(3.3.0版本后，优化为根据中英文自动设置周起始)
   * @default 0
   */
  weekOffset?: number
  /**
   * 小时步进
   */
  hourStep?: number
  /**
   * 分钟步进
   */
  minuteStep?: number
  /**
   * 秒钟步进
   */
  secondStep?: number
  /**
   * 输入框占位符
   */
  placeholder?: string | string[]
  /**
   * 自定义日期中历法展示信息
   */
  altCalendar?: CalendarDataItem[]
  /**
   * 预置历法信息（支持中国农历和印度节假日）
   */
  altCalendarPreset?: DatePickerAltCalendarPresetEnum
  /**
   * 自定义日期的右上角标记
   */
  dateMarkRender?: (currentDate: number, today: number) => React.ReactNode
  /**
   * 预置日期的右上角标记（休 | 班）
   */
  dateMarkPreset?: string
  /**
   * 禁止选择的小时，仅在 showTime 开启时生效
   */
  disabledHours?: ((panel: TimePickerPanelType) => number[]) | number[]
  /**
   * 禁止选择的分钟，仅在 showTime 开启时生效
   */
  disabledMinutes?: ((selectedHour: number, panel: TimePickerPanelType) => number[]) | number[]
  /**
   * 禁止选择的秒数，仅在 showTime 开启时生效
   */
  disabledSeconds?:
    | ((selectedHour: number, selectedMinute: number, panel: TimePickerPanelType) => number[])
    | number[]
  /**
   * 选择日期的回调函数，(data: 选中的 moment 日期对象, isCompleted: 是否选择完成，仅在范围选择下有效，panelIndex: 当前操作面板索引) => void
   */
  onSelect?: (data: Date, isCompleted: boolean, panelIndex?: number) => void
  /**
   * 选择后的回调，(date: 选中的日期，dateStr: 选中的日期字符串) => void
   */
  onChange?: (date: Date | Date[] | null, dateStr: string | string[] | null) => void
  /**
   * 日期面板改变时的回调函数
   */
  onPanelChange?: (data: Date) => void
  /**
   * 不同 UI 外观
   * @default 'line'
   */
  appearance?: 'line' | 'unset' | 'filled'
  /**
   * 不同尺寸
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * 自定义控制弹出层 popper
   */
  overlay?: PopperOverlayProps
  /**
   * 是否非法
   * @default false
   */
  invalid?: boolean
  /**
   * 面板打开时回调
   */
  onOpen?: () => void
  /**
   * 面板关闭时回调
   */
  onClose?: () => void
  /**
   * 自定义单元格内容
   */
  cellRender?: (colInfo: CalendarColInfo, date: Moment) => React.ReactNode
  /**
   * 自定义渲染页脚
   */
  footerRender?: (
    actionContents: React.ReactElement,
    onPick: (dates: (Moment | null)[], isShowPanel?: boolean) => void
  ) => React.ReactNode
  /**
   * 跨月选择模式
   * 'auto' 自动切换模式，跨月选择时自动切换到跨月的日期选择面板；
   * 'fixed' 固定模式，不自动切换（仅周范围选择下生效）
   * @default 'auto'
   */
  strideSelectMode?: 'auto' | 'fixed'
  /**
   * 自定义触发器
   */
  customRender?: React.ReactNode | ((option: (Date | undefined)[]) => React.ReactNode)
  /**
   * 选择框前置内容
   */
  prefix?: React.ReactNode
  /**
   * 是否需要确认按钮，为 <code>false</code> 时失去焦点即代表选择。日期时间范围选择默认为 <code>true</code>
   * @default false
   */
  needConfirm?: boolean
  /**
   * 点击确认按钮的回调
   */
  onConfirm?: (date: Date) => void
  /**
   * 是否显示日期选择器
   */
  visible?: boolean
  /**
   * 默认面板显示的日期，当用户没有传入或选择日期时，选择面板基于此值来显示日期
   */
  defaultPickerValue?: DatePickerValue | DatePickerValue[]
}
