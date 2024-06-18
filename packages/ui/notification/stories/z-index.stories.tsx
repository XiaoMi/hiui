import React, { useMemo } from 'react'
import { createNotification } from '../src'
import Button from '@hi-ui/button'

/**
 * @title 自定义css展示层级
 */
export const ZIndex = () => {
  const notificationWithZIndex = useMemo(
    () =>
      createNotification({
        zIndex: 2000,
      }),
    []
  )

  return (
    <>
      <h1>Container</h1>
      <div
        id="ddd"
        style={{
          top: 0,
          width: 800,
          height: 200,
          background: 'red',

          zIndex: 1400,
          position: 'fixed',
        }}
      ></div>

      <div className="notification-container__wrap">
        <Button
          onClick={() => {
            notificationWithZIndex.open({
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
