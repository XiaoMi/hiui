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
        <h2>Line 线性</h2>
        <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
          <Counter appearance={'line'} />
          <Counter appearance={'line'} max={2} min={0} defaultValue={5} />
        </div>

        <h2>Filled 面性</h2>
        <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
          <Counter appearance={'filled'} />
          <Counter appearance={'filled'} max={2} min={0} defaultValue={5} />
        </div>
      </div>
    </>
  )
}
