import React from 'react'
import Counter from '../src'

/**
 * @title 基础用法
 */
export const Basic = () => {
  return (
    <>
      <h1>Counter</h1>
      <div className="counter-basic__wrap">
        <Counter defaultValue={0} onChange={(v) => console.log('onChange', v)} />
      </div>
    </>
  )
}
