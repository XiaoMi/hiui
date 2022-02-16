import React from 'react'
import Popover from '../src'
import Button from '@hi-ui/button'

export const Basic = () => {
  const title = <span>Popover Title</span>
  const content = (
    <div>
      <div>Vivamus sagittis lacus vel augue laoreet rutrum faucibus.</div>
      <div>Vivamus sagittis lacus vel augue laoreet rutrum faucibus.</div>
    </div>
  )

  return (
    <>
      <h1>Basic</h1>
      <div className="popover-basic__wrap">
        <Popover title={title} content={content} trigger="hover">
          <Button>trigger</Button>
        </Popover>
      </div>
    </>
  )
}
