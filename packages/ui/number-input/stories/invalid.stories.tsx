import React from 'react'
import { NumberInput } from '../src'

/**
 * @title 无效态
 * @desc 输入无效或异常时可激活此态
 */
export const Invalid = () => {
  return (
    <>
      <h1>NumberInput</h1>
      <div className="NumberInput-invalid__wrap">
        <NumberInput invalid appearance={'line'} defaultValue={5} />
        <br />
        <br />
        <NumberInput invalid appearance={'filled'} defaultValue={5} />
      </div>
    </>
  )
}
