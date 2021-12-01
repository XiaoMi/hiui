import React from 'react'
import Progress from '../src'

export const Indeterminate = () => {
  return (
    <>
      <h1>Indeterminate</h1>
      <div className="progress-indeterminate__wrap">
        <Progress mode="indeterminate" />
      </div>
    </>
  )
}
