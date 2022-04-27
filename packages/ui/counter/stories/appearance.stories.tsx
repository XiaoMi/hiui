import React from 'react'
import Counter from '../src'

/**
 * @title 不同UI风格
 * @desc UI风格包括线性、面性两种
 */
export const Appearance = () => {
  return (
    <>
      <h1>Appearance</h1>
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
