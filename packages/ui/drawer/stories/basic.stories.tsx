import React from 'react'
import Drawer from '../src'
import Button from '@hi-ui/button'

export const Basic = () => {
  const [visible, setVisible] = React.useState(false)

  return (
    <>
      <h1>Basic</h1>
      <div className="drawer-basic__wrap">
        <Button onClick={() => setVisible(!visible)}>open</Button>
        <Drawer visible={visible} closeOnOverlayClick={true} onClose={() => setVisible(false)}>
          Drawer content
        </Drawer>
      </div>
    </>
  )
}
