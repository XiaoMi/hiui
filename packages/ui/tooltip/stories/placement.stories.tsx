import React from 'react'
import Tooltip from '../src'
import Button from '@hi-ui/button'

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
                  trigger="click"
                  popper={{ placement: 'top-start' }}
                >
                  <Button>top-start</Button>
                </Tooltip>
              </td>
              <td>
                <Tooltip
                  title="我是内容我是内容我是内容我是内容"
                  trigger="click"
                  popper={{ placement: 'top' }}
                >
                  <Button>top</Button>
                </Tooltip>
              </td>
              <td>
                <Tooltip
                  title="我是内容我是内容我是内容我是内容"
                  trigger="click"
                  popper={{ placement: 'top-end' }}
                >
                  <Button>top-end</Button>
                </Tooltip>
              </td>
              <td></td>
            </tr>
            <tr>
              <td>
                <Tooltip
                  title="我是内容我是内容我是内容我是内容"
                  trigger="click"
                  popper={{ placement: 'left-start' }}
                >
                  <Button>left-start</Button>
                </Tooltip>
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td>
                <Tooltip
                  title="我是内容我是内容我是内容我是内容"
                  trigger="click"
                  popper={{ placement: 'right-start' }}
                >
                  <Button>right-start</Button>
                </Tooltip>
              </td>
            </tr>
            <tr>
              <td>
                <Tooltip
                  title="我是内容我是内容我是内容我是内容"
                  trigger="click"
                  popper={{ placement: 'left' }}
                >
                  <Button>left</Button>
                </Tooltip>
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td>
                <Tooltip
                  title="我是内容我是内容我是内容我是内容"
                  trigger="click"
                  popper={{ placement: 'right' }}
                >
                  <Button>right</Button>
                </Tooltip>
              </td>
            </tr>
            <tr>
              <td>
                <Tooltip
                  title="我是内容我是内容我是内容我是内容"
                  trigger="click"
                  popper={{ placement: 'left-end' }}
                >
                  <Button>left-end</Button>
                </Tooltip>
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td>
                <Tooltip
                  title="我是内容我是内容我是内容我是内容"
                  trigger="click"
                  popper={{ placement: 'right-end' }}
                >
                  <Button>right-end</Button>
                </Tooltip>
              </td>
            </tr>
            <tr>
              <td></td>
              <td>
                <Tooltip
                  title="我是内容我是内容我是内容我是内容"
                  trigger="click"
                  popper={{ placement: 'bottom-start' }}
                >
                  <Button>bottom-start</Button>
                </Tooltip>
              </td>
              <td>
                <Tooltip
                  title="我是内容我是内容我是内容我是内容"
                  trigger="click"
                  popper={{ placement: 'bottom' }}
                >
                  <Button>bottom</Button>
                </Tooltip>
              </td>
              <td>
                <Tooltip
                  title="我是内容我是内容我是内容我是内容"
                  trigger="click"
                  popper={{ placement: 'bottom-end' }}
                >
                  <Button>bottom-end</Button>
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
