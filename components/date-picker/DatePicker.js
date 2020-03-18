import React from 'react'
import PropTypes from 'prop-types'

import BasePicker from './BasePicker'
import DatePanel from './DatePanel'
import DateRangePanel from './DateRangePanel'
import WeekRangePanel from './WeekRangePanel'
import Provider from '../context'
import { getPRCDate, deconstructDate } from './util'
import IndiaHoliday from './IndiaHoliday.js'
class DatePicker extends BasePicker {
  static propTypes = {
    altCalendar: PropTypes.array,
    dateMarkRender: PropTypes.func,
    altCalendarPreset: PropTypes.oneOf(['zh-CN', 'id-ID']),
    dateMarkPreset: PropTypes.oneOf(['zh-CN'])
  }
  constructor (props) {
    super(props)
    this.altCalendarPresetData = {}
    this.dateMarkPresetData = {}
    this._getLunarPresetData()
    this._getMarkPresetData()
  }
  // 获取预置数据
  _getLunarPresetData () {
    const {altCalendarPreset, altCalendar} = this.props
    const allPRCDate = {}
    if (altCalendarPreset === 'zh-CN') {
      getPRCDate('PRCLunar').then(res => {
        Object.keys(res.data).forEach(key => {
          let oneYear = {}
          res.data[key].PRCLunar.forEach(item => {
            Object.assign(oneYear, {
              [item.date.replace(/-/g, '/')]: item.text
            })
          })
          Object.assign(allPRCDate, oneYear)
        })
        this.altCalendarPresetData = altCalendar ? this._altCalendarData(allPRCDate) : allPRCDate
      })
    } else if (altCalendarPreset === 'id-ID') {
      Object.keys(IndiaHoliday).forEach(key => {
        let oneYear = {}
        IndiaHoliday[key].IndiaHoliday.forEach(item => {
          Object.assign(oneYear, {
            [item.date.replace(/-/g, '/')]: {
              ...item,
              highlight: true
            }
          })
        })
        Object.assign(allPRCDate, oneYear)
      })
      this.altCalendarPresetData = altCalendar ? this._altCalendarData(allPRCDate) : allPRCDate
    } else {
      this.altCalendarPresetData = altCalendar ? this._altCalendarData(allPRCDate) : {}
    }
  }
  // 获取预置数据
  _getMarkPresetData () {
    const {altCalendarPreset, dateMarkPreset} = this.props
    if (altCalendarPreset && altCalendarPreset !== 'zh-CN') {
      return
    }
    dateMarkPreset === 'zh-CN' && getPRCDate('PRCHoliday').then(res => {
      const allPRCDate = {}
      Object.keys(res.data).forEach(key => {
        Object.keys(res.data[key].PRCHoliday).forEach(elkey => {
          allPRCDate[elkey.replace(/-/g, '/')] = res.data[key].PRCHoliday[elkey] === '1'
            ? <span className='hi-datepicker__text——holiday hi-datepicker__text——holiday--rest'>休</span>
            : <span className='hi-datepicker__text——holiday hi-datepicker__text——holiday--work'>班</span>
        })
      })
      this.dateMarkPresetData = allPRCDate
    })
  }
  // 合并用户自定义的日期信息作为presetData
  _altCalendarData = (allPRCDate) => {
    const allData = {}
    this.props.altCalendar.length > 0 && this.props.altCalendar.forEach(item => {
      const dateInfo = deconstructDate(item.date)
      if (!Number.isNaN(dateInfo.year)) {
        Object.assign(allData, {
          [dateInfo.year + '/' + dateInfo.month + '/' + dateInfo.day]: item
        })
      }
    })
    return Object.assign(allPRCDate, allData)
  }
  initPanel (state, props) {
    let component = null
    let d = state.date
    switch (props.type) {
      case 'month':
      case 'year':
      case 'week':
      case 'date':
        component = (
          <DatePanel
            {...props}
            altCalendarPresetData={this.altCalendarPresetData}
            dateMarkPresetData={this.dateMarkPresetData}
            date={state.date}
            format={this.state.format}
            onPick={this.onPick.bind(this)}
            style={state.style}
          />
        )
        break
      case 'timeperiod':
        component = (
          <DatePanel
            {...props}
            altCalendarPresetData={this.altCalendarPresetData}
            dateMarkPresetData={this.dateMarkPresetData}
            format={this.state.format}
            date={state.date}
            onPick={this.onPick.bind(this)}
            style={state.style}
          />
        )
        break
      case 'daterange':
        component = (
          <DateRangePanel
            {...props}
            altCalendarPresetData={this.altCalendarPresetData}
            dateMarkPresetData={this.dateMarkPresetData}
            format={this.state.format}
            date={d}
            onPick={this.onPick.bind(this)}
            style={state.style}
          />
        )
        break
      case 'weekrange':
        component = (
          <WeekRangePanel
            {...props}
            format={this.state.format}
            date={d}
            range={state.range}
            onPick={this.onPick.bind(this)}
            style={state.style}
          />
        )
        break
    }
    return component
  }
}
export default Provider(DatePicker)
export {DatePicker}
