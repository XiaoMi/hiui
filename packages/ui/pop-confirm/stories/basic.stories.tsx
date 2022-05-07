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
        <PopConfirm title="Delete this item along with the entered content?">
          <Button>Trigger</Button>
        </PopConfirm>
      </div>
    </>
  )
}
