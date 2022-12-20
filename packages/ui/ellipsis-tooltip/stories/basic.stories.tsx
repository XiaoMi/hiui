import React from 'react'
import EllipsisTooltip from '../src'

export const Basic = () => {
  return (
    <>
      <h1>基本使用</h1>
      <div className="ellipsis-tooltip-basic__wrap" style={{ width: 400 }}>
        <EllipsisTooltip>学而时习之</EllipsisTooltip>
        <div>-----------------------------------------</div>
        <EllipsisTooltip>
          学而时习之，不亦说乎?有朋自远方来，不亦乐乎?人不知而不愠，不亦君子乎？
        </EllipsisTooltip>
        <div>-----------------------------------------</div>
        <EllipsisTooltip numberOfLines={2}>
          【译】孔子说：“学习并且不断温习，不也很愉快吗?远方来了朋友，不也很快乐吗?人家不了解我，我也不怨恨，不也是君子吗?”
        </EllipsisTooltip>
      </div>
    </>
  )
}

export const MaxTextCount = () => {
  return (
    <>
      <h1>超出文字个数限制</h1>
      <div className="ellipsis-tooltip-multiple__wrap" style={{ width: 400 }}>
        <EllipsisTooltip maxTextCount={20}>学而时习之</EllipsisTooltip>
        <div>-----------------------------------------</div>
        <EllipsisTooltip maxTextCount={20}>
          学而时习之，不亦说乎?有朋自远方来，不亦乐乎?人不知而不愠，不亦君子乎？
        </EllipsisTooltip>
        <div>-----------------------------------------</div>
        <EllipsisTooltip maxTextCount={40}>
          【译】孔子说：“学习并且不断温习，不也很愉快吗?远方来了朋友，不也很快乐吗?人家不了解我，我也不怨恨，不也是君子吗?”
        </EllipsisTooltip>
      </div>
    </>
  )
}
