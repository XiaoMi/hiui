import React from 'react'
import Badge from '../src'
import { Button } from '@hi-ui/button'
import { BellFilled } from '@hi-ui/icons'

/**
 * @title 自定义角标内容
 */
export const Custom = () => {
  return (
    <>
      <h1>自定义角标内容</h1>
      <div className="badge-Custom__wrap">
        <Badge content={<BellFilled style={{ fontSize: 16, color: '#ff5959' }} />}>
          <Button type="default">最新报表</Button>
        </Badge>
        <br />
        <br />
        <Badge content={<BellFilled style={{ fontSize: 16, color: '#ff5959' }} />} />
      </div>
    </>
  )
}
