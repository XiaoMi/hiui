import React from 'react'
import TimePicker from '../src'

/**
 * @title 不同UI风格
 * @desc UI风格包括线性、面性、无UI三种
 */
export const Appearance = () => {
  return (
    <>
      <h1>Appearance</h1>
      <div className="time-picker-appearance__wrap">
        <h2>line</h2>
        <TimePicker style={{ width: '240px' }} placeholder={['请选择时间']} appearance={'line'} />
        <h2>filled</h2>
        <TimePicker style={{ width: '240px' }} placeholder={['请选择时间']} appearance={'filled'} />
        <h2>unset</h2>
        <TimePicker placeholder={['请选择时间']} appearance={'unset'} />
        <h2>borderless</h2>
        <TimePicker style={{ width: 240 }} placeholder={['请选择时间']} appearance={'borderless'} />
        <h2>contained</h2>
        <TimePicker label="时间" appearance={'contained'} onChange={console.log} />
      </div>
    </>
  )
}
