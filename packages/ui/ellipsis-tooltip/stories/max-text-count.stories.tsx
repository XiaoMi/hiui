import React from 'react'
import EllipsisTooltip from '../src'

/**
 * @title 超出字数省略
 */
export const MaxTextCount = () => {
  return (
    <>
      <h1>超出字数省略</h1>
      <div className="ellipsis-tooltip-multiple__wrap" style={{ width: 400, margin: '0 auto' }}>
        <h4>没有超出</h4>
        <EllipsisTooltip maxTextCount={20}>学而时习之</EllipsisTooltip>
        <h4>文字超出 20 个字符时</h4>
        <EllipsisTooltip maxTextCount={20}>
          学而时习之，不亦说乎？有朋自远方来，不亦乐乎？人不知而不愠，不亦君子乎？
        </EllipsisTooltip>
        <h4>文字超出 40 个字符时</h4>
        <EllipsisTooltip maxTextCount={40}>
          【译】孔子说：“学习并且不断温习，不也很愉快吗？远方来了朋友，不也很快乐吗？人家不了解我，我也不怨恨，不也是君子吗？”
        </EllipsisTooltip>
      </div>
    </>
  )
}
