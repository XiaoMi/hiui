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
          Solid
        </Button>
        <Button type="primary" icon={<PlusOutlined />} appearance="filled" disabled>
          Filled
        </Button>
        <Button type="primary" icon={<PlusOutlined />} appearance="line" disabled>
          Line
        </Button>
        <Button type="primary" icon={<PlusOutlined />} appearance="text" disabled>
          Text
        </Button>
        <Button type="primary" icon={<PlusOutlined />} appearance="link" disabled>
          Link
        </Button>
      </div>
    </>
  )
}
