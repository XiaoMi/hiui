import React from 'react'
import Badge from '../src'
import { Button } from '@hi-ui/button'
import { BellOutlined } from '@hi-ui/icons'

export const Bubble = () => {
  return (
    <>
      <h1>徽标</h1>
      <div className="badge-basic__wrap">
        <div>
          <Badge content={8} style={{ marginRight: 20 }}>
            <BellOutlined style={{ fontSize: '24px' }} />
          </Badge>
          <Badge content={12} style={{ marginRight: 20 }}>
            <BellOutlined style={{ fontSize: '24px' }} />
          </Badge>
          <Badge content={88} max={44} style={{ marginRight: 20 }}>
            <BellOutlined style={{ fontSize: '24px' }} />
          </Badge>
          <Badge content={'new'} style={{ marginRight: 20 }}>
            <BellOutlined style={{ fontSize: '24px' }} />
          </Badge>
        </div>
      </div>
    </>
  )
}
