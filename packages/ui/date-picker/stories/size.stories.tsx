import React from 'react'
import DatePicker from '../src'

/**
 * @title 不同尺寸
 */
export const Size = () => {
  return (
    <>
      <h1>Size</h1>
      <div className="date-picker-size__wrap">
        <h2>sm</h2>
        <DatePicker
          size={'sm'}
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
        />
        <h2>md</h2>
        <DatePicker
          size={'md'}
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
        />
        <h2>lg</h2>
        <DatePicker
          size={'lg'}
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
        />
      </div>
    </>
  )
}
