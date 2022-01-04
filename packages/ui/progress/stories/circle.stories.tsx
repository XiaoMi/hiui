import React from 'react'
import { CircleProgress } from '../src'
import { CheckOutlined, CloseOutlined, ExclamationOutlined } from '@hi-ui/icons'

export const Circle = () => {
  return (
    <>
      <h1>Circle</h1>
      <div className="progress-Circle__wrap">
        <CircleProgress content="成功" percent={80} />

        <CircleProgress
          type="success"
          content={<CheckOutlined style={{ fontSize: '20px' }} />}
          percent={100}
        />

        <CircleProgress
          type="warning"
          content={<CloseOutlined style={{ fontSize: '20px' }} />}
          percent={50}
        />

        <CircleProgress
          type="error"
          content={<ExclamationOutlined style={{ fontSize: '20px' }} />}
          percent={20}
        />
        <CircleProgress percent={75} />
      </div>
    </>
  )
}
