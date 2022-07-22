import React from 'react'
import Checkbox from '../src'
import Button from '@hi-ui/button'

/**
 * @title 受控
 */
export const Controlled = () => {
  const [checked, setChecked] = React.useState(false)

  return (
    <>
      <h1>Controlled</h1>
      <div className="checkbox-controlled__wrap">
        <Button onClick={() => setChecked((prev) => !prev)}>Toggle</Button>
        <br />
        <Checkbox
          checked={checked}
          onChange={(evt) => {
            console.log('onChange', evt.target.checked)
            setChecked(evt.target.checked)
          }}
        >
          Checkbox
        </Checkbox>
      </div>
    </>
  )
}
