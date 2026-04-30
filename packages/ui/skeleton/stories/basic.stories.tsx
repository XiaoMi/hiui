import React from 'react'
import Skeleton from '../src'

/**
 * @title 基础用法
 */
export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
    </>
  )
}
