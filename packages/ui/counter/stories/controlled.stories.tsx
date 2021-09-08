import React from 'react'
import Counter from '../src'
import Button from '@hi-ui/button'

export const Controlled = () => {
  const [current, setCurrent] = React.useState(1)
  return (
    <>
      <h1>Controlled</h1>
      <div className="counter-controlled__wrap">
        <Counter
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
