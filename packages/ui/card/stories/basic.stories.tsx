import React from 'react'
import Card from '../src'

export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="card-basic__wrap">
        <Card title="标题" size="default" extra={<a>链接</a>}>
          基础卡片
        </Card>
        <Card title="标题" size="default" showHeaderDivider extra={<a>链接</a>}>
          基础卡片
        </Card>
      </div>
    </>
  )
}
