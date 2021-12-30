import React from 'react'
import Dropdown from '../src'

export const Trigger = () => {
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
    {
      id: 5,
      title: '菜单六',
    },
    {
      id: 6,
      title: '菜单七',
      disabled: true,
    },
    {
      id: 7,
      title: '-',
    },
    {
      id: 8,
      title: '小米商城',
      href: 'https://www.mi.com',
    },
  ])

  return (
    <>
      <h1>Trigger</h1>
      <div className="dropdown-trigger__wrap">
        <Dropdown overlayClassName="xxx" data={list} trigger="click" title="左键单击" />
        <br />
        <br />
        <Dropdown overlayClassName="xxx" data={list} trigger="hover" title="鼠标悬停" />
        <br />
        <br />
        <Dropdown overlayClassName="xxx" data={list} trigger="contextmenu" title="右键单击" />
      </div>
    </>
  )
}
