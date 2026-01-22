import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import DPContext, { DPContextData } from '../context'
import Panel from './panel'
import { CalenderSelectedRange } from '../hooks/useCalenderData'
import moment from 'moment'
import { CalendarViewEnum } from '../types'
import { Footer } from './footer'
import { parseValue } from '../utils'

interface DateRangeTimePanelProps {
  nowIndex: number
  onChangeNowIndex: (targetIndex: number) => void
}

// 选择日期范围，并且希望选择时间
export const DateRangeTimePanel = (props: DateRangeTimePanelProps) => {
  const {
    outDate,
    onPick,
    disabledDate,
    defaultPickerValue,
    type,
    weekOffset,
    realFormat,
    utcOffset,
  } = useContext(DPContext)
  const { nowIndex, onChangeNowIndex } = props

  const [range, setRange] = useState<CalenderSelectedRange>({
    start: null,
    end: null,
    selecting: false,
  })

  useEffect(() => {
    // 当 outDate 为空时，优先使用 defaultPickerValue 来设置初始显示日期
    if (!outDate[0] && !outDate[1] && defaultPickerValue) {
      const parsedDefaultPickerValue = parseValue(
        defaultPickerValue,
        type,
        weekOffset,
        realFormat,
        undefined,
        utcOffset
      )
      setRange({
        start: parsedDefaultPickerValue[0] && parsedDefaultPickerValue[0].clone(),
        end: parsedDefaultPickerValue[1] && parsedDefaultPickerValue[1].clone(),
        selecting: false,
      })
    } else {
      setRange({
        start: outDate[0] && outDate[0].clone(),
        end: outDate[1] && outDate[1].clone(),
        selecting: false,
      })
    }
  }, [outDate, defaultPickerValue, type, weekOffset, realFormat, utcOffset])

  const panelData = useMemo(() => (nowIndex === 0 ? [range.start] : [range.end]), [range, nowIndex])

  const panelOnPick = useCallback<DPContextData['onPick']>(
    (date, isShowPanel) => {
      const newRange = { ...range }
      if (nowIndex === 0) {
        newRange.start = date[0]
      } else {
        newRange.end = date[0]
      }

      // 此处不允许关闭panel
      onPick([newRange.start, newRange.end], true)
      setRange(newRange)
    },
    [range, nowIndex, onPick]
  )

  const panelDisabledDate = useCallback(
    (date: Date, disposeView: CalendarViewEnum) => {
      if (disabledDate(date, disposeView, nowIndex)) {
        return true
      } else {
        // 当正在操作开始，并且结束存在时，限制开始范围
        if (nowIndex === 0 && range.end) {
          return moment(date).isAfter(range.end, disposeView)
        }

        if (nowIndex === 1 && range.start) {
          return moment(date).isBefore(range.start, disposeView)
        }

        return false
      }
    },
    [range, disabledDate, nowIndex]
  )

  const onConfirmButtonClick = useCallback(() => {
    if (range.start && !range.end) {
      onChangeNowIndex(1)
    } else if (!range.start && range.end) {
      onChangeNowIndex(0)
    } else if (range.start && range.end) {
      const newRange = { ...range }
      // 保持前后关系一致
      if (range.start.isAfter(range.end)) {
        const temp = newRange.start
        newRange.start = newRange.end
        newRange.end = temp
        setRange(newRange)
      }
      onPick(
        [newRange.start && newRange.start.clone(), newRange.end && newRange.end.clone()],
        false
      )
    }
  }, [range, onPick, onChangeNowIndex])

  const isConfirmButtonDisabled = useMemo(() => {
    return nowIndex === 0 ? !range.start : !range.end
  }, [nowIndex, range])

  return (
    <React.Fragment>
      <Panel
        onPick={panelOnPick}
        disabledDate={panelDisabledDate}
        outDate={panelData}
        range={range}
        panelIndex={nowIndex}
      />
      <Footer disabled={isConfirmButtonDisabled} onConfirmButtonClick={onConfirmButtonClick} />
    </React.Fragment>
  )
}
