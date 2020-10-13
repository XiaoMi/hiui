import React, { useContext } from 'react'
import Time from './Time'
import DPContext from '../context'
import moment from 'moment'
import classNames from 'classnames'

const TimePanel = ({ hasShadow, onTimeChange, style, dates = [] }) => {
  const { type, theme, hourStep, minuteStep, secondStep } = useContext(DPContext)
  const panelCls = classNames(
    'hi-timepicker__panel',
    `theme__${theme}`,
    type.includes('range') && 'hi-timepicker__panel--range'
  )
  return (
    <div className={panelCls} style={style}>
      {
        <Time
          date={dates[0] || moment()}
          hourStep={hourStep}
          minuteStep={minuteStep}
          secondStep={secondStep}
          timeRangePanelType="left"
          onChange={(d) => onTimeChange(d, 0)}
        />
      }
      {type.includes('range') && (
        <>
          <div className="hi-timepicker__split" />
          <Time
            date={dates[1] || moment()}
            hourStep={hourStep}
            minuteStep={minuteStep}
            secondStep={secondStep}
            timeRangePanelType="right"
            startDate={dates[0] || moment()}
            onChange={(d) => onTimeChange(d, 1)}
          />
        </>
      )}
    </div>
  )
}

export default TimePanel
