import React from 'react'
import Alert from '../src'

export const Basic = () => {
  return (
    <>
      <h1>Alert</h1>
      <div className="alert-basic__wrap">
        <Alert
          type="primary"
          title="信息提示的文案"
          onClose={() => {
            console.log('alert关闭回调')
          }}
        />
        <br />
        <Alert
          type="success"
          title="成功提示的文案"
          onClose={() => {
            console.log('alert关闭回调')
          }}
        />
        <br />
        <Alert
          type="danger"
          title="错误提示的文案"
          onClose={() => {
            console.log('alert关闭回调')
          }}
        />
        <br />
        <Alert
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
