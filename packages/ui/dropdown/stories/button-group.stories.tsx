import React from 'react'
import Dropdown from '../src'

export const ButtonGroup = () => {
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
  ])

  return (
    <>
      <h1>ButtonGroup</h1>
      <div className="dropdown-button-group__wrap">
        <Dropdown data={list} title="鼠标悬停" type="group" onClick={console.log} />
      </div>
    </>
  )
}
