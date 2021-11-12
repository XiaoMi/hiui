import React from 'react'
import Popover from '../src'
import Button from '@hi-ui/button'

export const Basic = () => {
  const [btnEl, setBtnEl] = React.useState(null)
  const [visible, setVisible] = React.useState(false)

  return (
    <>
      <h1>Basic</h1>
      <div className="popper-basic__wrap">
        <Popover visible={visible} attachEl={btnEl} onClose={() => setVisible(false)}>
          {/* <div style={{ width: 200 }}>HiUI</div> */}
          {/* <div style={{ height: 200 }}>HiUI</div> */}
          {/* <div style={{ width: 200, height: 200 }}>HiUI</div> */}
        </Popover>

        <Button onClick={() => setVisible((prev) => !prev)}>trigger</Button>
      </div>
    </>
  )
}
