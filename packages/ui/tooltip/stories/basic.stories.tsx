import React from 'react'
import Tooltip from '../src'
import Button from '@hi-ui/button'

export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="Tooltip-basic__wrap">
        <Tooltip title="Tooltip Title" trigger="hover">
          <Button>trigger</Button>
        </Tooltip>
      </div>
    </>
  )
}
