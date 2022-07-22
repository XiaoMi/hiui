import React from 'react'
import Slider from '../src'

/**
 * @title 自定义提示
 * @desc 可自定义提示内容的格式
 */
export const TipFormatter = () => {
  return (
    <>
      <h1>TipFormatter</h1>
      <div className="slider-tip-formatter__wrap">
        <Slider
          style={{ width: 300 }}
          onChange={(value) => {
            console.log(value)
          }}
          tipFormatter={(value) => {
            console.log(value)
            return value + '英寸'
          }}
        ></Slider>
      </div>
    </>
  )
}
