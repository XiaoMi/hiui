import React from 'react'
import Alert from '../src'

/**
 * @title 倒计时自动关闭
 * @desc 倒计时自动关闭反馈信息在出现一定时间后自动关闭，不打扰
 */
export const Duration = () => {
  return (
    <>
      <h1>自动关闭</h1>
      <div className="alert-Duration__wrap">
        <Alert
          duration={1000}
          type="primary"
          title="信息提示的文案"
          onClose={() => {
            console.log('alert关闭回调')
          }}
        />
        <br />
        <Alert
          duration={2000}
          type="success"
          title="成功提示的文案"
          onClose={() => {
            console.log('alert关闭回调')
          }}
        />
        <br />
        <Alert
          duration={3000}
          type="danger"
          title="错误提示的文案"
          onClose={() => {
            console.log('alert关闭回调')
          }}
        />
        <br />
        <Alert
          duration={4000}
          type="warning"
          title="警示提示的文案"
          onClose={() => {
            console.log('alert关闭回调')
          }}
        />
      </div>
    </>
  )
}
