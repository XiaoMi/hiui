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
        <Modal title="提示" visible={visible} closeable={false} onCancel={() => setVisible(false)}>
          <div>这里是弹窗内容</div>
          <Button style={{ marginTop: 20 }} onClick={() => setNestVisible(!nestVisible)}>
            Nested
          </Button>
          <Modal
            title="提示"
            visible={nestVisible}
            closeable={false}
            onCancel={() => setNestVisible(false)}
          >
            Nest这里是弹窗内容
          </Modal>
        </Modal>
      </div>
    </>
  )
}
