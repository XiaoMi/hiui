import React from 'react'
import Tooltip from '../src'
import Button from '@hi-ui/button'

export const Basic = () => {
  const content = <span>Tooltip Title</span>

  return (
    <>
      <h1>Basic</h1>
      <div className="Tooltip-basic__wrap">
        <Tooltip content={content} trigger="hover">
          <Button>trigger</Button>
        </Tooltip>
      </div>
    </>
  )
}
