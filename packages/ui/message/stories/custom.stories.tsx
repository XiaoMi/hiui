import React, { useState } from 'react'
import { createMessage } from '../src'
import Button from '@hi-ui/button'

/**
 * @title message属性自定义
 *
 */

export const Custom = () => {
  const [container, setContainer] = useState<HTMLElement | null>(null)
  const message = createMessage({
    container: container,
    zIndex: 1000,
  })

  return (
    <>
      <h1>Custom</h1>
      <div className="message-container__wrap">
        <div
          ref={(e) => {
            setContainer(e)
          }}
          id="ddd"
          style={{
            width: 800,
            height: 600,
            background: 'red',
            zIndex: 1500,
            // Need add it
            position: 'relative',
            overflow: 'hidden',
          }}
        ></div>
        <Button
          onClick={() => {
            message.open({
              title: '欢迎使用 HiUI 组件库',
              type: 'success',
              autoClose: false,
            })
          }}
        >
          Toast
        </Button>
      </div>
    </>
  )
}
