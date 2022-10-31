import React from 'react'
import Popover from '../src'
import Button from '@hi-ui/button'

/**
 * @title 设置基于依附元素的间隙偏移量
 */
export const GutterGap = () => {
  const title = <span>文字提示</span>
  const content = (
    <div>
      <div>此处展示 Popover 具体内容</div>
      <div>具体内容可以自行渲染</div>
    </div>
  )

  return (
    <>
      <h1>Gutter Gap</h1>
      <div className="popover-basic__wrap">
        <Popover title={title} content={content} gutterGap={30} trigger="click">
          <Button>trigger</Button>
        </Popover>
      </div>
    </>
  )
}
