import React from 'react'
import Tooltip from '../src'
import Button from '@hi-ui/button'

export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="tooltip-basic__wrap">
        <Tooltip visible title={'triggerPropsEvent'}>
          <Button>按钮</Button>
        </Tooltip>
      </div>
    </>
  )
}
