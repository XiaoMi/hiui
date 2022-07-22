import React from 'react'
import Slider from '../src'

/**
 * @title 基础用法
 * @desc 滑动输入连续或离散数据的单点值或范围值
 */
export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="slider-basic__wrap">
        <Slider
          style={{ width: 300 }}
          onChange={(value) => {
            console.log(value)
          }}
        ></Slider>
      </div>
    </>
  )
}
