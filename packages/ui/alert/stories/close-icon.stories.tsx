import React from 'react'
import Alert from '../src'

/**
 * @title 自定义关闭按钮
 */
export const CloseIcon = () => {
  return (
    <>
      <h1>自定义关闭按钮</h1>
      <div className="alert-close-icon__wrap">
        <Alert
          type="primary"
          title="信息提示的文案"
          closeIcon={<span style={{ fontSize: 12 }}>Close</span>}
          onClose={() => {
            console.log('alert关闭回调')
          }}
        />
      </div>
    </>
  )
}
