import React, { useState, useCallback, useRef } from 'react'
import DPContext from './context'
import Root from './components/Root'
import { useDate } from './hooks'
import Popper from '../popper/index'
import TimePanel from './components/TimePanel'
import _ from 'lodash'
import classNames from 'classnames'
import './styles/timepicker.scss'
const TimePicker = ({
  type = 'time',
  value,
  defaultValue,
  format = 'HH:mm:ss',
  disabled,
  placeholder,
  localeDatas,
  theme
}) => {
  const cacheDate = useRef(null)
  const [showPanel, setShowPanel] = useState(false)
  const [outDate, changeOutDate] = useDate({
    value,
    type,
    defaultValue,
    cacheDate
  })
  const inputChangeEvent = (val, dir) => {
    if (val.isValid()) {
      const oData = _.cloneDeep(outDate)
      oData[dir] = val
      changeOutDate(oData)
    }
  }
  const clickOutsideEvent = useCallback(() => {
    setShowPanel(false)
  }, [outDate])
  const timePopperCls = classNames(
    'hi-timepicker__popper',
    type.includes('range') && 'hi-timepicker__popper--range'
  )
  const onTimeChange = (date, cIndex) => {
    const oData = _.cloneDeep(outDate)
    oData[cIndex] = date
    changeOutDate(oData)
  }
  return <DPContext.Provider
    value={{
      type,
      localeDatas,
      outDate,
      format,
      theme
    }}
  >
    <Root
      inputChangeEvent={inputChangeEvent}
      onTrigger={() => setShowPanel(true)}
    >
      <Popper
        show={showPanel}
        zIndex={1050}
        topGap={0}
        leftGap={0}
        width={false}
        preventOverflow
        className={timePopperCls}
        placement={'top-bottom-start'}
        onClickOutside={clickOutsideEvent}
      >
        <TimePanel onTimeChange={onTimeChange} dates={outDate} />
      </Popper>
    </Root>
  </DPContext.Provider>
}

export default TimePicker
