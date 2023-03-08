import React from 'react'
import EllipsisTooltip from '../src'

/**
 * @title 基础用法
 */
export const Basic = () => {
  return (
    <>
      <h1>基本使用 </h1>
      <div className="ellipsis-tooltip-basic__wrap" style={{ width: 400, margin: '0 auto' }}>
        <h4>没有超出</h4>
        <EllipsisTooltip>没有超出限制时，不会出现提示</EllipsisTooltip>
        <h4>超出宽度限制</h4>
        <EllipsisTooltip>
          学而时习之，不亦说乎？有朋自远方来，不亦乐乎？人不知而不愠，不亦君子乎？
        </EllipsisTooltip>
      </div>
    </>
  )
}
