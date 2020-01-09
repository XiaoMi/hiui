import React from 'react'

import BasePicker from './BasePicker'
import DatePanel from './DatePanel'
import DateRangePanel from './DateRangePanel'
import WeekRangePanel from './WeekRangePanel'
import Provider from '../context'
import { getPRCDate } from './util'

class DatePicker extends BasePicker {
  constructor (props) {
    super(props)
    this._getPresetData()
  }
  // 获取预置数据
  _getPresetData () {
    this.props.altCalendarPreset && getPRCDate(this.props.altCalendarPreset).then(res => {
      const allPRCDate = {}
      console.log(res)
      Object.keys(res.data).forEach(key => {
        let oneYear = {}
        res.data[key].PRCLunar.forEach(item => {
          Object.assign(oneYear, {
            [item.date.replace(/-/g, '/')]: item.text
          })
        })
        Object.assign(allPRCDate, oneYear)
      })
      console.log(allPRCDate)
      this.setState({
        altCalendarPresetData: allPRCDate
      })
    })
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
            altCalendarPresetData={this.state.altCalendarPresetData}
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
