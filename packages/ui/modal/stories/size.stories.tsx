import React from 'react'
import Button from '@hi-ui/button'
import Modal, { ModalSizeEnum } from '../src'

export const Size = () => {
  const [visibleModalSize, setVisibleModalSize] = React.useState<ModalSizeEnum>()

  return (
    <>
      <h1>Size</h1>
      <div className="modal-size__wrap">
        <Button onClick={() => setVisibleModalSize('sm')}>sm</Button>

        <Button onClick={() => setVisibleModalSize('md')}>md</Button>

        <Button onClick={() => setVisibleModalSize('lg')}>lg</Button>
        <Modal
          visible={!!visibleModalSize}
          closeable={false}
          size={visibleModalSize}
          onCancel={() => setVisibleModalSize(undefined)}
        >
          这是一个标题描述…
          <br />
          这是一个标题描述…
          <br />
          这是一个标题描述…
        </Modal>
      </div>
    </>
  )
}
