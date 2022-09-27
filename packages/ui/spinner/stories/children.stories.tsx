import React from 'react'
import Spinner from '../src'

/**
 * @title 局部容器加载
 */
export const Children = () => {
  return (
    <>
      <h1>Children</h1>
      <div
        className="spinner-children__wrap"
        style={{ position: 'relative', width: 500, height: 300 }}
      >
        <Spinner>
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
