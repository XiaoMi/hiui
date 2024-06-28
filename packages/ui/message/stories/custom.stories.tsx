import React, { useMemo, useState } from 'react'
import { createMessage } from '../src'
import Button from '@hi-ui/button'

/**
 * @title message 属性自定义
 *
 */

export const Custom = () => {
  const [container, setContainer] = useState<HTMLElement | null>(null)
  const message = useMemo(
    () =>
      createMessage({
        container,
        zIndex: 1000,
      }),
    [container]
  )
  return (
    <>
      <h1>Custom</h1>
      <div className="message-custom__wrap">
        <div
          ref={(e) => {
            setContainer(e)
          }}
          id="ddd"
          style={{
            width: 700,
            height: 400,
            background: 'rgb(245, 247, 250)',
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
            })
          }}
        >
          Toast
        </Button>
      </div>
    </>
  )
}
