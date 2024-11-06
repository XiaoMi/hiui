import React from 'react'
import Alert from '../src'
import Button from '@hi-ui/button'

/**
 * @title 不同尺寸
 */
export const Size = () => {
  return (
    <>
      <h1>Size</h1>
      <div className="alert-size__wrap">
        <h2>lg</h2>
        <Alert
          type="primary"
          title="信息提示的文案"
          onClose={() => {
            console.log('alert关闭回调')
          }}
        />
        <br />
        <Alert
          type="primary"
          title="信息提示的文案"
          content={
            <span style={{ display: 'flex', justifyContent: 'space-between', marginRight: -24 }}>
              <span>文字说明文字说明文字说明</span>
              <Button type="secondary" appearance="link">
                操作按钮
              </Button>
            </span>
          }
          onClose={() => {
            console.log('alert关闭回调')
          }}
        />
        <h2>md</h2>
        <Alert
          type="primary"
          size={'md'}
          title="信息提示的文案"
          onClose={() => {
            console.log('alert关闭回调')
          }}
        />
        <br />
        <Alert
          type="primary"
          size={'md'}
          title="信息提示的文案"
          content={
            <span style={{ display: 'flex', justifyContent: 'space-between', marginRight: -24 }}>
              <span>文字说明文字说明文字说明</span>
              <Button type="secondary" appearance="link">
                操作按钮
              </Button>
            </span>
          }
          onClose={() => {
            console.log('alert关闭回调')
          }}
        />
        <h2>sm</h2>
        <Alert
          type="primary"
          size={'sm'}
          title="信息提示的文案"
          onClose={() => {
            console.log('alert关闭回调')
          }}
        />
        <br />
        <Alert
          type="primary"
          size={'sm'}
          title="信息提示的文案"
          content={
            <span style={{ display: 'flex', justifyContent: 'space-between', marginRight: -24 }}>
              <span>文字说明文字说明文字说明</span>
              <Button type="secondary" appearance="link">
                操作按钮
              </Button>
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
