import React from 'react'
import Radio from '../src'
import Button from '@hi-ui/button'

export const Controlled = () => {
  const [checked, setChecked] = React.useState(false)

  return (
    <>
      <h1>Controlled</h1>
      <div className="radio-controlled__wrap">
        <Button onClick={() => setChecked((prev) => !prev)}>Toggle</Button>
        <br />
        <Radio
          checked={checked}
          onChange={(shouldChecked) => {
            console.log('onChange', shouldChecked)
            setChecked(shouldChecked)
          }}
        >
          Radio
        </Radio>
      </div>
    </>
  )
}
