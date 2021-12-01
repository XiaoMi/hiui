import React from 'react'
import Popover from '../src'
import Button from '@hi-ui/button'

export const Basic = () => {
  const title = <span>Popover Title</span>
  const content = (
    <div>
      <p>Vivamus sagittis lacus vel augue laoreet rutrum faucibus.</p>
      <p>Vivamus sagittis lacus vel augue laoreet rutrum faucibus.</p>
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
