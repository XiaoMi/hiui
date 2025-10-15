import React from 'react'
import { createNotification } from '../src'
import Button from '@hi-ui/button'

const notificationInstanceForTop = createNotification({
  placement: 'top',
})

const notificationInstanceForBottom = createNotification({
  placement: 'bottom',
})
/**
 * @title 基础用法
 */
export const Direction = () => {
  return (
    <>
      <h1>自定义位置 - 顶部</h1>
      <div className="notification-basic__wrap">
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
      </div>

      <h1>自定义位置 - 底部</h1>
      <div className="notification-basic__wrap">
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
