import React from 'react'
import Popover from '../src'
import Button from '@hi-ui/button'

/**
 * @title 自定义触发器
 * @desc 请确保 子元素能接受对应的 onMouseEnter、onMouseLeave、onFocus、onClick 事件
 */
export const Trigger = () => {
  return (
    <>
      <h1>Trigger</h1>
      <div className="Popover-trigger__wrap">
        <Popover content="Popover Title">
          <Button>default click</Button>
        </Popover>
        <br />
        <br />
        <Popover content="Popover Title" trigger="hover">
          <Button>hover</Button>
        </Popover>
        <br />
        <br />
        <Popover content="Popover Title" trigger="contextmenu">
          <Button>contextmenu</Button>
        </Popover>
      </div>
    </>
  )
}
