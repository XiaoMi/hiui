import React from 'react'
import notification from '../src'
import Button from '@hi-ui/button'

/**
 * @title 带操作
 */
export const Action = () => {
  const notificationIdRef = React.useRef<React.ReactText | undefined>(undefined)

  return (
    <>
      <h1>Action</h1>
      <div className="notification-action__wrap">
        <Button
          onClick={() => {
            notificationIdRef.current = notification.open({
              autoClose: false,
              title: '数据备份通知',
              content:
                '各位同学请注意，将于2019.08.10 00:00:00 -08:00：00 期间进行系统服务器升级维护，请做好数据备份工作，以防丢失。带来不便，敬请谅解！',
              action: (
                <>
                  <Button
                    type="default"
                    appearance="line"
                    onClick={() => {
                      if (notificationIdRef.current) {
                        notification.close(notificationIdRef.current)
                      }
                    }}
                  >
                    取消
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => {
                      if (notificationIdRef.current) {
                        notification.close(notificationIdRef.current)
                      }
                    }}
                  >
                    确认
                  </Button>
                </>
              ),
            })
          }}
        >
          Notice
        </Button>
      </div>
    </>
  )
}
