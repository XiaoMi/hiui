import React from 'react'
import EllipsisTooltip from '../src'

/**
 * @title 超出字数省略
 */
export const MaxTextCount = () => {
  const textOverview = '学而时习之，不亦说乎？有朋自远方来，不亦乐乎？人不知而不愠，不亦君子乎？'

  return (
    <>
      <h1>超出字数省略</h1>
      <div className="ellipsis-tooltip-multiple__wrap" style={{ width: 400, margin: '0 auto' }}>
        <h2>没有超出</h2>
        <EllipsisTooltip maxTextCount={20}>学而时习之</EllipsisTooltip>
        <h2>文字超出 20 个字符时</h2>
        <EllipsisTooltip
          maxTextCount={20}
          tooltipProps={{
            title: <div style={{ width: 320 }}>{textOverview}</div>,
          }}
        >
          {textOverview}
        </EllipsisTooltip>
      </div>
    </>
  )
}
