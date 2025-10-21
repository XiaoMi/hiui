import React from 'react'
import Slider from '../src'

/**
 * @title 范围选择
 */
export const Range = () => {
  return (
    <>
      <h1>Range</h1>
      <div className="slider-range__wrap">
        <Slider
          style={{ width: 300 }}
          range
          defaultValue={[20, 80]}
          onChange={(value) => {
            console.log(value)
          }}
        ></Slider>
      </div>
    </>
  )
}
