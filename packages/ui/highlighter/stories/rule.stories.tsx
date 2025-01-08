import React from 'react'
import Highlighter from '../src'

/**
 * @title 自定义匹配规则
 */
export const Rule = () => {
  return (
    <>
      <h1>Rule</h1>
      <div className="highlighter-rule__wrap">
        <Highlighter keyword={/hiui/gi}>关键字 hiui，可以匹配上 hiui，也可匹配上 HiUI</Highlighter>
      </div>
    </>
  )
}
