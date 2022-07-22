import React from 'react'
import Popover from '../src'
import Button from '@hi-ui/button'

/**
 * @title 自定义触发器
 * @desc 请确保子元素能接受对应的 onMouseEnter、onMouseLeave、onFocus、onClick 事件
 */
export const Trigger = () => {
  const title = <span>文字提示</span>
  const content = (
    <div>
      <div>此处展示 Popover 具体内容</div>
      <div>具体内容可以自行渲染</div>
    </div>
  )

  return (
    <>
      <h1>Trigger</h1>
      <div className="Popover-trigger__wrap">
        <Popover title={title} content={content}>
          <Button>default click</Button>
        </Popover>
        <br />
        <br />
        <Popover title={title} content={content} trigger="hover">
          <Button>hover</Button>
        </Popover>
        <br />
        <br />
        <Popover title={title} content={content} trigger="contextmenu">
          <Button>contextmenu</Button>
        </Popover>
      </div>
    </>
  )
}
