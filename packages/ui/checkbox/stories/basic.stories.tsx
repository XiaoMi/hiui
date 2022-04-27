import React from 'react'
import Checkbox from '../src'

/**
 * @title 基础用法
 * @desc 展示所有备选项，数量不宜超出10个
 */
export const Basic = () => {
  return (
    <>
      <h1>Checkbox</h1>
      <div className="checkbox-basic__wrap">
        <Checkbox>复选框</Checkbox>
      </div>
    </>
  )
}
