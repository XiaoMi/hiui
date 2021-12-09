import React from 'react'
import DatePicker from '../src'

export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="date-picker-basic__wrap">
        <DatePicker
          type="timeperiod"
          timeInterval={30}
          // disabledHours={[2, 3, 4, 5, 6]}
          format="YYYY-MM-DD HH:mm:ss"
          // hourStep={2}
        />
      </div>
    </>
  )
}
