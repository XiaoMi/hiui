import React from 'react'
import moment from 'moment'
import Lunar from '../toLunar'
const AltCalender = ({
  view,
  currentCell,
  renderDate,
  altCalendar,
  altCalendarPreset,
  dateMarkRender,
  dateMarkPreset,
  altCalendarPresetData,
  dateMarkPresetData,
  onMouseEnter
}) => {
  const altCalendarText = (datainfo, lunarcellinfo) => {
    if (altCalendarPresetData && altCalendarPresetData[datainfo]) {
      return (
        altCalendarPresetData[datainfo].text || altCalendarPresetData[datainfo]
      )
    }
    return lunarcellinfo.text
  }
  const getMarkNode = (node) => {
    return <span className='hi-datepicker__holiday'>{node}</span>
  }
  const markRender = (datainfo) => {
    // 存在传入自定就优先使用自定义
    const markRenderNode = dateMarkRender
      ? dateMarkRender(new Date(datainfo).getTime(), new Date().getTime())
      : false
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
  const getFullTime = (cell) => {
    console.log(altCalendarPresetData)
    if (cell.type === 'disabled') return false
    let newDate = moment(renderDate)
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
        text: altCalendarText(datainfo, lunarcellinfo),
        highlight:
          altCalendarPresetData &&
          altCalendarPresetData[datainfo] &&
          altCalendarPresetData[datainfo].highlight,
        nodeMark: markRender(datainfo)
      }
    }
    if (
      (dateMarkPresetData && dateMarkPresetData[datainfo]) ||
      (altCalendarPresetData && altCalendarPresetData[datainfo])
    ) {
      lunarcellinfo = {
        text: altCalendarText(datainfo, lunarcellinfo),
        highlight:
          altCalendarPresetData &&
          altCalendarPresetData[datainfo] &&
          altCalendarPresetData[datainfo].highlight,
        nodeMark: markRender(datainfo)
      }
    }
    return { ...altCalendarPresetData[datainfo], ...lunarcellinfo }
  }
  const fullTimeInfo = getFullTime(currentCell)
  return (
    <React.Fragment>
      {fullTimeInfo.nodeMark}
      {fullTimeInfo.text ? (
        <span
          onMouseEnter={() => {
            altCalendarPreset === 'id-ID' && onMouseEnter(fullTimeInfo)
          }}
          value={currentCell.value}
          className={`hi-datepicker__lunar ${
            fullTimeInfo.highlight ? 'hi-datepicker__lunar--highlight' : ''
          }`}
        >
          {fullTimeInfo.text}
        </span>
      ) : null}
    </React.Fragment>
  )
}

export default AltCalender
