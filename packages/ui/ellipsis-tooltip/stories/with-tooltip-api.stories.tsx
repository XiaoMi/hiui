import React from 'react'
import EllipsisTooltip from '../src'

/**
 * @title 最大文字个数
 */
export const withTooltipApi = () => {
  const handleOpen = () => console.log('open tooltip')
  const handleClose = () => console.log('close tooltip')
  return (
    <>
      <h1>结合 tooltip 组件api 使用</h1>
      <div className="ellipsis-tooltip-multiple__wrap" style={{ width: 400 }}>
        <EllipsisTooltip
          maxTextCount={40}
          tooltipProps={{
            arrow: false,
            onOpen: handleOpen,
            onClose: handleClose,
          }}
        >
          【译】孔子说：“学习并且不断温习，不也很愉快吗？远方来了朋友，不也很快乐吗？人家不了解我，我也不怨恨，不也是君子吗？”
        </EllipsisTooltip>
      </div>
    </>
  )
}
