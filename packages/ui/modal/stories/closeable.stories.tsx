import React from 'react'
import Button from '@hi-ui/button'
import Modal from '../src'

export const Closeable = () => {
  const [visible, setVisible] = React.useState(false)
  console.log(visible)

  return (
    <>
      <h1>Closeable</h1>
      <div className="modal-closeable__wrap">
        <Button onClick={() => setVisible(!visible)}>open</Button>
        <Modal visible={visible} title="提示消息" closeable onCancel={() => setVisible(false)}>
          <span>哈哈哈哈哈....</span>
          <br />
          <span>哈哈哈哈哈...</span>
          <br />
          <span>哈哈哈哈哈...</span>
        </Modal>
      </div>
    </>
  )
}
