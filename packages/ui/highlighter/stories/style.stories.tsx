import React from 'react'
import Highlighter from '../src'

/**
 * @title 设置高亮样式
 */
export const Style = () => {
  return (
    <>
      <h1>Style</h1>
      <div className="highlighter-style__wrap">
        <Highlighter keyword="高危" highlightStyle={{ color: 'red', fontWeight: 'bold' }}>
          请注意，这是一段高危操作！！
        </Highlighter>
      </div>
    </>
  )
}
