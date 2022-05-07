import React from 'react'
import Rating from '../src'

/**
 * @title 受控
 */
export const Controlled = () => {
  const [value] = React.useState(1)
  return (
    <>
      <h1>Controlled</h1>
      <div className="rating-controlled__wrap">
        <Rating value={value} />
      </div>
    </>
  )
}
