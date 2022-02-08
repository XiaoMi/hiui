import React from 'react'
import Slider from '../src'

export const Mark = () => {
  const [marks] = React.useState({
    0: '0°C',
    27: '27°C',
    45: '45°C',
    100: '100°C',
  })
  return (
    <>
      <h1>Mark</h1>
      <div className="slider-mark__wrap">
        <div>
          <Slider
            style={{ width: 300 }}
            marks={marks}
            step={9}
            onChange={(value) => {
              console.log(value)
            }}
          ></Slider>
        </div>
        <br />
        <br />
        <div>
          <Slider
            vertical
            style={{ height: 300 }}
            marks={marks}
            step={9}
            onChange={(value) => {
              console.log(value)
            }}
          ></Slider>
        </div>
      </div>
    </>
  )
}
