import React from 'react'
import { CircleProgress } from '../src'

/**
 * @title 环形进度条尺寸
 */
export const CircleSize = () => {
  return (
    <>
      <h1>环形进度条尺寸</h1>
      <div
        className="progress-circle-size__wrap"
        style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 48 }}
      >
        <CircleProgress percent={75} size="sm" />
        <CircleProgress percent={75} />
        <CircleProgress percent={75} size="lg" />
      </div>
    </>
  )
}
