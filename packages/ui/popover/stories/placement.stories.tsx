import React from 'react'
import Popover from '../src'
import Button from '@hi-ui/button'
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
  const content = (
    <div>
      <div>当前展示方位：{placement}</div>
    </div>
  )

  return (
    <>
      <h1>Placement</h1>
      <div className="popper-placement__wrap">
        <table className="placement-table" cellSpacing="5">
          <tbody>
            <tr>
              <td></td>
              <td>
                <Popover placement={placement} title={title} content={content} trigger="click">
                  <Button style={{ width: 100 }} onClick={handleClick('top-start')}>
                    topStart
                  </Button>
                </Popover>
              </td>
              <td>
                <Popover placement={placement} title={title} content={content} trigger="click">
                  <Button style={{ width: 100 }} onClick={handleClick('top')}>
                    top
                  </Button>
                </Popover>
              </td>
              <td>
                <Popover placement={placement} title={title} content={content} trigger="click">
                  <Button style={{ width: 100 }} onClick={handleClick('top-end')}>
                    topEnd
                  </Button>
                </Popover>
              </td>
              <td></td>
            </tr>
            <tr>
              <td>
                <Popover placement={placement} title={title} content={content} trigger="click">
                  <Button style={{ width: 100 }} onClick={handleClick('left-start')}>
                    leftStart
                  </Button>
                </Popover>
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td>
                <Popover placement={placement} title={title} content={content} trigger="click">
                  <Button style={{ width: 100 }} onClick={handleClick('right-start')}>
                    rightStart
                  </Button>
                </Popover>
              </td>
            </tr>
            <tr>
              <td>
                <Popover placement={placement} title={title} content={content} trigger="click">
                  <Button style={{ width: 100 }} onClick={handleClick('left')}>
                    left
                  </Button>
                </Popover>
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td>
                <Popover placement={placement} title={title} content={content} trigger="click">
                  <Button style={{ width: 100 }} onClick={handleClick('right')}>
                    right
                  </Button>
                </Popover>
              </td>
            </tr>
            <tr>
              <td>
                <Popover placement={placement} title={title} content={content} trigger="click">
                  <Button style={{ width: 100 }} onClick={handleClick('left-end')}>
                    leftEnd
                  </Button>
                </Popover>
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td>
                <Popover placement={placement} title={title} content={content} trigger="click">
                  <Button style={{ width: 100 }} onClick={handleClick('right-end')}>
                    rightEnd
                  </Button>
                </Popover>
              </td>
            </tr>
            <tr>
              <td></td>
              <td>
                <Popover placement={placement} title={title} content={content} trigger="click">
                  <Button style={{ width: 100 }} onClick={handleClick('bottom-start')}>
                    bottomStart
                  </Button>
                </Popover>
              </td>
              <td>
                <Popover placement={placement} title={title} content={content} trigger="click">
                  <Button style={{ width: 100 }} onClick={handleClick('bottom')}>
                    bottom
                  </Button>
                </Popover>
              </td>
              <td>
                <Popover placement={placement} title={title} content={content} trigger="click">
                  <Button style={{ width: 100 }} onClick={handleClick('bottom-end')}>
                    bottomEnd
                  </Button>
                </Popover>
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}
