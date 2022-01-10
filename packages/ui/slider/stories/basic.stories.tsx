import React from 'react'
import Slider from '../src'

export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="slider-basic__wrap">
        <Slider
          style={{ width: 300 }}
          reversed
          onChange={(value) => {
            console.log(value)
          }}
        ></Slider>
      </div>
    </>
  )
}
