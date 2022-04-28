import React from 'react'
import Drawer from '../src'
import Button from '@hi-ui/button'

/**
 * @title 无蒙层
 */
export const Mask = () => {
  const [visible, setVisible] = React.useState(false)

  return (
    <>
      <h1>Mask</h1>
      <div className="drawer-mask__wrap">
        <Button onClick={() => setVisible(!visible)}>open</Button>
        <Drawer
          title="Drawer Header Title"
          visible={visible}
          showMask={false}
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
