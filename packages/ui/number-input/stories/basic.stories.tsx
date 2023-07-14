import React from 'react'
import NumberInput from '../src'

/**
 * @title 基础用法
 * @desc 用于输入数字的输入框
 */
export const Basic = () => {
  return (
    <>
      <h1>NumberInput</h1>
      <div className="NumberInput-basic__wrap">
        <NumberInput
          autoFocus
          defaultValue={5}
          min={1}
          placeholder="请输入数字"
          onChange={(v) => console.log('onChange', v)}
        />
      </div>
    </>
  )
}
