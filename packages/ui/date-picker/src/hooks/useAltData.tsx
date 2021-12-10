import React, { useState, useEffect } from 'react'
import { getPRCDate, deconstructDate } from '../utils'
import { CalendarItem, DataPickerAltCalendarPreset } from '../types'

const useAltData = (config: {
  altCalendarPreset?: DataPickerAltCalendarPreset
  altCalendar?: CalendarItem[]
  dateMarkPreset?: string
  showPanel: boolean
  prefixCls: string
}) => {
  const { altCalendarPreset = '', altCalendar = [], dateMarkPreset, showPanel, prefixCls } = config
  const [altCalendarPresetData, setAltCalendarPresetData] = useState({})
  const [dateMarkPresetData, setDateMarkPresetData] = useState({})

  // 获取预置数据
  const getLunarPresetData = () => {
    const allPRCDate = {}
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
          Object.assign(allPRCDate, oneYear)
        })
        setAltCalendarPresetData(altCalendar ? getAltCalendarData(allPRCDate) : allPRCDate)
      })
    } else {
      setAltCalendarPresetData(altCalendar ? getAltCalendarData(allPRCDate) : {})
    }
  }
  // 获取预置数据
  const getMarkPresetData = () => {
    if (altCalendarPreset && altCalendarPreset !== 'zh-CN') {
      return
    }
    if (dateMarkPreset === 'zh-CN') {
      getPRCDate('PRCHoliday')?.then((res) => {
        const allPRCDate = {} as any
        Object.keys(res.data).forEach((key) => {
          Object.keys(res.data[key].PRCHoliday).forEach((elkey) => {
            allPRCDate[elkey.replace(/-/g, '/')] =
              res.data[key].PRCHoliday[elkey] === '1' ? (
                <span className={`${prefixCls}__mark ${prefixCls}__mark--rest`}>休</span>
              ) : (
                <span className={`${prefixCls}__mark ${prefixCls}__mark--work`}>班</span>
              )
          })
        })
        setDateMarkPresetData(allPRCDate)
      })
    }
  }
  // 合并用户自定义的日期信息作为presetData
  const getAltCalendarData = (allPRCDate: any) => {
    const allData = {}
    altCalendar.length > 0 &&
      altCalendar.forEach((item) => {
        const dateInfo = deconstructDate(item.date)
        if (!Number.isNaN(dateInfo.year)) {
          Object.assign(allData, {
            [dateInfo.year + '/' + dateInfo.month + '/' + dateInfo.date]: item,
          })
        }
      })
    return Object.assign(allPRCDate, allData)
  }

  useEffect(() => {
    if (showPanel) {
      altCalendarPreset && getLunarPresetData()
      dateMarkPreset && getMarkPresetData()
    }
  }, [showPanel])
  return [altCalendarPresetData, dateMarkPresetData]
}

export default useAltData
