import React from 'react'
import Counter from '../src'

export const Appearance = () => {
  return (
    <>
      <h1>Counter</h1>
      <div>
        <h2>outline</h2>
        <Counter appearance={'line'} />
        <br />
        <br />
        <Counter appearance={'line'} max={2} min={0} defaultValue={5} />
      </div>
      <div>
        <h2>filled</h2>
        <Counter appearance={'filled'} />
        <br />
        <br />
        <Counter appearance={'filled'} max={2} min={0} defaultValue={5} />
      </div>
    </>
  )
}
