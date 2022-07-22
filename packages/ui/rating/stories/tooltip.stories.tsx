import React from 'react'
import Rating from '../src'

/**
 * @title 带Tooltip
 */
export const Tooltip = () => {
  return (
    <>
      <h1>带Tooltip</h1>
      <div className="rating-tooltip__wrap">
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
