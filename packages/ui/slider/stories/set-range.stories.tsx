import React from 'react'
import Slider from '../src'

/**
 * @title 设置范围
 */
export const SetRange = () => {
  const [value, setValue] = React.useState(0)
  return (
    <>
      <h1>SetRange</h1>
      <div className="slider-set-range__wrap">
        <Slider
          style={{ width: 300 }}
          defaultValue={value}
          min={1}
          max={90}
          onChange={(value) => {
            console.log(value)
            setValue(value as number)
          }}
          showRangeLabel
        />
      </div>
    </>
  )
}
