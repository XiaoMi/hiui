import React from 'react'
import Rating from '../src'

/**
 * @title 基础用法
 * @desc 评定业务指标、信用等级、满意度等
 */
export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="rating-basic__wrap">
        <Rating defaultValue={3} />
      </div>
    </>
  )
}
