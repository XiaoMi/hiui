import React from 'react'
import { Button } from '@hi-ui/button'
import Badge from '../src'

export const Color = () => {
  const colors = [
    'red',
    'yellow',
    'pink',
    'orange',
    'cyan',
    'blue',
    'green',
    'purple',
    'magenta',
    '#2db7f5',
    '#108ee9',
    '#2db7f5',
  ]

  return (
    <>
      <h1>自定义颜色</h1>
      <div className="badge-Color__wrap">
        {colors.map((color) => (
          <div key={color}>
            <Badge color={color} content="new">
              <Button>按钮</Button>
            </Badge>
            <br />
            <br />
          </div>
        ))}
      </div>
    </>
  )
}
