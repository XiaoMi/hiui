import React from 'react'
import Tooltip from '../src'
import Button from '@hi-ui/button'

export const BreakWord = () => {
  return (
    <>
      <h1>BreakWord</h1>
      <div className="Tooltip-break-word__wrap">
        <Tooltip
          title={<div style={{ width: 200 }}>这是两行提示文字这是两行提示文字这是两行提示文字</div>}
          trigger="click"
        >
          <Button>trigger</Button>
        </Tooltip>
      </div>
    </>
  )
}
