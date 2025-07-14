import React, { useState } from 'react'
import TimePicker from '../src'

/**
 * @title 输入框只读
 */
export const InputReadonly = () => {
  const [inputReadonlyValue, setInputReadonlyValue] = useState<string | string[]>(['11:11:11'])

  return (
    <>
      <h1>Input Readonly</h1>
      <div className="time-picker-input-readonly__wrap">
        <TimePicker
          style={{ width: '240px' }}
          placeholder={['请选择时间']}
          value={inputReadonlyValue}
          onChange={(e) => {
            console.log('input-readonly', e)
            setInputReadonlyValue(e)
          }}
          inputReadonly
        />
      </div>
    </>
  )
}
