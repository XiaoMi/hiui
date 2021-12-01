import React from 'react'
import { CircleProgress } from '../src'

export const Circle = () => {
  return (
    <>
      <h1>Circle</h1>
      <div className="progress-Circle__wrap">
        <CircleProgress radius={48} percent={70}></CircleProgress>
      </div>
    </>
  )
}
