import React from 'react'
import Space from '../src'
import Button from '@hi-ui/button'
import { ArrowRightOutlined } from '@hi-ui/icons'

export const Diliver = () => {
  return (
    <>
      <h1>分隔符</h1>
      <div className="space-basic__wrap">
        <Space split={<ArrowRightOutlined />} align="center">
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
