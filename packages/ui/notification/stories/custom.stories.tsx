import React, { useState, useMemo } from 'react'
import { createNotification } from '../src'
import Button from '@hi-ui/button'

/**
 * @title notification 属性配置
 * @desc 支持配置 container 和 zIndex
 */
export const Custom = () => {
  const [container, setContainer] = useState<HTMLElement>()

  const notification = useMemo(
    () =>
      createNotification({
        container: container,
        zIndex: 2000,
      }),
    [container]
  )

  return (
    <>
      <h1>Custom</h1>

      <div
        ref={(e) => {
          e && setContainer(e)
        }}
        className="notification-custom__wrap"
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
            notification.open({
              size: 'sm',
              title: '数据备份通知',
              content:
                '各位同学请注意，将于2019.08.10 00:00:00 -08:00：00 期间进行系统服务器升级维护！',
            })
          }}
        >
          Open
        </Button>
      </div>
    </>
  )
}
