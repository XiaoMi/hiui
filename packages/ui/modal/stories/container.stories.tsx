import React from 'react'
import Button from '@hi-ui/button'
import Modal from '../src'

/**
 * @title 局部容器弹窗
 */
export const Container = () => {
  const [visible, setVisible] = React.useState(false)
  const [container, setContainer] = React.useState(undefined)

  console.log('visible', visible)

  return (
    <>
      <h1>Container</h1>

      <div
        ref={setContainer}
        className="modal-container__wrap"
        style={{
          width: '100%',
          minWidth: 660,
          height: 420,
          background: '#f5f7fa',
          boxShadow: '1px 2px 8px #ddd',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',

          // Need add for it
          position: 'relative',
          overflow: 'hidden',
          zIndex: 0,
        }}
      >
        <Button type="primary" onClick={() => setVisible(!visible)}>
          open
        </Button>
        <Modal
          title="提示"
          style={{ position: 'absolute' }}
          visible={visible}
          onCancel={() => setVisible(false)}
          container={container}
        >
          我是挂载指定容器的模态框内容
        </Modal>
      </div>
    </>
  )
}
