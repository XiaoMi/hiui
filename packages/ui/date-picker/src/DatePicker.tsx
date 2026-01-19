import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { clone as cloneDeep } from '@hi-ui/object-utils'
import { useLocaleContext } from '@hi-ui/core'
import moment from 'moment'
import 'moment/locale/zh-cn'
import { useDate } from './hooks/useData'
import useFormat from './hooks/useFormat'
import useAltData from './hooks/useAltData'
import { getInRangeDate } from './utils'
import DPContext from './context'
import Popper from '@hi-ui/popper'
import Root from './components/root'
import Panel from './components/panel'
import RangePanel from './components/range-panel'
import {
  CalendarItemV3,
  DatePickerProps,
  DatePickerTypeEnum,
  DatePickerValueV3,
  DateRange,
  DatePickerOnChangeDateString,
  DatePickerOnChangeDate,
} from './types'
import { getBelongWeek, getBelongWeekYear } from './utils/week'
import { DateRangeTimePanel } from './components/date-range-time-panel'
import { GranularityMap } from './utils/constants'
import { CalenderSelectedRange } from './hooks/useCalenderData'

const DATE_PICKER_PREFIX = getPrefixCls('date-picker')

const DEFAULT_DISABLED_DATE = () => false
const DEFAULT_ON_CHANGE = () => {}
const DEFAULT_DISABLED_FUNCTION = () => []

export const DatePicker = forwardRef<HTMLDivElement | null, DatePickerProps>(
  (
    {
      prefixCls = DATE_PICKER_PREFIX,
      role = 'date-picker',
      className,
      type: propType = 'date',
      value: controlledValue,
      defaultValue: uncontrolledValue,
      defaultPickerValue: defaultPickerValueProp,
      placeholder,
      showTime = false,
      format,
      disabled,
      clearable = true,
      // width = 'auto',
      weekOffset,
      hourStep = 1,
      minuteStep = 1,
      secondStep = 1,
      onChange: onChangeOriginal = DEFAULT_ON_CHANGE,
      timeInterval = 240,
      shortcuts,
      altCalendar: altCalendarOriginal,
      altCalendarPreset,
      dateMarkRender,
      dateMarkPreset,
      inputReadOnly,
      disabledDate = DEFAULT_DISABLED_DATE,
      maxDate: max = null,
      minDate: min = null,
      utcOffset,
      onSelect: propsOnSelectOriginal,
      onPanelChange,
      theme,
      disabledHours = DEFAULT_DISABLED_FUNCTION,
      disabledMinutes = DEFAULT_DISABLED_FUNCTION,
      disabledSeconds = DEFAULT_DISABLED_FUNCTION,
      appearance = 'line',
      size = 'md',
      overlay,
      invalid = false,
      onOpen,
      onClose,
      cellRender,
      footerRender,
      strideSelectMode = 'auto',
      customRender,
      prefix,
      needConfirm: needConfirmProp = false,
      onConfirm,
      visible,
      ...otherProps
    },
    ref
  ) => {
    const i18n = useLocaleContext()
    const locale = i18n.locale

    const [dateRangeTimePanelNow, setDateRangeTimePanelNow] = useState(0)

    const cacheDate = useRef<(moment.Moment | null)[]>([])
    const [inputFocus, setInputFocus] = useState(false)
    const [type, setType] = useState<DatePickerTypeEnum>(propType)
    const rangeRef = useRef<CalenderSelectedRange | null>(null)

    const needConfirm = useMemo(() => {
      // 如果是日期时间范围选择，则默认返回 true
      if (type === 'daterange' && showTime) {
        return true
      }
      return needConfirmProp
    }, [needConfirmProp, showTime, type])

    useEffect(() => {
      moment.locale(locale === 'en-US' ? 'en' : 'zh-CN')
      // V4: 不使用 weekOffset 判断国际化语言
      // if (weekOffset !== undefined) {
      //   moment.locale(weekOffset === 0 ? 'en' : 'zh-CN')
      // }
    }, [locale, weekOffset])

    useEffect(() => {
      setType(propType)
    }, [propType])

    const propsOnSelect = useCallback(
      (data: moment.Moment, isCompleted: boolean, panelIndex?: number) => {
        propsOnSelectOriginal?.(moment(data).toDate(), isCompleted, panelIndex)
      },
      [propsOnSelectOriginal]
    )

    const safeWeekOffset = useMemo(
      () => (weekOffset !== undefined ? weekOffset : locale === 'en-US' ? 0 : 1),
      [weekOffset, locale]
    )

    const valueAdapter = useCallback((original?: DatePickerValueV3 | DatePickerValueV3[]) => {
      if (!original) {
        return original
      } else {
        if (Array.isArray(original)) {
          return {
            start: new Date(original[0] as any),
            end: new Date(original[1] as any),
          } as DateRange
        } else {
          return original
        }
      }
    }, [])

    const altCalendar = useMemo<CalendarItemV3[] | undefined>(
      () =>
        altCalendarOriginal &&
        altCalendarOriginal.map((item) => ({
          date: item.date,
          text: item.content,
          highlight: item.highlighted,
        })),
      [altCalendarOriginal]
    )

    // 将 v4 的 api 格式转换成 v3 的 api 格式内部使用
    const onChange = useCallback(
      (disposeDate: DatePickerOnChangeDate, disposeString: DatePickerOnChangeDateString) => {
        let resultData = null
        let resultString = null

        if (disposeDate) {
          resultData = ((disposeDate as unknown) as DateRange).start
            ? [
                moment(((disposeDate as unknown) as DateRange).start).toDate(),
                moment(((disposeDate as unknown) as DateRange).end).toDate(),
              ]
            : moment(disposeDate as any).toDate()
        }

        if (disposeString) {
          resultString = (((disposeString as unknown) as DateRange).start as string)
            ? [
                ((disposeString as unknown) as DateRange).start as string,
                ((disposeString as unknown) as DateRange).end as string,
              ]
            : (disposeString as string)
        }

        onChangeOriginal(resultData, resultString)
      },
      [onChangeOriginal]
    )

    const value = useMemo(() => valueAdapter(controlledValue), [valueAdapter, controlledValue])
    const defaultValue = useMemo(() => valueAdapter(uncontrolledValue), [
      valueAdapter,
      uncontrolledValue,
    ])
    const defaultPickerValue = useMemo(() => valueAdapter(defaultPickerValueProp), [
      valueAdapter,
      defaultPickerValueProp,
    ])
    const [outDate, changeOutDate] = useDate({
      value,
      type,
      defaultValue,
      cacheDate,
      format: typeof format === 'function' ? undefined : format,
      weekOffset: safeWeekOffset,
      locale,
      strideSelectMode,
      utcOffset,
    })
    const realFormat = useFormat({
      type,
      showTime,
      format: typeof format === 'function' ? undefined : format,
      locale,
    })

    const [showPanel, setShowPanel] = useState(false)
    const [altCalendarPresetData, dateMarkPresetData] = useAltData({
      altCalendar,
      altCalendarPreset,
      // dateMarkRender,
      dateMarkPreset,
      showPanel,
      prefixCls,
    })
    const inputChangeEvent = (val: moment.Moment, dir: number) => {
      if (val.isValid()) {
        const oData = cloneDeep(outDate)
        // 不在内部存储时应用 UTC 偏移，保持显示值原样
        oData[dir] = val
        // 位置开始一定小于结束
        if (oData[0] && oData[1] && oData[0]?.isAfter(oData[1])) {
          const temp = oData[0]
          oData[0] = oData[1]
          oData[1] = temp
        }
        changeOutDate(oData)
        callback(oData)
      }
    }

    const callback = useCallback(
      (dates: (moment.Moment | null)[], emitOnChange = true) => {
        // 在判断数值是否改变时，需要比较的数目（比如日期选择就只需要比较第一个数据即可）
        // 此处是为了过滤掉单选情况下，数组第二个数据所带来的影响
        let compareNumber = 1
        const _dates = cloneDeep(dates)
        let returnDate = {} as any
        let returnDateStr = '' as any

        // 为 onChange 回调应用时区转换（仅用于回调，不影响显示）
        const processedDatesForCallback = _dates.map((date) => {
          if (!date) return date
          // 完整的时区转换流程：
          // 1. 将显示的时间理解为 utcOffset 指定时区的时间
          // 2. 转换为 UTC 标准时间
          // 3. 转换为当前系统时区的本地时间

          // 第一步：减去 utcOffset，得到 UTC 时间
          const utcTime =
            typeof utcOffset === 'number'
              ? date.clone().subtract(utcOffset * 60, 'minutes')
              : date.clone()

          // 第二步：获取当前系统时区偏移量并转换为本地时间
          const currentTimezoneOffset = new Date().getTimezoneOffset()

          return typeof utcOffset === 'number' && utcOffset !== currentTimezoneOffset
            ? // getTimezoneOffset() 返回 UTC 到本地时间的偏移量（分钟）
              utcTime.subtract(currentTimezoneOffset, 'minutes')
            : utcTime
        })

        if (type.includes('range') || type === 'timeperiod') {
          returnDate = {
            start: processedDatesForCallback[0]?.toDate(),
            end: processedDatesForCallback[1]?.toDate(),
          }
          returnDateStr = {
            start: processedDatesForCallback[0]?.format(realFormat).toLocaleUpperCase(),
            end: processedDatesForCallback[1]?.format(realFormat).toLocaleUpperCase(),
          }
          compareNumber = 2
        } else if (type.includes('week')) {
          const getWeekString = (disposeDate: moment.Moment | null) => {
            if (disposeDate) {
              return format
                ? disposeDate.format(realFormat)
                : i18n.get('datePicker.weekRange', {
                    year: getBelongWeekYear(disposeDate, safeWeekOffset),
                    week: getBelongWeek(disposeDate, safeWeekOffset),
                  })
            } else {
              return ''
            }
          }

          returnDate = {
            start: processedDatesForCallback[0]?.toDate(),
            end: processedDatesForCallback[1]?.toDate(),
          }
          returnDateStr = type.includes('range')
            ? {
                start: getWeekString(processedDatesForCallback[0]),
                end: getWeekString(processedDatesForCallback[1]),
              }
            : getWeekString(processedDatesForCallback[0])
        } else {
          returnDate = processedDatesForCallback[0]?.toDate()
          returnDateStr = processedDatesForCallback[0]?.format(realFormat).toLocaleUpperCase()
        }

        // 只有发生了改变，才会去通知外部
        if (
          _dates.slice(0, compareNumber).some((od: moment.Moment | null, index: number) => {
            return od
              ? !od.isSame(cacheDate.current![index], showTime ? 'second' : GranularityMap[type])
              : // 如果 新数据为空，则，进入以下比较
                // 如果 旧数据也为空，则，视作，相等，旧数据存在，视作改变（此处是考虑到 null undefined 共存的情况）
                od || cacheDate.current![index]
          })
        ) {
          cacheDate.current = _dates
          emitOnChange && onChange(returnDate as any, returnDateStr)
        }
      },
      [format, i18n, onChange, realFormat, safeWeekOffset, type, showTime, utcOffset]
    )

    const onPick = useCallback(
      (dates: (moment.Moment | null)[], isShowPanel = false) => {
        setTimeout(() => {
          setShowPanel(isShowPanel)
        }, 0)
        if (!isShowPanel) {
          setInputFocus(false)
          callback(dates)
          onClose?.()
        }
        changeOutDate([...dates])
      },
      [callback, changeOutDate, onClose]
    )

    const resetStatus = useCallback(() => {
      setShowPanel(false)
      setInputFocus(false)
    }, [])

    const onPopperClose = useCallback(() => {
      resetStatus()

      if (!needConfirm) {
        const outDateValue = outDate[0]
        const isValid = moment(outDateValue).isValid()
        const start = rangeRef.current?.start
        const end = rangeRef.current?.end
        let newDate
        if (!!start && !!end) {
          newDate = [start, end]
        } else {
          newDate = outDate
        }

        // @ts-ignore
        const { startDate, endDate } = isValid && getInRangeDate(newDate[0], newDate[1], max, min)
        const _outDate = isValid ? [moment(startDate), moment(endDate)] : [null]
        callback(_outDate, true)

        changeOutDate(_outDate)
        rangeRef.current = null
      }
      // 日期时间范围选择模式，弹窗关闭，重新刷入缓存，视作取消
      else {
        changeOutDate(cacheDate.current!.map((item) => item && item.clone()))
      }

      onClose?.()
    }, [callback, changeOutDate, max, min, needConfirm, onClose, outDate, resetStatus])

    const onClear = () => {
      resetStatus()
      changeOutDate([])
      // @ts-ignore
      onChange(null, '')
      onClose?.()
    }

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

    const popperCls = cx(
      `${prefixCls}__popper`,
      type === 'date' && showTime && `${prefixCls}__popper--time`,
      type.includes('range') && `${prefixCls}__popper--range`,
      type === 'timeperiod' && `${prefixCls}__popper--timeperiod`,
      shortcuts && `${prefixCls}__popper--shortcuts`
    )

    const [attachEl, setAttachEl] = useState<HTMLElement | null>(null)

    const isInDateRangeTimeMode = useMemo(() => type === 'daterange' && showTime, [type, showTime])

    const popContent = useMemo(() => {
      // 日期时间范围选择器特殊处理
      if (isInDateRangeTimeMode) {
        return (
          <DateRangeTimePanel
            nowIndex={dateRangeTimePanelNow}
            onChangeNowIndex={setDateRangeTimePanelNow}
          />
        )
      }

      return (
        <div className={popperCls}>
          {type.includes('range') || type === 'timeperiod' ? (
            <RangePanel />
          ) : (
            <Panel
              onPick={onPick}
              outDate={outDate}
              disabledDate={disabledDate}
              needConfirm={needConfirm}
              onConfirm={onConfirm}
            />
          )}
        </div>
      )
    }, [
      isInDateRangeTimeMode,
      popperCls,
      type,
      onPick,
      outDate,
      disabledDate,
      needConfirm,
      onConfirm,
      dateRangeTimePanelNow,
    ])

    return (
      <DPContext.Provider
        value={{
          ...otherProps,
          locale,
          appearance,
          i18n,
          type,
          outDate,
          weekOffset: safeWeekOffset,
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
          disabledHours,
          disabledMinutes,
          disabledSeconds,
          clearable,
          theme,
          hourStep,
          minuteStep,
          secondStep,
          inputReadOnly,
          value,
          disabledDate,
          onSelect,
          onPanelChange,
          prefixCls,
          showPanel,
          isInDateRangeTimeMode,
          size,
          cellRender,
          footerRender,
          strideSelectMode,
          rangeRef,
          utcOffset,
          defaultPickerValue,
        }}
      >
        <div className={cx(prefixCls, className)} {...otherProps}>
          <Root
            inputChangeEvent={inputChangeEvent}
            onClear={onClear}
            inputFocus={inputFocus}
            onTrigger={(index) => {
              setDateRangeTimePanelNow(index)
              setShowPanel(true)
              setInputFocus(true)
            }}
            setAttachEl={setAttachEl}
            dateRangeTimePanelNow={dateRangeTimePanelNow}
            invalid={invalid}
            customRender={customRender}
            prefix={prefix}
          />
          <Popper
            {...(overlay || {})}
            visible={visible !== undefined ? visible : showPanel}
            onEntered={onOpen}
            onClose={onPopperClose}
            attachEl={attachEl}
            unmountOnClose={false}
            preload
            autoFocus={false}
          >
            {popContent}
          </Popper>
        </div>
      </DPContext.Provider>
    )
  }
)

if (__DEV__) {
  DatePicker.displayName = 'DatePicker'
}
