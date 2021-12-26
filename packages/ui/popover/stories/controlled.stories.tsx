import React from 'react'
import Popover from '../src'
import Button from '@hi-ui/button'

export const Controlled = () => {
  const [visible, setVisible] = React.useState(false)

  const content = (
    <div>
      <div>This is click content</div>
      <span
        style={{
          color: '#4285f4',
          fontSize: '12px',
          cursor: 'pointer',
          marginTop: '10px',
        }}
        onClick={() => {
          setVisible(false)
        }}
      >
        Close
      </span>
    </div>
  )

  return (
    <>
      <h1>Controlled</h1>
      <div className="popover-controlled__wrap">
        <Popover visible={visible} content={content}>
          <Button onClick={() => setVisible(true)}>trigger</Button>
        </Popover>
      </div>
    </>
  )
}
