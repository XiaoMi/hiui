import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import DPContext, { DPContextData } from '../context'
import Panel from './panel'
import { CalenderSelectedRange } from '../hooks/useCalenderData'
import moment from 'moment'
import { CalendarView } from '../types'

interface DateRangeTimePanelProps {
  nowIndex: number
}

// 选择日期范围，并且希望选择时间
export const DateRangeTimePanel = (props: DateRangeTimePanelProps) => {
  const { outDate, onPick, disabledDate } = useContext(DPContext)
  const { nowIndex } = props

  const [range, setRange] = useState<CalenderSelectedRange>({
    start: null,
    end: null,
    selecting: false,
  })

  useEffect(() => {
    setRange({
      start: outDate[0] && outDate[0].clone(),
      end: outDate[1] && outDate[1].clone(),
    })
  }, [outDate])

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
    (date: Date, disposeView: CalendarView) => {
      if (disabledDate(date, disposeView)) {
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

  return (
    <React.Fragment>
      <Panel
        onPick={panelOnPick}
        disabledDate={panelDisabledDate}
        outDate={panelData}
        range={range}
      />
      <div></div>
    </React.Fragment>
  )
}
