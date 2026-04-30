import React from 'react'
import Button from '@hi-ui/button'
import Modal from '../src'

/**
 * @title 提示弹窗
 * @desc 未传入 title 及 closeable 为 false，可取消 title 部分；footer 为 null，可取消底部按钮
 */
export const Popup = () => {
  const [visible, setVisible] = React.useState(false)
  console.log('visible', visible)

  return (
    <>
      <h1>提示弹窗</h1>
      <div className="modal-popup__wrap">
        <Button onClick={() => setVisible(!visible)}>open</Button>
        <Modal visible={visible} closeable={false} onCancel={() => setVisible(false)} footer={null}>
          <div style={{ padding: '18px 0' }}>
            代码如写诗
            <br />
            <br />
            写诗如代码
            <br />
            <br />
            这是一门艺术
          </div>
        </Modal>
      </div>
    </>
  )
}
