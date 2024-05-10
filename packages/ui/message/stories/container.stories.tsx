import React from 'react'
import message from '../src'
import Button from '@hi-ui/button'

/**
 * @title portal挂载
 * @desc 挂载在当前div
 *
 */
export const Container = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="message-container__wrap">
        <Button
          onClick={() => {
            message.open({
              title: '欢迎使用 HiUI 组件库',
              type: 'success',
              container: document.querySelector('.message-container__wrap'),
            })
          }}
        >
          Toast
        </Button>
      </div>
    </>
  )
}
