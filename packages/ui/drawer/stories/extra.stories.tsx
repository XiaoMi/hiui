import React from 'react'
import Drawer from '../src'
import Button from '@hi-ui/button'
import { EditOutlined } from '@hi-ui/icons'

export const Extra = () => {
  const [visible, setVisible] = React.useState(false)

  return (
    <>
      <h1>Extra</h1>
      <div className="drawer-extra">
        <Button onClick={() => setVisible(!visible)}>open</Button>
        <Drawer
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>我是大标题</div>
              <EditOutlined style={{ paddingRight: 12 }} />
            </div>
          }
          visible={visible}
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
