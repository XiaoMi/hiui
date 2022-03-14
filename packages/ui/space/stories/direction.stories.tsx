import React from 'react'
import Space from '../src'
import Button from '@hi-ui/button'

export const Direction = () => {
  return (
    <>
      <h1>垂直排列</h1>
      <div className="space-basic__wrap">
        <Space direction="column" size="normal">
          <Button>Button1</Button>
          <Button type="primary">Button2</Button>
          <Button type="danger">Button3</Button>
        </Space>
      </div>
    </>
  )
}
