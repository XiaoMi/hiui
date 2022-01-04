import React from 'react'
import Alert from '../src'

export const Closable = () => {
  return (
    <>
      <h1>不可关闭</h1>
      <div className="alert-closable__wrap">
        <Alert type="primary" title="信息提示的文案" closeable={false} />
        <br />
        <Alert type="success" title="成功提示的文案" closeable={false} />
        <br />
        <Alert type="danger" title="错误提示的文案" closeable={false} />
        <br />
        <Alert type="warning" title="警示提示的文案" closeable={false} />
      </div>
    </>
  )
}
