import React, { useState, useEffect, useCallback } from 'react'
import { getPRCDate, deconstructDate } from '../utils'
import {
  CalendarItem,
  DatePickerAltCalendarPreset,
  CalendarAltCalendarPreset,
  CalendarMarkPreset,
} from '../types'

const useAltData = (config: {
  altCalendarPreset?: DatePickerAltCalendarPreset
  altCalendar?: CalendarItem[]
  dateMarkPreset?: string
  showPanel: boolean
  prefixCls: string
}) => {
  const { altCalendarPreset = '', altCalendar = [], dateMarkPreset, showPanel, prefixCls } = config
  // 历法信息数据
  const [altCalendarPresetData, setAltCalendarPresetData] = useState(
    {} as CalendarAltCalendarPreset
  )
  // 日历标记信息，比如中国的 休/班
  const [dateMarkPresetData, setDateMarkPresetData] = useState({} as CalendarMarkPreset)

  // 合并用户自定义的日期信息作为presetData
  const getAltCalendarData = useCallback(
    (allPRCDate: CalendarAltCalendarPreset, altCalendar: CalendarItem[]) => {
      const result = {} as CalendarAltCalendarPreset
      altCalendar.length > 0 &&
        altCalendar.forEach((item) => {
          // 结构用户传入的 Date|string 类型
          const dateInfo = deconstructDate(item.date)
          if (!Number.isNaN(dateInfo.year)) {
            // 格式化转换拼接作为 key
            Object.assign(result, {
              [dateInfo.year + '/' + dateInfo.month + '/' + dateInfo.date]: item,
            })
          }
        })
      // 用户自定义优先级较高
      return Object.assign(allPRCDate, result)
    },
    []
  )

  // 获取预置数据
  const getLunarPresetData = useCallback(() => {
    // 所有历法节日信息
    const result = {} as CalendarAltCalendarPreset
    if (['zh-CN', 'id-ID'].includes(altCalendarPreset)) {
      const _urlKey = altCalendarPreset === 'zh-CN' ? 'PRCLunar' : 'IndiaHoliday'
      getPRCDate(_urlKey)?.then((res) => {
        Object.keys(res.data).forEach((key) => {
          const oneYear = {}
          res.data[key][_urlKey].forEach((item: any) => {
            Object.assign(oneYear, {
              [item.date.replace(/-/g, '/')]: {
                ...item,
                highlight: altCalendarPreset === 'id-ID',
              },
            })
          })
          Object.assign(result, oneYear)
        })
        setAltCalendarPresetData(
          // 如果存在用户自定义，则合并
          altCalendar ? getAltCalendarData(result, altCalendar) : result
        )
      })
    } else {
      setAltCalendarPresetData(altCalendar ? getAltCalendarData(result, altCalendar) : {})
    }
  }, [altCalendar, altCalendarPreset, getAltCalendarData])

  // 获取预置标签数据（顶部 休/班）
  const getMarkPresetData = useCallback(() => {
    // 只有中国才有预置标签数据
    if (altCalendarPreset && altCalendarPreset !== 'zh-CN') {
      return
    }
    if (dateMarkPreset === 'zh-CN') {
      // 获取中国节假日排班信息
      getPRCDate('PRCHoliday')?.then((res) => {
        const result = {} as CalendarMarkPreset
        Object.keys(res.data).forEach((key) => {
          Object.keys(res.data[key].PRCHoliday).forEach((elkey) => {
            // 格式化日期 YYYY-MM-DD -> YYYY/MM/DD
            result[elkey.replace(/-/g, '/')] =
              res.data[key].PRCHoliday[elkey] === '1' ? (
                <span className={`${prefixCls}__mark ${prefixCls}__mark--rest`}>休</span>
              ) : (
                <span className={`${prefixCls}__mark ${prefixCls}__mark--work`}>班</span>
              )
          })
        })

        setDateMarkPresetData(result)
      })
    }
  }, [altCalendarPreset, dateMarkPreset, prefixCls])

  useEffect(
    () => {
      if (showPanel) {
        altCalendarPreset && getLunarPresetData()
        dateMarkPreset && getMarkPresetData()
      }
    },
    // 此处不要把其他 altCalendarPreset dateMarkPreset 等作为依赖添加，会引起重复渲染
    // 只需要在打开panel的时候执行一次即可
    // 疑问：此处 getLunarPresetData getMarkPresetData等函数是否是最新的？
    [showPanel]
  )

  return [altCalendarPresetData, dateMarkPresetData]
}

export default useAltData
