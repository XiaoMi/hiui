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
        <Slider vertical value={value} onChange={setValue} style={{ height: 300 }} />
        <br />
        <Counter value={value} onChange={setValue} step={10} min={0} max={100} />
      </div>
    </>
  )
}
