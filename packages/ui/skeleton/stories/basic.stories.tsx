import React from 'react'
import Skeleton from '../src'

export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div
        className="skeleton-basic__wrap"
        style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}
      >
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
    </>
  )
}
