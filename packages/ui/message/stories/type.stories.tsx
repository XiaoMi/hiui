import React from 'react'
import message from '../src'
import Button from '@hi-ui/button'

/**
 * @title 不同类型
 * @desc 通过 type 指定不同类型场景的消息提醒
 */
export const Type = () => {
  function addToast(type) {
    return () => {
      message.open({
        title: '问君能有几多愁，恰似一江春水向东流',
        type,
      })
    }
  }

  return (
    <>
      <h1>Close</h1>
      <div className="message-close__wrap">
        <Button type="primary" onClick={addToast('info')}>
          Info
        </Button>
        <Button type="success" onClick={addToast('success')}>
          Success
        </Button>
        <Button type="danger" onClick={addToast('error')}>
          Error
        </Button>
        <Button type="default" appearance="solid" onClick={addToast('warning')}>
          Warning
        </Button>
      </div>
    </>
  )
}
