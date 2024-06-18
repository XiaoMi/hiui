import React, { useState, useMemo } from 'react'
import { createNotification } from '../src'
import Button from '@hi-ui/button'

/**
 * @title notification属性自定义
 */
export const Custom = () => {
  const [container, setContainer] = useState<HTMLElement | undefined>()

  const notificationWithContainer = useMemo(
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
          setContainer(e)
        }}
        id="ddd"
        style={{
          width: 400,
          height: 300,
          background: 'rgb(245, 247, 250)',

          // Need add it
          position: 'relative',
          overflow: 'hidden',
        }}
      ></div>

      <div className="notification-container__wrap">
        <Button
          onClick={() => {
            notificationWithContainer.open({
              title: '数据备份通知',
              content:
                '各位同学请注意，将于2019.08.10 00:00:00 -08:00：00 期间进行系统服务器升级维护，请做好数据备份工作，以防丢失。带来不便，敬请谅解！',
            })
          }}
        >
          Notice
        </Button>
      </div>
    </>
  )
}
