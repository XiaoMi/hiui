import React, { useState } from 'react'
import TimePicker from '../src'

/**
 * @title 时间范围
 * @desc 选择时间范围，可与日期搭配使用，也可用于展示当天时间范围
 */
export const Range = () => {
  const [rangeValue, setRangeValue] = useState<string | string[]>(['11:11:11', '12:00:00'])

  return (
    <>
      <h1>Range</h1>
      <div className="time-picker-range__wrap">
        <TimePicker
          value={rangeValue}
          placeholder={['请选择开始时间', '请选择结束时间']}
          onChange={(value) => {
            console.log('range-value', value)
            setRangeValue(value)
          }}
          type="range"
        />
      </div>
    </>
  )
}
