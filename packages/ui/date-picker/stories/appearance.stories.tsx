import React from 'react'
import DatePicker from '../src'

export const Appearanece = () => {
  return (
    <>
      <h1>Appearance</h1>
      <div className="date-picker-appearance__wrap">
        <h2>Line</h2>
        <DatePicker
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
        />
        <h2>filled</h2>
        <DatePicker
          appearance={'filled'}
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
        />
        <h2>unset</h2>
        <DatePicker
          appearance={'unset'}
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
        />
        <DatePicker
          appearance={'unset'}
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
          type={'daterange'}
        />
      </div>
    </>
  )
}
