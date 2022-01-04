import React from 'react'
import Badge from '../src'
import { Button } from '@hi-ui/button'
import { BellOutlined } from '@hi-ui/icons'

export const Custom = () => {
  return (
    <>
      <h1>自定义角标内容</h1>
      <div className="badge-Custom__wrap">
        <Badge content={<BellOutlined style={{ fontSize: 16, color: '#ff5959' }} />}>
          <Button type="default">最新报表</Button>
        </Badge>
        <br />
        <br />
        <Badge content={<BellOutlined style={{ fontSize: 16, color: '#ff5959' }} />} />
      </div>
    </>
  )
}
