import React from 'react'
import Slider from '../src'
import { Counter } from '@hi-ui/counter'

/**
 * @title 受控
 */
export const Controlled = () => {
  const [value, setValue] = React.useState(0)
  return (
    <>
      <h1>Controlled</h1>
      <div className="slider-controlled__wrap">
        <Slider value={value} onChange={setValue} style={{ width: 300 }} />
        <br />
        <Counter value={value} onChange={setValue} step={10} min={0} max={100} />
      </div>
    </>
  )
}
