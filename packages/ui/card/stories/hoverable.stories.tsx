import React from 'react'
import Card from '../src'

/**
 * @title hover 效果
 */
export const Hoverable = () => {
  return (
    <>
      <h1>Hoverable</h1>
      <div className="card-hoverable__wrap">
        <Card hoverable>
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
