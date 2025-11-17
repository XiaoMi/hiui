import React from 'react'
import Loading from '../src'

/**
 * @title 设置加载类型
 */
export const Type = () => {
  return (
    <>
      <h1>Type</h1>
      <div
        className="loading-basic__wrap"
        style={{ position: 'relative', width: 500, height: 300 }}
      >
        <Loading type="dot">
          <div
            style={{
              width: 500,
              height: 300,
              boxSizing: 'border-box',
              background: '#f5f7fa',
              padding: 20,
              border: '20px solid #5f6a7a',
            }}
          />
        </Loading>
      </div>
    </>
  )
}
