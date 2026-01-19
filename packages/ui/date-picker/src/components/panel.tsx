import React, { useEffect, useState, useContext, useCallback, useMemo } from 'react'
import { cx } from '@hi-ui/classname'
import Header from './header'
import Calendar from './calendar'
import moment from 'moment'
import DPContext, { DPContextData } from '../context'
import { TimePickerPopContent } from '@hi-ui/time-picker'
import { getView, genNewDates, toUtcTime, parseValue } from '../utils'
import { useTimePickerData } from '../hooks/useTimePickerData'
import { timePickerValueAdaptor } from '../utils/timePickerValueAdaptor'
import { useTimePickerFormat } from '../hooks/useTimePickerFormat'
import { getBelongWeekRange } from '../utils/week'
import { CalenderSelectedRange } from '../hooks/useCalenderData'
import { Footer } from './footer'
interface PanelProps {
  onPick: DPContextData['onPick']
  outDate: (moment.Moment | null)[]
  disabledDate: DPContextData['disabledDate']
  range?: CalenderSelectedRange
  needConfirm?: boolean
  onConfirm?: (date: Date) => void
  panelIndex?: number
}
const Panel = (props: PanelProps) => {
  const {
    onPick: onPickProp,
    outDate,
    range,
    disabledDate,
    needConfirm,
    onConfirm,
    panelIndex = 0,
  } = props
  const {
    // outDate,
    type,
    // onPick,
    i18n,
    showTime,
    theme,
    weekOffset,
    locale,
    onSelect,
    onPanelChange,
    hourStep,
    minuteStep,
    secondStep,
    disabledHours,
    realFormat,
    disabledMinutes,
    disabledSeconds,
    prefixCls,
    showPanel,
    footerRender,
    utcOffset,
    defaultPickerValue,
  } = useContext(DPContext)
  const [view, setView] = useState(getView(type))

  const [calRenderDates, setCalRenderDates] = useState<moment.Moment[]>([])
  // 疑问：实在不知道这到底是啥意思
  // useState(() => {
  //   setView(getView(type))
  // }, [type])

  useEffect(() => {
    setView(getView(type))
  }, [type])

  useEffect(() => {
    // 当用户没有传入或选择日期时，优先使用 defaultPickerValue，否则使用当前日期
    let rDate: moment.Moment
    if (outDate[0]) {
      rDate = moment(outDate[0])
    } else if (defaultPickerValue) {
      // 解析 defaultPickerValue，对于单个日期取第一个元素
      const parsedDefaultPickerValue = parseValue(
        defaultPickerValue,
        type,
        weekOffset,
        realFormat,
        undefined,
        utcOffset
      )
      rDate = parsedDefaultPickerValue[0] || moment()
    } else {
      // 当没有设置value和defaultPickerValue时，使用当前时区的今天作为默认日期
      rDate =
        typeof utcOffset === 'number'
          ? moment()
              .add(utcOffset * 60, 'minutes')
              .set('hour', 0)
              .set('minute', 0)
              .set('second', 0)
          : moment().set('hour', 0).set('minute', 0).set('second', 0)
    }
    setCalRenderDates([rDate])
  }, [outDate, utcOffset, defaultPickerValue, type, weekOffset, realFormat])

  const onPick = useCallback(
    (dates: (moment.Moment | null)[], isShowPanel?: boolean) => {
      onPickProp(dates, needConfirm ? true : isShowPanel)
    },
    [needConfirm, onPickProp]
  )

  const onCalenderPick = useCallback(
    (date: moment.Moment) => {
      onSelect(date as any, true, panelIndex)
      if (type === 'year' || (type === 'month' && view === 'month')) {
        // year || month picker
        onPick(
          [
            type === 'year'
              ? moment(date.year().toString())
              : moment(`${date.year().toString()}-${date.month() < 9 ? 0 : ''}${date.month() + 1}`),
          ],
          false
        )
        return
      }

      if (type === 'quarter' && view === 'quarter') {
        onPick([date], false)
        return
      }

      if (type === 'week' && view === 'date') {
        // week picker
        // 根据偏移判断当前使用的周格式
        // 抛弃使用 isoWeek week 函数区分周计算方式，统一使用 week + instance locale 方法
        // const weekMethod = weekOffset ? 'isoWeek' : 'week'
        // onPick([moment(date).startOf(weekMethod), moment(date).endOf(weekMethod)], false)
        onPick(getBelongWeekRange(date, weekOffset), false)
        return
      }
      let _view = view
      if (view === 'year') {
        _view = 'month'
      }
      if (view === 'year' && type === 'quarter') {
        _view = 'quarter'
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
    },
    [calRenderDates, onPick, onSelect, showTime, type, view, weekOffset]
  )

  const needFooter = useMemo(() => {
    return needConfirm || (type !== 'daterange' && footerRender)
  }, [footerRender, needConfirm, type])

  const panelCls = cx(
    `${prefixCls}__panel`,
    `theme__${theme}`,
    (showTime || needFooter) && `${prefixCls}__panel--time ${prefixCls}__panel--noshadow`
  )

  const timePickerFormat = useTimePickerFormat(realFormat)
  const timePickerData = useTimePickerData(calRenderDates, timePickerFormat)

  const onTimeChange = useCallback(
    (date: string[]) => {
      // 关闭之后，不再响应事件
      if (showPanel) {
        const d = timePickerValueAdaptor({
          timePickerValue: date,
          format: timePickerFormat,
          data: calRenderDates,
          isRange: false,
        })
        // 此处函数调用未知作用，暂且注释
        // d[0].setCalRenderDates(d)

        onPick(d, true)
      }
    },
    [calRenderDates, onPick, showPanel, timePickerFormat]
  )

  const onArrowEvent = (date: moment.Moment) => {
    const _innerDates = genNewDates(calRenderDates, date)
    if (type.includes('range') && _innerDates[0] >= _innerDates[1]) return
    setCalRenderDates(_innerDates)
    onPanelChange?.(date.toDate())
  }

  const panelType = useMemo(() => {
    return type.includes('range') ? (panelIndex === 0 ? 'range-start' : 'range-end') : 'single'
  }, [type, panelIndex])

  return (
    <>
      <div className={panelCls}>
        <div className={`${prefixCls}__panel--left`}>
          {calRenderDates[0] && (
            <React.Fragment>
              <Header
                renderDate={calRenderDates[0]}
                // 疑问：尚未找到这个 props
                // renderDates={calRenderDates}
                changeView={() => setView('year')}
                onArrowEvent={onArrowEvent}
                i18n={i18n}
                view={view}
                panelPosition={0}
                // 疑问：尚未找到这个 props
                // type={type}
                locale={locale}
                prefixCls={prefixCls}
              />
              <Calendar
                renderDate={calRenderDates[0]}
                originDate={outDate[0]}
                onPick={onCalenderPick}
                view={view}
                disabledDate={disabledDate}
                range={range}
                // panelPosition="left"
              />
            </React.Fragment>
          )}
        </div>
        {showTime && (
          <div className={`${prefixCls}__panel__time-container`}>
            <div className={`${prefixCls}__panel__time-header`}>{timePickerData[0]}</div>
            <div className={`${prefixCls}__panel__time-content`}>
              <TimePickerPopContent
                onChange={onTimeChange}
                value={timePickerData}
                hourStep={hourStep}
                minuteStep={minuteStep}
                secondStep={secondStep}
                type="single"
                format={timePickerFormat}
                disabledHours={() =>
                  typeof disabledHours === 'function' ? disabledHours(panelType) : disabledHours
                }
                disabledMinutes={(hour) =>
                  typeof disabledMinutes === 'function'
                    ? disabledMinutes(hour, panelType)
                    : disabledMinutes
                }
                disabledSeconds={(hour, minute) =>
                  typeof disabledSeconds === 'function'
                    ? disabledSeconds(hour, minute, panelType)
                    : disabledSeconds
                }
              />
            </div>
          </div>
        )}
      </div>
      {needFooter && (
        <Footer
          disabled={!outDate[0]}
          onConfirmButtonClick={() => {
            onPickProp(calRenderDates, false)
            onConfirm?.(calRenderDates[0].toDate())
          }}
        />
      )}
    </>
  )
}

export default Panel
