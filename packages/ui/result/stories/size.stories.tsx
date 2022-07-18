import React from 'react'
import Result from '../src'

/**
 * @title 不同尺寸
 * @desc 设置指示器的尺寸大小
 */
export const Size = () => {
  return (
    <>
      <h1>不同尺寸</h1>
      <div className="result-Size__wrap">
        <Result
          imageSize="sm"
          type="success"
          title="这是一条成功信息"
          content="这是对成功信息的说明文案"
        />
        <Result
          imageSize="md"
          type="success"
          title="这是一条成功信息"
          content="这是对成功信息的说明文案"
        />
        <Result
          imageSize="lg"
          type="success"
          title="这是一条成功信息"
          content="这是对成功信息的说明文案"
        />
      </div>
    </>
  )
}
