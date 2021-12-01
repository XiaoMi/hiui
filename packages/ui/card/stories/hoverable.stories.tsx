import React from 'react'
import Card from '../src'

export const Hoverable = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="card-basic__wrap">
        <Card size="default" hoverable style={{ width: 600 }}>
          基础卡片
        </Card>
      </div>
    </>
  )
}
