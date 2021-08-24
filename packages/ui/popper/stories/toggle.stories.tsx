import React from 'react'
import Popper from '../src'
import Button from '@hi-ui/button'
import { useToggle } from '@hi-ui/use-toggle'

export const Toggle = () => {
  const [btnRef, setBtnRef] = React.useState(null)
  const [visible, visibleAction] = useToggle(true)

  return (
    <>
      <h1>Toggle</h1>
      <div className="popper-toggle__wrap">
        <Button ref={setBtnRef} onClick={() => visibleAction.not()}>
          Toggle
        </Button>
        <Popper visible={visible} attachEl={btnRef} onClose={() => visibleAction.off()}>
          The content of the Popper.
        </Popper>
      </div>
    </>
  )
}
