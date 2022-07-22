import React from 'react'
import Progress from '../src'

/**
 * @title 等待中进度
 */
export const Indeterminate = () => {
  return (
    <>
      <h1>Indeterminate</h1>
      <div className="progress-indeterminate__wrap">
        <Progress indeterminate />
      </div>
    </>
  )
}
