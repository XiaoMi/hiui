import React from 'react'
import notification from '../src'
import Button from '@hi-ui/button'

/**
 * @title 不同类型
 */
export const Type = () => {
  return (
    <>
      <h1>Type</h1>
      <div className="notification-type__wrap">
        <Button
          type="secondary"
          onClick={() => {
            notification.open({
              type: 'info',
              title: '数据备份通知',
              content:
                '各位同学请注意，将于2019.08.10 00:00:00 -08:00：00 期间进行系统服务器升级维护，请做好数据备份工作，以防丢失。带来不便，敬请谅解！',
            })
          }}
        >
          Info
        </Button>
        <Button
          type="success"
          onClick={() => {
            notification.open({
              type: 'success',
              title: '数据备份通知',
              content:
                '各位同学请注意，将于2019.08.10 00:00:00 -08:00：00 期间进行系统服务器升级维护，请做好数据备份工作，以防丢失。带来不便，敬请谅解！',
            })
          }}
        >
          Success
        </Button>
        <Button
          type="danger"
          onClick={() => {
            notification.open({
              type: 'error',
              title: '数据备份通知',
              content:
                '各位同学请注意，将于2019.08.10 00:00:00 -08:00：00 期间进行系统服务器升级维护，请做好数据备份工作，以防丢失。带来不便，敬请谅解！',
            })
          }}
        >
          Error
        </Button>
        <Button
          type="default"
          onClick={() => {
            notification.open({
              type: 'warning',
              title: '数据备份通知',
              content:
                '各位同学请注意，将于2019.08.10 00:00:00 -08:00：00 期间进行系统服务器升级维护，请做好数据备份工作，以防丢失。带来不便，敬请谅解！',
            })
          }}
        >
          Warning
        </Button>
      </div>
    </>
  )
}
