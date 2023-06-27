import React, { useState, useRef, useCallback, useEffect } from 'react'
import moment from 'moment'
import DPContext from './context'
import Provider from '../context/index'
import { useDate, useFormat, useAltData } from './hooks'
import { getInRangeDate, normalizeWeekOffset } from './utils'
import _ from 'lodash'
import classNames from 'classnames'
import Popper from '../popper/index'
import Panel from './components/Panel'
import RangePanel from './components/RangePanel'
import Root from './components/Root'

import './style/index'

const BasePicker = ({
  type: propType = 'date',
  value,
  defaultValue,
  placeholder,
  showTime = false,
  format,
  disabled,
  clearable = true,
  width = 'auto',
  weekOffset,
  hourStep,
  minuteStep,
  secondStep,
  onChange = () => {},
  timeInterval = 240,
  shortcuts,
  altCalendar,
  altCalendarPreset,
  dateMarkRender,
  dateMarkPreset,
  localeDatas,
  overlayClassName,
  theme,
  placement = 'top-bottom-start',
  inputReadOnly,
  locale,
  bordered = true,
  disabledDate,
  onSelect: propsOnSelect,
  setOverlayContainer,
  overlayClickOutSideEventName = 'click',
  ...otherPorps
}) => {
  // 兼容2.x api -> max，min
  const [max, setMax] = useState(otherPorps.max || otherPorps.maxDate || null)
  const [min, setMin] = useState(otherPorps.min || otherPorps.minDate || null)

  useEffect(() => {
    setMax(otherPorps.max || otherPorps.maxDate || null)
  }, [otherPorps.max, otherPorps.maxDate])

  useEffect(() => {
    setMin(otherPorps.min || otherPorps.minDate || null)
  }, [otherPorps.min, otherPorps.minDate])

  const cacheDate = useRef(null)
  const [inputFocus, setInputFocus] = useState(false)
  const [type, setType] = useState(propType)
  useEffect(() => {
    moment.locale(locale === 'en-US' ? 'en' : 'zh-CN')
    if (weekOffset !== undefined) {
      moment.locale(weekOffset === 0 ? 'en' : 'zh-CN')
    }
  }, [locale, weekOffset])
  useEffect(() => {
    setType(propType)
  }, [propType])
  const [outDate, changeOutDate] = useDate({
    value,
    type,
    defaultValue,
    cacheDate,
    format,
    weekOffset,
    locale
  })
  const [iFormat] = useFormat({
    type,
    showTime,
    format,
    locale
  })
  const isLarge = altCalendar || altCalendarPreset || dateMarkRender || dateMarkPreset
  const [showPanel, setShowPanel] = useState(false)
  const [altCalendarPresetData, dateMarkPresetData] = useAltData({
    altCalendar,
    altCalendarPreset,
    dateMarkRender,
    dateMarkPreset,
    showPanel
  })
  const inputChangeEvent = (val, dir) => {
    if (val.isValid()) {
      const oData = _.cloneDeep(outDate)

      // 如果是范围的修改，则校准下时间范围的值
      if (outDate.length === 2) {
        if ((dir === 0 && moment(val) < moment(outDate[1])) || (dir === 1 && moment(val) > moment(outDate[0]))) {
          oData[dir] = val
        }
      } else {
        oData[dir] = val
      }

      changeOutDate(oData)
      callback(oData)
    }
  }

  const _weekOffset = weekOffset !== undefined ? weekOffset : locale === 'en-US' ? 0 : 1

  const callback = (dates, emitOnChange = true) => {
    const _dates = _.cloneDeep(dates)
    let returnDate = {}
    let returnDateStr = ''

    const formatWeek = (disposeDate) => {
      if (!disposeDate) return ''
      if (typeof format !== 'undefined') return disposeDate.format(iFormat)

      const clone = normalizeWeekOffset(disposeDate, _weekOffset)
      return clone.weekYear() + '-W' + clone.week()
    }

    if (type.includes('week')) {
      returnDate = {
        start: _dates[0].toDate(),
        end: _dates[1].toDate()
      }
      returnDateStr = type.includes('range')
        ? { start: formatWeek(_dates[0]), end: formatWeek(_dates[1]) }
        : formatWeek(_dates[0])
    } else if (type.includes('range') || type === 'timeperiod') {
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
    emitOnChange && onChange(returnDate, returnDateStr)
  }
  const onPick = (dates, isShowPanel) => {
    setTimeout(() => {
      setShowPanel(isShowPanel)
    }, 0)
    if (!isShowPanel) {
      setInputFocus(false)
      callback(dates)
    }
    changeOutDate([].concat(dates))
  }

  const clickOutsideEvent = useCallback(() => {
    const outDateValue = outDate[0]
    const isValid = moment(outDateValue).isValid()
    const { startDate, endDate } = isValid && getInRangeDate(outDate[0], outDate[1], max, min)
    const _outDate = isValid ? [moment(startDate), moment(endDate)] : [null]
    resetStatus()
    const isChange = _outDate.some((od, index) => {
      return od && !od.isSame(cacheDate.current[index])
    })
    isChange && callback(_outDate, showTime || type === 'daterange')

    changeOutDate(_outDate)
  }, [outDate])
  const onClear = () => {
    resetStatus()
    changeOutDate([])
    onChange(null, '')
  }
  const resetStatus = useCallback(() => {
    setShowPanel(false)
    setInputFocus(false)
  }, [])
  const onSelect = useCallback(
    (date, ...arg) => {
      if (propsOnSelect) {
        const _date = Array.isArray(date) ? date[0] : date
        propsOnSelect(_date, ...arg)
      }
    },
    [propsOnSelect]
  )
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
        ...otherPorps,
        locale,
        type,
        outDate,
        localeDatas,
        weekOffset: _weekOffset,
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
        theme,
        width,
        hourStep,
        minuteStep,
        secondStep,
        inputReadOnly,
        value,
        bordered,
        disabledDate,
        onSelect
      }}
    >
      <Root
        inputChangeEvent={inputChangeEvent}
        onClear={onClear}
        showPanel={showPanel}
        bordered={bordered}
        inputFocus={inputFocus}
        onTrigger={() => {
          setShowPanel(true)
          setInputFocus(true)
        }}
      >
        <Popper
          show={showPanel}
          zIndex={1050}
          overlayClassName={overlayClassName}
          topGap={0}
          leftGap={0}
          width={false}
          className={popperCls}
          placement={placement}
          setOverlayContainer={setOverlayContainer}
          overlayClickOutSideEventName={overlayClickOutSideEventName}
          onClickOutside={clickOutsideEvent}
        >
          {type.includes('range') || type === 'timeperiod' ? <RangePanel /> : <Panel />}
        </Popper>
      </Root>
    </DPContext.Provider>
  )
}
export default Provider(BasePicker)
