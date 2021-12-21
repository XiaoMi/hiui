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
            message.open({
              autoClose: false,
              title: '欢迎使用 HiUI 组件库',
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
