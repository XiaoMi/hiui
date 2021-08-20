import React from 'react'
import Popper from '../src'
import Button from '@hi-ui/button'

export const Basic = () => {
  const [btnRef, setBtnRef] = React.useState(null)
  const [visible, setVisible] = React.useState(false)

  return (
    <>
      <h1>Basic</h1>
      <div className="popper-basic__wrap">
        <Button ref={setBtnRef} onClick={() => setVisible(true)}>
          Open
        </Button>
        <Popper visible={visible} attachEl={btnRef} onOutsideClick={() => setVisible(false)}>
          I am Popper Content
        </Popper>
      </div>
    </>
  )
}
