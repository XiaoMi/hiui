import React from 'react'
import Alert from '../src'

/**
 * @title 自定义标题右侧扩展内容
 */
export const Extra = () => {
  return (
    <>
      <h1>自定义标题右侧扩展内容</h1>
      <div className="alert-extra__wrap">
        <Alert
          type="primary"
          title="信息提示的文案"
          extra={<div style={{ fontSize: 18 }}>Content</div>}
          closeable={false}
        />
      </div>
    </>
  )
}
