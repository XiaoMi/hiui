import React from 'react'
import Card from '../src'

export const Hoverable = () => {
  return (
    <>
      <h1>Hoverable</h1>
      <div className="card-hoverable__wrap">
        <Card hoverable style={{ width: 600 }}>
          <div
            style={{
              height: 174,
              backgroundColor: '#F5F7FA',
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
