import React from 'react'
import Spinner from '@hi-ui/spinner'
import Loading from '../src'

/**
 * @title 设置加载指示符
 */
export const Indicator = () => {
  return (
    <>
      <h1>Indicator</h1>
      <div
        className="loading-basic__wrap"
        style={{ position: 'relative', width: 500, height: 300 }}
      >
        <Loading indicator={<Spinner size={30} />}>
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
