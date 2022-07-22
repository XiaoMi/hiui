import React from 'react'
import Space from '../src'
import Button from '@hi-ui/button'

/**
 * @title 垂直排列
 * @desc 通过 direction 设置元素排版方向，支持垂直间距
 */
export const Direction = () => {
  return (
    <>
      <h1>垂直排列</h1>
      <div className="space-basic__wrap">
        <Space direction="column" size="lg">
          <Button type="primary">Button1</Button>
          <Button>Button2</Button>
          <Button>Button3</Button>
        </Space>
      </div>
    </>
  )
}
