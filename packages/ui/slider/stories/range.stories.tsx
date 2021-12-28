import React from 'react'
import Slider from '../src'

export const Range = () => {
  const [value, setValue] = React.useState(0)
  return (
    <>
      <h1>Range</h1>
      <div className="slider-range__wrap">
        <div>
          <Slider
            style={{ width: 300 }}
            defaultValue={value}
            min={1}
            max={90}
            onChange={setValue}
            showRangeLabel
          />
        </div>
        <br />
        <br />
        <div>
          <Slider
            vertical
            style={{ height: 300 }}
            defaultValue={value}
            min={1}
            max={90}
            onChange={setValue}
            showRangeLabel
          />
        </div>
      </div>
    </>
  )
}
