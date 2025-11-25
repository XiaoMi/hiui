import React from 'react'
import Tooltip from '../src'
import Button from '@hi-ui/button'

/**
 * @title 基础用法
 * @desc 用于解释、描述、引导
 */
export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="Tooltip-basic__wrap">
        <Tooltip title="7" trigger="hover" placement="top">
          <Button>trigger</Button>
        </Tooltip>
      </div>
    </>
  )
}
