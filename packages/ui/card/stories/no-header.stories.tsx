import React from 'react'
import Card from '../src'

/**
 * @title 无标题卡片
 */
export const NoHeader = () => {
  return (
    <>
      <h1>NoHeader</h1>
      <div className="card-no-header__wrap">
        <Card>
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
