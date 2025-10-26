import React from 'react'
import Slider from '../src'
import { Counter } from '@hi-ui/counter'

/**
 * @title 垂直用法
 */
export const Vertical = () => {
  const [value, setValue] = React.useState(0)
  return (
    <>
      <h1>Vertical</h1>
      <div className="slider-Vertical__wrap">
        <Slider
          vertical
          value={value}
          onChange={(v) => setValue(v as number)}
          style={{ height: 300 }}
        />
        <br />
        <Counter
          value={value}
          onChange={(v) => setValue(v as number)}
          step={10}
          min={0}
          max={100}
        />
      </div>
    </>
  )
}
