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
        <Card title="标题" loading>
          <div
            style={{
              height: 174,
              backgroundColor: '#F5F8FC',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          ></div>
        </Card>
      </div>
    </>
  )
}
