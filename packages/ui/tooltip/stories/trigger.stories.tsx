import React from 'react'
import Tooltip from '../src'
import Button from '@hi-ui/button'

/**
 * @title 自定义触发器
 * @desc 请确保 子元素能接受对应的 onMouseEnter、onMouseLeave、onFocus、onClick 事件
 */
export const Trigger = () => {
  return (
    <>
      <h1>Trigger</h1>
      <div className="Tooltip-trigger__wrap">
        <Tooltip title="Tooltip Title">
          <Button>default</Button>
        </Tooltip>
        <br />
        <br />
        <Tooltip title="Tooltip Title" trigger="click">
          <Button>click</Button>
        </Tooltip>
        <br />
        <br />
        <Tooltip title="Tooltip Title" trigger="contextmenu">
          <Button>contextmenu</Button>
        </Tooltip>
        <br />
        <br />
        <Tooltip title="Tooltip Title" trigger="focus">
          <Button>focus</Button>
        </Tooltip>
      </div>
    </>
  )
}
