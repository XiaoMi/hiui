import React from 'react'
import Button from '@hi-ui/button'
import Modal from '../src'

export const Basic = () => {
  const [visible, setVisible] = React.useState(false)

  return (
    <>
      <h1>Modal</h1>
      <div>
        <Button onClick={() => setVisible(!visible)}>open</Button>
      </div>
      <Modal visible={visible} closeOnOverlayClick={true} onClose={() => setVisible(false)}>
        Modal content
      </Modal>
    </>
  )
}
