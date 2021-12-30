import React from 'react'
import Dropdown from '../src'
import Button from '@hi-ui/button'

export const Placement = () => {
  const [list] = React.useState([
    {
      id: 0,
      title: '小米商城',
      href: 'https://www.mi.com',
    },
    {
      id: 1,
      title: '菜单二',
    },
    {
      id: 2,
      title: '菜单三',
    },
    {
      id: 3,
      title: '菜单四',
    },
    {
      id: 4,
      title: '菜单五',
    },
  ])

  return (
    <>
      <h1>Placement</h1>
      <div className="dropdown-placement__wrap">
        <table className="placement-table" cellSpacing="5">
          <tbody>
            <tr>
              <td></td>
              <td>
                <Dropdown
                  data={list}
                  title="鼠标悬停"
                  trigger="hover"
                  popper={{ placement: 'top-start' }}
                >
                  <Button>top-start</Button>
                </Dropdown>
              </td>
              <td>
                <Dropdown
                  data={list}
                  title="鼠标悬停"
                  trigger="hover"
                  popper={{ placement: 'top' }}
                >
                  <Button>top</Button>
                </Dropdown>
              </td>
              <td>
                <Dropdown
                  data={list}
                  title="鼠标悬停"
                  trigger="hover"
                  popper={{ placement: 'top-end' }}
                >
                  <Button>top-end</Button>
                </Dropdown>
              </td>
              <td></td>
            </tr>
            <tr>
              <td>
                <Dropdown
                  data={list}
                  title="鼠标悬停"
                  trigger="hover"
                  popper={{ placement: 'left-start' }}
                >
                  <Button>left-start</Button>
                </Dropdown>
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td>
                <Dropdown
                  data={list}
                  title="鼠标悬停"
                  trigger="hover"
                  popper={{ placement: 'right-start' }}
                >
                  <Button>right-start</Button>
                </Dropdown>
              </td>
            </tr>
            <tr>
              <td>
                <Dropdown
                  data={list}
                  title="鼠标悬停"
                  trigger="hover"
                  popper={{ placement: 'left' }}
                >
                  <Button>left</Button>
                </Dropdown>
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td>
                <Dropdown
                  data={list}
                  title="鼠标悬停"
                  trigger="hover"
                  popper={{ placement: 'right' }}
                >
                  <Button>right</Button>
                </Dropdown>
              </td>
            </tr>
            <tr>
              <td>
                <Dropdown
                  data={list}
                  title="鼠标悬停"
                  trigger="hover"
                  popper={{ placement: 'left-end' }}
                >
                  <Button>left-end</Button>
                </Dropdown>
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td>
                <Dropdown
                  data={list}
                  title="鼠标悬停"
                  trigger="hover"
                  popper={{ placement: 'right-end' }}
                >
                  <Button>right-end</Button>
                </Dropdown>
              </td>
            </tr>
            <tr>
              <td></td>
              <td>
                <Dropdown
                  data={list}
                  title="鼠标悬停"
                  trigger="hover"
                  popper={{ placement: 'bottom-start' }}
                >
                  <Button>bottom-start</Button>
                </Dropdown>
              </td>
              <td>
                <Dropdown
                  data={list}
                  title="鼠标悬停"
                  trigger="hover"
                  popper={{ placement: 'bottom' }}
                >
                  <Button>bottom</Button>
                </Dropdown>
              </td>
              <td>
                <Dropdown
                  data={list}
                  title="鼠标悬停"
                  trigger="hover"
                  popper={{ placement: 'bottom-end' }}
                >
                  <Button>bottom-end</Button>
                </Dropdown>
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}
