import React from 'react'
import Card from '../src'

export const NoHeader = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="card-basic__wrap">
        <Card style={{ width: 600 }}>基础卡片</Card>
      </div>
    </>
  )
}
