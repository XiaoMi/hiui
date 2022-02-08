import React from 'react'
import Button from '@hi-ui/button'
import Drawer from '../src'

export const Nested = () => {
  const [visible, setVisible] = React.useState(false)
  const [nestVisible, setNestVisible] = React.useState(false)

  return (
    <>
      <h1>Nested</h1>
      <div className="Drawer-nested__wrap">
        <Button onClick={() => setVisible(!visible)}>open</Button>
        <Drawer width={754} visible={visible} closeable={false} onClose={() => setVisible(false)}>
          <div>Drawer content</div>
          <Button onClick={() => setNestVisible(!nestVisible)}>Nested</Button>
          <Drawer visible={nestVisible} closeable={false} onClose={() => setNestVisible(false)}>
            NestDrawer content
          </Drawer>
        </Drawer>
      </div>
    </>
  )
}
