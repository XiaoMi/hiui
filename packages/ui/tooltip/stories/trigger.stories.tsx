import React from 'react'
import Tooltip from '../src'
import Button from '@hi-ui/button'

export const Trigger = () => {
  const content = <span>Tooltip Title</span>

  return (
    <>
      <h1>Trigger</h1>
      <div className="Tooltip-trigger__wrap">
        <Tooltip content={content}>
          <Button>default</Button>
        </Tooltip>
        <br />
        <br />
        <Tooltip content={content} trigger="click">
          <Button>click</Button>
        </Tooltip>
        <br />
        <br />
        <Tooltip content={content} trigger="contextmenu">
          <Button>contextmenu</Button>
        </Tooltip>
        <br />
        <br />
        <Tooltip content={content} trigger="focus">
          <Button>focus</Button>
        </Tooltip>
      </div>
    </>
  )
}
