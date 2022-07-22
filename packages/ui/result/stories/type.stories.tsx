import React from 'react'
import Result from '../src'

/**
 * @title 不同类型
 * @desc 默认有通知、成功、错误、警告四种类型
 */
export const Type = () => {
  return (
    <>
      <h1>不同类型</h1>
      <div className="result-type__wrap">
        <Result type="info" title="这是一条常规信息" content="这是对常规信息的说明文案" />
        <Result type="success" title="这是一条成功信息" content="这是对成功信息的说明文案" />
        <Result type="warning" title="这是一条警示信息" content="这是对警示信息的说明文案" />
        <Result type="error" title="这是一条错误信息" content="这是对错误信息的说明文案" />
      </div>
    </>
  )
}
