import React from 'react'
import Button from '@hi-ui/button'
import Modal from '../src'

/**
 * @title 关闭锁滚
 * @desc 和其它弹出层结合等复杂场景，自行控制锁滚行为
 */
export const LockScroll = () => {
  const [visible, setVisible] = React.useState(false)
  console.log('visible', visible)

  return (
    <>
      <h1>LockScroll</h1>
      <div className="modal-lock-scroll__wrap">
        <Button onClick={() => setVisible(!visible)}>open</Button>
        <div style={{ height: '100vh' }}>
          <br />
          模拟滚动区域
          <br />
          模拟滚动区域
          <br />
          模拟滚动区域
          <br />
          模拟滚动区域
          <br />
          模拟滚动区域
          <br />
          模拟滚动区域
          <br />
          模拟滚动区域
        </div>

        <Modal visible={visible} closeable={false} onCancel={() => setVisible(false)}>
          代码如写诗
          <br />
          <br />
          写诗如代码
          <br />
          <br />
          这是一门艺术
        </Modal>
      </div>
    </>
  )
}
