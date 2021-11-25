import React from 'react'
import Tooltip from '../src'
import Button from '@hi-ui/button'

export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="tooltip-basic__wrap">
        <Tooltip title={'triggerPropsEvent'}>
          <Button disabled>按钮</Button>
        </Tooltip>
      </div>
    </>
  )
}
