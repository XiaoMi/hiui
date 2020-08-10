import React, { useState, useEffect } from 'react'
import { getPRCDate, deconstructDate } from '../utils'

const useAltData = ({ altCalendarPreset, altCalendar, dateMarkPreset, dateMarkRender }) => {
  const [altCalendarPresetData, setAltCalendarPresetData] = useState({})
  const [dateMarkPresetData, setDateMarkPresetData] = useState({})

  // 获取预置数据
  const getLunarPresetData = () => {
    console.log('获取预置农历数据')
    const allPRCDate = {}
    if (['zh-CN', 'id-ID'].includes(altCalendarPreset)) {
      const _urlKey = altCalendarPreset === 'zh-CN' ? 'PRCLunar' : 'IndiaHoliday'
      getPRCDate(_urlKey).then(res => {
        Object.keys(res.data).forEach(key => {
          let oneYear = {}
          res.data[key][_urlKey].forEach(item => {
            Object.assign(oneYear, {
              [item.date.replace(/-/g, '/')]: {
                ...item,
                highlight: altCalendarPreset === 'id-ID'
              }
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
      getPRCDate('PRCHoliday').then(res => {
        const allPRCDate = {}
        Object.keys(res.data).forEach(key => {
          Object.keys(res.data[key].PRCHoliday).forEach(elkey => {
            allPRCDate[elkey.replace(/-/g, '/')] = res.data[key].PRCHoliday[elkey] === '1'
              ? <span className='hi-datepicker__mark hi-datepicker__mark--rest'>休</span>
              : <span className='hi-datepicker__mark hi-datepicker__mark--work'>班</span>
          })
        })
        setDateMarkPresetData(allPRCDate)
      })
    }
  }
  // 合并用户自定义的日期信息作为presetData
  const getAltCalendarData = (allPRCDate) => {
    const allData = {}
    altCalendar.length > 0 && altCalendar.forEach(item => {
      const dateInfo = deconstructDate(item.date)
      if (!Number.isNaN(dateInfo.year)) {
        Object.assign(allData, {
          [dateInfo.year + '/' + dateInfo.month + '/' + dateInfo.day]: item
        })
      }
    })
    return Object.assign(allPRCDate, allData)
  }

  useEffect(() => {
    altCalendarPreset && getLunarPresetData()
    dateMarkPreset && getMarkPresetData()
  }, [])
  return [altCalendarPresetData, dateMarkPresetData]
}

export default useAltData
