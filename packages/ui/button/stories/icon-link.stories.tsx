import React from 'react'
import { PlusOutlined } from '@hi-ui/icons'
import Button from '../src'

/**
 * @title 带图标链接
 * @desc 强调动作含义或简化动作的操作区域
 */
export const IconLink = () => {
  return (
    <>
      <h1>Button</h1>
      <div className="button-basic__wrap">
        <Button type="primary" appearance="link" icon={<PlusOutlined />}>
          主要按钮
        </Button>
        <Button type="secondary" appearance="link" icon={<PlusOutlined />}>
          次要按钮
        </Button>
        <Button type="default" appearance="link" icon={<PlusOutlined />}>
          中性按钮
        </Button>
        <Button type="danger" appearance="link" icon={<PlusOutlined />}>
          危险按钮
        </Button>
        <Button type="success" appearance="link" icon={<PlusOutlined />}>
          成功按钮
        </Button>
      </div>
    </>
  )
}
