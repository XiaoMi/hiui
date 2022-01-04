import React from 'react'
import Alert from '../src'

export const Banner = () => {
  return (
    <>
      <h1>Banner 展示</h1>
      <div className="alert-banner__wrap">
        <Alert
          showIcon={false}
          closeable={false}
          type="primary"
          title="信息提示的文案"
          onClose={() => {
            console.log('alert关闭回调')
          }}
        />
        <br />
        <Alert
          showIcon={false}
          closeable={false}
          type="success"
          title="成功提示的文案"
          onClose={() => {
            console.log('alert关闭回调')
          }}
        />
        <br />
        <Alert
          showIcon={false}
          closeable={false}
          type="danger"
          title="错误提示的文案"
          onClose={() => {
            console.log('alert关闭回调')
          }}
        />
        <br />
        <Alert
          showIcon={false}
          closeable={false}
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
