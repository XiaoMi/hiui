import React from 'react'
import Space from '../src'
import Button from '@hi-ui/button'
import { RightOutlined } from '@hi-ui/icons'

/**
 * @title 分隔符
 * @desc 通过 separator 自定义分隔符
 */
export const Split = () => {
  return (
    <>
      <h1>分隔符</h1>
      <div className="space-basic__wrap">
        <Space separator={<RightOutlined />} align="center">
          <Button type="primary" appearance="link">
            button
          </Button>
          <Button type="primary" appearance="link">
            button
          </Button>
          <Button type="primary" appearance="link">
            button
          </Button>
          <Button type="primary" appearance="link">
            button
          </Button>
        </Space>
      </div>
    </>
  )
}
