import React from 'react'
import Space from '../src'
import Button from '@hi-ui/button'

/**
 * @title 基础用法
 * @desc 包裹目标元素们并使它们产生间距
 */
export const Basic = () => {
  return (
    <>
      <h1>基本使用</h1>
      <div className="space-basic__wrap">
        <Space>
          <Button type="primary">Button1</Button>
          <Button>Button2</Button>
          <Button>Button3</Button>
          <Button>Button4</Button>
        </Space>
      </div>
    </>
  )
}
