import React from 'react'
import Popover from '../src'
import Button from '@hi-ui/button'

/**
 * @title 不带箭头
 */
export const Arrow = () => {
  return (
    <>
      <h1>Arrow</h1>
      <div className="popper-arrow__wrap">
        <Popover arrow={false} gutterGap={4} content="Popover 文字内容">
          <Button>trigger</Button>
        </Popover>
      </div>
    </>
  )
}
