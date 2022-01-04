import React from 'react'
import Progress from '../src'

export const Basic = () => {
  return (
    <>
      <h1>条形进度条</h1>
      <div className="progress-basic__wrap">
        <Progress content="成功" percent={80} />
        <br />
        <Progress type="success" content="成功" percent={100} />
        <br />
        <Progress type="warning" content="警示" percent={50} />
        <br />
        <Progress type="error" content="错误" percent={20} />
        <br />
        <Progress percent={75} />
        <br />
      </div>
    </>
  )
}
