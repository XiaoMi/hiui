import React from 'react'
import Button from '@hi-ui/button'
import Modal, { ModalSizeType } from '../src'

export const Size = () => {
  const [visibleModalSize, setVisibleModalSize] = React.useState<ModalSizeType | ''>('')

  return (
    <>
      <h1>Size</h1>
      <div className="modal-size__wrap">
        <Button onClick={() => setVisibleModalSize('sm')}>sm</Button>

        <Button onClick={() => setVisibleModalSize('md')}>md</Button>

        <Button onClick={() => setVisibleModalSize('lg')}>lg</Button>
        <Modal
          visible={!!visibleModalSize}
          size={visibleModalSize as ModalSizeType}
          onClose={() => setVisibleModalSize('')}
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
