import React from 'react'
import Space from '@hi-ui/space'
import Spinner from '../src'

/**
 * @title 设置大小
 */
export const Size = () => {
  return (
    <>
      <h1>Size</h1>
      <div className="spinner-size__wrap">
        <Space size={20}>
          <Spinner size={12} />
          <Spinner size={24} />
          <Spinner size="lg" />
        </Space>
      </div>
    </>
  )
}
