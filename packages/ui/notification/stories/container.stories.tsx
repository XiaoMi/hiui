import React from 'react'
import notification from '../src'
import Button from '@hi-ui/button'

/**
 * @title 挂载容器
 */
export const Container = () => {
  return (
    <>
      <h1>Container</h1>
      <div className="notification-container__wrap">
        <Button
          onClick={() => {
            notification.open({
              title: '数据备份通知',
              content:
                '各位同学请注意，将于2019.08.10 00:00:00 -08:00：00 期间进行系统服务器升级维护，请做好数据备份工作，以防丢失。带来不便，敬请谅解！',
              container: document.querySelector('.notification-container__wrap'),
            })
          }}
        >
          Notice
        </Button>
      </div>
    </>
  )
}
