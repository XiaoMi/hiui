import React from 'react'
import EllipsisTooltip from '../src'

/**
 * @title 多行省略
 */
export const MultiplyLine = () => {
  const textOverview =
  '【译】孔子说：“学习并且不断温习，不也很愉快吗？远方来了朋友，不也很快乐吗？人家不了解我，我也不怨恨，不也是君子吗？”，【译】孔子说：“学习并且不断温习，不也很愉快吗？远方来了朋友，不也很快乐吗？人家不了解我，我也不怨恨，不也是君子吗？”'

  return (
    <>
      <h1>多行省略</h1>
      <div className="ellipsis-tooltip-basic__wrap" style={{ width: 400, margin: '0 auto' }}>
        <h4>超出 3 行(tooltip 内容过多可设置样式换行)</h4>
        <EllipsisTooltip
          numberOfLines={3}
          tooltipProps={{
            title: <div style={{ width: 400 }}>{textOverview}</div>,
          }}
        >
          {textOverview}
        </EllipsisTooltip>
      </div>
    </>
  )
}
