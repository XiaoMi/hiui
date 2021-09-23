import React from 'react'
import message from '../src'
import Button from '@hi-ui/button'

export const Close = () => {
  const toastIdsRef = React.useRef([])

  function close() {
    const popId = toastIdsRef.current.pop()
    message.close(popId)
  }

  function closeAll() {
    message.closeAll()
  }

  function addToast() {
    const id = message.open({
      title: 'some text',
      type: ['error', 'warning', 'success', 'info'][Math.floor(Math.random() * 4)] as any,
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
