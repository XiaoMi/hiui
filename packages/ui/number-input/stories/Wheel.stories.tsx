import React from 'react'
import NumberInput from '../src'

/**
 * @title 滚轮滑动
 */
export const Wheel = () => {
  return (
    <>
      <h1>Wheel</h1>
      <div className="NumberInput-wheel__wrap">
        <NumberInput
          step={10}
          changeOnWheel
          defaultValue={0}
          min={1}
          onChange={(v) => console.log('onChange', v)}
        />
      </div>
    </>
  )
}
