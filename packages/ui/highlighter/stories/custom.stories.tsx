import React from 'react'
import Highlighter from '../src'

/**
 * @title 自定义高亮
 */
export const Custom = () => {
  return (
    <>
      <h1>Custom</h1>
      <div className="highlighter-Custom__wrap">
        <Highlighter keyword="自定义高亮" color='red' style={{ fontSize: '18px' }}>我希望高亮的文案是：自定义高亮 </Highlighter>
      </div>
    </>
  )
}
