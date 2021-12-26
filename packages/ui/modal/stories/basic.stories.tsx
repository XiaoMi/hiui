import React from 'react'
import Button from '@hi-ui/button'
import Modal from '../src'

export const Basic = () => {
  const [visible, setVisible] = React.useState(false)
  console.log('visible', visible)

  return (
    <>
      <h1>Basic</h1>
      <div className="modal-basic__wrap">
        <Button onClick={() => setVisible(!visible)}>open</Button>
        <Modal visible={visible} closeable={false} onClose={() => setVisible(false)}>
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
