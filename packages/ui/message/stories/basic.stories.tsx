import React from 'react'
import message from '../src'
import Button from '@hi-ui/button'

/**
 * @title 基础用法
 * @desc 一般提醒，不具有明确的引导倾向，自动关闭
 *
 */
export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="message-basic__wrap">
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
