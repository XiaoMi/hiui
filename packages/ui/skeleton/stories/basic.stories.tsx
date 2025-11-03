import React from 'react'
import Skeleton from '../src'

export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="skeleton-basic__wrap">
        <Skeleton.Group animation="wave">
          <Skeleton size="lg" style={{ width: '30%' }} />
          <Skeleton />
          <Skeleton />
          <Skeleton style={{ width: '70%' }} />
        </Skeleton.Group>
      </div>
    </>
  )
}
