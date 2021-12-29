import React from 'react'
import Counter from '../src'

export const Size = () => {
  return (
    <>
      <h1>Counter size</h1>
      <div>
        <h2>outline</h2>
        <Counter size={'xs'} />
        <br />
        <br />
        <Counter size={'sm'} />
        <br />
        <br />
        <Counter />
        <br />
        <br />
        <Counter size={'lg'} />
      </div>
      <div>
        <h2>filled</h2>
        <Counter size={'xs'} appearance={'filled'} />
        <br />
        <br />
        <Counter size={'sm'} appearance={'filled'} />
        <br />
        <br />
        <Counter appearance={'filled'} />
        <br />
        <br />
        <Counter size={'lg'} appearance={'filled'} />
      </div>
    </>
  )
}
