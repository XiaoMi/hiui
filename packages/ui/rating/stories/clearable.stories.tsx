import React from 'react'
import Rating from '../src'

/**
 * @title 禁止清除
 */
export const Clearable = () => {
  return (
    <>
      <h1>Clearable</h1>
      <div className="rating-clearable__wrap">
        <Rating defaultValue={3} clearable={false} />
      </div>
    </>
  )
}
