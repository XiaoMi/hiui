import React from 'react'
import Tooltip from '../src'
import Button from '@hi-ui/button'

/**
 * @title 不同方位
 */
export const Placement = () => {
  return (
    <>
      <h1>Placement</h1>
      <div className="popper-placement__wrap">
        <table className="placement-table" cellSpacing="5">
          <tbody>
            <tr>
              <td></td>
              <td>
                <Tooltip
                  title="我是内容我是内容我是内容我是内容"
                  trigger="hover"
                  placement="top-start"
                >
                  <Button style={{ width: 100 }}>top-start</Button>
                </Tooltip>
              </td>
              <td>
                <Tooltip title="我是内容我是内容我是内容我是内容" trigger="hover" placement="top">
                  <Button style={{ width: 100 }}>top</Button>
                </Tooltip>
              </td>
              <td>
                <Tooltip
                  title="我是内容我是内容我是内容我是内容"
                  trigger="hover"
                  placement="top-end"
                >
                  <Button style={{ width: 100 }}>top-end</Button>
                </Tooltip>
              </td>
              <td></td>
            </tr>
            <tr>
              <td>
                <Tooltip
                  title="我是内容我是内容我是内容我是内容"
                  trigger="hover"
                  placement="left-start"
                >
                  <Button style={{ width: 100 }}>left-start</Button>
                </Tooltip>
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td>
                <Tooltip
                  title="我是内容我是内容我是内容我是内容"
                  trigger="hover"
                  placement="right-start"
                >
                  <Button style={{ width: 100 }}>right-start</Button>
                </Tooltip>
              </td>
            </tr>
            <tr>
              <td>
                <Tooltip title="我是内容我是内容我是内容我是内容" trigger="hover" placement="left">
                  <Button style={{ width: 100 }}>left</Button>
                </Tooltip>
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td>
                <Tooltip title="我是内容我是内容我是内容我是内容" trigger="hover" placement="right">
                  <Button style={{ width: 100 }}>right</Button>
                </Tooltip>
              </td>
            </tr>
            <tr>
              <td>
                <Tooltip
                  title="我是内容我是内容我是内容我是内容"
                  trigger="hover"
                  placement="left-end"
                >
                  <Button style={{ width: 100 }}>left-end</Button>
                </Tooltip>
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td>
                <Tooltip
                  title="我是内容我是内容我是内容我是内容"
                  trigger="hover"
                  placement="right-end"
                >
                  <Button style={{ width: 100 }}>right-end</Button>
                </Tooltip>
              </td>
            </tr>
            <tr>
              <td></td>
              <td>
                <Tooltip
                  title="我是内容我是内容我是内容我是内容"
                  trigger="hover"
                  placement="bottom-start"
                >
                  <Button style={{ width: 100 }}>bottom-start</Button>
                </Tooltip>
              </td>
              <td>
                <Tooltip
                  title="我是内容我是内容我是内容我是内容"
                  trigger="hover"
                  placement="bottom"
                >
                  <Button style={{ width: 100 }}>bottom</Button>
                </Tooltip>
              </td>
              <td>
                <Tooltip
                  title="我是内容我是内容我是内容我是内容"
                  trigger="hover"
                  placement="bottom-end"
                >
                  <Button style={{ width: 100 }}>bottom-end</Button>
                </Tooltip>
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}
