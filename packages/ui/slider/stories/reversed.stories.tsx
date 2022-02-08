import React from 'react'
import Slider from '../src'

export const Reversed = () => {
  return (
    <>
      <h1>Reversed</h1>
      <div className="slider-reversed__wrap">
        <Slider
          reversed
          style={{ width: 300 }}
          onChange={(value) => {
            console.log(value)
          }}
        ></Slider>
      </div>
    </>
  )
}
