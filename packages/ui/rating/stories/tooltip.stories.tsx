import React from 'react'
import Rating from '../src'

export const Tooltip = () => {
  return (
    <>
      <h1>Rating</h1>
      <div className="rating-Tooltip__wrap">
        <Rating
          defaultValue={3.5}
          tooltips={['极差', '失望', '一般', '满意', '很满意']}
          allowHalf
          halfPlacement="horizontal"
        ></Rating>
      </div>
    </>
  )
}
