import React from 'react'
import Drawer from '../src'
import Button from '@hi-ui/button'

export const Container = () => {
  const [visible, setVisible] = React.useState(false)
  const [container, setContainer] = React.useState(null)
  return (
    <>
      <h1>Container</h1>
      <div
        ref={setContainer}
        className="drawer-container__wrap"
        style={{
          width: 500,
          height: 400,
          background: '#ecdecd',

          // need add
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Button onClick={() => setVisible(!visible)}>open</Button>
        <Drawer
          style={{ position: 'absolute' }}
          container={container}
          visible={visible}
          closeOnOverlayClick={true}
          onClose={() => setVisible(false)}
        >
          Drawer content
        </Drawer>
      </div>
    </>
  )
}
