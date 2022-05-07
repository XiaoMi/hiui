import React from 'react'
import { CircleProgress } from '../src'
import { CheckOutlined, CloseOutlined, ExclamationOutlined } from '@hi-ui/icons'

/**
 * @title 环形用法
 * @desc 在局限空间里展示加载进度，如图片上传、附件上传
 */
export const Circle = () => {
  return (
    <>
      <h1>环形用法</h1>
      <div className="progress-circle__wrap">
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
