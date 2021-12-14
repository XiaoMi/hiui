import React from 'react'
import Alert from '../src'

export const Closable = () => {
  return (
    <>
      <h1>可关闭</h1>
      <div className="alert-basic__wrap">
        <Alert
          closeable
          type="primary"
          title="信息提示的文案"
          onClose={() => {
            console.log('alert关闭回调')
          }}
        />
        <br />
        <Alert
          closeable
          type="primary"
          title="信息提示的文案"
          content="文字说明文字说明文字说明文字说明文字说明文字说明"
          onClose={() => {
            console.log('alert关闭回调')
          }}
        />
      </div>
    </>
  )
}
