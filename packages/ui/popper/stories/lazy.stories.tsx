import React from 'react'
import { PopperPortal as Popper } from '../src'
import Button from '@hi-ui/button'

export const Lazy = () => {
  const [btnRef, setBtnRef] = React.useState(null)
  const [visible, setVisible] = React.useState(false)

  return (
    <>
      <h1>Lazy</h1>
      <div className="popper-lazy">
        <Button ref={setBtnRef} onClick={() => setVisible(true)}>
          Open
        </Button>
        <div>
          <h1>unmountOnClose</h1>
          <Popper visible={visible} attachEl={btnRef} onClose={() => setVisible(false)}>
            The content of the Popper1.
          </Popper>
        </div>
        <div>
          <h1>lazyLoad</h1>
          <Popper
            visible={visible}
            preload={false}
            unmountOnClose={false}
            placement="top"
            attachEl={btnRef}
            onClose={() => setVisible(false)}
          >
            The content of the Popper2.
          </Popper>
        </div>
        <div>
          <h1>keep</h1>
          <Popper
            visible={visible}
            preload={true}
            unmountOnClose={false}
            placement="right"
            attachEl={btnRef}
            onClose={() => setVisible(false)}
          >
            The content of the Popper3.
          </Popper>
        </div>
      </div>
    </>
  )
}
