import React from 'react'
import Popover from '../src'
import Button from '@hi-ui/button'

/**
 * @title 基础用法
 * @desc 用于信息描述、辅助信息等
 */
export const Basic = () => {
  const title = <span>文字提示</span>
  const content = (
    <div>
      <div>此处展示 Popover 具体内容</div>
      <div>具体内容可以自行渲染</div>
    </div>
  )

  return (
    <>
      <h1>Basic</h1>
      <div className="popover-basic__wrap">
        <Popover title={title} content={content} trigger="click">
          <Button>trigger</Button>
        </Popover>
      </div>
    </>
  )
}
