import React, { useMemo } from 'react'
import { createNotification } from '../src'
import Button from '@hi-ui/button'

/**
 * @title 弹出方向
 */
export const Direction = () => {
  const notificationInstanceForTop = useMemo(
    () =>
      createNotification({
        placement: 'top',
      }),
    []
  )

  const notificationInstanceForBottom = useMemo(
    () =>
      createNotification({
        placement: 'bottom',
      }),
    []
  )

  return (
    <>
      <h1>Direction</h1>
      <div className="notification-direction__wrap">
        <h2>顶部左侧</h2>
        <Button
          onClick={() => {
            notificationInstanceForTop.open({
              direction: 'left',
              title: '数据备份通知',
              content:
                '各位同学请注意，将于2019.08.10 00:00:00 -08:00：00 期间进行系统服务器升级维护，请做好数据备份工作，以防丢失。带来不便，敬请谅解！ ' +
                new Date().toLocaleString(),
            })
          }}
        >
          top left
        </Button>
        <h2>顶部右侧</h2>
        <Button
          onClick={() => {
            notificationInstanceForTop.open({
              direction: 'right',
              title: '数据备份通知',
              content:
                '各位同学请注意，将于2019.08.10 00:00:00 -08:00：00 期间进行系统服务器升级维护，请做好数据备份工作，以防丢失。带来不便，敬请谅解！ ' +
                new Date().toLocaleString(),
            })
          }}
        >
          top right
        </Button>
        <h2>底部左侧</h2>
        <Button
          onClick={() => {
            notificationInstanceForBottom.open({
              direction: 'left',
              title: '数据备份通知',
              content:
                '各位同学请注意，将于2019.08.10 00:00:00 -08:00：00 期间进行系统服务器升级维护，请做好数据备份工作，以防丢失。带来不便，敬请谅解！ ' +
                new Date().toLocaleString(),
            })
          }}
        >
          bottom left
        </Button>
        <h2>底部右侧</h2>
        <Button
          onClick={() => {
            notificationInstanceForBottom.open({
              direction: 'right',
              title: '数据备份通知',
              content:
                '各位同学请注意，将于2019.08.10 00:00:00 -08:00：00 期间进行系统服务器升级维护，请做好数据备份工作，以防丢失。带来不便，敬请谅解！ ' +
                new Date().toLocaleString(),
            })
          }}
        >
          bottom right
        </Button>
      </div>
    </>
  )
}
