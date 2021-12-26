import React from 'react'
import message from '../src'
import Button from '@hi-ui/button'

export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="message-basic__wrap">
        {/* <Message></Message> */}
        <Button
          onClick={() => {
            message.open({
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
