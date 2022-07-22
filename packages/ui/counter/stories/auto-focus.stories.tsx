import React from 'react'
import Counter from '../src'

/**
 * @title 自动聚焦
 */
export const AutoFocus = () => {
  return (
    <>
      <h1>AutoFocus</h1>
      <div className="counter-auto-focus__wrap">
        <Counter autoFocus defaultValue={1} min={1} onChange={(v) => console.log('onChange', v)} />
      </div>
    </>
  )
}
