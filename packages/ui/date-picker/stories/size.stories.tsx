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
        <h2>xs</h2>
        <DatePicker
          style={{ width: 240 }}
          size={'xs'}
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
        />
        <h2>sm</h2>
        <DatePicker
          style={{ width: 240 }}
          size={'sm'}
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
        />
        <h2>md</h2>
        <DatePicker
          style={{ width: 240 }}
          size={'md'}
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
        />
        <h2>lg</h2>
        <DatePicker
          style={{ width: 240 }}
          size={'lg'}
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
        />
      </div>
    </>
  )
}
