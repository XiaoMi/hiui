import React from 'react'
import Result from '../src'

/**
 * @title 基础用法
 */
export const Basic = () => {
  return (
    <>
      <h1>基础功能</h1>
      <div className="result-basic__wrap">
        <Result title="我是标题" content="我是结果信息的说明文案"></Result>
      </div>
    </>
  )
}
