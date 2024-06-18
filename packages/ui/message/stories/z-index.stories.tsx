import React from 'react'
import { createMessage } from '../src'
import Button from '@hi-ui/button'

/**
 * @title 自定义css展示层级
 *
 */

export const ZIndex = () => {
  const messageWithZIndex = createMessage({
    zIndex: 2000,
  })

  return (
    <>
      <h1>zIndex</h1>
      <div className="message-container__wrap">
        <div
          id="ddd"
          style={{
            top: 0,
            width: 1000,
            height: 200,
            background: 'red',

            // Need add it
            zIndex: 1500,
            position: 'fixed',
          }}
        ></div>
        <Button
          onClick={() => {
            messageWithZIndex.open({
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
