import React, { useState, useCallback, useRef } from 'react'

import DPContext from './context'
import Root from './components/Root'
import { useDate, useFormat } from './hooks'
import Popper from '../popper/index'
import TimePanel from './components/TimePanel'
import Provider from '../context/index'
import _ from 'lodash'
import classNames from 'classnames'

import './style/timepicker'
const TimePicker = ({
  type = 'time',
  value,
  defaultValue,
  format = 'HH:mm:ss',
  disabled,
  clearable = true,
  placeholder,
  localeDatas,
  theme,
  disabledHours,
  disabledMinutes,
  disabledSeconds,
  overlayClassName,
  hourStep,
  minuteStep,
  secondStep,
  onChange = () => {},
  placement = 'top-bottom-start',
  inputReadOnly,
  bordered = true,
  locale
}) => {
  const cacheDate = useRef(null)
  const [rangeInputIsError, setRangeInputIsError] = useState(false)

  const [inputFocus, setInputFocus] = useState(false)
  const [showPanel, setShowPanel] = useState(false)
  const [iFormat] = useFormat({
    type,
    showTime: false,
    format,
    locale
  })
  const [outDate, changeOutDate] = useDate({
    value,
    type,
    defaultValue,
    cacheDate,
    format,
    locale
  })
  const inputChangeEvent = (val, dir) => {
    if (val.isValid()) {
      const oData = _.cloneDeep(outDate)
      oData[dir] = val
      changeOutDate(oData)
    }
  }
  const clickOutsideEvent = useCallback(() => {
    const isError = type.includes('range') && Date.parse(outDate[0]) > Date.parse(outDate[1])
    !isError && resetStatus()
    setRangeInputIsError(isError)

    !isError &&
      outDate.forEach((od, index) => {
        if (od && !od.isSame(cacheDate.current[index])) {
          callback(outDate)
        }
      })
  }, [outDate])
  const timePopperCls = classNames('hi-timepicker__popper', type.includes('range') && 'hi-timepicker__popper--range')
  const onClear = () => {
    resetStatus()
    changeOutDate([])
    onChange(null, '')
  }
  const resetStatus = useCallback(() => {
    setShowPanel(false)
    setInputFocus(false)
  }, [])
  const callback = (dates) => {
    const _dates = _.cloneDeep(dates)
    let returnDate = {}
    let returnDateStr = ''
    if (type.includes('range')) {
      returnDate = {
        start: _dates[0].toDate(),
        end: _dates[1].toDate()
      }
      returnDateStr = {
        start: _dates[0].format(iFormat),
        end: _dates[1].format(iFormat)
      }
    } else {
      returnDate = _dates[0].toDate()
      returnDateStr = _dates[0].format(iFormat)
    }
    cacheDate.current = _dates
    onChange(returnDate, returnDateStr)
  }
  const onTimeChange = (date, cIndex) => {
    const oData = _.cloneDeep(outDate)
    oData[cIndex] = date
    changeOutDate(oData)
  }
  return (
    <DPContext.Provider
      value={{
        type,
        localeDatas,
        outDate,
        format,
        theme,
        disabled,
        placeholder,
        disabledHours,
        disabledMinutes,
        disabledSeconds,
        clearable,
        hourStep,
        minuteStep,
        secondStep,
        inputReadOnly,
        bordered
      }}
    >
      <Root
        inputChangeEvent={inputChangeEvent}
        onClear={onClear}
        showPanel={showPanel}
        inputFocus={inputFocus}
        rangeInputIsError={rangeInputIsError}
        bordered={bordered}
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
          overlayClassName={overlayClassName}
          width={false}
          className={timePopperCls}
          placement={placement}
          onClickOutside={clickOutsideEvent}
        >
          <TimePanel onTimeChange={onTimeChange} dates={outDate} />
        </Popper>
      </Root>
    </DPContext.Provider>
  )
}

export default Provider(TimePicker)
