import React from 'react'
import Notification from '../src'
import Button from '@hi-ui/button'

export const Close = () => {
  const toastIdsRef = React.useRef([])

  function close() {
    const popId = toastIdsRef.current.pop()
    Notification.close(popId)
  }

  function closeAll() {
    Notification.closeAll()
  }

  function addToast() {
    const id = Notification.open({
      title: 'some text',
      type: ['error', 'warning', 'success', 'info'][Math.floor(Math.random() * 4)] as any,
      content: 'some content',
    })
    toastIdsRef.current.push(id)
  }

  return (
    <>
      <h1>Close</h1>
      <div className="notification-close__wrap">
        <Button onClick={addToast}>Toast</Button>

        <Button onClick={close}>Close latest toast</Button>

        <Button onClick={closeAll}>Close all toasts</Button>
      </div>
    </>
  )
}
