import React from 'react'
import Skeleton from '../src'

export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="skeleton-basic__wrap">
        <Skeleton.Group animation="wave">
          <Skeleton size="lg" width={'30%'} />
          <Skeleton />
          <Skeleton />
          <Skeleton width={'70%'} />
        </Skeleton.Group>
      </div>
    </>
  )
}
