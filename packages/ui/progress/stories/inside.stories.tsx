import React from 'react'
import Progress from '../src'

export const Inside = () => {
  return (
    <>
      <h1>文字内显</h1>
      <div className="progress-basic__wrap">
        <Progress percent={0} placement="inside" strokeWidth={20} />
        <Progress percent={2} placement="inside" strokeWidth={20} />
        <Progress content="成功" percent={80} placement="inside" strokeWidth={20} />
        <br />
        <Progress type="success" content="成功" percent={100} placement="inside" strokeWidth={20} />
        <br />
        <Progress type="warning" content="警示" percent={50} placement="inside" strokeWidth={20} />
        <br />
        <Progress type="danger" content="错误" percent={20} placement="inside" strokeWidth={20} />
        <Progress percent={75} strokeWidth={20} />
        <br />
      </div>
    </>
  )
}
