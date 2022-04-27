import React from 'react'
import Badge from '../src'
import { BellOutlined } from '@hi-ui/icons'

/**
 * @title 徽标
 * @desc 标识消息数或简洁描述
 */
export const Bubble = () => {
  return (
    <>
      <h1>徽标</h1>
      <div className="badge-basic__wrap">
        <div>
          <Badge content={8} style={{ marginRight: 20 }}>
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
