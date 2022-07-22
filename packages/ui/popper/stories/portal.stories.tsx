import React from 'react'
import Popper from '../src'
import Button from '@hi-ui/button'

/**
 * @title 跟随当前文档流
 */
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
        <Popper
          visible={visible}
          disabledPortal
          attachEl={btnRef}
          onClose={() => setVisible(false)}
        >
          The content of the Popper.
        </Popper>
      </div>
    </>
  )
}
