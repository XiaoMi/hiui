import React from 'react'
import Button from '@hi-ui/button'
import Modal from '../src'

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
          width: 640,
          height: 420,
          background: '#ecdecd',
          boxShadow: '1px 2px 8px #ccc',

          // need add
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Button onClick={() => setVisible(!visible)}>open</Button>
        <Modal
          style={{ position: 'absolute' }}
          visible={visible}
          onClose={() => setVisible(false)}
          container={container}
        >
          我是挂载指定容器的模态框内容
        </Modal>
      </div>
    </>
  )
}
