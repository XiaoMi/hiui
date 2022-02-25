import React from 'react'
import Popper from '../src'
import Button from '@hi-ui/button'

export const Container = () => {
  const [btnRef, setBtnRef] = React.useState(null)
  const [visible, setVisible] = React.useState(false)
  const containerRef = React.useRef(null)

  return (
    <div
      style={{
        width: '60vw',
        height: '200px',
        overflow: 'auto',
        border: '1px solid #eee',
        position: 'relative',
      }}
    >
      <h1>Container</h1>
      <div
        ref={containerRef}
        className="popper-container__wrap"
        style={{ zoom: 2, height: '200vh' }}
      >
        <Button ref={setBtnRef} onClick={() => setVisible(true)}>
          Open
        </Button>
        <Popper
          visible={visible}
          attachEl={btnRef}
          onClose={() => setVisible(false)}
          container={btnRef}
        >
          The content of the Popper.
        </Popper>
      </div>
    </div>
  )
}
