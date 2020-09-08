import React, { useEffect, useState, useContext } from 'react'
import classNames from 'classnames'
import Header from './Header'
import Calender from './Calender'
import moment from 'moment'
import DPContext from '../context'
import TimePanel from './TimePanel'
import { getView, genNewDates } from '../utils'

const Panel = () => {
  const {
    outDate,
    type,
    onPick,
    localeDatas,
    showTime,
    theme,
    weekOffset
  } = useContext(DPContext)

  const [view, setView] = useState(getView(type))

  const [calRenderDates, setCalRenderDates] = useState([])

  useEffect(() => {
    const rDate = outDate[0] ? moment(outDate[0]) : moment()
    setCalRenderDates([rDate])
  }, [outDate])

  const onCalenderPick = date => {
    if (type === 'year' || (type === 'month' && view === 'month')) {
      // year || month picker
      onPick(
        [
          type === 'year'
            ? moment(date.year().toString())
            : moment(`${date.year().toString()}-${date.month() + 1}`)
        ],
        false
      )
      return
    }
    if (type === 'week' && view === 'date') {
      // week picker
      const weekMethod = weekOffset ? 'isoWeek' : 'week'
      const weekNum = date[weekMethod]()
      onPick(
        [moment(date).startOf(weekMethod), moment(date).endOf(weekMethod)],
        false,
        weekNum
      )
      return
    }
    let _view = view
    if (view === 'year') {
      _view = 'month'
    }
    if (view === 'month') {
      _view = 'date'
    }
    setView(_view)
    const _innerDates = genNewDates(calRenderDates, date)
    if (view === 'date') {
      onPick(_innerDates, showTime)
      return
    }
    setCalRenderDates(_innerDates)
  }

  const panelCls = classNames(
    'hi-datepicker__panel',
    `theme__${theme}`,
    showTime && 'hi-datepicker__panel--time hi-datepicker__panel--noshadow'
  )
  const onTimeChange = date => {
    const d = genNewDates(calRenderDates, date)
    setCalRenderDates(d)
    onPick(d, true)
  }

  const onArrowEvent = date => {
    const _innerDates = genNewDates(calRenderDates, date)
    if (type.includes('range') && _innerDates[0] >= _innerDates[1]) return
    setCalRenderDates(_innerDates)
  }

  return (
    <div className={panelCls}>
      <div className='hi-datepicker__panel--left'>
        {calRenderDates[0] && (
          <React.Fragment>
            <Header
              renderDate={calRenderDates[0]}
              renderDates={calRenderDates}
              changeView={() => setView('year')}
              onArrowEvent={onArrowEvent}
              localeDatas={localeDatas}
              view={view}
              panelPosition={0}
              type={type}
            />
            <Calender
              renderDate={calRenderDates[0]}
              originDate={outDate[0]}
              onPick={onCalenderPick}
              view={view}
              panelPosition='left'
            />
          </React.Fragment>
        )}
      </div>
      {type === 'date' && showTime && (
        <div className='hi-datepicker__panel--right'>
          <TimePanel onTimeChange={onTimeChange} dates={calRenderDates} />
        </div>
      )}
    </div>
  )
}

export default Panel
