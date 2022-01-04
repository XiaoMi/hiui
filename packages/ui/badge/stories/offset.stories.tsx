import React from 'react'
import Badge from '../src'
import { Button } from '@hi-ui/button'

export const Offset = () => {
  return (
    <>
      <h1>位置偏移</h1>
      <div className="badge-offset__wrap">
        <Badge type="dot" offset={[4, -4]}>
          <Button type="default">最新报表</Button>
        </Badge>
        <br />
        <br />
        <Badge content={8} offset={[8, -8]}>
          <Button type="default">最新报表</Button>
        </Badge>
      </div>
    </>
  )
}
