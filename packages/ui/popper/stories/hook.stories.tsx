import React from 'react'
import { usePopper } from '../src'
import Button from '@hi-ui/button'

export const Hook = () => {
  const [btnEl, setBtnEl] = React.useState(null)
  const [visible, setVisible] = React.useState(false)
  const { shouldRenderPopper, getPopperProps } = usePopper({
    attachEl: btnEl,
    visible,
    placement: 'bottom-end',
    onClose: () => setVisible(false),
    unmountOnClose: false,
    // preload: true,
  })

  return (
    <>
      <h1>Hook</h1>
      <div className="popper-hook__wrap">
        <Button ref={setBtnEl} onClick={() => setVisible((prev) => !prev)}>
          Open
        </Button>
        {shouldRenderPopper ? (
          <div {...getPopperProps()}>The content of the Popper.The content of the Popper.</div>
        ) : null}
      </div>
    </>
  )
}
