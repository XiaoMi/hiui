import React from 'react'
import Counter from '../src'

export const Basic = () => {
  return (
    <>
      <h1>Counter</h1>
      <div className="counter-basic__wrap">
        <Counter value={0} min={1} appearance={'filled'} />
        <br />
        <br />
        <Counter
          autoFocus
          focusOnStep={false}
          defaultValue={0}
          min={1}
          appearance={'filled'}
          onChange={(v) => console.log('onChange', v)}
        />
      </div>
    </>
  )
}
