import React, { useState, useRef, useCallback } from 'react'
import DPContext from './context'
import Provider from '../context/index'
import { useDate, useFormat, useAltData } from './hooks'
import _ from 'lodash'
import classNames from 'classnames'
import Popper from '../popper/index'
import Panel from './components/Panel'
import RangePanel from './components/RangePanel'
import Root from './components/Root'

import './styles/index.scss'
const BasePicker = ({
  type = 'date',
  value,
  defaultValue,
  placeholder,
  showTime = false,
  format,
  disabled,
  clearable = true,
  width = 'auto',
  weekOffset = 0,
  min = null,
  max = null,
  onChange = () => { },
  timeInterval = 240,
  shortcuts,
  altCalendar,
  altCalendarPreset,
  dateMarkRender,
  dateMarkPreset,
  localeDatas,
  theme
}) => {
  const cacheDate = useRef(null)
  const [inputFocus, setInputFocus] = useState(false)
  const [outDate, changeOutDate] = useDate({
    value,
    type,
    defaultValue,
    cacheDate
  })
  const [iFormat] = useFormat({
    type,
    showTime,
    format
  })
  const isLarge = altCalendar || altCalendarPreset || dateMarkRender || dateMarkPreset
  const [altCalendarPresetData, dateMarkPresetData] = useAltData({
    altCalendar,
    altCalendarPreset,
    dateMarkRender,
    dateMarkPreset
  })
  const [showPanel, setShowPanel] = useState(false)
  const inputChangeEvent = (val, dir) => {
    if (val.isValid()) {
      const oData = _.cloneDeep(outDate)
      oData[dir] = val
      changeOutDate(oData)
    }
  }

  const callback = (dates) => {
    const _dates = _.cloneDeep(dates)
    let returnDate = {}
    let returnDateStr = ''
    if (type.includes('range') || type === 'timeperiod') {
      returnDate = {
        start: _dates[0].toDate(),
        end: _dates[1].toDate()
      }
      returnDateStr = { start: _dates[0].format(iFormat), end: _dates[1].format(iFormat) }
    } else {
      returnDate = _dates[0].toDate()
      returnDateStr = _dates[0].format(iFormat)
    }
    cacheDate.current = _dates
    onChange(returnDate, returnDateStr)
  }
  const onPick = (dates, isShowPanel) => {
    changeOutDate([].concat(dates))
    setTimeout(() => {
      setShowPanel(isShowPanel)
    }, 0)
    if (!isShowPanel) {
      setInputFocus(false)
      callback(dates)
    }
  }

  const clickOutsideEvent = useCallback(() => {
    changeOutDate(outDate)
    resetStatus()
    outDate.forEach((od, index) => {
      if (od && !od.isSame(cacheDate.current[index])) {
        callback(outDate)
      }
    })
  }, [outDate])
  const onClear = () => {
    resetStatus()
    changeOutDate([])
  }
  const resetStatus = useCallback(() => {
    setShowPanel(false)
    setInputFocus(false)
  }, [])
  const popperCls = classNames(
    'hi-datepicker__popper',
    type === 'date' && showTime && 'hi-datepicker__popper--time',
    type.includes('range') && 'hi-datepicker__popper--range',
    type === 'timeperiod' && 'hi-datepicker__popper--timeperiod',
    shortcuts && 'hi-datepicker__popper--shortcuts',
    isLarge && 'hi-datepicker__popper--large'
  )

  return (
    <DPContext.Provider
      value={{
        type,
        outDate,
        localeDatas,
        weekOffset,
        onPick,
        min,
        max,
        disabled,
        placeholder,
        showTime,
        format,
        timeInterval,
        shortcuts,
        altCalendar,
        altCalendarPreset,
        dateMarkRender,
        dateMarkPreset,
        altCalendarPresetData,
        dateMarkPresetData,
        clearable,
        theme
      }}
    >
      <Root
        inputChangeEvent={inputChangeEvent}
        onClear={onClear}
        showPanel={showPanel}
        inputFocus={inputFocus}
        onTrigger={() => {
          setShowPanel(true)
          setInputFocus(true)
        }}
      >
        <Popper
          show={showPanel}
          zIndex={1050}
          topGap={0}
          leftGap={0}
          width={false}
          preventOverflow
          className={popperCls}
          placement={'top-bottom-start'}
          onClickOutside={clickOutsideEvent}
        >
          {
            (type.includes('range') || type === 'timeperiod') ? <RangePanel /> : <Panel />
          }
        </Popper>
      </Root>
      <hr />
    </DPContext.Provider>
  )
}
export default Provider(BasePicker)
