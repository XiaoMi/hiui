import React from 'react'
import _ from 'lodash'
import moment from 'moment'
import request from 'axios'
import Lunar from './toLunar'
const holiday = {
  PRCHoliday: 'https://cdn.cnbj1.fds.api.mi-img.com/hiui/PRCHoliday.json?',
  PRCLunar: 'https://cdn.cnbj1.fds.api.mi-img.com/hiui/PRCLunar.json?',
  IndiaHoliday: 'https://cdn.cnbj1.fds.api.mi-img.com/hiui/IndiaHoliday.json?'
}
export const deconstructDate = (date) => {
  return {
    year: date.year(),
    month: date.month(),
    date: date.date(),
    hour: date.hour(),
    minute: date.minute(),
    second: date.second()
  }
}
/**
 * 获取 yearrange monthrange 类型
 * @param {String} type
 */
export const getView = (type) => {
  return type.includes('year') || type.includes('month') ? type.split('range')[0] : 'date'
}

/**
 *
 * @param {Array} currentDates  原始数组
 * @param {Moment} newDate 新时间
 * @param {Number} index 更新数组位置
 */
export const genNewDates = (currentDates, newDate, index = 0) => {
  const newDates = _.cloneDeep(currentDates)
  newDates[index] = newDate
  return newDates
}

/**
 * 生成 renderDates 用于 Calender(Range) 渲染时的基础时间
 * @param {Array} dates 原始数据
 * @param {String} type 选择器类型
 */
export const parseRenderDates = (dates, type) => {
  let [leftDate, rightDate] = _.cloneDeep(dates)
  const getRightDate = () => {
    if (type === 'yearrange') {
      if (!rightDate) {
        return moment(leftDate).add(12, 'year')
      }
      const diff = rightDate.year() - leftDate.year()
      if (diff <= 12) {
        return moment(leftDate).add(12, 'year')
      }
      const rYear = rightDate.year()
      const nRightDate = moment(rightDate).year(rYear + (12 - (diff % 12)), 'year')
      return nRightDate
    }
    if (type === 'monthrange') {
      return moment(leftDate).add(1, 'year')
    }
    if (!rightDate || leftDate.isSame(rightDate, 'month')) {
      return moment(leftDate).add(1, 'months')
    }
    return rightDate
  }

  leftDate = leftDate || moment()
  rightDate = getRightDate()
  return [leftDate, rightDate]
}

export const getTimePeriodData = (timeInterval) => {
  const segment = (24 * 60) / timeInterval
  let pre = 0
  let next = 0
  const periodData = []
  const func = (val) => (val < 10 ? '0' + val : val)
  for (let i = 0; i < segment; i++) {
    next += timeInterval
    const timeStart = func(parseInt(pre / 60))
    const timeEnd = func(parseInt(next / 60))
    const timeStr = timeStart + ':' + func(pre % 60) + ' ~ ' + timeEnd + ':' + func(next % 60)
    periodData.push({
      timeStr,
      timeStart,
      timeEnd
    })
    pre = next
  }
  return periodData
}

/**
 * 是否展示历法次要信息
 * @param {Object} props
 */
export const showLargeCalendar = (props) => {
  return props.altCalendar || props.altCalendarPreset || props.dateMarkRender || props.dateMarkPreset
}

export const getPRCDate = (api) => {
  const url = holiday[api]
  const options = {
    url,
    method: 'GET'
  }
  return url ? request.create().request(options) : null
}

const altCalendarText = (datainfo, lunarcellinfo, altCalendarPresetData) => {
  if (altCalendarPresetData && altCalendarPresetData[datainfo]) {
    return altCalendarPresetData[datainfo].text || altCalendarPresetData[datainfo]
  }
  return lunarcellinfo.text
}
const getMarkNode = (node) => {
  return <span className="hi-datepicker__lunar hi-datepicker__holiday">{node}</span>
}
const markRender = (datainfo, dateMarkRender, dateMarkPresetData) => {
  // 存在传入自定就优先使用自定义
  const markRenderNode = dateMarkRender ? dateMarkRender(new Date(datainfo).getTime(), new Date().getTime()) : false
  if (markRenderNode) {
    return getMarkNode(markRenderNode)
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
  dateMarkPresetData
}) => {
  if (cell.type === 'disabled') return false
  const newDate = moment(renderDate)
  newDate.date(cell.value)
  if (cell.type === 'prev') {
    newDate.subtract(1, 'months')
  }
  if (cell.type === 'next') {
    newDate.add(1, 'months')
  }
  const _year = newDate.year()
  const _month = newDate.month() + 1
  const _value = cell.value
  const datainfo = _year + '/' + _month + '/' + _value
  const LunarInfo = Lunar.toLunar(_year, _month, _value)
  let lunarcellinfo = {
    text: altCalendarPreset === 'zh-CN' ? LunarInfo[6] : null, // 默认预置信息
    highlight: false
  }
  if (altCalendar || dateMarkRender) {
    lunarcellinfo = {
      text: altCalendarText(datainfo, lunarcellinfo, altCalendarPresetData),
      highlight: altCalendarPresetData && altCalendarPresetData[datainfo] && altCalendarPresetData[datainfo].highlight,
      nodeMark: markRender(datainfo, dateMarkRender, dateMarkPresetData)
    }
  }
  if (
    (dateMarkPresetData && dateMarkPresetData[datainfo]) ||
    (altCalendarPresetData && altCalendarPresetData[datainfo])
  ) {
    lunarcellinfo = {
      text: altCalendarText(datainfo, lunarcellinfo, altCalendarPresetData),
      highlight: altCalendarPresetData && altCalendarPresetData[datainfo] && altCalendarPresetData[datainfo].highlight,
      nodeMark: markRender(datainfo, dateMarkRender, dateMarkPresetData)
    }
  }
  return { ...altCalendarPresetData[datainfo], ...lunarcellinfo }
}

/**
 * 处理输入不在该范围内的处理
 * @param {String} startDate 开始日期
 * @param {String} endDate 结束日期
 * @param {String} max 最大日期
 * @param {String} min 最小日期
 */
export const getInRangeDate = (momentstartDate, momentendDate, max, min) => {
  const startDate = momentstartDate && momentstartDate.format()
  const endDate = momentendDate && momentendDate.format()

  const isValid = (value) => {
    return moment(value).isValid()
  }
  const toDate = (value) => {
    return moment(value).format()
  }
  let _startDate = isValid(startDate) ? startDate : ''
  let _endDate = isValid(endDate) ? endDate : ''
  if (min && isValid(startDate)) {
    const minTimestamp = Date.parse(toDate(min))
    const startDateTimestamp = Date.parse(startDate)
    const endDateTimestamp = Date.parse(endDate)
    _startDate = startDateTimestamp < minTimestamp ? new Date(minTimestamp) : new Date(startDate)
    _endDate = endDateTimestamp < minTimestamp ? new Date(minTimestamp) : new Date(endDate)
  }
  if (max && isValid(startDate)) {
    const maxTimestamp = Date.parse(toDate(max))
    const startDateTimestamp = Date.parse(_startDate)
    const endDateTimestamp = Date.parse(_endDate)
    _startDate = startDateTimestamp > maxTimestamp ? new Date(maxTimestamp) : new Date(_startDate)
    _endDate = endDateTimestamp > maxTimestamp ? new Date(maxTimestamp) : new Date(_endDate)
  }
  return { startDate: _startDate, endDate: _endDate }
}

/**
 * 格式化value
 * @param {Any} value 格式化的值
 * @param {String} type 类型
 * @param {String} format 日期格式
 */
export const parseValue = (value, type, format) => {
  if (!value) return [null]
  const _value = moment(value)
  const isValid = moment(value).isValid()
  if (value && typeof value === 'object' && type.includes('range')) {
    if (type === 'weekrange') {
      return [
        value.start ? moment(value.start).startOf('week') : null,
        value.end ? moment(value.end).endOf('week') : null
      ]
    }
    return [value.start ? moment(value.start, format) : null, value.end ? moment(value.end, format) : null]
  }
  return [isValid ? _value : null]
}
