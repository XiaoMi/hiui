import React from 'react'
import { NumberInput } from '../src'

/**
 * @title 数字输入框
 * @desc 用于输入数字的输入框
 */
export const Input = () => {
  return (
    <>
      <h1>NumberInput</h1>
      <div className="counter-number-input__wrap">
        <NumberInput defaultValue={2} min={1} />
        <br />
        <br />
        <NumberInput autoFocus defaultValue={0} onChange={(v) => console.log('onChange', v)} />
      </div>
    </>
  )
}
