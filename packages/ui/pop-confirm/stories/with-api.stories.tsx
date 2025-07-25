import React, { useState } from 'react'
import PopConfirm from '../src'
import Button from '@hi-ui/button'

/**
 * @title API 方式调用
 */
export const WithApi = () => {
  // const FormItem = Form.Item
  const key = 'my_key'

  return (
    <>
      <h1>WithApi</h1>
      <div className="pop-confirm-basic__wrap">
        <h4>此处展示多个操作使用同一个容器，即 API 调用时，将 key 设置为同一个</h4>
        <Button
          onClick={(e) => {
            PopConfirm.open(e.target as HTMLElement, {
              key: key,
              title: <div style={{ whiteSpace: 'normal' }}>标题1</div>,
              content: <div>内容1</div>,
              arrow: false,
              crossGap: 0,
              placement: 'bottom-start',
              disabledPortal: true,
              zIndex: 99,
            })
          }}
        >
          trigger 1
        </Button>
        <Button
          onClick={(e) => {
            PopConfirm.open(e.target as HTMLElement, {
              key: key,
              title: <div style={{ whiteSpace: 'normal' }}>标题2</div>,
              content: <div>内容2</div>,
              arrow: false,
              crossGap: 0,
              placement: 'bottom-start',
              disabledPortal: true,
              zIndex: 99,
            })
          }}
        >
          trigger 2
        </Button>
      </div>
    </>
  )
}
