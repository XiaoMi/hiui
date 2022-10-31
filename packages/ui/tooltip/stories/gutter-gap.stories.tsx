import React from 'react'
import Tooltip from '../src'
import Button from '@hi-ui/button'

/**
 * @title 设置基于依附元素的间隙偏移量
 */
export const GutterGap = () => {
  return (
    <>
      <h1>Gutter Gap</h1>
      <div className="Tooltip-basic__wrap">
        <Tooltip title="Tooltip Title" gutterGap={30} trigger="hover">
          <Button>trigger</Button>
        </Tooltip>
      </div>
    </>
  )
}
