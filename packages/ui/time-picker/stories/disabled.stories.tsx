import React from 'react'
import TimePicker from '../src'

/**
 * @title 禁用状态
 */
export const Disabled = () => {
  return (
    <>
      <h1>Disabled</h1>
      <div className="time-picker-disabled__wrap">
        <TimePicker style={{ width: '240px' }} disabled placeholder={['请选择时间']} />
      </div>
    </>
  )
}
