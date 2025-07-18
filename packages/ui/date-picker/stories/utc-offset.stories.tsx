import React from 'react'
import DatePicker from '../src'

/**
 * @title 设置时区偏移
 * @desc UTC时间偏移量，单位为小时。例如：东八区传入 8，西五区传入 -5
 */
export const UTCOffset = () => {
  const [value, setValue] = React.useState<Date | Date[] | null>(new Date('2025-7-30 12:00:00'))

  return (
    <>
      <h1>设置时区偏移</h1>
      <div className="date-time__wrap">
        <h2>日期时间</h2>
        <DatePicker
          style={{ width: 240 }}
          value={value}
          showTime={true}
          utcOffset={1}
          format="YYYY-MM-DD HH:mm:ss"
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
            setValue(date)
          }}
        />

        <p>系统时间：{value?.toLocaleString()}</p>
        <p>UTC时间：{(value as Date)?.toUTCString()}</p>
      </div>
    </>
  )
}
