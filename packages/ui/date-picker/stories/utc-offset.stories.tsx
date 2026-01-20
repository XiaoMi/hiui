import React from 'react'
import DatePicker from '../src'
import moment from 'moment'

/**
 * @title 设置时区偏移
 * @desc UTC时间偏移量，单位为小时。例如：东八区传入 8，西五区传入 -5
 */
export const UTCOffset = () => {
  const [value, setValue] = React.useState<Date | Date[] | null>(new Date())
  const [utcOffset] = React.useState<number>(1)

  return (
    <>
      <h1>设置时区偏移</h1>
      <div className="date-time__wrap">
        <h2>日期时间</h2>
        <DatePicker
          style={{ width: 240 }}
          value={value}
          showTime={true}
          utcOffset={utcOffset}
          format="YYYY-MM-DD HH:mm:ss"
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
            setValue(date)
          }}
          // 禁用小于今天的时间
          disabledDate={(current, view) => {
            // 获取当前系统时区
            const systemTimezone = moment().utcOffset()
            // 获取 UTC 时间
            const utcTime = moment().startOf('day').add(-systemTimezone, 'minutes').clone()
            // 获取对应时区的时间
            const offsetUtcToday = utcTime.add(utcOffset, 'hours').clone()
            const isDisabled = current < offsetUtcToday.toDate()
            // console.log(isDisabled, current, offsetUtcToday.toDate())

            return isDisabled
          }}
        />

        <p>系统时间：{value?.toLocaleString()}</p>
        <p>UTC时间：{(value as Date)?.toUTCString()}</p>
      </div>
    </>
  )
}
