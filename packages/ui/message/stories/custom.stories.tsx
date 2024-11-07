import React, { useMemo, useState } from 'react'
import { createMessage } from '../src'
import Button from '@hi-ui/button'

/**
 * @title message 属性自定义
 * @desc 支持配置 container 和 zIndex
 */

export const Custom = () => {
  const [container, setContainer] = useState<HTMLElement>()
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
            setContainer(e as HTMLDivElement)
          }}
          style={{
            width: '100%',
            minWidth: 660,
            height: 420,
            marginBottom: 20,
            background: '#f5f7fa',
            boxShadow: '1px 2px 8px #ddd',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',

            // Need add for it
            position: 'relative',
            overflow: 'hidden',
            zIndex: 0,
          }}
        >
          <Button
            type="primary"
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
      </div>
    </>
  )
}
