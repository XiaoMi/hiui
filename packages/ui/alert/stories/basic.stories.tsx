import React from 'react'
import Alert from '../src'

/**
 * @title 基础用法
 * @desc 根据用户的操作进行页面级或模块、区块级的提示
 */
export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
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
