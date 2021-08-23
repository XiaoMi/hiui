import React from 'react'
import Popper from '../src'
import Button from '@hi-ui/button'

export const DisabledPortal = () => {
  const [btnRef, setBtnRef] = React.useState(null)
  const [visible, setVisible] = React.useState(false)

  return (
    <>
      <h1>DisabledPortal</h1>
      <div className="popper-disabled-portal__wrap">
        <Button ref={setBtnRef} onClick={() => setVisible(true)}>
          Open
        </Button>
        <Popper
          visible={visible}
          attachEl={btnRef}
          disabledPortal
          onClose={() => setVisible(false)}
        >
          The content of the Popper.
        </Popper>
      </div>
    </>
  )
}
