import React from 'react'
import Rating from '../src'

/**
 * @title 设置尺寸
 */
export const Size = () => {
  return (
    <>
      <h1>Size</h1>
      <div className="rating-size__wrap">
        <div>
          <Rating defaultValue={3} style={{ fontSize: 14 }} />
        </div>
        <div style={{ marginTop: 10 }}>
          <Rating defaultValue={3} style={{ fontSize: 20 }} />
        </div>
      </div>
    </>
  )
}
