import React from 'react'
import NumberInput from '../src'
import Button from '@hi-ui/button'

/**
 * @title 受控
 */
export const Controlled = () => {
  const [current, setCurrent] = React.useState(1)
  return (
    <>
      <h1>Controlled</h1>
      <div className="NumberInput-controlled__wrap">
        <NumberInput
          value={current}
          min={1}
          onChange={(v) => {
            console.log('onChange', v)
            setCurrent(v)
          }}
        />

        <br />
        <br />
        <Button onClick={() => setCurrent(5)}>更新为 5</Button>
      </div>
    </>
  )
}
