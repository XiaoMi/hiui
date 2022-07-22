import React from 'react'
import { Radio } from '../src'

/**
 * @title 基础用法
 * @desc 展示所有备选项，数量不宜超出10个
 */
export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="radio-basic__wrap">
        <Radio onChange={console.log}>Radio</Radio>
      </div>
    </>
  )
}
