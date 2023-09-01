import React from 'react'
import notification from '../src'
import Button from '@hi-ui/button'

/**
 * @title 设置尺寸
 */
export const Size = () => {
  const notificationIdRef = React.useRef<React.ReactText>()

  const openNotification = (size) => {
    notificationIdRef.current = notification.open({
      size,
      autoClose: false,
      title: '数据备份通知',
      content: '将于 2035.08.10 00:00:00-08:00：00 期间进行系统服务器升级维护！',
    })
  }
  return (
    <>
      <h1>Size</h1>
      <div className="notification-size__wrap">
        <Button onClick={() => openNotification('lg')}>Notice lg</Button>
        <Button onClick={() => openNotification('md')}>Notice md</Button>
        <Button onClick={() => openNotification('sm')}>Notice sm</Button>
      </div>
    </>
  )
}
