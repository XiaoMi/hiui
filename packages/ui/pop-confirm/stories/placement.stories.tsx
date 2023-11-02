import Button from '@hi-ui/button'
import React from 'react'
import PopConfirm from '../src'
import { PopperJS } from '@hi-ui/popper'

/**
 * @title 不同方位
 */
export const Placement = () => {
  const [placement, setPlacement] = React.useState<undefined | PopperJS.Placement>()

  const handleClick = (newPlacement) => () => {
    setPlacement(newPlacement)
  }

  const title = <span>文字提示</span>

  return (
    <>
      <h1>Placement</h1>
      <div className="pop-confirm-placement__wrap">
        <table className="placement-table" cellSpacing="5">
          <tbody>
            <tr>
              <td></td>
              <td>
                <PopConfirm placement={placement} title={title}>
                  <Button style={{ width: 100 }} onClick={handleClick('top-start')}>
                    topStart
                  </Button>
                </PopConfirm>
              </td>
              <td>
                <PopConfirm placement={placement} title={title}>
                  <Button style={{ width: 100 }} onClick={handleClick('top')}>
                    top
                  </Button>
                </PopConfirm>
              </td>
              <td>
                <PopConfirm placement={placement} title={title}>
                  <Button style={{ width: 100 }} onClick={handleClick('top-end')}>
                    topEnd
                  </Button>
                </PopConfirm>
              </td>
              <td></td>
            </tr>
            <tr>
              <td>
                <PopConfirm placement={placement} title={title}>
                  <Button style={{ width: 100 }} onClick={handleClick('left-start')}>
                    leftStart
                  </Button>
                </PopConfirm>
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td>
                <PopConfirm placement={placement} title={title}>
                  <Button style={{ width: 100 }} onClick={handleClick('right-start')}>
                    rightStart
                  </Button>
                </PopConfirm>
              </td>
            </tr>
            <tr>
              <td>
                <PopConfirm placement={placement} title={title}>
                  <Button style={{ width: 100 }} onClick={handleClick('left')}>
                    left
                  </Button>
                </PopConfirm>
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td>
                <PopConfirm placement={placement} title={title}>
                  <Button style={{ width: 100 }} onClick={handleClick('right')}>
                    right
                  </Button>
                </PopConfirm>
              </td>
            </tr>
            <tr>
              <td>
                <PopConfirm placement={placement} title={title}>
                  <Button style={{ width: 100 }} onClick={handleClick('left-end')}>
                    leftEnd
                  </Button>
                </PopConfirm>
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td>
                <PopConfirm placement={placement} title={title}>
                  <Button style={{ width: 100 }} onClick={handleClick('right-end')}>
                    rightEnd
                  </Button>
                </PopConfirm>
              </td>
            </tr>
            <tr>
              <td></td>
              <td>
                <PopConfirm placement={placement} title={title}>
                  <Button style={{ width: 100 }} onClick={handleClick('bottom-start')}>
                    bottomStart
                  </Button>
                </PopConfirm>
              </td>
              <td>
                <PopConfirm placement={placement} title={title}>
                  <Button style={{ width: 100 }} onClick={handleClick('bottom')}>
                    bottom
                  </Button>
                </PopConfirm>
              </td>
              <td>
                <PopConfirm placement={placement} title={title}>
                  <Button style={{ width: 100 }} onClick={handleClick('bottom-end')}>
                    bottomEnd
                  </Button>
                </PopConfirm>
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}
