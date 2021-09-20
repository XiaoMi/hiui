import React from 'react'
import Message from '../src'
import Button from '@hi-ui/button'

export const Close = () => {
  const toastIdsRef = React.useRef([])

  function close() {
    const popId = toastIdsRef.current.pop()
    Message.close(popId)
  }

  function closeAll() {
    Message.closeAll()
  }

  function addToast() {
    const id = Message.open({
      title: 'some text',
      type: ['error', 'warning', 'success', 'info'][parseInt(Math.random() * 4)] as any,
    })
    toastIdsRef.current.push(id)
  }

  return (
    <>
      <h1>Close</h1>
      <div className="message-close__wrap">
        <Button onClick={addToast}>Toast</Button>

        <Button onClick={close}>Close latest toast</Button>

        <Button onClick={closeAll}>Close all toasts</Button>
      </div>
    </>
  )
}
