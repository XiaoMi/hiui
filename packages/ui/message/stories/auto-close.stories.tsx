import React from 'react'
import message from '../src'
import Button from '@hi-ui/button'

/**
 * @title 取消自动关闭
 */
export const AutoClose = () => {
  return (
    <>
      <h1>AutoClose</h1>
      <div className="message-auto-close">
        <Button
          onClick={() => {
            const toastId = message.open({
              autoClose: false,
              title: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span>这个 Toast 将不会自动被关闭哦 </span>
                  <Button
                    style={{ marginLeft: 24 }}
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
