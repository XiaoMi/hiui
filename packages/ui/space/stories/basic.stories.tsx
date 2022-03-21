import React from 'react'
import Space from '../src'
import Button from '@hi-ui/button'

export const Basic = () => {
  return (
    <>
      <h1>基本使用</h1>
      <div className="space-basic__wrap">
        <Space>
          <Button>Button1</Button>
          <Button type="primary">Button2</Button>
          <Button type="danger">Button3</Button>
        </Space>
      </div>
    </>
  )
}
