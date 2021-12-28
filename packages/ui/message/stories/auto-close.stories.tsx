import React from 'react'
import message from '../src'
import Button from '@hi-ui/button'

export const AutoClose = () => {
  return (
    <>
      <h1>AutoClose</h1>
      <div className="message-auto-close">
        {/* <Message></Message> */}
        <Button
          onClick={() => {
            const toastId = message.open({
              autoClose: false,
              title: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span>这个 Toast 将不会自动被关闭哦 </span>
                  <Button
                    type="primary"
                    appearance="link"
                    onClick={() => {
                      message.close(toastId)
                    }}
                  >
                    撤销
                  </Button>
                </div>
              ),
              type: 'success',
            })
          }}
        >
          Toast
        </Button>
      </div>
    </>
  )
}
