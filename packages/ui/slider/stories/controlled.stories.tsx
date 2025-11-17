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
        <Slider value={value} onChange={(v) => setValue(v as number)} style={{ width: 300 }} />
        <Counter
          style={{ marginTop: 16 }}
          value={value as number}
          onChange={(v) => setValue(v as number)}
          step={10}
          min={0}
          max={100}
        />
      </div>
    </>
  )
}
