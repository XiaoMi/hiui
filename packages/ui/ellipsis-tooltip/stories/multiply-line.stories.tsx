import React from 'react'
import EllipsisTooltip from '../src'

/**
 * @title 基础用法
 */
export const MultiplyLine = () => {
  return (
    <>
      <h1>超出多行提示使用</h1>
      <div className="ellipsis-tooltip-basic__wrap" style={{ width: 400 }}>
        <h4>超出 2 行时</h4>
        <EllipsisTooltip numberOfLines={2}>
          【译】孔子说：“学习并且不断温习，不也很愉快吗？远方来了朋友，不也很快乐吗？人家不了解我，我也不怨恨，不也是君子吗？”
        </EllipsisTooltip>
        <h4>超出 3 行时</h4>
        <EllipsisTooltip numberOfLines={3}>
          【译】孔子说：“学习并且不断温习，不也很愉快吗？远方来了朋友，不也很快乐吗？人家不了解我，我也不怨恨，不也是君子吗？”，【译】孔子说：“学习并且不断温习，不也很愉快吗？远方来了朋友，不也很快乐吗？人家不了解我，我也不怨恨，不也是君子吗？”
        </EllipsisTooltip>
      </div>
    </>
  )
}
