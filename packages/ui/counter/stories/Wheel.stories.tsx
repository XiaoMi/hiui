import React from 'react'
import Counter from '../src'

export const Wheel = () => {
  return (
    <>
      <h1>Wheel</h1>
      <div className="counter-wheel__wrap">
        <Counter
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
