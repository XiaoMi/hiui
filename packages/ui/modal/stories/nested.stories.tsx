import React from 'react'
import Button from '@hi-ui/button'
import Modal from '../src'

/**
 * @title 嵌套弹窗
 * @desc 反复操作确认弹窗场景
 */
export const Nested = () => {
  const [visible, setVisible] = React.useState(false)
  const [nestVisible, setNestVisible] = React.useState(false)

  return (
    <>
      <h1>Nested</h1>
      <div className="modal-nested__wrap">
        <Button onClick={() => setVisible(!visible)}>open</Button>
        <Modal visible={visible} closeable={false} onCancel={() => setVisible(false)}>
          <div>Modal content</div>
          <Button onClick={() => setNestVisible(!nestVisible)}>Nested</Button>
          <Modal visible={nestVisible} closeable={false} onCancel={() => setNestVisible(false)}>
            NestModal content
          </Modal>
        </Modal>
      </div>
    </>
  )
}
