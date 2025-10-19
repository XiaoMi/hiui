import React from 'react'
import message from '../src'
import Button from '@hi-ui/button'
import Spinner from '@hi-ui/spinner'

/**
 * @title 设置图标
 *
 */
export const Icon = () => {
  return (
    <>
      <h1>Icon</h1>
      <div className="message-icon__wrap">
        <Button
          onClick={() => {
            message.open({
              icon: <Spinner size="sm" />,
              title: '数据提交中，请勿关闭页面',
              type: 'success',
            })
          }}
        >
          Toast
        </Button>
      </div>
    </>
  )
}
