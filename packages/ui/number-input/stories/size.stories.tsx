import React from 'react'
import NumberInput from '../src'

/**
 * @title 不同尺寸
 */
export const Size = () => {
  return (
    <>
      <h1>NumberInput size</h1>
      <div>
        <h2>outline</h2>
        <br />
        <br />
        <NumberInput size={'sm'} />
        <br />
        <br />
        <NumberInput size="md" />
        <br />
        <br />
        <NumberInput size={'lg'} />
      </div>
      <div>
        <h2>filled</h2>
        <br />
        <br />
        <NumberInput size={'sm'} appearance={'filled'} />
        <br />
        <br />
        <NumberInput size="md" appearance={'filled'} />
        <br />
        <br />
        <NumberInput size={'lg'} appearance={'filled'} />
      </div>
    </>
  )
}
