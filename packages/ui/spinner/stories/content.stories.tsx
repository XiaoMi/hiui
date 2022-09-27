import React from 'react'
import Spinner from '../src'

/**
 * @title 设置提示内容
 */
export const Content = () => {
  return (
    <>
      <h1>Content</h1>
      <div
        className="spinner-visible__wrap"
        style={{ position: 'relative', width: 500, height: 300 }}
      >
        <Spinner content="loading...">
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
        </Spinner>
      </div>
    </>
  )
}
