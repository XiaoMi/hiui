import React from 'react'
import Notification from '../src'
import Button from '@hi-ui/button'

export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="notification-basic__wrap">
        {/* <Notification></Notification> */}
        <Button
          onClick={() => {
            Notification.open({
              title: '数据备份通知',
              content:
                '各位同学请注意，将于2019.08.10 00:00:00 -08:00：00 期间进行系统服务器升级维护，请做好数据备份工作，以防丢失。带来不便，敬请谅解！',
            })
          }}
        >
          Toast
        </Button>
      </div>
    </>
  )
}
