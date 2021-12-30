import React from 'react'
import Dropdown from '../src'

export const Disabled = () => {
  const [list] = React.useState([
    {
      id: '1',
      title: '菜单一',
    },
    {
      id: '2',
      title: '菜单二',
    },
    {
      id: '3',
      title: '菜单三',
    },
    {
      id: '4',
      title: '链接一',
      href: 'https://www.mi.com',
    },
  ])

  return (
    <>
      <h1>Disabled</h1>
      <div className="dropdown-disabled__wrap">
        <Dropdown disabled data={list} title="鼠标悬停" onClick={console.log} />
      </div>
    </>
  )
}
