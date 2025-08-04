import Button from '@hi-ui/button'
import React from 'react'
import Card from '../src'

/**
 * @title 加载中状态
 */
export const Loading = () => {
  return (
    <>
      <h1>Loading</h1>
      <div className="card-loading__wrap">
        <Card
          title="标题"
          loading
          extra={
            <Button type="primary" appearance="link">
              链接
            </Button>
          }
        >
          基础卡片
        </Card>
      </div>
    </>
  )
}
