import React from 'react'
import Counter from '../src'

export const Basic = () => {
  return (
    <>
      <h1>Counter</h1>
      <div className="counter-basic__wrap">
        <Counter value={0} min={1} />
        <br />
        <br />
        <Counter autoFocus defaultValue={0} min={1} onChange={(v) => console.log('onChange', v)} />
      </div>
    </>
  )
}
