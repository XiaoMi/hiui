import React from 'react'
import ToastAPI from '../src'
import Button from '@hi-ui/button'

const Toast = ToastAPI.create('.close')

export const Close = () => {
  const toastIdsRef = React.useRef([])

  function close() {
    const popId = toastIdsRef.current.pop()
    Toast.close(popId)
  }

  function closeAll() {
    Toast.closeAll()
  }

  function addToast() {
    const id = Toast.open({
      title: 'some text',
    })
    toastIdsRef.current.push(id)
  }

  return (
    <>
      <h1>Close</h1>
      <div className="toast-close__wrap">
        <Button onClick={addToast}>Toast</Button>

        <Button onClick={close}>Close latest toast</Button>

        <Button onClick={closeAll}>Close all toasts</Button>
      </div>
    </>
  )
}
