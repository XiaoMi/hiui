import React from 'react'
import { CircleProgress } from '../src'

/**
 * @title 环形进度条尺寸
 */
export const CircleSize = () => {
  return (
    <>
      <h1>环形进度条尺寸</h1>
      <div className="progress-circle-size__wrap">
        <CircleProgress percent={75} size="sm" />
        <br />
        <CircleProgress percent={75} />
        <br />
        <CircleProgress percent={75} size="lg" />
      </div>
    </>
  )
}
