import React, { useState } from 'react'
import { createMessage } from '../src'
import Button from '@hi-ui/button'

/**
 * @title 局部容器挂载
 *
 */

export const Container = () => {
  const [container, setContainer] = useState<HTMLElement | null>(null)
  const messageWithContainer = createMessage({
    container: container,
  })

  return (
    <>
      <h1>Container</h1>
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

            // Need add it
            position: 'relative',
            overflow: 'hidden',
          }}
        ></div>
        <Button
          onClick={() => {
            messageWithContainer.open({
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
