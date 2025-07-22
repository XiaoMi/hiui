import Button from '@hi-ui/button'
import React from 'react'
import PopConfirm from '../src'

/**
 * @title 基础用法
 */
export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="pop-confirm-basic__wrap">
        <PopConfirm style={{ minWidth: 280 }} title="Hello! Are you OK?">
          <Button>Trigger</Button>
        </PopConfirm>
      </div>
    </>
  )
}
