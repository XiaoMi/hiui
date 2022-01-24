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
          width: 640,
          height: 420,
          background: '#ecdecd',
          boxShadow: '1px 2px 8px #ccc',

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
          closeable={false}
          onClose={() => setVisible(false)}
        >
          Drawer content
        </Drawer>
      </div>
    </>
  )
}
