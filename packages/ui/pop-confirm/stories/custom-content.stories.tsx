import Button from '@hi-ui/button'
import React from 'react'
import PopConfirm from '../src'

/**
 * @title 自定义内容
 */
export const CustomContent = () => {
  return (
    <>
      <h1>CustomContent</h1>
      <div className="pop-confirm-basic__wrap">
        <PopConfirm
          style={{ minWidth: 280, maxWidth: 300 }}
          icon={null}
          title={<div style={{ whiteSpace: 'normal' }}>很长的通知标题</div>}
          content={<div>这是一段很长的内容这是一段很长的内容这是一段很长的内容</div>}
        >
          <Button>Trigger</Button>
        </PopConfirm>
      </div>
    </>
  )
}
