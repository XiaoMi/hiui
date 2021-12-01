import React from 'react'
import Progress from '../src'

export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="progress-basic__wrap">
        <Progress value={48} bufferValue={70}></Progress>
      </div>
    </>
  )
}
