// import React from 'react'
import { clone as cloneDeep } from '@hi-ui/object-utils'
import moment from 'moment'
import request from 'axios'
import Lunar from './toLunar'
// import { getLocaleTypeFormatMap } from './constants'
import {
  CalendarAltCalendarPreset,
  CalendarItemV3,
  CalendarMarkPreset,
  CalendarViewEnum,
  DateMarkRender,
  DatePickerAltCalendarPresetEnum,
  DatePickerProps,
  DatePickerTypeEnum,
  DatePickerValueV3,
  DateRange,
  FormatCalendarItem,
} from '../types'
import { CalendarColInfo } from '../hooks/useCalenderData'
// import { CalendarViewEnum } from '../components/calendar'
import { getBelongWeekBoundary } from './week'

/**
 * 应用UTC偏移到moment对象
 * @param momentDate moment对象
 * @param utcOffset UTC偏移量（小时）
 * @returns 应用偏移后的moment对象
 */
export const applyUtcOffset = (momentDate: moment.Moment | null, utcOffset?: number) => {
  if (!momentDate || !momentDate.isValid()) {
    return momentDate
  }

  if (typeof utcOffset !== 'number') {
    return momentDate
  }

  // 使用 add 方法实际偏移时间值，而不是仅仅设置时区
  return momentDate.clone().add(utcOffset * 60, 'minutes')
}

/**
 * 判断是否是当前时区
 */
export const isCurrentTimezone = (utcOffset: number) => {
  return new Date().getTimezoneOffset() === utcOffset * 60
}

/**
 * 转换为国际标准时间
 */
export const toUtcTime = (momentDate: moment.Moment) => {
  const utcTime = momentDate.utc()
  const newDate = utcTime.format('YYYY-MM-DD HH:mm:ss')
  return moment(newDate).clone()
}

/**
 * 创建应用UTC偏移的moment对象
 * @param dateValue 日期值
 * @param format 格式
 * @param utcOffset UTC偏移量（小时）
 * @returns 应用偏移后的moment对象
 */
export const createMomentWithUtcOffset = (dateValue: any, format?: string, utcOffset?: number) => {
  const momentDate = moment(dateValue, format)

  if (typeof utcOffset === 'number') {
    return toUtcTime(momentDate).add(utcOffset * 60, 'minutes')
  }

  return momentDate.clone()
}

export function createDateWithUTCOffset(date: moment.Moment, utcOffset: number) {
  const year = date.year()
  const month = date.month()
  const day = date.date()
  const hours = date.hour()
  const minutes = date.minute()
  const seconds = date.second()

  // 根据 utcOffset 获取对应的 UTC 时间
  const utcDate = Date.UTC(year, month, day, hours - utcOffset, minutes, seconds)

  return moment(utcDate)
}

const holiday = {
  PRCHoliday:
    'https://cdn.cnbj1.fds.api.mi-img.com/hiui/PRCHoliday.json?' + new Date().getFullYear(),
  PRCLunar: 'https://cdn.cnbj1.fds.api.mi-img.com/hiui/PRCLunar.json?' + new Date().getFullYear(),
  IndiaHoliday:
    'https://cdn.cnbj1.fds.api.mi-img.com/hiui/IndiaHoliday.json?' + new Date().getFullYear(),
}
export const deconstructDate = (original: Date | string | number | null) => {
  const date = moment(original)

  return {
    year: date.year(),
    month: date.month(),
    date: date.date(),
    hour: date.hour(),
    minute: date.minute(),
    second: date.second(),
  }
}
/**
 * 获取 yearrange monthrange 类型
 * @param {String} type
 */
export const getView = (type: DatePickerTypeEnum) => {
  return (type.includes('year') || type.includes('month') || type.includes('quarter')
    ? type.split('range')[0]
    : 'date') as CalendarViewEnum
}

/**
 *
 * @param {Array} currentDates  原始数组
 * @param {Moment} newDate 新时间
 * @param {Number} index 更新数组位置
 */
export const genNewDates = (currentDates: moment.Moment[], newDate: moment.Moment, index = 0) => {
  const newDates = cloneDeep(currentDates)
  newDates[index] = newDate
  return newDates
}

/**
 * 生成 renderDates 用于 Calender(Range) 渲染时的基础时间
 * @param {Array} dates 原始数据
 * @param {String} type 选择器类型
 */
export const parseRenderDates = (dates: (moment.Moment | null)[], type: DatePickerTypeEnum) => {
  let [leftDate, rightDate] = cloneDeep(dates)

  const getRightDate = () => {
    if (type === 'yearrange') {
      if (!rightDate) {
        return moment(leftDate).add(12, 'year')
      }
      const diff = rightDate.year() - leftDate!.year()
      if (diff <= 12) {
        return moment(leftDate).add(12, 'year')
      }
      // 跨越面板数量
      let crossingPanelNumber = Math.trunc(diff / 12)
      // 12 整面板数量之后，剩余的数量
      const moreNumber = diff % 12
      // 如果剩余部分超出了当前面版，则，应当在下一个面板展示
      if (moreNumber > 7) {
        crossingPanelNumber += 1
      }

      return moment(leftDate).add(12 * crossingPanelNumber, 'year')
    }
    if (type === 'monthrange' || type === 'quarterrange') {
      // 如果 rightDate 存在且与 leftDate 不在同一年，使用 rightDate
      // 否则基于 leftDate 加1年，确保两个面板显示不同的年份
      if (rightDate && !rightDate.isSame(leftDate, 'year')) {
        return rightDate
      }
      return moment(leftDate).add(1, 'year')
    }
    if (!rightDate || leftDate?.isSame(rightDate, 'month')) {
      return moment(leftDate).add(1, 'months')
    }
    return rightDate
  }

  leftDate = leftDate || moment()
  rightDate = getRightDate()
  return [leftDate, rightDate]
}

export const getTimePeriodData = (timeInterval: number) => {
  const segment = (24 * 60) / timeInterval
  let pre = 0
  let next = 0
  const periodData = []
  const func = (val: number) => (val < 10 ? '0' + val : val)
  for (let i = 0; i < segment; i++) {
    next += timeInterval
    const timeStart = func(parseInt(String(pre / 60)))
    const timeEnd = func(parseInt(String(next / 60)))
    const timeStr = timeStart + ':' + func(pre % 60) + ' ~ ' + timeEnd + ':' + func(next % 60)
    periodData.push({
      timeStr,
      timeStart,
      timeEnd,
    })
    pre = next
  }
  return periodData
}

/**
 * 是否展示历法次要信息
 * @param {Object} props
 */
export const showLargeCalendar = (props: DatePickerProps) => {
  return (
    props.altCalendar || props.altCalendarPreset || props.dateMarkRender || props.dateMarkPreset
  )
}

export const getPRCDate = (api: keyof typeof holiday) => {
  const url = holiday[api]
  const options = {
    url,
    method: 'GET',
  }
  return url ? request.create().request(options as any) : null
}

const altCalendarText = (
  datainfo: string,
  lunarcellinfo: Omit<FormatCalendarItem, 'date'>,
  altCalendarPresetData: CalendarAltCalendarPreset
) => {
  if (altCalendarPresetData && altCalendarPresetData[datainfo]) {
    return altCalendarPresetData[datainfo].text || ''
  }
  return lunarcellinfo.text
}
// const getMarkNode = (node: React.ReactNode) => {
//   return <span className="hi-datepicker__lunar hi-datepicker__holiday">{node}</span>
// }
const markRender = (
  datainfo: string,
  dateMarkRender: DateMarkRender | undefined,
  dateMarkPresetData: CalendarMarkPreset
) => {
  // 存在传入自定就优先使用自定义
  const markRenderNode = dateMarkRender
    ? dateMarkRender(new Date(datainfo).getTime(), new Date().getTime())
    : false
  if (markRenderNode) {
    return markRenderNode
  }
  if (dateMarkPresetData) {
    return dateMarkPresetData[datainfo]
  }
  return null
}
/**
 * 获取完整时间
 * @param {*} value 日
 * @param {*} cls className
 */
export const getFullTime = ({
  cell,
  renderDate,
  altCalendarPreset,
  altCalendar,
  dateMarkRender,
  altCalendarPresetData,
  dateMarkPresetData,
}: {
  cell: CalendarColInfo
  renderDate: moment.Moment | null
  altCalendarPresetData: CalendarAltCalendarPreset
  dateMarkPresetData: CalendarMarkPreset
  dateMarkRender?: DateMarkRender
  altCalendar?: CalendarItemV3[]
  altCalendarPreset?: DatePickerAltCalendarPresetEnum
}) => {
  if (cell.type === 'disabled') return false
  const newDate = moment(renderDate)
  // 先设置月份，防止赋值出月中不存在日期
  if (cell.type === 'prev') {
    newDate.subtract(1, 'months')
  }
  if (cell.type === 'next') {
    newDate.add(1, 'months')
  }
  newDate.date(cell.value)
  const _year = newDate.year()
  const _month = newDate.month() + 1
  const _value = cell.value
  const datainfo = _year + '/' + _month + '/' + _value
  const LunarInfo = Lunar.toLunar(_year, _month, _value)
  let lunarcellinfo: Omit<FormatCalendarItem, 'date'> = {
    text: altCalendarPreset === 'zh-CN' ? LunarInfo[6] : null, // 默认预置信息
    highlight: false,
    nodeMark: undefined,
  }
  if (altCalendar || dateMarkRender) {
    lunarcellinfo = {
      text: altCalendarText(datainfo, lunarcellinfo, altCalendarPresetData),
      highlight: !!(
        altCalendarPresetData &&
        altCalendarPresetData[datainfo] &&
        altCalendarPresetData[datainfo].highlight
      ),
      nodeMark: markRender(datainfo, dateMarkRender, dateMarkPresetData),
    }
  }
  if (
    (dateMarkPresetData && dateMarkPresetData[datainfo]) ||
    (altCalendarPresetData && altCalendarPresetData[datainfo])
  ) {
    lunarcellinfo = {
      text: altCalendarText(datainfo, lunarcellinfo, altCalendarPresetData),
      highlight: !!(
        altCalendarPresetData &&
        altCalendarPresetData[datainfo] &&
        altCalendarPresetData[datainfo].highlight
      ),
      nodeMark: markRender(datainfo, dateMarkRender, dateMarkPresetData),
    }
  }
  return { ...altCalendarPresetData[datainfo], ...lunarcellinfo }
}

/**
 * 处理输入不在该范围内的处理
 * @param {String} momentStartDate 开始日期
 * @param {String} momentEndDate 结束日期
 * @param {String} max 最大日期
 * @param {String} min 最小日期
 */
export const getInRangeDate = (
  momentStartDate: moment.Moment,
  momentEndDate: moment.Moment,
  max: Date,
  min: Date
) => {
  const startDate = momentStartDate && momentStartDate.format()
  const endDate = momentEndDate && momentEndDate.format()

  const isValid = (value: string) => {
    return moment(value).isValid()
  }
  const toDate = (value: Date) => {
    return moment(value).format()
  }
  let _startDate: Date | string = isValid(startDate) ? startDate : ''
  let _endDate: Date | string = isValid(endDate) ? endDate : ''
  if (min && isValid(startDate)) {
    const minTimestamp = Date.parse(toDate(min))
    const startDateTimestamp = Date.parse(startDate)
    const endDateTimestamp = Date.parse(endDate)
    _startDate = startDateTimestamp < minTimestamp ? new Date(minTimestamp) : new Date(startDate)
    _endDate = endDateTimestamp < minTimestamp ? new Date(minTimestamp) : new Date(endDate)
  }
  if (max && isValid(startDate)) {
    const maxTimestamp = Date.parse(toDate(max))
    const startDateTimestamp = Date.parse(_startDate as string)
    const endDateTimestamp = Date.parse(_endDate as string)
    _startDate = startDateTimestamp > maxTimestamp ? new Date(maxTimestamp) : new Date(_startDate)
    _endDate = endDateTimestamp > maxTimestamp ? new Date(maxTimestamp) : new Date(_endDate)
  }
  return { startDate: _startDate, endDate: _endDate }
}

/**
 * 解析日期数据
 * @param value 格式化的值
 * @param type 类型
 * @param weekOffset 周偏移
 * @param format 日期格式
 * @param strideSelectMode 跨月选择模式
 * @param utcOffset UTC偏移量（小时）
 */
export const parseValue = (
  value: DatePickerValueV3,
  type: DatePickerTypeEnum,
  weekOffset: number,
  format?: string,
  strideSelectMode?: 'auto' | 'fixed',
  utcOffset?: number
) => {
  if (!value) return [null]

  // 暂时无法理解为何此处自行获取了 type
  // const _format = getLocaleTypeFormatMap(locale)[type]
  // const _value = moment(value as any, _format)
  const _value =
    typeof utcOffset === 'number'
      ? createMomentWithUtcOffset(
          value as any,
          typeof format === 'string' ? format : undefined,
          utcOffset
        )
      : moment(value as any, typeof format === 'string' ? format : undefined)
  const isValid = moment(_value).isValid()

  if (value && typeof value === 'object' && (type.includes('range') || type === 'timeperiod')) {
    const rangeValue = value as DateRange

    if (type === 'weekrange') {
      if (strideSelectMode === 'fixed') {
        return [
          typeof utcOffset === 'number'
            ? createMomentWithUtcOffset(rangeValue.start, format, utcOffset)
            : moment(rangeValue.start),
          typeof utcOffset === 'number'
            ? createMomentWithUtcOffset(rangeValue.end, format, utcOffset)
            : moment(rangeValue.end),
        ]
      }

      const startMoment =
        typeof utcOffset === 'number'
          ? createMomentWithUtcOffset(rangeValue.start, format, utcOffset)
          : moment(rangeValue.start)
      const endMoment =
        typeof utcOffset === 'number'
          ? createMomentWithUtcOffset(rangeValue.end, format, utcOffset)
          : moment(rangeValue.end)

      return [
        rangeValue.start ? getBelongWeekBoundary(startMoment, weekOffset) : null,
        rangeValue.end ? getBelongWeekBoundary(endMoment, weekOffset, false) : null,
      ]
    }

    return [
      rangeValue.start && moment(rangeValue.start).isValid()
        ? typeof utcOffset === 'number'
          ? createMomentWithUtcOffset(rangeValue.start, format, utcOffset)
          : moment(rangeValue.start, format)
        : null,
      rangeValue.end && moment(rangeValue.end).isValid()
        ? typeof utcOffset === 'number'
          ? createMomentWithUtcOffset(rangeValue.end, format, utcOffset)
          : moment(rangeValue.end, format)
        : null,
    ]
  }

  return [isValid ? _value : null]
}
