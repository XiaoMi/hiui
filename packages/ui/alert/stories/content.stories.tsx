import React from 'react'
import Alert from '../src'

/**
 * @title 带内容
 * @desc 反馈给用户的信息较多，需要用户阅读更详细
 */
export const Content = () => {
  return (
    <>
      <h1>带内容</h1>
      <div className="alert-basic__wrap">
        <Alert
          type="primary"
          title="信息提示的文案"
          content={
            <span style={{ display: 'flex', justifyContent: 'space-between', marginRight: -24 }}>
              <span>文字说明文字说明文字说明</span>
              <span>操作按钮</span>
            </span>
          }
          onClose={() => {
            console.log('alert关闭回调')
          }}
        />
        <br />
        <Alert
          type="success"
          title="成功提示的文案"
          content={
            <span style={{ display: 'flex', justifyContent: 'space-between', marginRight: -24 }}>
              <span>文字说明文字说明文字说明</span>
              <span>操作按钮</span>
            </span>
          }
          onClose={() => {
            console.log('alert关闭回调')
          }}
        />
        <br />
        <Alert
          type="danger"
          title="错误提示的文案"
          content={
            <span style={{ display: 'flex', justifyContent: 'space-between', marginRight: -24 }}>
              <span>文字说明文字说明文字说明</span>
              <span>操作按钮</span>
            </span>
          }
          onClose={() => {
            console.log('alert关闭回调')
          }}
        />
        <br />
        <Alert
          type="warning"
          title="警示提示的文案"
          content={
            <span style={{ display: 'flex', justifyContent: 'space-between', marginRight: -24 }}>
              <span>文字说明文字说明文字说明</span>
              <span>操作按钮</span>
            </span>
          }
          onClose={() => {
            console.log('alert关闭回调')
          }}
        />
      </div>
    </>
  )
}
