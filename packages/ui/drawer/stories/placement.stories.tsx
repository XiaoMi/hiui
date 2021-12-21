import React from 'react'
import Drawer from '../src'
import Button from '@hi-ui/button'

export const Placement = () => {
  const [visible, setVisible] = React.useState(false)

  return (
    <>
      <h1>Placement</h1>
      <div className="drawer-placement__wrap">
        <Button onClick={() => setVisible(!visible)}>open</Button>
        <Drawer
          title="Drawer Header Title"
          visible={visible}
          placement="left"
          closeOnOverlayClick={true}
          onClose={() => setVisible(false)}
          footer={
            <div style={{ textAlign: 'right' }}>
              <Button type="default" key={1} onClick={() => console.log(2)}>
                取消
              </Button>
              <Button type="primary" key={0} onClick={() => console.log(1)}>
                确认
              </Button>
            </div>
          }
        >
          <div>Drawer content</div>
          <div>Drawer content</div>
          <div>Drawer content</div>
          <div>Drawer content</div>
          <div>Drawer content</div>
          <div>Drawer content</div>
          <div>Drawer content</div>
          <div>Drawer content</div>
          <div>Drawer content</div>
          <div>Drawer content</div>
          <div>Drawer content</div>
          <div>Drawer content</div>
          <div>Drawer content</div>
          <div>Drawer content</div>
          <div>Drawer content</div>
          <div>Drawer content</div>
          <div>Drawer content</div>
          <div>Drawer content</div>
          <div>Drawer content</div>
          <div>Drawer content</div>
          <div>Drawer content</div>
          <div>Drawer content</div>
          <div>Drawer content</div>
          <div>Drawer content</div>
          <div>Drawer content</div>
          <div>Drawer content</div>
          <div>Drawer content</div>
          <div>Drawer content</div>
          <div>Drawer content</div>
          <div>Drawer content</div>
          <div>Drawer content</div>
          <div>Drawer content</div>
          <div>Drawer content</div>
          <div>Drawer content</div>
          <div>Drawer content</div>
          <div>Drawer content</div>
          <div>Drawer content</div>
          <div>Drawer content</div>
          <div>Drawer content</div>
        </Drawer>
      </div>
    </>
  )
}
