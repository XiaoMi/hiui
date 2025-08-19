import React from 'react'
import DatePicker from '../src'

/**
 * @title 不同UI风格
 * @desc UI风格包括线性、面性两种
 */
export const Appearance = () => {
  return (
    <>
      <h1>Appearance</h1>
      <div className="date-picker-appearance__wrap">
        <h2>Line</h2>
        <DatePicker
          style={{ width: 240 }}
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
        />
        <h2>filled</h2>
        <DatePicker
          style={{ width: 240 }}
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
        <h2>borderless</h2>
        <DatePicker
          style={{ width: 240 }}
          appearance={'borderless'}
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
        />
        <h2>contained</h2>
        <DatePicker
          style={{ width: 'auto' }}
          appearance="contained"
          label="日期"
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
        />
        <br />
        <br />
        <DatePicker
          appearance="contained"
          label="日期范围"
          type="daterange"
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
        />
      </div>
    </>
  )
}
