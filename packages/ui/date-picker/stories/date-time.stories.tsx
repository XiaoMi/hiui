import React, { useState } from 'react'
import DatePicker from '../src'

export const DateTime = () => {
  return (
    <>
      <h1>日期时间</h1>
      <div className="date-time__wrap">
        <DatePicker
          defaultValue={new Date()}
          showTime={true}
          disabledHours={[2, 3, 4, 5, 6]}
          format="YYYY-MM-DD HH:mm:ss"
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
        />
      </div>
    </>
  )
}
