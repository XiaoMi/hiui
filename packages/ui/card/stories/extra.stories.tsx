import React from 'react'
import Card from '../src'
import Button from '@hi-ui/button'

/**
 * @title 带操作用法
 * @desc 可对卡片进行编辑、删除等操作
 */
export const Extra = () => {
  return (
    <>
      <h1>Extra</h1>
      <div className="card-extra__wrap">
        <Card
          title="标题"
          extra={
            <Button type="primary" appearance="link">
              链接
            </Button>
          }
        >
          <div
            style={{
              height: 174,
              backgroundColor: '#F5F8FC',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            此处展示卡片内容
          </div>
        </Card>
        <br />
        <br />
        <Card
          title="标题"
          showHeaderDivider
          extra={
            <Button type="primary" appearance="link">
              链接
            </Button>
          }
        >
          <div
            style={{
              height: 174,
              backgroundColor: '#F5F8FC',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            此处展示卡片内容
          </div>
        </Card>
      </div>
    </>
  )
}
