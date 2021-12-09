export type TimePickerType = 'single' | 'range'

export type TimePickerFormat = 'HH:mm:ss' | 'HH' | 'mm' | 'ss' | 'HH:mm' | 'mm:ss'

export type TimePickerPanelType = 'single' | 'range-start' | 'range-end'

export enum TimePickerSelectorType {
  hour = 1,
  minute,
  second,
}

export interface TimePickerStep {
  /**
   * 小时选项间隔
   * @default 1
   */
  hourStep?: number
  /**
   * 分钟选项间隔
   * @default 1
   */
  minuteStep?: number
  /**
   * 秒选项间隔
   * @default 1
   */
  secondStep?: number
}

export type TimePickerDisabledHoursFunction = (panel: TimePickerPanelType) => number[]
export type TimePickerDisabledMinutesFunction = (
  hour: number,
  panel: TimePickerPanelType
) => number[]
export type TimePickerDisabledSecondsFunction = (
  hour: number,
  minute: number,
  panel: TimePickerPanelType
) => number[]

export interface TimePickerFilterProps {
  /**
   * 禁止选择的小时
   * @default () => []
   */
  disabledHours?: TimePickerDisabledHoursFunction | number[]
  /**
   * 禁止选择的分钟
   * @default () => []
   */
  disabledMinutes?: TimePickerDisabledMinutesFunction | number[]
  /**
   * 禁止选择的秒数
   * @default () => []
   */
  disabledSeconds?: TimePickerDisabledSecondsFunction | number[]
}

export interface TimePickerFilter {
  /**
   * 禁止选择的小时
   * @default () => []
   */
  disabledHours?: TimePickerDisabledHoursFunction
  /**
   * 禁止选择的分钟
   * @default () => []
   */
  disabledMinutes?: TimePickerDisabledMinutesFunction
  /**
   * 禁止选择的秒数
   * @default () => []
   */
  disabledSeconds?: TimePickerDisabledSecondsFunction
}
