import React from 'react'
import Card from '../src'

/**
 * @title 无边框
 */
export const NoBordered = () => {
  return (
    <>
      <h1>无边框</h1>
      <div
        className="card-no-header__wrap"
        style={{ padding: 32, backgroundColor: 'rgb(243, 244, 247)' }}
      >
        <Card bordered={false} title="我是标题">
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
