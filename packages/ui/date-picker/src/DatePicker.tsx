import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import _ from 'lodash'
import { LocaleContext } from '@hi-ui/locale-context'
import moment from 'moment'
import { useDate } from './hooks/useData'
import useFormat from './hooks/useFormat'
import useAltData from './hooks/useAltData'
import { getInRangeDate } from './utils'
import DPContext from './context'
import { PopperPortal } from '@hi-ui/popper'
import Root from './components/root'
import Panel from './components/panel'
import RangePanel from './components/range-panel'
import { DatePickerProps } from './types'

const DATE_PICKER_PREFIX = getPrefixCls('date-picker')

const DEFAULT_DISABLED_DATE = () => false
const DEFAULT_ON_CHANGE = () => {}

export const DatePicker = forwardRef<HTMLDivElement | null, DatePickerProps>(
  (
    {
      prefixCls = DATE_PICKER_PREFIX,
      role = 'date-picker',
      className,
      children,
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
      hourStep = 1,
      minuteStep = 1,
      secondStep = 1,
      onChange = DEFAULT_ON_CHANGE,
      timeInterval = 240,
      shortcuts,
      altCalendar,
      altCalendarPreset,
      dateMarkRender,
      dateMarkPreset,
      overlayClassName,
      inputReadOnly,
      locale = 'zh-CN',
      bordered = true,
      disabledDate = DEFAULT_DISABLED_DATE,
      max: configMax,
      min: configMin,
      maxDate,
      minDate,
      onSelect: propsOnSelect,
      theme,
      placement,
      ...otherProps
    },
    ref
  ) => {
    const { datePicker } = useContext(LocaleContext)
    // 适配器，暂时兼容老代码
    const localeDatas = useMemo(() => ({ datePicker }), [datePicker])
    const [max, setMax] = useState(configMax || maxDate || null)
    const [min, setMin] = useState(configMin || minDate || null)

    useEffect(() => {
      setMax(configMax || maxDate || null)
    }, [configMax, maxDate])

    useEffect(() => {
      setMin(configMin || minDate || null)
    }, [configMin, minDate])

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
      locale,
    })
    const realFormat = useFormat({
      type,
      showTime,
      format,
      locale,
    })
    const isLarge = altCalendar || altCalendarPreset || dateMarkRender || dateMarkPreset
    const [showPanel, setShowPanel] = useState(false)
    const [altCalendarPresetData, dateMarkPresetData] = useAltData({
      altCalendar,
      altCalendarPreset,
      // dateMarkRender,
      dateMarkPreset,
      showPanel,
    })
    const inputChangeEvent = (val: any, dir: any) => {
      if (val.isValid()) {
        const oData = _.cloneDeep(outDate) as any
        oData[dir] = val
        changeOutDate(oData)
      }
    }

    const callback = (dates: any, emitOnChange = true) => {
      const _dates = _.cloneDeep(dates)
      let returnDate = {}
      let returnDateStr = ''
      if (type.includes('range') || type === 'timeperiod' || type === 'week') {
        returnDate = {
          start: _dates[0].toDate(),
          end: _dates[1].toDate(),
        }
        returnDateStr =
          type === 'week'
            ? _dates[0].format(realFormat)
            : { start: _dates[0].format(realFormat), end: _dates[1].format(realFormat) }
      } else {
        returnDate = _dates[0].toDate()
        returnDateStr = _dates[0].format(realFormat)
      }
      cacheDate.current = _dates
      emitOnChange && onChange(returnDate as any, returnDateStr)
    }
    const onPick = (dates: any, isShowPanel: any) => {
      setTimeout(() => {
        setShowPanel(isShowPanel)
      }, 0)
      if (!isShowPanel) {
        setInputFocus(false)
        callback(dates)
      }
      changeOutDate([].concat(dates))
    }

    const onPopperClose = useCallback(() => {
      const outDateValue = outDate[0]
      const isValid = moment(outDateValue).isValid()
      // @ts-ignore
      const { startDate, endDate } = isValid && getInRangeDate(outDate[0], outDate[1], max, min)
      const _outDate = isValid ? [moment(startDate), moment(endDate)] : [null]
      resetStatus()
      const isChange = _outDate.some((od, index) => {
        // @ts-ignore
        return od && !od.isSame(cacheDate.current[index])
      })
      isChange && callback(_outDate, showTime || type === 'daterange')

      changeOutDate(_outDate)
    }, [outDate])

    const onClear = () => {
      resetStatus()
      changeOutDate([])
      // @ts-ignore
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
          // @ts-ignore
          propsOnSelect(_date, ...arg)
        }
      },
      [propsOnSelect]
    )

    const cls = cx(prefixCls, className)
    const popperCls = cx(
      `${prefixCls}__popper`,
      type === 'date' && showTime && `${prefixCls}__popper--time`,
      type.includes('range') && `${prefixCls}__popper--range`,
      type === 'timeperiod' && `${prefixCls}__popper--timeperiod`,
      shortcuts && `${prefixCls}__popper--shortcuts`,
      isLarge && `${prefixCls}__popper--large`
    )
    const [attachEl, setAttachEl] = useState<HTMLElement | null>(null)

    const _weekOffset = weekOffset !== undefined ? weekOffset : locale === 'en-US' ? 0 : 1

    return (
      <DPContext.Provider
        value={{
          ...otherProps,
          locale,
          localeDatas,
          type,
          outDate,
          weekOffset: _weekOffset,
          onPick,
          min,
          max,
          disabled,
          placeholder,
          showTime,
          format,
          realFormat,
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
          onSelect,
          prefixCls,
          showPanel,
        }}
      >
        <div className={cls} {...otherProps}>
          <Root
            inputChangeEvent={inputChangeEvent}
            onClear={onClear}
            // @ts-ignore
            showPanel={showPanel}
            bordered={bordered}
            inputFocus={inputFocus}
            onTrigger={() => {
              setShowPanel(true)
              setInputFocus(true)
            }}
            setAttachEl={setAttachEl}
          />
          <PopperPortal
            visible={showPanel}
            // overlayClassName={overlayClassName}
            placement={placement}
            onClose={onPopperClose}
            attachEl={attachEl}
            // setOverlayContainer={setOverlayContainer}
            // overlayClickOutSideEventName={overlayClickOutSideEventName}
            // onClickOutside={clickOutsideEvent}
          >
            <div className={popperCls}>
              {type.includes('range') || type === 'timeperiod' ? <RangePanel /> : <Panel />}
            </div>
          </PopperPortal>
        </div>
      </DPContext.Provider>
    )
  }
)

if (__DEV__) {
  DatePicker.displayName = 'DatePicker'
}
