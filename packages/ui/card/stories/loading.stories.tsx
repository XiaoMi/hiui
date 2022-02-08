import React from 'react'
import Card from '../src'

export const Loading = () => {
  return (
    <>
      <h1>Loading</h1>
      <div className="card-loading__wrap">
        <Card title="标题" loading extra={<a>链接</a>}>
          基础卡片
        </Card>
      </div>
    </>
  )
}
