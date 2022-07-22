import React from 'react'
import Rating from '../src'

/**
 * @title 任意数量
 */
export const Count = () => {
  return (
    <>
      <h1>任意数量</h1>
      <div className="rating-count__wrap">
        <Rating count={10} allowHalf defaultValue={9.5} />
      </div>
    </>
  )
}
