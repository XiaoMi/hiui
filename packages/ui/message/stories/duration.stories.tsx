import React from 'react'
import message from '../src'
import Button from '@hi-ui/button'

/**
 * @title 延时关闭
 * @desc 自定义消息的关闭延时
 *
 */
export const Duration = () => {
  return (
    <>
      <h1>Duration</h1>
      <div className="message-duration__wrap">
        <Button
          onClick={() => {
            message.open({
              title: '欢迎使用 HiUI 组件库',
              type: 'success',
              duration: 6000,
            })
          }}
        >
          Toast
        </Button>
      </div>
    </>
  )
}
