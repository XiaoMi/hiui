import React from 'react'
import Tooltip from '../src'
import Button from '@hi-ui/button'
import { Avatar } from '@hi-ui/avatar'

/**
 * @title 基础用法
 * @desc 用于解释、描述、引导
 */
export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="Tooltip-basic__wrap">
        <Tooltip title="Tooltip Title" trigger="hover">
          <Button>trigger</Button>
        </Tooltip>
        <br />
        <br />
        <Tooltip title="Mother" trigger="hover">
          <Avatar initials="M" />
        </Tooltip>
      </div>
    </>
  )
}
