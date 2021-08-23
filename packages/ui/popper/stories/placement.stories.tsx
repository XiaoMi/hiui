import React from 'react'
import Popper from '../src'
import Button from '@hi-ui/button'
import * as PopperJS from '@popperjs/core'

export const Placement = () => {
  const [btnEl, setBtnEl] = React.useState(null)
  const [visible, setVisible] = React.useState(false)
  const [placement, setPlacement] = React.useState<undefined | PopperJS.Placement>()

  const handleClick = (newPlacement) => (event) => {
    setBtnEl(event.currentTarget)
    setPlacement(newPlacement)
    setVisible(true)
  }

  return (
    <>
      <h1>Placement</h1>
      <div className="popper-basic__wrap">
        <Popper
          visible={visible}
          attachEl={btnEl}
          placement={placement}
          onClose={() => setVisible(false)}
          arrow
        >
          {/* <div style={{ width: 200 }}>HiUI</div> */}
          {/* <div style={{ height: 200 }}>HiUI</div> */}
          {/* <div style={{ width: 200, height: 200 }}>HiUI</div> */}
        </Popper>

        <table className="placement-table" cellSpacing="5">
          <tbody>
            <tr>
              <td></td>
              <td>
                <Button onClick={handleClick('top-start')}>topStart</Button>
              </td>
              <td>
                <Button onClick={handleClick('top')}>top</Button>
              </td>
              <td>
                <Button onClick={handleClick('top-end')}>topEnd</Button>
              </td>
              <td></td>
            </tr>
            <tr>
              <td>
                <Button onClick={handleClick('left-start')}>leftStart</Button>
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td>
                <Button onClick={handleClick('right-start')}>rightStart</Button>
              </td>
            </tr>
            <tr>
              <td>
                <Button onClick={handleClick('left')}>left</Button>
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td>
                <Button onClick={handleClick('right')}>right</Button>
              </td>
            </tr>
            <tr>
              <td>
                <Button onClick={handleClick('left-end')}>leftEnd</Button>
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td>
                <Button onClick={handleClick('right-end')}>rightEnd</Button>
              </td>
            </tr>
            <tr>
              <td></td>
              <td>
                <Button onClick={handleClick('bottom-start')}>bottomStart</Button>
              </td>
              <td>
                <Button onClick={handleClick('bottom')}>bottom</Button>
              </td>
              <td>
                <Button onClick={handleClick('bottom-end')}>bottomEnd</Button>
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}
