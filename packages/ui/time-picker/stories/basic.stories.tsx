import React, { useState } from 'react'
import TimePicker from '../src'

/**
 * @title 基础用法
 * @desc 选择时间点，可与日期搭配使用，也可用于展示当天时间
 */
export const Basic = () => {
  const [basicValue, setBasicValue] = useState<string | string[]>(['12:00:00'])

  return (
    <>
      <h1>Basic</h1>
      <div className="time-picker-basic__wrap">
        <TimePicker
          placeholder={['请选择时间']}
          value={basicValue}
          onChange={(e) => {
            console.log('basic-default', e)
            setBasicValue(e)
          }}
        />
      </div>
    </>
  )
}
