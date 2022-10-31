import React from 'react'
import PopConfirm from '../src'
import Button from '@hi-ui/button'

/**
 * @title 设置基于依附元素的间隙偏移量
 */
export const GutterGap = () => {
  return (
    <>
      <h1>Gutter Gap</h1>
      <div className="pop-confirm-basic__wrap">
        <PopConfirm title="Delete this item along with the entered content?" gutterGap={30}>
          <Button>Trigger</Button>
        </PopConfirm>
      </div>
    </>
  )
}
