import React from 'react'
import Rate from '../src'

export const Basic = () => {
  return (
    <>
      <h1>Rate</h1>
      <div className="rate-basic__wrap">
        <Rate halfPlacement="horizontal"></Rate>
        <br />
        <Rate halfPlacement="vertical"></Rate>
      </div>
    </>
  )
}
