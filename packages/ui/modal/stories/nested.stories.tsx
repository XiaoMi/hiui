import React from 'react'
import Button from '@hi-ui/button'
import Modal from '../src'

export const Nested = () => {
  const [visible, setVisible] = React.useState(false)
  const [nestVisible, setNestVisible] = React.useState(false)

  return (
    <>
      <h1>Nested</h1>
      <div>
        <Button onClick={() => setVisible(!visible)}>open</Button>
      </div>
      <Modal visible={visible} closeOnOverlayClick={true} onClose={() => setVisible(false)}>
        <div>Modal content</div>
        <Button onClick={() => setNestVisible(!nestVisible)}>Nested</Button>
        <Modal visible={nestVisible} onClose={() => setNestVisible(false)}>
          NestModal content
        </Modal>
      </Modal>
    </>
  )
}
