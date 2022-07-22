import React from 'react'
import Counter from '../src'

/**
 * @title 自定义步长
 */
export const Step = () => {
  return (
    <>
      <h1>Step</h1>
      <div className="counter-step__wrap">
        <Counter step={0.1} defaultValue={0} min={1} onChange={(v) => console.log('onChange', v)} />
      </div>
    </>
  )
}
