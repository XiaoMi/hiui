import React from 'react'
import Space from '../src'
import Button from '@hi-ui/button'

/**
 * @title 不同大小
 * @desc 通过 size 设置标椎的间距大小，默认为小号
 */
export const Size = () => {
  return (
    <>
      <h1>不同大小</h1>
      <div className="space-size__wrap">
        <h2>sm</h2>
        <Space size="sm">
          <Button type="primary">Button1</Button>
          <Button>Button2</Button>
          <Button>Button3</Button>
          <Button>Button4</Button>
        </Space>
        <h2>md</h2>
        <Space size="md">
          <Button type="primary">Button1</Button>
          <Button>Button2</Button>
          <Button>Button3</Button>
          <Button>Button4</Button>
        </Space>
        <h2>lg</h2>
        <Space size="lg">
          <Button type="primary">Button1</Button>
          <Button>Button2</Button>
          <Button>Button3</Button>
          <Button>Button4</Button>
        </Space>
      </div>
    </>
  )
}
