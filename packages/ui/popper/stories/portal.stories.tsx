import React from 'react'
import { PopperPortal } from '../src'
import Button from '@hi-ui/button'

export const Portal = () => {
  const [btnRef, setBtnRef] = React.useState(null)
  const [visible, setVisible] = React.useState(false)

  return (
    <>
      <h1>Portal</h1>
      <div className="popper-portal__wrap">
        <Button ref={setBtnRef} onClick={() => setVisible(true)}>
          Open
        </Button>
        <PopperPortal visible={visible} attachEl={btnRef} onClose={() => setVisible(false)}>
          The content of the Popper.
        </PopperPortal>
      </div>
    </>
  )
}
