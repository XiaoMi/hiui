import React from 'react'
import Progress from '../src'

export const BarSize = () => {
  return (
    <>
      <h1>条形进度条尺寸</h1>
      <div className="progress-basic__wrap">
        <Progress percent={75} size="sm" />
        <br />
        <Progress percent={75} />
        <br />
        <Progress percent={75} size="lg" active />
      </div>
    </>
  )
}
