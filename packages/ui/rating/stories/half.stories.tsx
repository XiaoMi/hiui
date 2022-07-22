import React from 'react'
import Rating from '../src'

/**
 * @title 半星
 */
export const Half = () => {
  return (
    <>
      <h1>半星</h1>
      <div className="rating-half__wrap">
        <Rating
          allowHalf
          defaultValue={3.5}
          halfPlacement="horizontal"
          onHover={console.log}
        ></Rating>
        <br />
        <br />
        <Rating allowHalf defaultValue={3.5} halfPlacement="vertical" />
      </div>
    </>
  )
}
