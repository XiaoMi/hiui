import React from 'react'
import notification from '../src'
import Button from '@hi-ui/button'

export const Close = () => {
  const toastIdsRef = React.useRef([])

  function close() {
    const popId = toastIdsRef.current.pop()
    notification.close(popId)
  }

  function closeAll() {
    notification.closeAll()
  }

  function addToast() {
    const id = notification.open({
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
        <Button onClick={addToast}>Notice</Button>

        <Button onClick={close}>Close latest Notice</Button>

        <Button onClick={closeAll}>Close all Notices</Button>
      </div>
    </>
  )
}
