import React from 'react'
import Counter from '../src'

export const Basic = () => {
  return (
    <>
      <h1>Counter</h1>
      <div className="counter-basic__wrap">
        <Counter autoFocus defaultValue={0} min={1} />
      </div>
    </>
  )
}
