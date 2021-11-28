import React from 'react'
import { usePopper } from '../src'
import Button from '@hi-ui/button'

export const Hook = () => {
  const [btnEl, setBtnEl] = React.useState(null)
  const [visible, setVisible] = React.useState(false)
  const { getPopperProps } = usePopper({
    attachEl: btnEl,
    visible,
    placement: 'bottom-end',
    onClose: () => setVisible(false),
  })

  return (
    <>
      <h1>Hook</h1>
      <div className="popper-hook__wrap">
        <Button ref={setBtnEl} onClick={() => setVisible((prev) => !prev)}>
          Open
        </Button>
        {visible ? (
          <div {...getPopperProps()}>The content of the Popper.The content of the Popper.</div>
        ) : null}
      </div>
    </>
  )
}
