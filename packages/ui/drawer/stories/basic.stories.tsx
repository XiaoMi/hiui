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
        <Drawer
          title="Drawer Header Title"
          visible={visible}
          closeOnOverlayClick={true}
          onClose={() => setVisible(false)}
          footer={
            <div style={{ textAlign: 'right' }}>
              <Button type="primary" key={0} onClick={() => console.log(1)}>
                确认
              </Button>
              <Button type="default" key={1} onClick={() => console.log(2)}>
                取消
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
