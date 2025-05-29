import React from 'react'
import Button from '../src'
import { PlusOutlined } from '@hi-ui/icons'

/**
 * @title 禁用状态
 * @desc 暂不可操作的状态
 */
export const Disabled = () => {
  return (
    <>
      <h1>禁用</h1>
      <div className="button-basic__wrap">
        <Button type="primary" icon={<PlusOutlined />} disabled>
          面性按钮
        </Button>
        <Button type="primary" icon={<PlusOutlined />} appearance="line" disabled>
          线性按钮
        </Button>
        <Button type="primary" icon={<PlusOutlined />} appearance="link" disabled>
          链接按钮
        </Button>
        <Button type="primary" icon={<PlusOutlined />} appearance="text" disabled>
          文本按钮
        </Button>
      </div>
    </>
  )
}
