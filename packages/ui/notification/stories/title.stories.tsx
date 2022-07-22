import React from 'react'
import notification from '../src'
import Button from '@hi-ui/button'

/**
 * @title 通知内容
 */
export const Title = () => {
  return (
    <>
      <h1>Title</h1>
      <div className="notification-title__wrap">
        <Button
          onClick={() => {
            notification.open({
              title: '重要通知：重复三遍',
            })
            notification.open({
              title: '重要通知：重复三遍',
            })
            notification.open({
              title: '重要通知：重复三遍',
            })
          }}
        >
          Notice
        </Button>
      </div>
    </>
  )
}
