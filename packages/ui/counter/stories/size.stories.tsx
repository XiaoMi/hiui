import React from 'react'
import Counter from '../src'

export const Size = () => {
  return (
    <>
      <h1>Counter size</h1>
      <div>
        <h2>outline</h2>
        <br />
        <br />
        <Counter size={'sm'} />
        <br />
        <br />
        <Counter size="md" />
        <br />
        <br />
        <Counter size={'lg'} />
      </div>
      <div>
        <h2>filled</h2>
        <br />
        <br />
        <Counter size={'sm'} appearance={'filled'} />
        <br />
        <br />
        <Counter size="md" appearance={'filled'} />
        <br />
        <br />
        <Counter size={'lg'} appearance={'filled'} />
      </div>
    </>
  )
}
